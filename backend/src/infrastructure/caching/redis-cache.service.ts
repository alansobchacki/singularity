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

  async delPattern(pattern: string): Promise<void> {
    let cursor = 0;
    let keys: string[] = [];

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = reply.cursor;
      keys = reply.keys;

      if (keys.length > 0) await redisClient.del(keys);
    } while (cursor !== 0);
  }
}
