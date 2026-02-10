import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Check if current user has active premium subscription
 */
export async function isPremium(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { premiumUntil: true, subscriptionStatus: true },
  });

  if (!user?.premiumUntil) return false;

  return new Date(user.premiumUntil) > new Date();
}

/**
 * Get premium status and expiry for a user
 */
export async function getPremiumStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      premiumUntil: true, 
      subscriptionStatus: true,
      lastPaymentDate: true,
    },
  });

  if (!user) return { isPremium: false };

  const isPremiumActive = user.premiumUntil && new Date(user.premiumUntil) > new Date();

  return {
    isPremium: isPremiumActive,
    premiumUntil: user.premiumUntil,
    subscriptionStatus: user.subscriptionStatus,
    daysRemaining: isPremiumActive 
      ? Math.ceil((new Date(user.premiumUntil!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0,
  };
}

/**
 * Premium features list
 */
export const PREMIUM_FEATURES = [
  {
    id: 'unlimited_exports',
    name: 'Exports PDF illimités',
    description: 'Téléchargez autant de CV que vous voulez',
    freeLimit: 3,
  },
  {
    id: 'ai_analysis',
    name: 'Analyse IA avancée',
    description: 'Analyse complète de votre CV par l\'IA',
    freeLimit: 1,
  },
  {
    id: 'premium_templates',
    name: 'Templates Premium',
    description: 'Accès à tous les modèles exclusifs',
    freeLimit: 0,
  },
  {
    id: 'no_watermark',
    name: 'Sans filigrane',
    description: 'CVs propres sans mention InstantCV',
    freeLimit: 0,
  },
  {
    id: 'linkedin_import',
    name: 'Import LinkedIn',
    description: 'Importez votre profil LinkedIn en 1 clic',
    freeLimit: 0,
  },
];
