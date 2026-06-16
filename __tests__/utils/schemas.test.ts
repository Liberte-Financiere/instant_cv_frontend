import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  languageSchema,
  hobbySchema,
  certificationSchema,
  projectSchema,
  qualitySchema,
  referenceSchema,
  socialLinkSchema,
  footerSchema,
  settingsSchema,
  coverLetterContentSchema,
} from '@/lib/schemas';

/**
 * Tests for Zod validation schemas.
 *
 * These tests verify that the schemas accept valid data and
 * reject invalid data with correct error messages. This is
 * critical for data integrity since these schemas guard
 * every CV creation and update operation.
 */

// -- personalInfoSchema -----------------------------------------------------

describe('personalInfoSchema', () => {
  it('accepts a complete personal info object', () => {
    const data = {
      firstName: 'Amadou',
      lastName: 'Ouedraogo',
      email: 'amadou@test.com',
      phone: '+226 70 00 00 00',
      address: 'Ouagadougou',
      title: 'Developpeur',
      summary: 'Senior dev',
    };
    expect(personalInfoSchema.safeParse(data).success).toBe(true);
  });

  it('accepts empty strings for optional fields', () => {
    const data = { firstName: '', lastName: '', email: '' };
    expect(personalInfoSchema.safeParse(data).success).toBe(true);
  });

  it('accepts an empty object', () => {
    expect(personalInfoSchema.safeParse({}).success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const data = { email: 'not-an-email' };
    expect(personalInfoSchema.safeParse(data).success).toBe(false);
  });
});

// -- experienceSchema -------------------------------------------------------

describe('experienceSchema', () => {
  it('accepts a valid experience', () => {
    const data = {
      id: 'exp-1',
      company: 'TechCorp',
      position: 'Developpeur',
      startDate: '2020-01',
    };
    expect(experienceSchema.safeParse(data).success).toBe(true);
  });

  it('rejects missing company', () => {
    const data = { id: 'exp-1', company: '', position: 'Dev' };
    expect(experienceSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing position', () => {
    const data = { id: 'exp-1', company: 'Corp', position: '' };
    expect(experienceSchema.safeParse(data).success).toBe(false);
  });

  it('rejects missing id', () => {
    const data = { company: 'Corp', position: 'Dev' };
    expect(experienceSchema.safeParse(data).success).toBe(false);
  });
});

// -- educationSchema --------------------------------------------------------

describe('educationSchema', () => {
  it('accepts a valid education entry', () => {
    const data = {
      id: 'edu-1',
      institution: 'Universite Ouaga',
      degree: 'Master',
      field: 'Informatique',
    };
    expect(educationSchema.safeParse(data).success).toBe(true);
  });

  it('rejects empty institution', () => {
    const data = { id: 'edu-1', institution: '' };
    expect(educationSchema.safeParse(data).success).toBe(false);
  });
});

// -- skillSchema ------------------------------------------------------------

describe('skillSchema', () => {
  it('accepts a skill with level', () => {
    const data = { id: 's1', name: 'React', level: 4 };
    expect(skillSchema.safeParse(data).success).toBe(true);
  });

  it('accepts a skill without level', () => {
    const data = { id: 's1', name: 'React' };
    expect(skillSchema.safeParse(data).success).toBe(true);
  });

  it('rejects level below 1', () => {
    const data = { id: 's1', name: 'React', level: 0 };
    expect(skillSchema.safeParse(data).success).toBe(false);
  });

  it('rejects level above 5', () => {
    const data = { id: 's1', name: 'React', level: 6 };
    expect(skillSchema.safeParse(data).success).toBe(false);
  });

  it('rejects empty skill name', () => {
    const data = { id: 's1', name: '' };
    expect(skillSchema.safeParse(data).success).toBe(false);
  });
});

// -- languageSchema ---------------------------------------------------------

describe('languageSchema', () => {
  it('accepts valid language levels', () => {
    const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'];
    for (const level of levels) {
      const data = { id: 'l1', name: 'Francais', level };
      expect(languageSchema.safeParse(data).success, `Level "${level}" should be valid`).toBe(true);
    }
  });

  it('rejects invalid language level', () => {
    const data = { id: 'l1', name: 'Francais', level: 'Expert' };
    expect(languageSchema.safeParse(data).success).toBe(false);
  });

  it('accepts language without level', () => {
    const data = { id: 'l1', name: 'Francais' };
    expect(languageSchema.safeParse(data).success).toBe(true);
  });
});

// -- socialLinkSchema -------------------------------------------------------

describe('socialLinkSchema', () => {
  it('accepts valid social link platforms', () => {
    const platforms = ['linkedin', 'github', 'portfolio', 'twitter', 'other'];
    for (const platform of platforms) {
      const data = { id: 'sl1', platform, url: 'https://example.com' };
      expect(socialLinkSchema.safeParse(data).success, `Platform "${platform}" should be valid`).toBe(true);
    }
  });

  it('rejects invalid platform', () => {
    const data = { id: 'sl1', platform: 'tiktok', url: 'https://tiktok.com' };
    expect(socialLinkSchema.safeParse(data).success).toBe(false);
  });

  it('rejects invalid URL', () => {
    const data = { id: 'sl1', platform: 'linkedin', url: 'not-a-url' };
    expect(socialLinkSchema.safeParse(data).success).toBe(false);
  });
});

// -- footerSchema -----------------------------------------------------------

describe('footerSchema', () => {
  it('accepts a valid footer', () => {
    const data = { showFooter: true, madeAt: 'Ouagadougou', madeDate: '2024-01' };
    expect(footerSchema.safeParse(data).success).toBe(true);
  });

  it('requires showFooter to be boolean', () => {
    const data = { showFooter: 'yes' };
    expect(footerSchema.safeParse(data).success).toBe(false);
  });
});

// -- settingsSchema ---------------------------------------------------------

describe('settingsSchema', () => {
  it('accepts valid settings', () => {
    const data = { accentColor: '#2563eb', fontFamily: 'sans' };
    expect(settingsSchema.safeParse(data).success).toBe(true);
  });

  it('accepts all font families', () => {
    for (const font of ['sans', 'serif', 'mono']) {
      const data = { accentColor: '#000', fontFamily: font };
      expect(settingsSchema.safeParse(data).success, `Font "${font}" should be valid`).toBe(true);
    }
  });

  it('rejects invalid font family', () => {
    const data = { accentColor: '#000', fontFamily: 'comic-sans' };
    expect(settingsSchema.safeParse(data).success).toBe(false);
  });
});

// -- referenceSchema --------------------------------------------------------

describe('referenceSchema', () => {
  it('accepts valid reference', () => {
    const data = {
      id: 'r1',
      name: 'Jean Dupont',
      position: 'CTO',
      company: 'Corp',
      email: 'jean@corp.com',
      phone: '+33 6 12 34',
    };
    expect(referenceSchema.safeParse(data).success).toBe(true);
  });

  it('rejects invalid reference email', () => {
    const data = { id: 'r1', name: 'Jean', email: 'invalid' };
    expect(referenceSchema.safeParse(data).success).toBe(false);
  });

  it('accepts empty string email', () => {
    const data = { id: 'r1', name: 'Jean', email: '' };
    expect(referenceSchema.safeParse(data).success).toBe(true);
  });
});

// -- coverLetterContentSchema -----------------------------------------------

describe('coverLetterContentSchema', () => {
  it('accepts a valid cover letter', () => {
    const data = {
      sender: { firstName: 'Amadou', lastName: 'O', email: 'a@b.com' },
      recipient: { name: 'HR', company: 'Corp', address: '123 Rue' },
      details: {
        date: '2024-01-01',
        location: 'Ouagadougou',
        subject: 'Candidature',
        salutation: 'Madame, Monsieur,',
        body: 'Je me permets...',
        closing: 'Cordialement',
      },
    };
    expect(coverLetterContentSchema.safeParse(data).success).toBe(true);
  });

  it('rejects missing recipient fields', () => {
    const data = {
      sender: {},
      recipient: {},
      details: { date: '', location: '', subject: '', salutation: '', body: '', closing: '' },
    };
    expect(coverLetterContentSchema.safeParse(data).success).toBe(false);
  });
});
