/**
 * Anonymization utilities for the Recruiter Portal.
 *
 * Transforms sensitive candidate data (full name, email, phone, address)
 * into anonymized versions while preserving professional content
 * (skills, experience descriptions, education, languages, scores).
 *
 * All anonymization runs server-side only. The client never receives
 * raw personal data unless a recruiter has unlocked the profile.
 */

// -- Types ------------------------------------------------------------------

export interface AnonymizedProfile {
  anonymousName: string;
  title: string;
  summary: string | null;
  sector: string | null;
  skills: string[];
  experienceYears: number;
  locationCity: string | null;
  locationCountry: string | null;
  completionScore: number;
  experiences: AnonymizedExperience[];
  education: AnonymizedEducation[];
  languages: { name: string; level?: string }[];
  certifications: { name: string; organization: string; date: string }[];
  projects: AnonymizedProject[];
}

interface AnonymizedExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface AnonymizedEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface AnonymizedProject {
  name: string;
  description: string;
  url?: string;
  github?: string;
  technologies?: string;
}

// -- Core Functions ---------------------------------------------------------

/**
 * Generates initials from a first and last name.
 * Handles compound names (e.g. "Jean-Pierre" -> "J"), accented characters,
 * and missing values gracefully.
 *
 * @example
 * anonymizeName("Amadou", "Sawadogo") => "A.S."
 * anonymizeName("Jean-Pierre", "De La Fontaine") => "J.D."
 * anonymizeName("", "Ouedraogo") => "O."
 * anonymizeName("", "") => "A."
 */
export function anonymizeName(firstName: string, lastName: string): string {
  const extractInitial = (name: string): string => {
    if (!name || typeof name !== 'string') return '';
    const trimmed = name.trim();
    if (!trimmed) return '';
    const firstChar = Array.from(trimmed)[0] || '';
    return firstChar.toUpperCase();
  };

  const firstInitial = extractInitial(firstName);
  const lastInitial = extractInitial(lastName);

  if (firstInitial && lastInitial) {
    return `${firstInitial}.${lastInitial}.`;
  }
  if (firstInitial) return `${firstInitial}.`;
  if (lastInitial) return `${lastInitial}.`;

  return '??';
}

/**
 * Removes PII patterns (emails, phone numbers) from free-form text.
 * Used to sanitize experience descriptions and summaries.
 */
export function sanitizeText(text: any): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
    .replace(/(\+?\d[\d\s\-().]{7,}\d)/g, '[tel]');
}

/**
 * Removes occurrences of the candidate's full name, first name, or
 * last name from sanitized text.
 */
function stripName(text: string, fullName: string): string {
  if (!text || !fullName) return text;
  const parts = fullName.split(/\s+/).filter((p) => p.length >= 2);
  let result = text;
  if (fullName.length >= 2) {
    result = result.replace(new RegExp(escapeRegex(fullName), 'gi'), '[nom]');
  }
  for (const part of parts) {
    result = result.replace(new RegExp(`\\b${escapeRegex(part)}\\b`, 'gi'), '[nom]');
  }
  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds an anonymized view of a candidate profile from raw CV content.
 * Strips all personally identifiable information (PII) while keeping
 * the professional substance intact.
 *
 * What gets masked:
 *   - Full name -> initials
 *   - Email, phone, address -> removed entirely
 *   - Company names in experiences -> kept (they describe the candidate's background)
 *
 * What is preserved:
 *   - Job title, summary, sector
 *   - Skills array, experience descriptions, education details
 *   - Languages, certifications
 *   - Completion score, experience years, location (city/country only)
 */
export function anonymizeProfile(cvContent: any): AnonymizedProfile {
  if (!cvContent || typeof cvContent !== 'object') {
    return {
      anonymousName: '??',
      title: '',
      summary: null,
      sector: null,
      skills: [],
      experienceYears: 0,
      locationCity: null,
      locationCountry: null,
      completionScore: 0,
      experiences: [],
      education: [],
      languages: [],
      certifications: [],
      projects: [],
    };
  }

  const personalInfo = cvContent.personalInfo || {};
  const candidateName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();

  const experiences = Array.isArray(cvContent.experiences)
    ? cvContent.experiences.map((exp: any) => ({
        position: exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: !!exp.current,
        description: stripName(sanitizeText(exp.description || ''), candidateName),
      }))
    : [];

  const education = Array.isArray(cvContent.education)
    ? cvContent.education.map((edu: any) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      }))
    : [];

  const languages = Array.isArray(cvContent.languages)
    ? cvContent.languages.map((lang: any) => ({
        name: lang.name || '',
        level: lang.level || undefined,
      }))
    : [];

  const certifications = Array.isArray(cvContent.certifications)
    ? cvContent.certifications.map((cert: any) => ({
        name: cert.name || '',
        organization: cert.organization || '',
        date: cert.date || '',
      }))
    : [];

  const projects = Array.isArray(cvContent.projects)
    ? cvContent.projects.map((proj: any) => {
        // Masquer les liens Github/Gitlab car ils contiennent souvent le nom complet,
        // mais conserver les autres URL de portfolio/site vitrine.
        const isGitLink = (url?: string) => url && /github|gitlab/i.test(url);
        return {
          name: proj.name || '',
          description: stripName(sanitizeText(proj.description || ''), candidateName),
          url: isGitLink(proj.url) ? undefined : (proj.url || undefined),
          github: undefined, // Toujours masquer le champ github dédié
          technologies: proj.technologies || undefined,
        };
      })
    : [];

  const skills = extractSkillNames(cvContent.skills);
  const experienceYears = calculateExperienceYears(cvContent.experiences);
  const completionScore = calculateCompletionScore(cvContent);
  const sector = personalInfo.sector || cvContent.sector || null;

  return {
    anonymousName: anonymizeName(
      personalInfo.firstName || '',
      personalInfo.lastName || ''
    ),
    title: personalInfo.title || '',
    summary: personalInfo.summary ? stripName(sanitizeText(personalInfo.summary), candidateName) : null,
    sector,
    skills,
    experienceYears,
    locationCity: extractCity(personalInfo.address),
    locationCountry: extractCountry(personalInfo.address),
    completionScore,
    experiences,
    education,
    languages,
    certifications,
    projects,
  };
}

// -- Scoring & Extraction ---------------------------------------------------

/**
 * Extracts skill names from the CV skills array.
 * Handles both `{ name: "React" }` and plain string formats.
 */
function extractSkillNames(skills: any): string[] {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s: any) => (typeof s === 'string' ? s : s?.name || ''))
    .filter((name: string) => name.length > 0);
}

/**
 * Calculates total years of professional experience by summing
 * the duration of each experience entry.
 *
 * Handles missing dates, "current" positions (uses today's date),
 * and invalid date strings gracefully.
 */
export function calculateExperienceYears(experiences: any): number {
  if (!Array.isArray(experiences) || experiences.length === 0) return 0;

  let totalMonths = 0;

  for (const exp of experiences) {
    const startDate = parseExperienceDate(exp.startDate);
    if (!startDate) continue;

    const endDate = exp.current
      ? new Date()
      : parseExperienceDate(exp.endDate) || new Date();

    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs > 0) {
      totalMonths += diffMs / (1000 * 60 * 60 * 24 * 30.44);
    }
  }

  return Math.round(totalMonths / 12);
}

/**
 * Parses a date string from a CV experience entry.
 * Supports formats like "2020-01", "Janvier 2020", "2020", "01/2020".
 */
function parseExperienceDate(dateStr: any): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed;

  // Try "YYYY" format
  const yearOnly = /^(\d{4})$/.exec(trimmed);
  if (yearOnly) return new Date(parseInt(yearOnly[1], 10), 0, 1);

  // Try "MM/YYYY" format
  const mmYYYY = /^(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (mmYYYY) return new Date(parseInt(mmYYYY[2], 10), parseInt(mmYYYY[1], 10) - 1, 1);

  return null;
}

/**
 * Calculates a completion score (0-100) for a CV based on
 * the presence and quality of its sections.
 *
 * Weighted scoring:
 *   - Personal info (name, title, email, phone): 25 points
 *   - Experiences (at least 1 with description):  25 points
 *   - Education (at least 1):                     15 points
 *   - Skills (at least 3):                        20 points
 *   - Summary/profile text:                       10 points
 *   - Languages (at least 1):                      5 points
 */
export function calculateCompletionScore(cvContent: any): number {
  if (!cvContent || typeof cvContent !== 'object') return 0;

  let score = 0;
  const p = cvContent.personalInfo || {};

  // Personal info block (25 pts)
  if (p.firstName && p.lastName) score += 10;
  if (p.title) score += 5;
  if (p.email) score += 5;
  if (p.phone) score += 5;

  // Experiences (25 pts)
  const exps = Array.isArray(cvContent.experiences) ? cvContent.experiences : [];
  if (exps.length > 0) {
    score += 15;
    const hasDescription = exps.some((e: any) => e.description && e.description.length > 20);
    if (hasDescription) score += 10;
  }

  // Education (15 pts)
  const edus = Array.isArray(cvContent.education) ? cvContent.education : [];
  if (edus.length > 0) score += 15;

  // Skills (20 pts)
  const skills = extractSkillNames(cvContent.skills);
  if (skills.length >= 3) score += 20;
  else if (skills.length > 0) score += 10;

  // Summary (10 pts)
  if (p.summary && p.summary.length > 30) score += 10;

  // Languages (5 pts)
  const langs = Array.isArray(cvContent.languages) ? cvContent.languages : [];
  if (langs.length > 0) score += 5;

  return Math.min(100, score);
}

// -- Location Helpers -------------------------------------------------------

/**
 * Extracts the city portion from a free-form address string.
 * Uses a best-effort heuristic: takes the first segment before a comma.
 * Returns null if the address is empty or unparseable.
 */
function extractCity(address: any): string | null {
  if (!address || typeof address !== 'string') return null;
  const parts = address.split(',').map((p: string) => p.trim());
  return parts[0] || null;
}

/**
 * Extracts the country portion from a free-form address string.
 * Assumes the last segment after a comma is the country.
 */
function extractCountry(address: any): string | null {
  if (!address || typeof address !== 'string') return null;
  const parts = address.split(',').map((p: string) => p.trim());
  return parts.length > 1 ? parts[parts.length - 1] : null;
}
