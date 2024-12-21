import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  maxRequests: 30, // Maximum number of requests per window
};

export async function checkRateLimit(ip: string) {
  const key = `rate-limit:${ip}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  try {
    // Use zcount to efficiently get the number of requests within the window
    const requestCount = await redis.zcount(key, windowStart, now);
    
    if (requestCount >= RATE_LIMIT.maxRequests) {
      return { success: false, message: 'Rate limit exceeded' };
    }

    // Add the new request timestamp to the sorted set
    await redis.zadd(key, { score: now, member: now.toString() });
    
    // Set the expiration for the key to ensure old entries are cleaned up
    await redis.expire(key, Math.floor(RATE_LIMIT.windowMs / 1000));

    return { success: true };
  } catch (error) {
    console.error('Rate limiting error:', error);
    return { success: false, message: 'Internal server error' };
  }
}
