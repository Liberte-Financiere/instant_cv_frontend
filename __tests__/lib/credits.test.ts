import { describe, it, expect } from 'vitest';
import { CREDIT_COSTS, InsufficientCreditsError } from '@/lib/credits';

/**
 * Tests for the candidate credit system.
 *
 * The transactional functions (checkAndConsumeCredits, addCredits)
 * depend on Prisma and are covered by integration tests.
 * Here we validate constants and the error class.
 */

// -- CREDIT_COSTS -----------------------------------------------------------

describe('CREDIT_COSTS', () => {
  it('all cost values are positive numbers', () => {
    for (const [action, cost] of Object.entries(CREDIT_COSTS)) {
      expect(cost, `${action} should be > 0`).toBeGreaterThan(0);
    }
  });

  it('CV creation is the most expensive standard action', () => {
    expect(CREDIT_COSTS.CREATE_CV).toBeGreaterThan(CREDIT_COSTS.CREATE_LETTER);
  });

  it('translation is more expensive than basic analysis', () => {
    expect(CREDIT_COSTS.AI_CV_TRANSLATE).toBeGreaterThan(CREDIT_COSTS.AI_ANALYZE);
  });

  it('interview is more expensive than a single rewrite', () => {
    expect(CREDIT_COSTS.AI_INTERVIEW).toBeGreaterThan(CREDIT_COSTS.AI_REWRITE);
  });

  it('quick AI actions (rewrite, continue, correct) cost the same', () => {
    expect(CREDIT_COSTS.AI_REWRITE).toBe(CREDIT_COSTS.AI_CONTINUE);
    expect(CREDIT_COSTS.AI_CONTINUE).toBe(CREDIT_COSTS.AI_CORRECT);
  });

  it('all defined action types are present', () => {
    const expectedActions = [
      'CREATE_CV',
      'CREATE_LETTER',
      'AI_ANALYZE',
      'AI_MATCH',
      'AI_GENERATE_LETTER',
      'AI_OPTIMIZE',
      'AI_REWRITE',
      'AI_CONTINUE',
      'AI_CORRECT',
      'AI_CV_TRANSLATE',
      'AI_INTERVIEW',
      'AI_INTERVIEW_AUDIO_MINUTE',
    ];

    for (const action of expectedActions) {
      expect(CREDIT_COSTS).toHaveProperty(action);
    }
  });
});

// -- InsufficientCreditsError -----------------------------------------------

describe('InsufficientCreditsError', () => {
  it('is an instance of Error', () => {
    const err = new InsufficientCreditsError(3, 1);
    expect(err).toBeInstanceOf(Error);
  });

  it('has the correct name', () => {
    const err = new InsufficientCreditsError(3, 1);
    expect(err.name).toBe('InsufficientCreditsError');
  });

  it('message includes cost and missing amount', () => {
    const err = new InsufficientCreditsError(10, 3);
    expect(err.message).toContain('10');
    // The message format is: "besoin de {cost} crédits ... manque {missing} crédits"
    // Balance (3) is not displayed directly, but missing (7) is
    expect(err.message).toContain('7');
  });

  it('message includes the missing amount', () => {
    const err = new InsufficientCreditsError(10, 3);
    expect(err.message).toContain('7'); // 10 - 3
  });

  it('works with fractional costs', () => {
    const err = new InsufficientCreditsError(0.5, 0);
    expect(err.message).toContain('0.5');
  });

  it('can be caught and re-identified', () => {
    try {
      throw new InsufficientCreditsError(5, 2);
    } catch (e) {
      expect(e).toBeInstanceOf(InsufficientCreditsError);
      expect(e).toBeInstanceOf(Error);
    }
  });
});

// -- Cost hierarchy invariants ----------------------------------------------

describe('cost hierarchy invariants', () => {
  it('audio interview per-minute cost is less than full interview cost', () => {
    expect(CREDIT_COSTS.AI_INTERVIEW_AUDIO_MINUTE).toBeLessThan(
      CREDIT_COSTS.AI_INTERVIEW
    );
  });

  it('no action costs more than translation', () => {
    const maxCost = Math.max(...Object.values(CREDIT_COSTS));
    expect(maxCost).toBe(CREDIT_COSTS.AI_CV_TRANSLATE);
  });
});
