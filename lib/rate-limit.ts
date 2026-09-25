type Bucket = { count: number; resetAt: number };

const globalRateLimit = globalThis as typeof globalThis & { babsRateLimit?: Map<string, Bucket> };
const buckets = globalRateLimit.babsRateLimit ?? new Map<string, Bucket>();
globalRateLimit.babsRateLimit = buckets;

/**
 * Limiteur best-effort par instance serverless. Il bloque les rafales courantes;
 * un WAF/Vercel ou Redis est requis pour une limite distribuee a grand trafic.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5_000) for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }
  current.count += 1;
  return { limited: current.count > limit, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
}

export function requestIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
