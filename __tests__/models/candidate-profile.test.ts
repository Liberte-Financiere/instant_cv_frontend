import { describe, it, expect } from 'vitest';
import { evaluateQuality } from '@/lib/candidate-profile';

// -- Test fixtures ----------------------------------------------------------

function makeCV(overrides: any = {}) {
  return {
    personalInfo: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@mail.com',
      phone: '+226 70 00 00 00',
      title: 'Developpeur',
      summary: 'Profil complet et solide',
      ...overrides.personalInfo,
    },
    experiences: overrides.experiences ?? [
      {
        position: 'Dev Senior',
        company: 'Corp',
        startDate: '2020-01',
        endDate: '',
        current: true,
        description: 'Travail significatif',
      },
    ],
    education: overrides.education ?? [
      {
        institution: 'Universite X',
        degree: 'Licence',
        field: 'Info',
        startDate: '2016',
        endDate: '2019',
      },
    ],
    skills: overrides.skills ?? ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    languages: overrides.languages ?? [{ name: 'Francais', level: 'Natif' }],
    certifications: overrides.certifications ?? [],
  };
}

// -- evaluateQuality --------------------------------------------------------

describe('evaluateQuality', () => {
  describe('passing cases', () => {
    it('passes for a complete CV updated recently', () => {
      const content = makeCV();
      const updatedAt = new Date(); // just now
      const result = evaluateQuality(content, updatedAt);
      expect(result.passes).toBe(true);
      expect(result.completionScore).toBeGreaterThanOrEqual(60);
      expect(result.reasons).toHaveLength(0);
    });

    it('passes with exactly 3 skills (minimum threshold)', () => {
      const content = makeCV({ skills: ['A', 'B', 'C'] });
      const result = evaluateQuality(content, new Date());
      expect(result.passes).toBe(true);
    });
  });

  describe('failing cases - score too low', () => {
    it('fails for a CV with no experiences, education, or skills', () => {
      const content = makeCV({
        experiences: [],
        education: [],
        skills: [],
      });
      const result = evaluateQuality(content, new Date());
      expect(result.passes).toBe(false);
      expect(result.completionScore).toBeLessThan(60);
    });
  });

  describe('failing cases - missing experiences or education', () => {
    it('fails if no experience AND no education', () => {
      const content = makeCV({
        experiences: [],
        education: [],
      });
      const result = evaluateQuality(content, new Date());
      expect(result.passes).toBe(false);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('passes with 1 experience and 0 education', () => {
      const content = makeCV({ education: [] });
      const result = evaluateQuality(content, new Date());
      // Should still pass because at least 1 exp exists
      expect(result.reasons.filter((r: string) => r.includes('experience') && r.includes('formation'))).toHaveLength(0);
    });

    it('passes with 0 experience and 1 education', () => {
      const content = makeCV({ experiences: [] });
      const result = evaluateQuality(content, new Date());
      expect(result.reasons.filter((r: string) => r.includes('experience') && r.includes('formation'))).toHaveLength(0);
    });
  });

  describe('failing cases - insufficient skills', () => {
    it('fails with only 2 skills', () => {
      const content = makeCV({ skills: ['React', 'Node'] });
      const result = evaluateQuality(content, new Date());
      expect(result.passes).toBe(false);
      expect(result.reasons.some((r: string) => r.toLowerCase().includes('comp'))).toBe(true);
    });

    it('fails with 0 skills', () => {
      const content = makeCV({ skills: [] });
      const result = evaluateQuality(content, new Date());
      expect(result.passes).toBe(false);
    });
  });

  describe('failing cases - stale CV', () => {
    it('fails if updated more than 6 months ago', () => {
      const content = makeCV();
      const sevenMonthsAgo = new Date();
      sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

      const result = evaluateQuality(content, sevenMonthsAgo);
      expect(result.passes).toBe(false);
      expect(result.reasons.some((r: string) => r.toLowerCase().includes('jour') || r.toLowerCase().includes('jours'))).toBe(true);
    });

    it('passes if updated exactly 5 months ago', () => {
      const content = makeCV();
      const fiveMonthsAgo = new Date();
      fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

      const result = evaluateQuality(content, fiveMonthsAgo);
      // Should not fail on staleness (5 < 6)
      expect(result.reasons.some((r: string) => r.toLowerCase().includes('jour'))).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles null content gracefully', () => {
      const result = evaluateQuality(null as any, new Date());
      expect(result.passes).toBe(false);
      expect(result.completionScore).toBe(0);
    });

    it('handles undefined updatedAt', () => {
      const content = makeCV();
      const result = evaluateQuality(content, undefined as any);
      expect(result.passes).toBe(false);
    });

    it('accumulates multiple failure reasons', () => {
      const content = makeCV({
        experiences: [],
        education: [],
        skills: [],
      });
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 2);

      const result = evaluateQuality(content, oldDate);
      expect(result.passes).toBe(false);
      expect(result.reasons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
