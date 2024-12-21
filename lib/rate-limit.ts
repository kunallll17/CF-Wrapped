import { Redis } from '@upstash/redis';
import { RATE_LIMIT } from './api';

const redis = Redis.fromEnv();

export async function rateLimit(identifier: string) {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  const requests = await redis.zrangebyscore(key, windowStart, '+inf');
  
  if (requests.length >= RATE_LIMIT.maxRequests) {
    return { success: false };
  }

  await redis.zadd(key, now, now.toString());
  await redis.zremrangebyscore(key, 0, windowStart);
  await redis.expire(key, Math.floor(RATE_LIMIT.windowMs / 1000));

  return { success: true };
}