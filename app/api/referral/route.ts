import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { 
  generateReferralCode, 
  calculatePremiumDays, 
  getNextRewardTier,
  isPremiumActive,
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
    const nextTier = getNextRewardTier(referralCount);
    const hasPremium = isPremiumActive(user.premiumUntil);

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink,
      referralCount,
      referredUsers,
      premiumUntil: user.premiumUntil,
      hasPremium,
      nextTier,
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

    // Check if user was already referred
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

    // Update both users in a transaction
    await prisma.$transaction(async (tx) => {
      // Link the new user to referrer
      await tx.user.update({
        where: { id: currentUserId },
        data: { referredById: referrer.id },
      });

      // Increment referrer's count
      const newCount = referrer.referralCount + 1;
      const premiumDays = calculatePremiumDays(newCount);
      
      // Calculate new premium end date
      let premiumUntil: Date | null = null;
      if (premiumDays > 0) {
        const now = new Date();
        const currentPremium = referrer.premiumUntil && new Date(referrer.premiumUntil) > now 
          ? new Date(referrer.premiumUntil) 
          : now;
        premiumUntil = new Date(currentPremium);
        premiumUntil.setDate(premiumUntil.getDate() + premiumDays);
      }

      await tx.user.update({
        where: { id: referrer.id },
        data: { 
          referralCount: newCount,
          premiumUntil,
        },
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Parrainage enregistré avec succès' 
    });
  } catch (error) {
    console.error('[REFERRAL_POST]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
