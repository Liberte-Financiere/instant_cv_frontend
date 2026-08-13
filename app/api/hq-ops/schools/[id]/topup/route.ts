import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id: schoolId } = await context.params;
    const body = await request.json();
    const { amount, idempotencyKey, reference, description } = body;

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return NextResponse.json(
        { error: 'idempotencyKey est obligatoire pour les opérations financières.' },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être un entier strictement positif.' },
        { status: 400 }
      );
    }

    const existingTransaction = await prisma.schoolCreditTransaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransaction) {
      return NextResponse.json({
        transaction: existingTransaction,
        deduplicated: true,
      });
    }

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true, name: true, isActive: true },
    });

    if (!school) {
      return NextResponse.json({ error: 'École introuvable.' }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.schoolCreditWallet.findUnique({
        where: { schoolId },
      });

      if (!wallet) {
        throw new Error(`Wallet introuvable pour l'école ${schoolId}`);
      }

      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + parsedAmount;

      await tx.schoolCreditWallet.update({
        where: { schoolId },
        data: {
          balance: { increment: parsedAmount },
          totalBought: { increment: parsedAmount },
        },
      });

      const transaction = await tx.schoolCreditTransaction.create({
        data: {
          schoolId,
          performedByUserId: session.user.id,
          amount: parsedAmount,
          type: 'PURCHASE',
          balanceBefore,
          balanceAfter,
          idempotencyKey,
          reference: reference || null,
          description: description || `Recharge de ${parsedAmount} crédits`,
        },
      });

      return { transaction, balanceBefore, balanceAfter };
    });

    return NextResponse.json({
      transaction: result.transaction,
      balanceBefore: result.balanceBefore,
      balanceAfter: result.balanceAfter,
      deduplicated: false,
    }, { status: 201 });
  } catch (error) {
    console.error('[HQ-OPS/SCHOOLS/TOPUP] POST error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
