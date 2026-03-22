/**
 * Simple in-memory rate limiter for API routes.
 * 
 * Uses a sliding window approach per user ID.
 * For production at scale, replace with Redis-based solution (e.g. @upstash/ratelimit).
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

interface RateLimitOptions {
  /** Maximum number of requests allowed per window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // ms until reset
}

/**
 * Check if a request is allowed based on rate limits.
 * 
 * @param key - Unique identifier (typically `userId:routeName`)
 * @param options - Rate limit configuration
 * @returns Whether the request is allowed and remaining quota
 * 
 * @example
 * ```ts
 * const result = checkRateLimit(`${userId}:ai-analyze`, { limit: 10, windowMs: 60_000 });
 * if (!result.allowed) {
 *   return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // First request or window expired — reset
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, resetIn: options.windowMs };
  }

  // Within window — check count
  if (record.count >= options.limit) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  // Increment and allow
  record.count++;
  return { allowed: true, remaining: options.limit - record.count, resetIn: record.resetTime - now };
}

/**
 * Pre-configured rate limits for different API categories.
 */
export const RATE_LIMITS = {
  /** File upload: 15 requests per minute */
  UPLOAD: { limit: 15, windowMs: 60_000 },
} as const;
