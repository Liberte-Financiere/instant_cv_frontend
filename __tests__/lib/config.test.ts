import { describe, it, expect } from 'vitest';
import { APP_CONFIG, APP_NAME } from '@/lib/config';

/**
 * Tests for the application configuration.
 *
 * Validates that the central config object maintains internal
 * consistency. Catches typos, missing fields, and invalid values
 * that would cause runtime failures in production.
 */

// -- Brand ------------------------------------------------------------------

describe('APP_CONFIG.brand', () => {
  it('APP_NAME matches APP_CONFIG.name', () => {
    expect(APP_NAME).toBe(APP_CONFIG.name);
  });

  it('name is a non-empty string', () => {
    expect(APP_CONFIG.name.length).toBeGreaterThan(0);
  });

  it('url is a valid HTTPS URL', () => {
    expect(APP_CONFIG.url).toMatch(/^https:\/\//);
  });

  it('email addresses are valid format', () => {
    expect(APP_CONFIG.email).toMatch(/@/);
    expect(APP_CONFIG.supportEmail).toMatch(/@/);
  });
});

// -- Credits ----------------------------------------------------------------

describe('APP_CONFIG.credits', () => {
  it('signup bonus is positive', () => {
    expect(APP_CONFIG.credits.signupBonus).toBeGreaterThan(0);
  });

  it('referral rewards are positive', () => {
    expect(APP_CONFIG.credits.referralReward).toBeGreaterThan(0);
    expect(APP_CONFIG.credits.referralBonus).toBeGreaterThan(0);
  });
});

// -- Pricing ----------------------------------------------------------------

describe('APP_CONFIG.pricing', () => {
  it('has a valid currency code', () => {
    expect(APP_CONFIG.pricing.currency.length).toBeGreaterThan(0);
  });

  it('has at least 1 credit pack', () => {
    expect(APP_CONFIG.pricing.packs.length).toBeGreaterThanOrEqual(1);
  });

  it('each pack has required fields with valid values', () => {
    for (const pack of APP_CONFIG.pricing.packs) {
      expect(pack.id, `pack missing id`).toBeTruthy();
      expect(pack.name, `pack ${pack.id} missing name`).toBeTruthy();
      expect(pack.credits, `pack ${pack.id} credits should be > 0`).toBeGreaterThan(0);
      expect(pack.price, `pack ${pack.id} price should be > 0`).toBeGreaterThan(0);
      expect(pack.priceLabel, `pack ${pack.id} missing priceLabel`).toBeTruthy();
      expect(pack.description, `pack ${pack.id} missing description`).toBeTruthy();
      expect(Array.isArray(pack.features), `pack ${pack.id} features should be an array`).toBe(true);
      expect(pack.features.length, `pack ${pack.id} should have features`).toBeGreaterThan(0);
    }
  });

  it('pack IDs are unique', () => {
    const ids = APP_CONFIG.pricing.packs.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exactly one pack is marked as popular', () => {
    const popularPacks = APP_CONFIG.pricing.packs.filter((p) => p.popular);
    expect(popularPacks).toHaveLength(1);
  });

  it('packs are ordered by ascending price', () => {
    for (let i = 1; i < APP_CONFIG.pricing.packs.length; i++) {
      expect(APP_CONFIG.pricing.packs[i].price).toBeGreaterThan(
        APP_CONFIG.pricing.packs[i - 1].price
      );
    }
  });

  it('more expensive packs give more credits', () => {
    for (let i = 1; i < APP_CONFIG.pricing.packs.length; i++) {
      expect(APP_CONFIG.pricing.packs[i].credits).toBeGreaterThan(
        APP_CONFIG.pricing.packs[i - 1].credits
      );
    }
  });
});

// -- AI Configuration -------------------------------------------------------

describe('APP_CONFIG.ai', () => {
  it('all model names are non-empty strings', () => {
    const checkModels = (models: any) => {
      for (const [key, value] of Object.entries(models)) {
        if (typeof value === 'object' && value !== null) {
          checkModels(value);
        } else {
          expect(typeof value, `model ${key} should be a string`).toBe('string');
          expect((value as string).length, `model ${key} should not be empty`).toBeGreaterThan(0);
        }
      }
    };
    checkModels(APP_CONFIG.ai.models);
  });

  it('interview maxQuestions is a positive integer', () => {
    expect(APP_CONFIG.ai.interview.maxQuestions).toBeGreaterThan(0);
    expect(Number.isInteger(APP_CONFIG.ai.interview.maxQuestions)).toBe(true);
  });

  it('talent assistant rate limit has valid values', () => {
    const rl = APP_CONFIG.ai.talentAssistant.rateLimit;
    expect(rl.limit).toBeGreaterThan(0);
    expect(rl.windowMs).toBeGreaterThan(0);
  });

  it('maxMessages for talent assistant is positive', () => {
    expect(APP_CONFIG.ai.talentAssistant.maxMessages).toBeGreaterThan(0);
  });

  it('voices configuration has at least one default voice', () => {
    expect(APP_CONFIG.ai.voices.default).toBeTruthy();
  });
});

// -- Free Features ----------------------------------------------------------

describe('APP_CONFIG.freeFeatures', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(APP_CONFIG.freeFeatures)).toBe(true);
    expect(APP_CONFIG.freeFeatures.length).toBeGreaterThan(0);
    for (const feature of APP_CONFIG.freeFeatures) {
      expect(typeof feature).toBe('string');
      expect(feature.length).toBeGreaterThan(0);
    }
  });
});
