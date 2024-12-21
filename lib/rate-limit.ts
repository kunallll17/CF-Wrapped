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

  // Convert windowStart to string for zremrangebyscore
  const requests = await redis.zremrangebyscore(key, windowStart.toString(), '+inf');
  
  if (requests.length >= RATE_LIMIT.maxRequests) {
    return { success: false };
  }

  await redis.zadd(key, now, now.toString());
  await redis.expire(key, Math.floor(RATE_LIMIT.windowMs / 1000));

  return { success: true };
}
