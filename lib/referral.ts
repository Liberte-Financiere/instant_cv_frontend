/**
 * Referral System Utilities
 * Generates unique referral codes and manages referral rewards
 */

// Generate a unique 8-character referral code
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Reward tiers based on referral count
export const REFERRAL_REWARDS = {
  TIER_1: { count: 3, premiumDays: 30 },   // 3 referrals = 1 month premium
  TIER_2: { count: 10, premiumDays: 90 },  // 10 referrals = 3 months premium
  TIER_3: { count: 25, premiumDays: 180 }, // 25 referrals = 6 months premium
  TIER_4: { count: 50, premiumDays: 365 }, // 50 referrals = 1 year premium
} as const;

// Calculate total premium days earned based on referral count
export function calculatePremiumDays(referralCount: number): number {
  let totalDays = 0;
  
  if (referralCount >= REFERRAL_REWARDS.TIER_4.count) {
    totalDays = REFERRAL_REWARDS.TIER_4.premiumDays;
  } else if (referralCount >= REFERRAL_REWARDS.TIER_3.count) {
    totalDays = REFERRAL_REWARDS.TIER_3.premiumDays;
  } else if (referralCount >= REFERRAL_REWARDS.TIER_2.count) {
    totalDays = REFERRAL_REWARDS.TIER_2.premiumDays;
  } else if (referralCount >= REFERRAL_REWARDS.TIER_1.count) {
    totalDays = REFERRAL_REWARDS.TIER_1.premiumDays;
  }
  
  return totalDays;
}

// Get next reward tier information
export function getNextRewardTier(referralCount: number): { 
  needed: number; 
  premiumDays: number;
  progress: number;
} | null {
  const tiers = [
    REFERRAL_REWARDS.TIER_1,
    REFERRAL_REWARDS.TIER_2,
    REFERRAL_REWARDS.TIER_3,
    REFERRAL_REWARDS.TIER_4,
  ];
  
  for (const tier of tiers) {
    if (referralCount < tier.count) {
      return {
        needed: tier.count - referralCount,
        premiumDays: tier.premiumDays,
        progress: Math.round((referralCount / tier.count) * 100),
      };
    }
  }
  
  return null; // All tiers unlocked
}

// Check if user has active premium
export function isPremiumActive(premiumUntil: Date | null): boolean {
  if (!premiumUntil) return false;
  return new Date(premiumUntil) > new Date();
}

// Get referral link for a user
export function getReferralLink(referralCode: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  // Remove trailing slash if present
  const cleanBase = base.replace(/\/$/, '');
  return `${cleanBase}/auth?ref=${referralCode}`;
}

