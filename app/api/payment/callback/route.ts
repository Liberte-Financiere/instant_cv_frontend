import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/credits';
import { APP_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/payment/callback
 * 
 * Webhook called by LigdiCash after payment processing.
 * LigdiCash sends 2 POST requests (form-urlencoded + JSON) with the same data.
 * We must handle idempotency to avoid double-crediting.
 */
export async function POST(req: Request) {
  try {
    let payload: any;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      payload = Object.fromEntries(params.entries());
    } else {
      // Try JSON as fallback
      try {
        payload = await req.json();
      } catch {
        return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
      }
    }

    console.log('[Callback] 📨 Received LigdiCash callback:', JSON.stringify(payload));

    const { token, transaction_id: lgdTransactionId, status } = payload;

    if (!token || !status) {
      console.warn('[Callback] ⚠️ Missing token or status in callback payload');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the transaction by LigdiCash token
    const transaction = await prisma.paymentTransaction.findFirst({
      where: { ligdicashToken: token },
    });

    if (!transaction) {
      // Could also be a callback for a transaction we haven't stored yet
      // Try matching by custom_data order_id if available
      console.warn(`[Callback] ⚠️ No transaction found for token: ${token.slice(0, 20)}...`);
      return NextResponse.json({ status: 'not_found' }, { status: 200 }); // Return 200 to prevent retries
    }

    // Idempotency check: don't credit twice
    if (transaction.status === 'completed') {
      console.log(`[Callback] ℹ️ Transaction ${transaction.id} already completed. Skipping.`);
      return NextResponse.json({ status: 'already_processed' });
    }

    if (status === 'completed') {
      // SECURITY CHECK: Verify that the amount paid is at least the amount requested
      // Note: LigdiCash payload.amount may be a string like "1000", transaction.amount is a Float/Int
      const paidAmount = parseFloat(payload.amount || '0');
      const expectedAmount = Number(transaction.amount);

      if (paidAmount < expectedAmount) {
        console.warn(`[Callback] 🚨 SECURITY ALERT: Partial payment attempt detected! Transaction ${transaction.id}. Expected: ${expectedAmount}, Paid: ${paidAmount}`);
        await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: { status: 'failed', transactionId: lgdTransactionId || null, operatorName: payload.operator_name || null },
        });
        return NextResponse.json({ status: 'fraud_prevented' }, { status: 200 });
      }

      // Update status and credit the user
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'completed',
          transactionId: lgdTransactionId || null,
          operatorName: payload.operator_name || null,
        },
      });

      const pack = APP_CONFIG.pricing.packs.find((p) => p.id === transaction.packId);

      await addCredits(
        transaction.userId,
        transaction.credits,
        'PURCHASE',
        `Achat ${pack?.name || transaction.packId} — ${transaction.amount} ${APP_CONFIG.pricing.currency} (callback)`
      );

      console.log(`[Callback] ✅ Transaction ${transaction.id} completed! +${transaction.credits} credits for user ${transaction.userId}`);
    } else if (status === 'failed' || status === 'cancelled') {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' },
      });
      console.log(`[Callback] ❌ Transaction ${transaction.id} failed/cancelled.`);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('[Callback] Error processing callback:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
