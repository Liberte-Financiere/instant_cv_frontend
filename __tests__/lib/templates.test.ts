import { describe, it, expect } from 'vitest';
import { TEMPLATES, TEMPLATE_IDS } from '@/lib/templates';
import type { CategoryId } from '@/lib/mock-cv-profiles';

describe('TEMPLATES registry', () => {
  it('contains unique template IDs', () => {
    const ids = TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('exposes TEMPLATE_IDS synchronized with TEMPLATES', () => {
    expect(TEMPLATE_IDS).toEqual(TEMPLATES.map(t => t.id));
  });

  it('does not contain deprecated or deleted templates ats-iron, infographic, classic-serif, gradient, clean-grid, and corporate-blue', () => {
    expect((TEMPLATE_IDS as string[])).not.toContain('ats-iron');
    expect(TEMPLATES.some(t => (t.id as string) === 'ats-iron')).toBe(false);
    expect((TEMPLATE_IDS as string[])).not.toContain('infographic');
    expect(TEMPLATES.some(t => (t.id as string) === 'infographic')).toBe(false);
    expect((TEMPLATE_IDS as string[])).not.toContain('classic-serif');
    expect(TEMPLATES.some(t => (t.id as string) === 'classic-serif')).toBe(false);
    expect((TEMPLATE_IDS as string[])).not.toContain('gradient');
    expect(TEMPLATES.some(t => (t.id as string) === 'gradient')).toBe(false);
    expect((TEMPLATE_IDS as string[])).not.toContain('clean-grid');
    expect(TEMPLATES.some(t => (t.id as string) === 'clean-grid')).toBe(false);
    expect((TEMPLATE_IDS as string[])).not.toContain('corporate-blue');
    expect(TEMPLATES.some(t => (t.id as string) === 'corporate-blue')).toBe(false);
  });

  it('contains essential fallback templates modern and professional', () => {
    expect(TEMPLATE_IDS).toContain('modern');
    expect(TEMPLATE_IDS).toContain('professional');
  });

  it('ensures each template has all required properties and valid non-empty fields', () => {
    for (const template of TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.color).toBeTruthy();
      expect(Array.isArray(template.categories)).toBe(true);
      expect(template.categories.length).toBeGreaterThan(0);
      expect(template.exampleTitles).toBeDefined();
      expect(typeof template.exampleTitles.etudiant).toBe('string');
      expect(typeof template.exampleTitles.professionnel).toBe('string');
      expect(typeof template.exampleTitles.reconversion).toBe('string');
    }
  });

  it('provides template coverage for all target categories', () => {
    const targetCategories: CategoryId[] = ['etudiant', 'professionnel', 'reconversion'];
    for (const category of targetCategories) {
      const templatesForCategory = TEMPLATES.filter(t => t.categories.includes(category));
      expect(templatesForCategory.length).toBeGreaterThan(0);
    }
  });
});
