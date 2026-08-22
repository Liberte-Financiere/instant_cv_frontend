import { describe, it, expect } from 'vitest';
import { formatDate, generateId, sanitizeCVData, groupSkillsByCategory } from '@/lib/utils';

/**
 * Tests for utility functions.
 *
 * sanitizeCVData is the most critical function here: it processes
 * all imported and AI-generated CV data before storage. A bug
 * here would corrupt every CV in the database.
 */

// -- formatDate -------------------------------------------------------------

describe('formatDate', () => {
  it('formats a valid Date object', () => {
    const result = formatDate(new Date('2024-03-15'));
    expect(result).toContain('2024');
  });

  it('formats a valid date string', () => {
    const result = formatDate('2024-01-01');
    expect(result).toContain('2024');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns the raw string for unparseable dates', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('uses French locale by default', () => {
    const result = formatDate('2024-06-15', 'fr');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('supports English locale', () => {
    const result = formatDate('2024-06-15', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// -- generateId -------------------------------------------------------------

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns a non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('generates statistically unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});

// -- sanitizeCVData ---------------------------------------------------------

describe('sanitizeCVData', () => {
  describe('null/undefined/empty input', () => {
    it('returns null for null input', () => {
      expect(sanitizeCVData(null)).toBeNull();
    });

    it('returns undefined for undefined input', () => {
      expect(sanitizeCVData(undefined)).toBeUndefined();
    });

    it('returns a string for string input', () => {
      expect(sanitizeCVData('hello')).toBe('hello');
    });
  });

  describe('default values injection', () => {
    it('adds an id if missing', () => {
      const result = sanitizeCVData({});
      expect(result.id).toBeTruthy();
      expect(typeof result.id).toBe('string');
    });

    it('preserves existing id', () => {
      const result = sanitizeCVData({ id: 'my-cv-id' });
      expect(result.id).toBe('my-cv-id');
    });

    it('adds default settings if missing', () => {
      const result = sanitizeCVData({});
      expect(result.settings).toBeDefined();
      expect(result.settings.accentColor).toBe('#2563eb');
      expect(result.settings.fontFamily).toBe('sans');
    });

    it('adds default footer if missing', () => {
      const result = sanitizeCVData({});
      expect(result.footer).toBeDefined();
      expect(result.footer.showFooter).toBe(false);
    });

    it('adds default sectionOrder if missing', () => {
      const result = sanitizeCVData({});
      expect(Array.isArray(result.sectionOrder)).toBe(true);
      expect(result.sectionOrder).toContain('experience');
      expect(result.sectionOrder).toContain('education');
      expect(result.sectionOrder).toContain('skills');
    });

    it('fills missing sections in partial sectionOrder', () => {
      const result = sanitizeCVData({ sectionOrder: ['experience'] });
      expect(result.sectionOrder).toContain('experience');
      expect(result.sectionOrder).toContain('education');
      expect(result.sectionOrder).toContain('skills');
    });

    it('filters invalid section names from sectionOrder', () => {
      const result = sanitizeCVData({ sectionOrder: ['experience', 'INVALID_SECTION'] });
      expect(result.sectionOrder).not.toContain('INVALID_SECTION');
      expect(result.sectionOrder).toContain('experience');
    });

    it('defaults to modern template if invalid templateId', () => {
      const result = sanitizeCVData({ templateId: 'DOES_NOT_EXIST' });
      expect(result.templateId).toBe('modern');
    });

    it('preserves valid templateId', () => {
      const result = sanitizeCVData({ templateId: 'professional' });
      expect(result.templateId).toBe('professional');
    });
  });

  describe('personalInfo sanitization', () => {
    it('adds default personalInfo if missing', () => {
      const result = sanitizeCVData({});
      expect(result.personalInfo).toBeDefined();
      expect(result.personalInfo.firstName).toBe('');
      expect(result.personalInfo.email).toBe('');
    });

    it('preserves valid email', () => {
      const result = sanitizeCVData({
        personalInfo: { email: 'test@example.com' },
      });
      expect(result.personalInfo.email).toBe('test@example.com');
    });

    it('rejects invalid email', () => {
      const result = sanitizeCVData({
        personalInfo: { email: 'not-an-email' },
      });
      expect(result.personalInfo.email).toBe('');
    });

    it('trims whitespace from email', () => {
      const result = sanitizeCVData({
        personalInfo: { email: '  user@test.com  ' },
      });
      expect(result.personalInfo.email).toBe('user@test.com');
    });
  });

  describe('experiences sanitization', () => {
    it('returns empty array for null experiences', () => {
      const result = sanitizeCVData({ experiences: null });
      expect(result.experiences).toEqual([]);
    });

    it('adds id to experiences missing id', () => {
      const result = sanitizeCVData({
        experiences: [{ company: 'Corp', position: 'Dev' }],
      });
      expect(result.experiences[0].id).toBeTruthy();
    });

    it('preserves valid experience data', () => {
      const result = sanitizeCVData({
        experiences: [{
          id: 'exp-1',
          company: 'TechCorp',
          position: 'Senior Dev',
          startDate: '2020-01',
          current: true,
          description: 'Building stuff',
        }],
      });
      expect(result.experiences[0].company).toBe('TechCorp');
      expect(result.experiences[0].position).toBe('Senior Dev');
      expect(result.experiences[0].current).toBe(true);
    });

    it('defaults missing company to "Entreprise"', () => {
      const result = sanitizeCVData({
        experiences: [{ position: 'Dev' }],
      });
      expect(result.experiences[0].company).toBe('Entreprise');
    });
  });

  describe('skills sanitization', () => {
    it('clamps skill level to 1-5 range', () => {
      const result = sanitizeCVData({
        skills: [
          { name: 'React', level: 10 },
          { name: 'Node', level: 0 },
          { name: 'TS', level: 3 },
        ],
      });
      expect(result.skills[0].level).toBe(5); // clamped from 10
      expect(result.skills[1].level).toBe(1); // clamped from 0
      expect(result.skills[2].level).toBe(3); // unchanged
    });

    it('handles non-numeric skill levels', () => {
      const result = sanitizeCVData({
        skills: [{ name: 'React', level: 'expert' }],
      });
      expect(result.skills[0].level).toBeUndefined();
    });

    it('defaults missing skill name to "Compétence"', () => {
      const result = sanitizeCVData({
        skills: [{ level: 3 }],
      });
      expect(result.skills[0].name).toBe('Compétence');
    });
  });

  describe('languages sanitization', () => {
    it('maps French level names to Zod enum values', () => {
      const result = sanitizeCVData({
        languages: [
          { name: 'Francais', level: 'natif' },
          { name: 'Anglais', level: 'courant' },
          { name: 'Espagnol', level: 'débutant' },
        ],
      });
      expect(result.languages[0].level).toBe('Natif');
      expect(result.languages[1].level).toBe('Avancé');
      expect(result.languages[2].level).toBe('Débutant');
    });

    it('maps English level names to Zod enum values', () => {
      const result = sanitizeCVData({
        languages: [
          { name: 'English', level: 'native' },
          { name: 'French', level: 'beginner' },
        ],
      });
      expect(result.languages[0].level).toBe('Natif');
      expect(result.languages[1].level).toBe('Débutant');
    });

    it('returns undefined for unrecognized levels', () => {
      const result = sanitizeCVData({
        languages: [{ name: 'Klingon', level: 'warp speed' }],
      });
      expect(result.languages[0].level).toBeUndefined();
    });
  });

  describe('socialLinks sanitization', () => {
    it('normalizes platform names to lowercase', () => {
      const result = sanitizeCVData({
        socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com/in/user' }],
      });
      expect(result.socialLinks[0].platform).toBe('linkedin');
    });

    it('defaults invalid platform to "other"', () => {
      const result = sanitizeCVData({
        socialLinks: [{ platform: 'MySpace', url: 'https://myspace.com' }],
      });
      expect(result.socialLinks[0].platform).toBe('other');
    });

    it('prepends https:// to URLs missing protocol', () => {
      const result = sanitizeCVData({
        socialLinks: [{ platform: 'github', url: 'github.com/user' }],
      });
      expect(result.socialLinks[0].url).toBe('https://github.com/user');
    });
  });

  describe('references sanitization', () => {
    it('validates reference email', () => {
      const result = sanitizeCVData({
        references: [{ name: 'Boss', email: 'valid@corp.com' }],
      });
      expect(result.references[0].email).toBe('valid@corp.com');
    });

    it('rejects invalid reference email', () => {
      const result = sanitizeCVData({
        references: [{ name: 'Boss', email: 'not-email' }],
      });
      expect(result.references[0].email).toBe('');
    });
  });

  describe('full CV round-trip', () => {
    it('sanitizes a complete real-world CV without crashing', () => {
      const fullCV = {
        id: 'cv-123',
        title: 'Mon CV',
        templateId: 'modern',
        personalInfo: {
          firstName: 'Amadou',
          lastName: 'Ouedraogo',
          email: 'amadou@test.com',
          phone: '+226 70 00 00 00',
          address: 'Ouagadougou, Burkina Faso',
          title: 'Ingenieur Logiciel',
          summary: 'Senior dev with 5 years experience',
        },
        experiences: [
          { id: 'e1', company: 'TechCorp', position: 'Senior Dev', startDate: '2020-01', current: true, description: 'Building platforms' },
        ],
        education: [
          { id: 'ed1', institution: 'Univ Ouaga', degree: 'Master', field: 'CS', startDate: '2015', endDate: '2018' },
        ],
        skills: [
          { id: 's1', name: 'React', level: 4 },
          { id: 's2', name: 'Node.js', level: 3 },
        ],
        languages: [
          { id: 'l1', name: 'Francais', level: 'natif' },
        ],
        certifications: [],
        projects: [],
        references: [],
        hobbies: [],
        qualities: [],
        socialLinks: [],
        sectionOrder: ['summary', 'experience', 'education', 'skills'],
        footer: { showFooter: false },
        settings: { accentColor: '#ff0000' },
      };

      const result = sanitizeCVData(fullCV);

      expect(result.id).toBe('cv-123');
      expect(result.personalInfo.email).toBe('amadou@test.com');
      expect(result.experiences).toHaveLength(1);
      expect(result.skills[0].level).toBe(4);
      expect(result.languages[0].level).toBe('Natif');
      expect(result.templateId).toBe('modern');
    });
  });
});

// -- groupSkillsByCategory ----------------------------------------------------

describe('groupSkillsByCategory', () => {
  it('groups skills by their category property', () => {
    const skills = [
      { id: '1', name: 'React', category: 'Compétences Techniques' },
      { id: '2', name: 'Communication', category: 'Compétences Transversales' },
      { id: '3', name: 'Node.js', category: 'Compétences Techniques' },
    ];
    const grouped = groupSkillsByCategory(skills);
    
    expect(grouped).toHaveLength(2);
    expect(grouped[0].category).toBe('Compétences Techniques');
    expect(grouped[0].items).toHaveLength(2);
    expect(grouped[0].items[0].name).toBe('React');
    expect(grouped[0].items[1].name).toBe('Node.js');
    
    expect(grouped[1].category).toBe('Compétences Transversales');
    expect(grouped[1].items).toHaveLength(1);
    expect(grouped[1].items[0].name).toBe('Communication');
  });

  it('puts skills without category in an empty string category group', () => {
    const skills = [
      { id: '1', name: 'React' },
      { id: '2', name: 'Communication', category: 'Compétences Transversales' },
    ];
    const grouped = groupSkillsByCategory(skills);
    
    expect(grouped).toHaveLength(2);
    // Uncategorized items usually appear first due to the ordering logic if implemented,
    // or we just check the groups exist.
    const emptyCategoryGroup = grouped.find(g => g.category === '');
    expect(emptyCategoryGroup).toBeDefined();
    expect(emptyCategoryGroup!.items).toHaveLength(1);
    expect(emptyCategoryGroup!.items[0].name).toBe('React');
  });

  it('handles empty arrays gracefully', () => {
    const grouped = groupSkillsByCategory([]);
    expect(grouped).toEqual([]);
  });
});
