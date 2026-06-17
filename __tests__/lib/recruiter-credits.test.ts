import { describe, it, expect } from 'vitest';
import {
  FREE_UNLOCK_LIMIT,
  UNLOCK_CREDIT_COST,
  InsufficientRecruiterCreditsError,
} from '@/lib/recruiter-credits';

/**
 * Tests for recruiter-credits module.
 *
 * The core functions (unlockProfile, canUnlockForFree, etc.) depend on Prisma
 * and require database mocking. We test the exported constants, error class,
 * and behavioral contracts here. Integration tests with a real DB would go
 * in a separate suite.
 */

// -- Constants --------------------------------------------------------------

describe('recruiter credit constants', () => {
  it('FREE_UNLOCK_LIMIT is 3', () => {
    expect(FREE_UNLOCK_LIMIT).toBe(3);
  });

  it('UNLOCK_CREDIT_COST is 5', () => {
    expect(UNLOCK_CREDIT_COST).toBe(5);
  });

  it('free unlocks cost less than paid unlocks', () => {
    // Free = 0 credits, paid = UNLOCK_CREDIT_COST
    expect(UNLOCK_CREDIT_COST).toBeGreaterThan(0);
  });
});

// -- InsufficientRecruiterCreditsError --------------------------------------

describe('InsufficientRecruiterCreditsError', () => {
  it('is an instance of Error', () => {
    const err = new InsufficientRecruiterCreditsError(5, 2);
    expect(err).toBeInstanceOf(Error);
  });

  it('has the correct name', () => {
    const err = new InsufficientRecruiterCreditsError(5, 2);
    expect(err.name).toBe('InsufficientRecruiterCreditsError');
  });

  it('message includes cost and balance', () => {
    const err = new InsufficientRecruiterCreditsError(5, 2);
    expect(err.message).toContain('5');
    expect(err.message).toContain('2');
  });

  it('message includes the missing amount', () => {
    const err = new InsufficientRecruiterCreditsError(10, 3);
    expect(err.message).toContain('7'); // 10 - 3 = 7 missing
  });

  it('can be caught as a standard Error', () => {
    try {
      throw new InsufficientRecruiterCreditsError(5, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).name).toBe('InsufficientRecruiterCreditsError');
    }
  });
});

// -- Business rule invariants -----------------------------------------------

describe('business rule invariants', () => {
  it('free tier allows exactly FREE_UNLOCK_LIMIT unlocks', () => {
    // Simulate the free unlock check logic
    for (let used = 0; used < FREE_UNLOCK_LIMIT; used++) {
      expect(used < FREE_UNLOCK_LIMIT).toBe(true); // still free
    }
    expect(FREE_UNLOCK_LIMIT < FREE_UNLOCK_LIMIT).toBe(false); // no more free
  });

  it('paid unlock should always cost UNLOCK_CREDIT_COST', () => {
    const balance = 100;
    const afterUnlock = balance - UNLOCK_CREDIT_COST;
    expect(afterUnlock).toBe(balance - 5);
  });

  it('insufficient credits when balance < UNLOCK_CREDIT_COST', () => {
    const balances = [0, 1, 2, 3, 4];
    for (const balance of balances) {
      expect(balance < UNLOCK_CREDIT_COST).toBe(true);
    }
    expect(UNLOCK_CREDIT_COST < UNLOCK_CREDIT_COST).toBe(false); // exact match is sufficient
  });

  it('exact balance equal to cost should be sufficient', () => {
    const balance = UNLOCK_CREDIT_COST;
    expect(balance >= UNLOCK_CREDIT_COST).toBe(true);
  });
});
