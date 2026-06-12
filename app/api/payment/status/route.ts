import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { verifyTransactionStatus, isPaymentConfirmed } from '@/lib/ligdicash';
import { addCredits } from '@/lib/credits';
import { APP_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token requis' }, { status: 400 });
  }

  try {
    const transaction = await prisma.paymentTransaction.findFirst({
      where: { ligdicashToken: token, userId: session.user.id },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction introuvable' }, { status: 404 });
    }

    if (transaction.status === 'completed') {
      return NextResponse.json({ status: 'completed', credits: transaction.credits });
    }

    if (transaction.status === 'failed') {
      return NextResponse.json({ status: 'failed' });
    }

    // Check with LigdiCash
    const status = await verifyTransactionStatus(token);

    if (isPaymentConfirmed(status)) {
      // SECURITY CHECK: Ensure the paid amount covers the pack price
      const paidAmount = parseFloat(status.amount || '0');
      const expectedAmount = Number(transaction.amount);

      if (paidAmount < expectedAmount) {
        console.warn(`[Payment] 🚨 SECURITY ALERT: Polling partial payment attempt! Expected ${expectedAmount}, Paid ${paidAmount}`);
        await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'failed',
            transactionId: status.transaction_id,
            operatorName: status.operator_name,
          },
        });
        return NextResponse.json({ error: 'Montant payé insuffisant.' }, { status: 400 });
      }

      // Payment verified & amount confirmed! Credit the user atomically
      const updateResult = await prisma.paymentTransaction.updateMany({
        where: { id: transaction.id, status: 'pending' },
        data: {
          status: 'completed',
          transactionId: status.transaction_id,
          operatorName: status.operator_name || 'Inconnu',
        },
      });

      if (updateResult.count === 0) {
        // Already completed by webhook callback
        return NextResponse.json({ status: 'completed', credits: transaction.credits });
      }

      const pack = APP_CONFIG.pricing.packs.find((p) => p.id === transaction.packId);

      const { newBalance } = await addCredits(
        transaction.userId,
        transaction.credits,
        'PURCHASE',
        `Achat ${pack?.name || transaction.packId} — ${transaction.amount} ${APP_CONFIG.pricing.currency}`
      );

      return NextResponse.json({ 
        status: 'completed', 
        credits: transaction.credits, 
        newBalance,
        operator: status.operator_name 
      });
    }

    if (status.status === 'failed' || status.status === 'cancelled') {
        await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: { status: 'failed' }
        });
        return NextResponse.json({ status: 'failed' });
    }

    return NextResponse.json({ status: 'pending' });

  } catch (error) {
    console.error('[Payment] Status check error:', error);
    return NextResponse.json({ error: 'Erreur lors de la vérification du statut.' }, { status: 500 });
  }
}
