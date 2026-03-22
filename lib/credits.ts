import { prisma } from '@/lib/prisma';

export const CREDIT_COSTS = {
  CREATE_CV: 3,
  CREATE_LETTER: 1,
  AI_ANALYZE: 2,
  AI_MATCH: 2,
  AI_GENERATE_LETTER: 2,

  AI_OPTIMIZE: 1,
  AI_REWRITE: 0.5,
  AI_CONTINUE: 0.5,
  AI_CORRECT: 0.5,

  AI_CV_TRANSLATE: 15,

  AI_INTERVIEW: 3,
  AI_INTERVIEW_AUDIO: 5,
};

export type ActionType = keyof typeof CREDIT_COSTS;

export class InsufficientCreditsError extends Error {
  constructor(cost: number, balance: number) {
    const missing = cost - balance;
    super(`Crédits insuffisants. Vous avez besoin de ${cost} crédits pour cette action. Il vous manque ${missing} crédits.`);
    this.name = 'InsufficientCreditsError';
  }
}

/**
 * Checks if a user has enough credits and consumes them if they do.
 * Logs the transaction in the database.
 * Throws InsufficientCreditsError if insufficient credits.
 * Throws generic Error for database issues.
 */
export async function checkAndConsumeCredits(
  userId: string,
  actionType: ActionType,
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  const cost = CREDIT_COSTS[actionType];

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      if (!user) {
        throw new InsufficientCreditsError(cost, 0);
      }

      if (user.credits < cost) {
        throw new InsufficientCreditsError(cost, user.credits);
      }

      const newBalance = user.credits - cost;

      // 1. Decrement user balance
      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance },
      });

      // 2. Log transaction (non-blocking — if this fails, don't block the action)
      try {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -cost,
            type: 'USAGE',
            description,
          },
        });
      } catch (logError) {
        console.warn('[CREDITS] Failed to log transaction, but credits were deducted:', logError);
      }

      return { success: true, newBalance };
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      throw error; // re-throw credit errors as-is
    }
    // Log the actual DB error for debugging
    console.error('[CREDITS] Database error in checkAndConsumeCredits:', error);
    throw error;
  }
}

/**
 * Adds credits to a user account and logs the transaction.
 * Usually used for purchases, referrals, or welcome bonuses.
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'PURCHASE' | 'BONUS_REFERRAL' | 'SIGNUP' | 'ADMIN_GIFT',
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  return await prisma.$transaction(async (tx) => {
    // 1. Increment user balance
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        credits: { increment: amount },
      },
      select: { credits: true },
    });

    // 2. Log transaction
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
 * Fetches the current credit balance for a user.
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits || 0;
}
