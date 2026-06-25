import "server-only";

/**
 * Lightweight fixed-window rate limiter. Uses an in-memory store by default so
 * it works with zero infra; in production set UPSTASH_REDIS_REST_URL/TOKEN and
 * swap the store for @upstash/ratelimit (Faz 4). The interface stays the same.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

const hits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
  }
  entry.count += 1;
  return {
    ok: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "anonymous"
  );
}
