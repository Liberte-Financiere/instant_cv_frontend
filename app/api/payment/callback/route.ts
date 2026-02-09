import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * PawaPay Callback Handler
 * 
 * Called by PawaPay when payment status changes
 * Docs: https://docs.pawapay.io/#tag/Callbacks
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log('[PawaPay Callback] Received:', JSON.stringify(body, null, 2));

    // PawaPay callback format
    const {
      depositId,
      status,
      amount,
      currency,
      correspondent,
      failureReason,
    } = body;

    if (!depositId) {
      console.error('[PawaPay Callback] Missing depositId');
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    // Find the payment record by transactionId (which is the depositId)
    const payment = await prisma.payment.findUnique({
      where: { transactionId: depositId },
    });

    if (!payment) {
      console.error('[PawaPay Callback] Payment not found:', depositId);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check if already processed
    if (payment.status === 'completed') {
      console.log('[PawaPay Callback] Payment already completed:', depositId);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Process based on status
    if (status === 'COMPLETED') {
      // Calculate premium expiry
      const now = new Date();
      const premiumUntil = new Date(now.getTime() + (payment.planDuration || 30) * 24 * 60 * 60 * 1000);

      // Update payment and user in transaction
      await prisma.$transaction([
        // Update payment status
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            completedAt: now,
            paymentMethod: correspondent === 'ORANGE_BFA' ? 'orange_money' : 'moov_money',
          },
        }),
        // Update user premium status
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            premiumUntil,
            subscriptionStatus: 'active',
            lastPaymentId: payment.id,
            lastPaymentDate: now,
          },
        }),
      ]);

      console.log('[PawaPay Callback] Payment COMPLETED:', {
        paymentId: payment.id,
        userId: payment.userId,
        premiumUntil,
      });

    } else if (status === 'FAILED') {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
        },
      });

      console.log('[PawaPay Callback] Payment FAILED:', {
        paymentId: payment.id,
        reason: failureReason,
      });
    }

    // Return success to PawaPay
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[PawaPay Callback] Error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}

// GET for status checks
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
        amount: true,
        planType: true,
        completedAt: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
