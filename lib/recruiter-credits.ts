/**
 * Recruiter Credits & Profile Unlock Engine.
 *
 * Manages the recruiter-specific credit economy:
 *   - 3 free profile unlocks for new recruiter accounts.
 *   - Paid unlocks via recruiterCredits after free tier is exhausted.
 *   - Idempotent unlock: re-unlocking the same profile returns cached
 *     data without charging again.
 *   - Atomic transactions to prevent double-spending under concurrency.
 *
 * This module handles credit deduction and unlock record creation.
 * It delegates PII retrieval to the caller (API route) to maintain
 * separation of concerns.
 */

import { prisma } from '@/lib/prisma';

// -- Constants --------------------------------------------------------------

export const FREE_UNLOCK_LIMIT = 3;
export const UNLOCK_CREDIT_COST = 5;

// -- Types ------------------------------------------------------------------

export interface UnlockResult {
  status: 'unlocked' | 'already_unlocked';
  wasFree: boolean;
  creditsCost: number;
  remainingFreeUnlocks: number;
  remainingCredits: number;
  candidateProfileId: string;
}

export interface RecruiterStatus {
  recruiterCredits: number;
  freeUnlocksUsed: number;
  freeUnlocksRemaining: number;
  totalUnlocks: number;
}

export class InsufficientRecruiterCreditsError extends Error {
  constructor(cost: number, balance: number) {
    const missing = cost - balance;
    super(
      `Credits recruteur insuffisants. Cout: ${cost}, solde: ${balance}. Il vous manque ${missing} credits.`
    );
    this.name = 'InsufficientRecruiterCreditsError';
  }
}

// -- Core Functions ---------------------------------------------------------

/**
 * Checks whether the recruiter still has free unlocks available.
 */
export async function canUnlockForFree(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { freeUnlocksUsed: true },
  });

  if (!user) return false;
  return user.freeUnlocksUsed < FREE_UNLOCK_LIMIT;
}

/**
 * Unlocks a candidate profile for a recruiter.
 *
 * Flow:
 *   1. Check if already unlocked (idempotent: return existing data).
 *   2. Check if free unlocks are available.
 *   3. If not free, verify and deduct recruiterCredits atomically.
 *   4. Create the ProfileUnlock record.
 *   5. Log the credit transaction.
 *
 * All operations run inside a single Prisma transaction to prevent
 * race conditions and double-spending.
 *
 * @throws InsufficientRecruiterCreditsError if paid unlock but no credits.
 */
export async function unlockProfile(
  recruiterId: string,
  candidateProfileId: string
): Promise<UnlockResult> {
  // 1. Idempotent check: already unlocked?
  const existingUnlock = await prisma.profileUnlock.findUnique({
    where: {
      unlockerUserId_candidateProfileId: {
        unlockerUserId: recruiterId,
        candidateProfileId,
      },
    },
  });

  if (existingUnlock) {
    const user = await prisma.user.findUnique({
      where: { id: recruiterId },
      select: { freeUnlocksUsed: true, recruiterCredits: true },
    });

    return {
      status: 'already_unlocked',
      wasFree: existingUnlock.creditsCost === 0,
      creditsCost: 0,
      remainingFreeUnlocks: Math.max(0, FREE_UNLOCK_LIMIT - (user?.freeUnlocksUsed || 0)),
      remainingCredits: user?.recruiterCredits || 0,
      candidateProfileId,
    };
  }

  // 2. Verify the candidate profile exists and is active
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { id: candidateProfileId },
    select: { id: true, isActive: true, userId: true },
  });

  if (!candidateProfile || !candidateProfile.isActive) {
    throw new Error('Profil candidat introuvable ou inactif.');
  }

  // 3. Prevent recruiters from unlocking their own profile
  if (candidateProfile.userId === recruiterId) {
    throw new Error('Vous ne pouvez pas debloquer votre propre profil.');
  }

  // 4. Transactional unlock
  return await prisma.$transaction(async (tx) => {
    const recruiter = await tx.user.findUnique({
      where: { id: recruiterId },
      select: { freeUnlocksUsed: true, recruiterCredits: true },
    });

    if (!recruiter) {
      throw new Error('Compte recruteur introuvable.');
    }

    const isFree = recruiter.freeUnlocksUsed < FREE_UNLOCK_LIMIT;
    const cost = isFree ? 0 : UNLOCK_CREDIT_COST;

    // If paid unlock, verify sufficient credits
    if (!isFree && recruiter.recruiterCredits < UNLOCK_CREDIT_COST) {
      throw new InsufficientRecruiterCreditsError(
        UNLOCK_CREDIT_COST,
        recruiter.recruiterCredits
      );
    }

    // Deduct credits or increment free unlock counter
    if (isFree) {
      await tx.user.update({
        where: { id: recruiterId },
        data: { freeUnlocksUsed: { increment: 1 } },
      });
    } else {
      await tx.user.update({
        where: { id: recruiterId },
        data: { recruiterCredits: { decrement: UNLOCK_CREDIT_COST } },
      });
    }

    // Create the unlock record
    await tx.profileUnlock.create({
      data: {
        unlockerUserId: recruiterId,
        candidateProfileId,
        creditsCost: cost,
      },
    });

    // Log credit transaction (for paid unlocks only)
    if (!isFree) {
      await tx.creditTransaction.create({
        data: {
          userId: recruiterId,
          amount: -UNLOCK_CREDIT_COST,
          type: 'RECRUITER_UNLOCK',
          description: `Deblocage profil candidat ${candidateProfileId}`,
        },
      });
    }

    const newFreeUsed = isFree ? recruiter.freeUnlocksUsed + 1 : recruiter.freeUnlocksUsed;
    const newCredits = isFree
      ? recruiter.recruiterCredits
      : recruiter.recruiterCredits - UNLOCK_CREDIT_COST;

    return {
      status: 'unlocked' as const,
      wasFree: isFree,
      creditsCost: cost,
      remainingFreeUnlocks: Math.max(0, FREE_UNLOCK_LIMIT - newFreeUsed),
      remainingCredits: newCredits,
      candidateProfileId,
    };
  });
}

/**
 * Returns the unlock history for a recruiter, ordered by most recent.
 * Includes the anonymized candidate data for each unlock.
 */
export async function getUnlockHistory(recruiterId: string) {
  return prisma.profileUnlock.findMany({
    where: { unlockerUserId: recruiterId },
    include: {
      candidateProfile: {
        select: {
          id: true,
          anonymousName: true,
          title: true,
          sector: true,
          skills: true,
          experienceYears: true,
          locationCity: true,
          locationCountry: true,
          completionScore: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Returns the current status of a recruiter account:
 * credits balance, free unlocks used/remaining, total unlocks.
 */
export async function getRecruiterStatus(recruiterId: string): Promise<RecruiterStatus | null> {
  const user = await prisma.user.findUnique({
    where: { id: recruiterId },
    select: {
      recruiterCredits: true,
      freeUnlocksUsed: true,
      _count: { select: { profileUnlocks: true } },
    },
  });

  if (!user) return null;

  return {
    recruiterCredits: user.recruiterCredits,
    freeUnlocksUsed: user.freeUnlocksUsed,
    freeUnlocksRemaining: Math.max(0, FREE_UNLOCK_LIMIT - user.freeUnlocksUsed),
    totalUnlocks: user._count.profileUnlocks,
  };
}
