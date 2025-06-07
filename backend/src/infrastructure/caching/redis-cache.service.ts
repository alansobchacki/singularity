import { Injectable } from '@nestjs/common';
import redisClient from './redis-client';

@Injectable()
export class RedisCacheService {
  async get(key: string): Promise<string | null> {
    const value = await redisClient.get(key);
    return value as string | null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
