import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validatePayment, verifyTransactionStatus, isPaymentConfirmed } from '@/lib/ligdicash';
import { addCredits } from '@/lib/credits';
import { APP_CONFIG } from '@/lib/config';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/payment/validate
 * 
 * Step 2: Validates the payment using the OTP code.
 * Body: { otp: string, transactionId: string }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Rate limit: 5 validation attempts per minute
  const rateCheck = checkRateLimit(`${session.user.id}:payment-validate`, { limit: 5, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Veuillez réessayer dans quelques secondes.' },
      { status: 429 }
    );
  }

  try {
    const { otp, transactionId } = await req.json();

    if (!otp || !transactionId) {
      return NextResponse.json({ error: 'Code OTP et identifiant de transaction requis.' }, { status: 400 });
    }

    // Find the pending transaction
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction introuvable.' }, { status: 404 });
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
    }

    if (transaction.status === 'completed') {
      return NextResponse.json({ error: 'Cette transaction a déjà été traitée.' }, { status: 400 });
    }

    if (transaction.status === 'failed') {
      return NextResponse.json({ error: 'Cette transaction a échoué. Veuillez relancer un paiement.' }, { status: 400 });
    }

    // Find pack for invoice details
    const pack = APP_CONFIG.pricing.packs.find((p) => p.id === transaction.packId);

    // Build invoice payload for LigdiCash
    const callbackUrl = `${APP_CONFIG.url}/api/payment/callback`;
    
    const payload = {
      commande: {
        invoice: {
          items: [
            {
              name: pack?.name || transaction.packId,
              description: `${transaction.credits} crédits IA ${APP_CONFIG.name}`,
              quantity: 1,
              unit_price: transaction.amount,
              total_price: transaction.amount,
            },
          ],
          total_amount: transaction.amount,
          devise: 'XOF',
          description: `Achat de crédits ${APP_CONFIG.name}`,
          customer: transaction.phone,
          customer_firstname: transaction.user.name?.split(' ')[0] || '',
          customer_lastname: transaction.user.name?.split(' ').slice(1).join(' ') || '',
          customer_email: transaction.user.email || '',
          external_id: '',
          otp: otp,
        },
        store: {
          name: APP_CONFIG.name,
          website_url: APP_CONFIG.url,
        },
        actions: {
          cancel_url: '',
          return_url: '',
          callback_url: callbackUrl,
        },
        custom_data: {
          order_id: transaction.id,
          transaction_id: transaction.id,
          user_id: transaction.userId,
          pack_id: transaction.packId,
        },
      },
    };

    // Call LigdiCash validation API
    const result = await validatePayment(payload);

    if (result.response_code !== '00') {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' },
      });
      return NextResponse.json(
        { error: result.response_text || 'Paiement refusé. Vérifiez votre code OTP.' },
        { status: 400 }
      );
    }

    // Store the LigdiCash token
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: { ligdicashToken: result.token },
    });

    // Verify the transaction status
    const status = await verifyTransactionStatus(result.token);

    if (isPaymentConfirmed(status)) {
      // Payment confirmed! Credit the user
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'completed',
          transactionId: status.transaction_id,
          operatorName: status.operator_name,
        },
      });

      const { newBalance } = await addCredits(
        transaction.userId,
        transaction.credits,
        'PURCHASE',
        `Achat ${pack?.name || transaction.packId} — ${transaction.amount} ${APP_CONFIG.pricing.currency}`
      );

      return NextResponse.json({
        success: true,
        status: 'completed',
        credits: transaction.credits,
        newBalance,
        operator: status.operator_name,
      });
    }

    // Payment not yet confirmed — might be pending
    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Paiement en cours de traitement. Vous serez crédité automatiquement.',
      token: result.token,
    });

  } catch (error: any) {
    console.error('[Payment] Validate error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la validation du paiement.' },
      { status: 500 }
    );
  }
}
