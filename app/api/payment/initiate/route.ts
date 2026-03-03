import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { initiateOTP } from '@/lib/ligdicash';
import { APP_CONFIG } from '@/lib/config';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/payment/initiate
 * 
 * Step 1: Sends OTP to customer's phone number.
 * Body: { phone: string, packId: string }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Rate limit: 3 OTP requests per minute
  const rateCheck = checkRateLimit(`${session.user.id}:payment-otp`, { limit: 3, windowMs: 60_000 });
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Veuillez réessayer dans quelques secondes.' },
      { status: 429 }
    );
  }

  try {
    const { phone, packId } = await req.json();

    // Validate inputs
    if (!phone || !packId) {
      return NextResponse.json({ error: 'Numéro de téléphone et pack requis.' }, { status: 400 });
    }

    // Normalize phone: strip spaces, +, and ensure it starts with country code
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    if (cleanPhone.length < 8) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 400 });
    }

    // Find the pack in config (server-side — cannot be manipulated)
    const pack = APP_CONFIG.pricing.packs.find((p) => p.id === packId);
    if (!pack) {
      return NextResponse.json({ error: 'Pack invalide.' }, { status: 400 });
    }

    // Create a pending transaction in DB
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: session.user.id,
        packId: pack.id,
        amount: pack.price,
        credits: pack.credits,
        phone: cleanPhone,
        status: 'pending',
      },
    });

    // Call LigdiCash OTP API
    const otpResponse = await initiateOTP(cleanPhone, pack.price);

    if (otpResponse.error) {
      // Mark transaction as failed
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' },
      });
      return NextResponse.json(
        { error: otpResponse.message || 'Erreur lors de l\'envoi du code OTP.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      message: otpResponse.message,
    });
  } catch (error: any) {
    console.error('[Payment] Initiate error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'initiation du paiement.' },
      { status: 500 }
    );
  }
}
