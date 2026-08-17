import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { 
  generateReferralCode, 
  getReferralLink 
} from '@/lib/referral';

// GET /api/referral - Get user's referral info and stats
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const currentUserId = session.user.id;

    // Get user with referral data
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Generate referral code if not exists
    if (!user.referralCode) {
      let code = generateReferralCode();
      let attempts = 0;
      
      // Ensure uniqueness
      while (attempts < 5) {
        const existing = await prisma.user.findUnique({
          where: { referralCode: code },
        });
        if (!existing) break;
        code = generateReferralCode();
        attempts++;
      }

      // Update user with new code
      user = await prisma.user.update({
        where: { id: currentUserId },
        data: { referralCode: code },
      });
    }

    // Fetch referred users separately (users who have this user as referrer)
    const referredUsers = await prisma.user.findMany({
      where: { referredById: currentUserId },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 10,
    });

    const referralLink = getReferralLink(user.referralCode!, process.env.NEXTAUTH_URL);
    const referralCount = user.referralCount ?? 0;

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink,
      referralCount,
      referredUsers,
    });
  } catch (error) {
    console.error('[REFERRAL_GET]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


// POST /api/referral - Process a referral (called after successful signup)
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const currentUserId = session.user.id;

    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json({ error: 'Code de parrainage manquant' }, { status: 400 });
    }

    // Fetch user and check if already referred
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { referredById: true },
    });

    if (currentUser?.referredById) {
      return NextResponse.json({ error: 'Déjà parrainé' }, { status: 400 });
    }

    // Find the referrer by code
    const referrer = await prisma.user.findUnique({
      where: { referralCode: referralCode.toUpperCase() },
    });

    if (!referrer) {
      return NextResponse.json({ error: 'Code de parrainage invalide' }, { status: 404 });
    }

    // Prevent self-referral
    if (referrer.id === currentUserId) {
      return NextResponse.json({ error: 'Auto-parrainage interdit' }, { status: 400 });
    }

    // Dynamic import to avoid circular dependencies and top level await issues
    const { addCredits } = await import('@/lib/credits');
    const { REFERRAL_REWARDS } = await import('@/lib/referral');

    // 1. Link the new user to referrer and increment referrer count
    await prisma.$transaction(async (tx) => {
      // Link the new user to referrer only if not already referred
      const updateResult = await tx.user.updateMany({
        where: { 
          id: currentUserId,
          referredById: null
        },
        data: { referredById: referrer.id },
      });

      if (updateResult.count === 0) {
        throw new Error("ALREADY_REFERRED");
      }

      // Increment referrer's count atomically
      await tx.user.update({
        where: { id: referrer.id },
        data: { referralCount: { increment: 1 } },
      });
    });
    
    // 2. Add Credits securely via the Credits module (outside the main user tx to use its inner generic tx)
    // Reward for the Referrer
    await addCredits(
        referrer.id, 
        REFERRAL_REWARDS.CREDITS_PER_REFERRAL, 
        'BONUS_REFERRAL', 
        `Bonus parrainage suite à l'inscription de testeur`
    );
     
    // Welcome Bonus for the new User
    await addCredits(
        currentUserId, 
        REFERRAL_REWARDS.CREDITS_FOR_NEW_USER, 
        'BONUS_REFERRAL', 
        `Bonus de bienvenue (code parrain)`
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Parrainage enregistré avec succès ! Crédits ajoutés.' 
    });
  } catch (error: any) {
    console.error('[REFERRAL_POST]', error);
    if (error.message === 'ALREADY_REFERRED') {
        return NextResponse.json({ error: 'Déjà parrainé ou requête en double' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
