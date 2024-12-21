import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 30, // requests per window
};

export async function checkRateLimit(ip: string) {
  const key = `rate-limit:${ip}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  // Use numbers directly for Redis operations
  const requests = await redis.zrangebyscore(key, windowStart, now);
  
  if (requests.length >= RATE_LIMIT.maxRequests) {
    return { success: false };
  }

  // Add the new request timestamp
  await redis.zadd(key, { score: now, member: now.toString() });
  
  // Set expiration
  await redis.expire(key, Math.floor(RATE_LIMIT.windowMs / 1000));

  return { success: true };
}
