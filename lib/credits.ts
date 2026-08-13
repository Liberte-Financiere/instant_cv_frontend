import { prisma } from '@/lib/prisma';
import { CREDIT_COSTS, type ActionType } from '@/lib/credit-costs';

export { CREDIT_COSTS, FREE_SERVICES, type ActionType } from '@/lib/credit-costs';

export class InsufficientCreditsError extends Error {
  constructor(cost: number, balance: number, isB2B: boolean = false) {
    const missing = cost - balance;
    const msg = isB2B
      ? `Crédits de l'établissement insuffisants. Il manque ${missing} crédits pour cette action.`
      : `Crédits personnels insuffisants. Vous avez besoin de ${cost} crédits pour cette action. Il vous manque ${missing} crédits.`;
    super(msg);
    this.name = 'InsufficientCreditsError';
  }
}

/**
 * Moteur de facturation unifié (Billing Engine).
 * Résout le portefeuille approprié (B2C vs B2B) et effectue un débit atomique.
 */
export async function checkAndConsumeCredits(
  userId: string,
  actionType: ActionType,
  description: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance: number; isFree?: boolean; isB2B?: boolean }> {
  
  // 1. Vérifier si le service est gratuit
  const { FREE_SERVICES } = await import('@/lib/credit-costs');
  if (FREE_SERVICES.includes(actionType)) {
    // Service gratuit : on ne touche à aucun ledger.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    return { success: true, newBalance: user?.credits || 0, isFree: true };
  }

  const cost = CREDIT_COSTS[actionType];

  try {
    return await prisma.$transaction(async (tx) => {
      // 2. Identifier l'utilisateur et son appartenance B2B
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { school: true },
      });

      if (!user) {
        throw new Error(`Utilisateur introuvable: ${userId}`);
      }

      const isB2B = Boolean(user.schoolId && user.school?.isActive);

      if (isB2B) {
        // --- FLUX B2B (SCHOOL_ONLY Policy) ---
        const schoolId = user.schoolId!;
        const wallet = await tx.schoolCreditWallet.findUnique({
          where: { schoolId },
        });

        if (!wallet || Number(wallet.balance) < cost) {
          throw new InsufficientCreditsError(cost, wallet ? Number(wallet.balance) : 0, true);
        }

        const balanceBefore = Number(wallet.balance);
        const balanceAfter = balanceBefore - cost;

        // Débit atomique (protection contre les Race Conditions)
        const updateResult = await tx.schoolCreditWallet.updateMany({
          where: { 
            schoolId,
            balance: { gte: cost }
          },
          data: { 
            balance: { decrement: cost },
            totalUsed: { increment: cost }
          },
        });

        if (updateResult.count === 0) {
          throw new InsufficientCreditsError(cost, balanceBefore, true);
        }

        // Enregistrement dans le Ledger B2B (Append-only)
        await tx.schoolCreditTransaction.create({
          data: {
            schoolId,
            userId,
            amount: -cost,
            type: 'CONSUMPTION',
            balanceBefore,
            balanceAfter,
            actionType,
            description,
            referenceId,
          },
        });

        return { success: true, newBalance: balanceAfter, isB2B: true };

      } else {
        // --- FLUX B2C (Portefeuille Personnel) ---
        if (user.credits < cost) {
          throw new InsufficientCreditsError(cost, user.credits, false);
        }

        // Débit atomique
        const updateResult = await tx.user.updateMany({
          where: { 
            id: userId,
            credits: { gte: cost } // Garantit l'atomicité
          },
          data: { credits: { decrement: cost } },
        });

        if (updateResult.count === 0) {
          throw new InsufficientCreditsError(cost, user.credits, false);
        }

        // Enregistrement B2C
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -cost,
            type: 'USAGE',
            description,
          },
        });

        const newUser = await tx.user.findUnique({ where: { id: userId } });
        return { success: true, newBalance: newUser?.credits || 0, isB2B: false };
      }
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      throw error;
    }
    console.error('[CREDITS] Database error in checkAndConsumeCredits:', error);
    throw error;
  }
}

/**
 * Adds credits to a user account and logs the transaction.
 * Usually used for B2C purchases, referrals, or welcome bonuses.
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'PURCHASE' | 'BONUS_REFERRAL' | 'SIGNUP' | 'ADMIN_GIFT' | 'REFUND',
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  return await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        credits: { increment: amount },
      },
      select: { credits: true },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    });

    return { success: true, newBalance: updatedUser.credits };
  });
}

/**
 * Fetches the current credit balance (B2C only).
 * Note: To fetch a B2B school balance, a separate function should be used.
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits || 0;
}

/**
 * Refunds credits to a user or school account if an action failed.
 */
export async function refundCredits(
  userId: string,
  actionType: ActionType,
  description: string = "Remboursement suite à un échec technique",
  referenceId?: string
): Promise<{ success: boolean; newBalance: number }> {
  const cost = CREDIT_COSTS[actionType];
  
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { school: true },
    });

    const isB2B = Boolean(user?.schoolId && user?.school?.isActive);

    if (isB2B) {
      // Remboursement vers le School Wallet
      const schoolId = user!.schoolId!;
      const wallet = await tx.schoolCreditWallet.findUnique({ where: { schoolId } });
      const balanceBefore = Number(wallet?.balance || 0);
      const balanceAfter = balanceBefore + cost;

      await tx.schoolCreditWallet.update({
        where: { schoolId },
        data: { balance: { increment: cost } },
      });

      await tx.schoolCreditTransaction.create({
        data: {
          schoolId,
          userId,
          amount: cost,
          type: 'REFUND',
          balanceBefore,
          balanceAfter,
          actionType,
          description,
          referenceId,
        },
      });

      return { success: true, newBalance: balanceAfter };
    } else {
      // Remboursement vers le B2C Wallet
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { credits: { increment: cost } },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: cost,
          type: 'REFUND',
          description,
        },
      });

      return { success: true, newBalance: updatedUser.credits };
    }
  });
}

