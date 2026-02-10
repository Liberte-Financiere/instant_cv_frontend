import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { initiateDeposit, PRICING_PLANS, PlanType } from '@/lib/pawapay';
import { z } from 'zod';

// Request validation
const requestSchema = z.object({
  planType: z.enum(['monthly', 'yearly', 'lifetime']),
  phone: z.string().min(8, 'Numéro de téléphone requis'),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Auth check
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { planType, phone } = validation.data;
    const plan = PRICING_PLANS[planType as PlanType];

    if (!plan) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    // Check if API is configured
    if (!process.env.PAWAPAY_API_TOKEN) {
      console.error('[Payment] PawaPay not configured');
      return NextResponse.json(
        { error: 'Le système de paiement n\'est pas configuré' },
        { status: 503 }
      );
    }

    // Initiate PawaPay deposit
    const result = await initiateDeposit(
      phone,
      plan.amount,
      plan.description,
      {
        user_id: session.user.id,
        plan_type: plan.id,
      }
    );

    if (result.status === 'REJECTED') {
      return NextResponse.json(
        { 
          error: result.rejectionReason?.rejectionMessage || 'Paiement refusé',
          code: result.rejectionReason?.rejectionCode,
        },
        { status: 400 }
      );
    }

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        transactionId: result.depositId,
        amount: plan.amount,
        currency: 'XOF',
        status: 'pending',
        provider: 'pawapay',
        planType: plan.id,
        planDuration: plan.duration,
        phoneNumber: phone,
      },
    });

    // Update user phone if provided
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
    });

    console.log('[Payment] PawaPay deposit initiated:', {
      paymentId: payment.id,
      depositId: result.depositId,
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      depositId: result.depositId,
      message: 'Validez le paiement sur votre téléphone',
    });

  } catch (error: any) {
    console.error('[Payment] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initiation du paiement' },
      { status: 500 }
    );
  }
}
