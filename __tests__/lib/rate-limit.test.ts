import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Tests for the in-memory rate limiter.
 *
 * The rate limiter uses a Map-based sliding window. These tests verify
 * the counting, blocking, and key-isolation behaviors without any
 * external dependency.
 */

describe('checkRateLimit', () => {
  const OPTIONS = { limit: 3, windowMs: 60_000 };

  // Use a unique key prefix per test to avoid state leaks between tests
  let keyCounter = 0;
  function uniqueKey() {
    return `test-key-${Date.now()}-${keyCounter++}`;
  }

  it('allows the first request and returns full remaining quota', () => {
    const key = uniqueKey();
    const result = checkRateLimit(key, OPTIONS);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(OPTIONS.limit - 1);
  });

  it('decrements remaining correctly on successive calls', () => {
    const key = uniqueKey();

    const r1 = checkRateLimit(key, OPTIONS);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, OPTIONS);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, OPTIONS);
    expect(r3.remaining).toBe(0);
  });

  it('blocks requests after the limit is reached', () => {
    const key = uniqueKey();

    for (let i = 0; i < OPTIONS.limit; i++) {
      const r = checkRateLimit(key, OPTIONS);
      expect(r.allowed).toBe(true);
    }

    const blocked = checkRateLimit(key, OPTIONS);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('returns a positive resetIn value when blocked', () => {
    const key = uniqueKey();

    for (let i = 0; i < OPTIONS.limit; i++) {
      checkRateLimit(key, OPTIONS);
    }

    const blocked = checkRateLimit(key, OPTIONS);
    expect(blocked.resetIn).toBeGreaterThan(0);
    expect(blocked.resetIn).toBeLessThanOrEqual(OPTIONS.windowMs);
  });

  it('isolates rate limits between different keys', () => {
    const keyA = uniqueKey();
    const keyB = uniqueKey();

    // Exhaust key A
    for (let i = 0; i < OPTIONS.limit; i++) {
      checkRateLimit(keyA, OPTIONS);
    }

    // Key B should still be allowed
    const resultB = checkRateLimit(keyB, OPTIONS);
    expect(resultB.allowed).toBe(true);
    expect(resultB.remaining).toBe(OPTIONS.limit - 1);
  });

  it('resets after the window expires', () => {
    const key = uniqueKey();
    const shortWindow = { limit: 1, windowMs: 1 }; // 1ms window

    checkRateLimit(key, shortWindow);

    // Wait for the window to expire
    const start = Date.now();
    while (Date.now() - start < 5) {
      // busy wait 5ms
    }

    const result = checkRateLimit(key, shortWindow);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('handles a limit of 1 (single request per window)', () => {
    const key = uniqueKey();
    const strictOptions = { limit: 1, windowMs: 60_000 };

    const first = checkRateLimit(key, strictOptions);
    expect(first.allowed).toBe(true);

    const second = checkRateLimit(key, strictOptions);
    expect(second.allowed).toBe(false);
  });
});
