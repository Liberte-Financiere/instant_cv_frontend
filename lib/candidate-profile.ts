/**
 * Candidate Profile Indexation Engine.
 *
 * Manages the lifecycle of CandidateProfile records:
 *   - Sync: extracts structured data from a CV's JSON content,
 *     calculates scores, generates anonymized names, and upserts
 *     into the CandidateProfile table.
 *   - Remove: deletes the profile when a user opts out.
 *   - Quality Gate: enforces minimum thresholds before a profile
 *     becomes visible to recruiters.
 *
 * This module operates exclusively on the CandidateProfile table.
 * It never exposes raw PII to API consumers.
 */

import { prisma } from '@/lib/prisma';
import {
  anonymizeName,
  calculateExperienceYears,
  calculateCompletionScore,
} from '@/lib/anonymize';

// -- Constants --------------------------------------------------------------

const QUALITY_MIN_COMPLETION = 60;
const QUALITY_MIN_SKILLS = 3;
const QUALITY_MAX_STALE_DAYS = 180; // 6 months

// -- Types ------------------------------------------------------------------

interface QualityReport {
  passes: boolean;
  completionScore: number;
  hasExperienceOrEducation: boolean;
  skillCount: number;
  isRecent: boolean;
  reasons: string[];
}

// -- Quality Gate -----------------------------------------------------------

/**
 * Evaluates whether a CV meets the minimum quality threshold
 * to be indexed in the recruiter talent pool.
 *
 * Criteria:
 *   1. Completion score >= 60%
 *   2. At least 1 experience OR 1 education entry
 *   3. At least 3 skills listed
 *   4. CV updated within the last 6 months
 */
export function evaluateQuality(cvContent: any, lastUpdated: Date): QualityReport {
  if (!cvContent || typeof cvContent !== 'object') {
    return {
      passes: false,
      completionScore: 0,
      hasExperienceOrEducation: false,
      skillCount: 0,
      isRecent: false,
      reasons: ['Contenu du CV invalide ou vide'],
    };
  }

  if (!lastUpdated || !(lastUpdated instanceof Date) || isNaN(lastUpdated.getTime())) {
    return {
      passes: false,
      completionScore: calculateCompletionScore(cvContent),
      hasExperienceOrEducation: false,
      skillCount: 0,
      isRecent: false,
      reasons: ['Date de mise a jour invalide'],
    };
  }

  const completionScore = calculateCompletionScore(cvContent);
  const experiences = Array.isArray(cvContent.experiences) ? cvContent.experiences : [];
  const education = Array.isArray(cvContent.education) ? cvContent.education : [];
  const skills = Array.isArray(cvContent.skills) ? cvContent.skills : [];

  const hasExperienceOrEducation = experiences.length > 0 || education.length > 0;
  const skillCount = skills.filter((s: any) => {
    const name = typeof s === 'string' ? s : s?.name;
    return name && name.trim().length > 0;
  }).length;

  const daysSinceUpdate = Math.floor(
    (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isRecent = daysSinceUpdate <= QUALITY_MAX_STALE_DAYS;

  const reasons: string[] = [];
  if (completionScore < QUALITY_MIN_COMPLETION) {
    reasons.push(`Score de complétude insuffisant (${completionScore}% < ${QUALITY_MIN_COMPLETION}%)`);
  }
  if (!hasExperienceOrEducation) {
    reasons.push('Au moins 1 expérience ou 1 formation requise');
  }
  if (skillCount < QUALITY_MIN_SKILLS) {
    reasons.push(`Au moins ${QUALITY_MIN_SKILLS} compétences requises (${skillCount} trouvées)`);
  }
  if (!isRecent) {
    reasons.push(`CV non mis à jour depuis ${daysSinceUpdate} jours (max ${QUALITY_MAX_STALE_DAYS})`);
  }

  return {
    passes: reasons.length === 0,
    completionScore,
    hasExperienceOrEducation,
    skillCount,
    isRecent,
    reasons,
  };
}

// -- Sync & Remove ----------------------------------------------------------

/**
 * Synchronizes a CandidateProfile from a CV record.
 *
 * This function is the single entry point for indexation. It:
 *   1. Loads the CV and its content from the database.
 *   2. Checks dual consent: `isPublic` AND `isSearchable` must both be true.
 *   3. Runs the quality gate.
 *   4. Extracts structured fields from the JSON content.
 *   5. Upserts the CandidateProfile (create or update).
 *
 * If the CV does not meet the conditions (consent or quality),
 * any existing CandidateProfile is deactivated silently.
 *
 * @returns The upserted profile, or null if conditions are not met.
 */
export async function syncCandidateProfile(cvId: string) {
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    select: {
      id: true,
      userId: true,
      content: true,
      isPublic: true,
      isSearchable: true,
      updatedAt: true,
    },
  });

  if (!cv || !cv.userId) {
    return null;
  }

  const cvContent = cv.content as any;
  if (!cvContent) {
    await deactivateProfile(cvId);
    return null;
  }

  // Dual consent check
  if (!cv.isPublic || !cv.isSearchable) {
    await deactivateProfile(cvId);
    return null;
  }

  // Quality gate
  const quality = evaluateQuality(cvContent, cv.updatedAt);
  if (!quality.passes) {
    await deactivateProfile(cvId);
    return null;
  }

  // Extract structured data
  const personalInfo = cvContent.personalInfo || {};
  const skills = extractSkillNames(cvContent.skills);
  const experienceYears = calculateExperienceYears(cvContent.experiences);

  const profileData = {
    userId: cv.userId,
    anonymousName: anonymizeName(personalInfo.firstName || '', personalInfo.lastName || ''),
    title: personalInfo.title || 'Non renseigné',
    summary: personalInfo.summary || null,
    sector: personalInfo.sector || null,
    skills,
    experienceYears,
    locationCity: extractCity(personalInfo.address),
    locationCountry: extractCountry(personalInfo.address),
    completionScore: quality.completionScore,
    lastCvUpdate: cv.updatedAt,
    isActive: true,
  };

  // Upsert: create if new, update if exists
  const profile = await prisma.candidateProfile.upsert({
    where: { cvId },
    create: {
      cvId,
      ...profileData,
    },
    update: profileData,
  });

  return profile;
}

/**
 * Removes a candidate profile from the recruiter search index.
 * Called when a user disables `isSearchable` on their CV.
 *
 * Uses soft-delete (isActive = false) to preserve unlock history
 * for recruiters who already paid for this profile.
 */
export async function removeCandidateProfile(cvId: string): Promise<void> {
  await deactivateProfile(cvId);
}

/**
 * Checks the quality of a CV and returns a detailed report.
 * Used by the frontend to show the user why their profile
 * cannot be indexed yet.
 */
export async function getQualityReport(cvId: string): Promise<QualityReport | null> {
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    select: { content: true, updatedAt: true },
  });

  if (!cv) return null;

  return evaluateQuality(cv.content as any, cv.updatedAt);
}

// -- Internal Helpers -------------------------------------------------------

async function deactivateProfile(cvId: string): Promise<void> {
  try {
    await prisma.candidateProfile.update({
      where: { cvId },
      data: { isActive: false },
    });
  } catch {
    // P2025: Record not found. Profile was never created, nothing to deactivate.
  }
}

function extractSkillNames(skills: any): string[] {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s: any) => (typeof s === 'string' ? s : s?.name || ''))
    .filter((name: string) => name.length > 0);
}

function extractCity(address: any): string | null {
  if (!address || typeof address !== 'string') return null;
  const parts = address.split(',').map((p: string) => p.trim());
  return parts[0] || null;
}

function extractCountry(address: any): string | null {
  if (!address || typeof address !== 'string') return null;
  const parts = address.split(',').map((p: string) => p.trim());
  return parts.length > 1 ? parts[parts.length - 1] : null;
}
