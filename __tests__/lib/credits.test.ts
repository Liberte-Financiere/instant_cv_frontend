import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { CREDIT_COSTS, InsufficientCreditsError, checkAndConsumeCredits } from '@/lib/credits';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(async (cb) => {
      // Pour simuler la transaction, on exécute simplement le callback avec l'objet prisma mocké
      return cb(prisma);
    }),
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    creditTransaction: {
      create: vi.fn(),
    },
  },
}));

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

  it('has a reasonable maximum cost', () => {
    const maxCost = Math.max(...Object.values(CREDIT_COSTS));
    expect(maxCost).toBeLessThanOrEqual(50);
  });
});

// -- FREE_SERVICES ----------------------------------------------------------

describe('FREE_SERVICES & checkAndConsumeCredits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.user.updateMany as any).mockResolvedValue({ count: 1 });
  });

  it('contains CREATE_CV in config', async () => {
    // Dynamically import to ensure we get the latest
    const { FREE_SERVICES } = await import('@/lib/credit-costs');
    expect(FREE_SERVICES).toContain('CREATE_CV');
  });

  describe('checkAndConsumeCredits behavior', () => {
    it('Cas 1 - Utilisateur avec des crédits (CREATE_CV est gratuit)', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ credits: 10 });

      const result = await checkAndConsumeCredits('user-1', 'CREATE_CV', 'Test free service');
      
      // Doit retourner success: true, le vrai solde (10) et isFree: true
      expect(result).toEqual({
        success: true,
        newBalance: 10,
        isFree: true
      });

      // Ne doit pas débiter le solde
      expect(prisma.user.update).not.toHaveBeenCalled();
      
      // Ne doit générer aucune transaction
      expect(prisma.creditTransaction.create).not.toHaveBeenCalled();
    });

    it('Cas 2 - Utilisateur sans crédit (CREATE_CV autorisé)', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ credits: 0 });

      const result = await checkAndConsumeCredits('user-2', 'CREATE_CV', 'Test free service no credits');
      
      // Autorisé même à 0 crédit
      expect(result).toEqual({
        success: true,
        newBalance: 0,
        isFree: true
      });

      // Aucun débit ni transaction
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.creditTransaction.create).not.toHaveBeenCalled();
    });

    it('Cas 4 - Service payant normal (AI_ANALYZE)', async () => {
      (prisma.user.findUnique as any)
        .mockResolvedValueOnce({ credits: 10 })
        .mockResolvedValueOnce({ credits: 10 - CREDIT_COSTS.AI_ANALYZE });
      const cost = CREDIT_COSTS.AI_ANALYZE;

      const result = await checkAndConsumeCredits('user-3', 'AI_ANALYZE', 'Test paid service');
      
      expect(result).toEqual({
        success: true,
        newBalance: 10 - cost,
        isB2B: false,
      });

      // Le solde doit être débité de manière atomique
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: 'user-3', credits: { gte: cost } },
        data: { credits: { decrement: cost } }
      });

      // La transaction doit être loggée
      expect(prisma.creditTransaction.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-3',
          amount: -cost,
          type: 'USAGE',
          description: 'Test paid service'
        }
      });
    });

    it('Cas 5 - Service payant avec crédits insuffisants', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ credits: 1 });
      const cost = CREDIT_COSTS.AI_ANALYZE; // 2

      await expect(
        checkAndConsumeCredits('user-4', 'AI_ANALYZE', 'Test insufficient')
      ).rejects.toThrow(InsufficientCreditsError);

      expect(prisma.user.updateMany).not.toHaveBeenCalled();
      expect(prisma.creditTransaction.create).not.toHaveBeenCalled();
    });
  });
});
