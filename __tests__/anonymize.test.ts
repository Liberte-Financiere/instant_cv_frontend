import { describe, it, expect } from 'vitest';
import {
  anonymizeName,
  anonymizeProfile,
  calculateCompletionScore,
  calculateExperienceYears,
  sanitizeText,
} from '@/lib/anonymize';

// -- Test fixtures ----------------------------------------------------------

const FULL_CV_CONTENT = {
  personalInfo: {
    firstName: 'Abdoulaye',
    lastName: 'Ouedraogo',
    email: 'abdoulaye.ouedraogo@gmail.com',
    phone: '+226 70 12 34 56',
    address: '12 Rue de la Paix, Ouagadougou',
    title: 'Developpeur Full Stack Senior',
    summary: 'Developpeur avec 5 ans experience chez TechCorp Burkina.',
  },
  experiences: [
    {
      position: 'Developpeur Senior',
      company: 'TechCorp Burkina',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Developpement de plateformes web pour Abdoulaye Corp.',
    },
    {
      position: 'Developpeur Junior',
      company: 'StartupBF',
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: 'Maintenance et features.',
    },
  ],
  education: [
    {
      institution: 'Universite Ouaga I',
      degree: 'Master',
      field: 'Informatique',
      startDate: '2015',
      endDate: '2018',
    },
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
  languages: [
    { name: 'Francais', level: 'Natif' },
    { name: 'Anglais', level: 'Courant' },
  ],
  certifications: [
    { name: 'AWS Solutions Architect', organization: 'Amazon', date: '2022' },
  ],
};

const MINIMAL_CV_CONTENT = {
  personalInfo: {
    firstName: 'Jean',
    lastName: '',
    email: '',
    phone: '',
    title: '',
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};

// -- anonymizeName ----------------------------------------------------------

describe('anonymizeName', () => {
  it('generates initials from firstName and lastName', () => {
    expect(anonymizeName('Abdoulaye', 'Ouedraogo')).toBe('A.O.');
  });

  it('handles single name (firstName only)', () => {
    expect(anonymizeName('Abdoulaye', '')).toBe('A.');
    expect(anonymizeName('Abdoulaye', undefined as any)).toBe('A.');
  });

  it('handles empty strings', () => {
    expect(anonymizeName('', '')).toBe('??');
  });

  it('handles null/undefined gracefully', () => {
    expect(anonymizeName(null as any, null as any)).toBe('??');
    expect(anonymizeName(undefined as any, undefined as any)).toBe('??');
  });

  it('trims whitespace around names', () => {
    expect(anonymizeName('  Marie  ', '  Dupont  ')).toBe('M.D.');
  });

  it('handles compound last names', () => {
    expect(anonymizeName('Jean', 'De La Fontaine')).toBe('J.D.');
  });

  // --- Bizarre Scenarios ---
  it('handles names with special characters and hyphens', () => {
    expect(anonymizeName('Jean-Baptiste', 'O\'Connor')).toBe('J.O.');
    expect(anonymizeName('Marie-Antoinette', 'D\'Arcy')).toBe('M.D.');
  });

  it('handles names that are just single letters', () => {
    expect(anonymizeName('A', 'B')).toBe('A.B.');
  });

  it('handles names with emojis (should still extract first character)', () => {
    expect(anonymizeName('👨‍💻Dev', '🚀Ninja')).toBe('👨.🚀.');
  });
});

// -- sanitizeText -----------------------------------------------------------

describe('sanitizeText', () => {
  it('removes email addresses from text', () => {
    const input = 'Contactez-moi a abdoulaye@gmail.com pour plus info';
    const result = sanitizeText(input);
    expect(result).not.toContain('abdoulaye@gmail.com');
    expect(result).toContain('[email]');
  });

  it('removes phone numbers', () => {
    const input = 'Mon numero: +226 70 12 34 56';
    const result = sanitizeText(input);
    expect(result).not.toContain('+226 70 12 34 56');
  });

  it('returns empty string for null/undefined', () => {
    expect(sanitizeText(null as any)).toBe('');
    expect(sanitizeText(undefined as any)).toBe('');
  });

  it('preserves clean text unchanged', () => {
    const clean = 'Developpeur Full Stack avec 5 ans experience';
    expect(sanitizeText(clean)).toBe(clean);
  });

  // --- Bizarre Scenarios ---
  it('removes bizarrely formatted emails', () => {
    const input = 'My email is weirdly.formatted+alias@sub.domain.co.uk please email me.';
    const result = sanitizeText(input);
    expect(result).not.toContain('weirdly.formatted');
    expect(result).toContain('[email]');
  });

  it('removes bizarrely formatted phone numbers', () => {
    const input = 'Call me: +226.70.12.34.56 or 00226-70-12-34-56';
    const result = sanitizeText(input);
    expect(result).not.toContain('70.12');
    expect(result).not.toContain('70-12');
  });

  it('handles text with HTML tags and script injections safely', () => {
    const malicious = '<script>alert("hack")</script> and my phone is +33 6 12 34 56 78';
    const result = sanitizeText(malicious);
    expect(result).not.toContain('+33 6');
  });
});

// -- anonymizeProfile -------------------------------------------------------

describe('anonymizeProfile', () => {
  it('returns anonymized name as initials', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.anonymousName).toBe('A.O.');
  });

  it('strips PII from personalInfo (no email, phone, address, full name)', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT) as any;
    expect(result.email).toBeUndefined();
    expect(result.phone).toBeUndefined();
    expect(result.address).toBeUndefined();
    expect(result.firstName).toBeUndefined();
    expect(result.lastName).toBeUndefined();
  });

  it('preserves title and sanitized summary', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.title).toBe('Developpeur Full Stack Senior');
    expect(result.summary).toBeDefined();
    expect(result.summary).not.toContain('Abdoulaye');
  });

  it('sanitizes PII from experience descriptions', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    const firstExp = result.experiences[0];
    expect(firstExp.description).not.toContain('Abdoulaye');
  });

  it('preserves experience metadata (position, company, dates)', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.experiences).toHaveLength(2);
    expect(result.experiences[0].position).toBe('Developpeur Senior');
    expect(result.experiences[0].company).toBe('TechCorp Burkina');
  });

  it('preserves education data', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.education).toHaveLength(1);
    expect(result.education[0].degree).toBe('Master');
  });

  it('preserves skills array', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.skills).toEqual(['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker']);
  });

  it('preserves languages', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.languages).toHaveLength(2);
  });

  it('preserves certifications', () => {
    const result = anonymizeProfile(FULL_CV_CONTENT);
    expect(result.certifications).toHaveLength(1);
    expect(result.certifications[0].name).toBe('AWS Solutions Architect');
  });

  it('handles minimal CV without crashing', () => {
    const result = anonymizeProfile(MINIMAL_CV_CONTENT);
    expect(result.anonymousName).toBe('J.');
    expect(result.experiences).toEqual([]);
    expect(result.skills).toEqual([]);
  });

  it('handles null/undefined content', () => {
    const result = anonymizeProfile(null as any);
    expect(result.anonymousName).toBe('??');
    expect(result.skills).toEqual([]);
  });

  // --- Bizarre Scenarios ---
  it('handles CV where personalInfo exists but all fields are null/undefined', () => {
    const weirdCV = {
      personalInfo: { firstName: null, lastName: undefined, email: null, phone: undefined },
      experiences: null,
      education: undefined,
    };
    const result = anonymizeProfile(weirdCV as any);
    expect(result.anonymousName).toBe('??');
    expect(result.experiences).toEqual([]);
    expect(result.education).toEqual([]);
  });

  it('anonymizes bizarre deep nested descriptions with XSS payloads', () => {
    const xssCV = {
      personalInfo: { firstName: 'Hacker', lastName: 'Man' },
      experiences: [{ 
        position: 'Dev', 
        company: 'Corp', 
        description: 'I hack things <img src="x" onerror="alert(1)"> call me +1 555 123 4567' 
      }],
    };
    const result = anonymizeProfile(xssCV as any);
    expect(result.experiences[0].description).not.toContain('555');
  });
  // --- Github/Gitlab URL censorship ---
  it('masks github URLs in project url field', () => {
    const cvWithGithub = {
      ...FULL_CV_CONTENT,
      projects: [
        { name: 'Mon Projet', description: 'Un projet cool', url: 'https://github.com/user/repo', github: 'https://github.com/user/repo' },
      ],
    };
    const result = anonymizeProfile(cvWithGithub);
    expect(result.projects[0].url).toBeUndefined();
    expect(result.projects[0].github).toBeUndefined();
  });

  it('masks gitlab URLs in project url field', () => {
    const cvWithGitlab = {
      ...FULL_CV_CONTENT,
      projects: [
        { name: 'Projet GL', description: 'Projet Gitlab', url: 'https://gitlab.com/user/repo' },
      ],
    };
    const result = anonymizeProfile(cvWithGitlab);
    expect(result.projects[0].url).toBeUndefined();
  });

  it('preserves non-git URLs in projects', () => {
    const cvWithPortfolio = {
      ...FULL_CV_CONTENT,
      projects: [
        { name: 'Portfolio', description: 'Mon site', url: 'https://monportfolio.com' },
      ],
    };
    const result = anonymizeProfile(cvWithPortfolio);
    expect(result.projects[0].url).toBe('https://monportfolio.com');
  });

  it('github field is always undefined regardless of input', () => {
    const cvWithGithub = {
      ...FULL_CV_CONTENT,
      projects: [
        { name: 'Projet', description: 'Desc', github: 'https://github.com/user/repo', url: 'https://mysite.com' },
      ],
    };
    const result = anonymizeProfile(cvWithGithub);
    expect(result.projects[0].github).toBeUndefined();
    expect(result.projects[0].url).toBe('https://mysite.com');
  });
});

// -- calculateCompletionScore -----------------------------------------------

describe('calculateCompletionScore', () => {
  it('returns 100 or near-100 for a fully complete CV', () => {
    const score = calculateCompletionScore(FULL_CV_CONTENT);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('returns a low score for a minimal CV', () => {
    const score = calculateCompletionScore(MINIMAL_CV_CONTENT);
    expect(score).toBeLessThan(30);
  });

  it('returns 0 for null content', () => {
    expect(calculateCompletionScore(null as any)).toBe(0);
  });

  it('returns 0 for empty object', () => {
    expect(calculateCompletionScore({})).toBe(0);
  });

  it('gives partial credit for having experiences but nothing else', () => {
    const partial = {
      personalInfo: { firstName: 'Test' },
      experiences: [{ position: 'Dev', company: 'Corp' }],
      education: [],
      skills: [],
    };
    const score = calculateCompletionScore(partial);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(60);
  });

  it('score increases with more skills', () => {
    const fewSkills = { ...MINIMAL_CV_CONTENT, skills: ['React'] };
    const manySkills = { ...MINIMAL_CV_CONTENT, skills: ['React', 'Node', 'TS', 'Docker', 'AWS'] };
    expect(calculateCompletionScore(manySkills)).toBeGreaterThan(calculateCompletionScore(fewSkills));
  });

  it('always returns a value between 0 and 100', () => {
    const score = calculateCompletionScore(FULL_CV_CONTENT);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// -- calculateExperienceYears -----------------------------------------------

describe('calculateExperienceYears', () => {
  it('calculates total years from multiple experiences', () => {
    const years = calculateExperienceYears(FULL_CV_CONTENT.experiences);
    expect(years).toBeGreaterThanOrEqual(5);
  });

  it('returns 0 for empty experiences array', () => {
    expect(calculateExperienceYears([])).toBe(0);
  });

  it('returns 0 for null/undefined', () => {
    expect(calculateExperienceYears(null as any)).toBe(0);
    expect(calculateExperienceYears(undefined as any)).toBe(0);
  });

  it('handles current position (no endDate)', () => {
    const current = [{ startDate: '2023-01', endDate: '', current: true }];
    const years = calculateExperienceYears(current);
    expect(years).toBeGreaterThanOrEqual(1);
  });

  it('handles date format YYYY only', () => {
    const exps = [{ startDate: '2020', endDate: '2023', current: false }];
    const years = calculateExperienceYears(exps);
    expect(years).toBeGreaterThanOrEqual(2);
    expect(years).toBeLessThanOrEqual(4);
  });

  it('handles malformed dates gracefully', () => {
    const exps = [{ startDate: 'not-a-date', endDate: 'also-bad', current: false }];
    expect(calculateExperienceYears(exps)).toBe(0);
  });
});
