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
 * Creates a Straight Checkout Invoice using an OTP the user generated via USSD.
 * Body: { phone: string, otp: string, packId: string }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Security: Block payments if the admin is impersonating a user
  if (session.user.impersonatedBy) {
    return NextResponse.json(
      { error: 'Paiements bloqués en mode impersonation.' },
      { status: 403 }
    );
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
    const { phone, otp, packId, credits: requestedCredits } = await req.json();

    if (!phone || !otp || !packId) {
      return NextResponse.json({ error: 'Téléphone, code OTP et pack requis.' }, { status: 400 });
    }

    // Normalize phone (remove spaces, -, +)
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');

    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 400 });
    }

    // Determine pricing: À la carte or Pack
    let packName: string;
    let packPrice: number;
    let packCredits: number;

    if (packId === 'alacarte') {
      // À la carte: validate credits amount
      const { alaCarte } = APP_CONFIG.pricing;
      const numCredits = parseInt(requestedCredits, 10);

      if (!numCredits || numCredits < alaCarte.minCredits || numCredits > alaCarte.maxCredits) {
        return NextResponse.json(
          { error: `Le nombre de crédits doit être compris entre ${alaCarte.minCredits} et ${alaCarte.maxCredits}.` },
          { status: 400 }
        );
      }

      packName = 'À la carte';
      packCredits = numCredits;
      packPrice = numCredits * alaCarte.pricePerCredit;
    } else {
      // Standard pack lookup
      const pack = APP_CONFIG.pricing.packs.find((p) => p.id === packId);
      if (!pack) {
        return NextResponse.json({ error: 'Pack invalide.' }, { status: 400 });
      }
      packName = pack.name;
      packCredits = pack.credits;
      packPrice = pack.price;
    }

    // Create a new pending transaction
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: session.user.id,
        packId,
        amount: packPrice,
        credits: packCredits,
        phone: cleanPhone,
        status: 'pending',
      },
    });

    const callbackUrl = `${APP_CONFIG.url}/api/payment/callback`;
    
    const payload = {
      commande: {
        invoice: {
          items: [
            {
              name: packName,
              description: `${packCredits} crédits IA ${APP_CONFIG.name}`,
              quantity: 1,
              unit_price: packPrice,
              total_price: packPrice,
            },
          ],
          total_amount: packPrice,
          devise: 'XOF',
          description: `Achat de crédits ${APP_CONFIG.name}`,
          customer: cleanPhone,
          customer_firstname: session.user.name?.split(' ')[0] || '',
          customer_lastname: session.user.name?.split(' ').slice(1).join(' ') || '',
          customer_email: session.user.email || '',
          external_id: '',
          otp: otp.trim(), // User's USSD generated OTP
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

    // Call LigdiCash Straight API
    const result = await validatePayment(payload as any);

    if (result.response_code !== '00') {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' },
      });
      return NextResponse.json(
        { error: result.response_text || 'Paiement refusé. Vérifiez votre code OTP ou votre solde.' },
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
      // Payment confirmed! Credit the user immediately
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
        `Achat ${packName} — ${transaction.amount} ${APP_CONFIG.pricing.currency}`
      );

      return NextResponse.json({
        success: true,
        status: 'completed',
        credits: transaction.credits,
        newBalance,
        operator: status.operator_name,
      });
    }

    // Payment not yet confirmed — might be waiting for the callback
    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Paiement en cours de traitement. Vous serez crédité automatiquement.',
      token: result.token,
    });

  } catch (error: any) {
    console.error('[Payment] Validate error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du paiement.' },
      { status: 500 }
    );
  }
}
