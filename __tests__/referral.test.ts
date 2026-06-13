import { describe, it, expect } from 'vitest';
import {
  generateReferralCode,
  REFERRAL_REWARDS,
  calculateEarnedCredits,
  isPremiumActive,
  getReferralLink,
} from '@/lib/referral';

/**
 * Tests for the referral system utilities.
 * All functions are pure (no Prisma dependency).
 */

// -- generateReferralCode ---------------------------------------------------

describe('generateReferralCode', () => {
  const VALID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const EXCLUDED_CHARS = ['0', 'O', '1', 'I'];

  it('generates a code of exactly 8 characters', () => {
    const code = generateReferralCode();
    expect(code).toHaveLength(8);
  });

  it('uses only allowed characters (no ambiguous 0/O/1/I)', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateReferralCode();
      for (const char of code) {
        expect(VALID_CHARS).toContain(char);
      }
      for (const excluded of EXCLUDED_CHARS) {
        expect(code).not.toContain(excluded);
      }
    }
  });

  it('generates statistically unique codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateReferralCode());
    }
    // With 31^8 possible codes, 100 codes should all be unique
    expect(codes.size).toBe(100);
  });

  it('returns a string type', () => {
    expect(typeof generateReferralCode()).toBe('string');
  });
});

// -- REFERRAL_REWARDS -------------------------------------------------------

describe('REFERRAL_REWARDS', () => {
  it('rewards the referrer with a positive number of credits', () => {
    expect(REFERRAL_REWARDS.CREDITS_PER_REFERRAL).toBeGreaterThan(0);
  });

  it('rewards the new user with a positive number of credits', () => {
    expect(REFERRAL_REWARDS.CREDITS_FOR_NEW_USER).toBeGreaterThan(0);
  });

  it('referrer reward is greater than or equal to new user reward', () => {
    expect(REFERRAL_REWARDS.CREDITS_PER_REFERRAL).toBeGreaterThanOrEqual(
      REFERRAL_REWARDS.CREDITS_FOR_NEW_USER
    );
  });
});

// -- calculateEarnedCredits -------------------------------------------------

describe('calculateEarnedCredits', () => {
  it('returns 0 for 0 referrals', () => {
    expect(calculateEarnedCredits(0)).toBe(0);
  });

  it('returns correct value for 1 referral', () => {
    expect(calculateEarnedCredits(1)).toBe(REFERRAL_REWARDS.CREDITS_PER_REFERRAL);
  });

  it('scales linearly with referral count', () => {
    const count = 10;
    expect(calculateEarnedCredits(count)).toBe(
      count * REFERRAL_REWARDS.CREDITS_PER_REFERRAL
    );
  });
});

// -- isPremiumActive --------------------------------------------------------

describe('isPremiumActive', () => {
  it('returns false for null', () => {
    expect(isPremiumActive(null)).toBe(false);
  });

  it('returns true for a future date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isPremiumActive(future)).toBe(true);
  });

  it('returns false for a past date', () => {
    const past = new Date();
    past.setFullYear(past.getFullYear() - 1);
    expect(isPremiumActive(past)).toBe(false);
  });
});

// -- getReferralLink --------------------------------------------------------

describe('getReferralLink', () => {
  it('generates a valid URL with the referral code', () => {
    const link = getReferralLink('ABCD1234', 'https://jobsira.com');
    expect(link).toBe('https://jobsira.com/auth?ref=ABCD1234');
  });

  it('strips trailing slash from base URL', () => {
    const link = getReferralLink('ABCD1234', 'https://jobsira.com/');
    expect(link).toBe('https://jobsira.com/auth?ref=ABCD1234');
  });

  it('falls back to NEXTAUTH_URL or localhost when no baseUrl provided', () => {
    const link = getReferralLink('TESTCODE');
    expect(link).toContain('/auth?ref=TESTCODE');
  });
});
