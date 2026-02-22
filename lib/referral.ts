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

// Reward constants
export const REFERRAL_REWARDS = {
  CREDITS_PER_REFERRAL: 30, // The referrer gets 30 credits
  CREDITS_FOR_NEW_USER: 15, // The new user gets 15 bonus credits
} as const;

// Calculate total credits earned based on referral count
export function calculateEarnedCredits(referralCount: number): number {
  return referralCount * REFERRAL_REWARDS.CREDITS_PER_REFERRAL;
}

// Check if user has active premium (Deprecated, kept for type safety on old accounts)
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

