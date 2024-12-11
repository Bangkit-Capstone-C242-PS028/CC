// src/infrastructure/cache/cache.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class CacheService {
  private client;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.MEMORYSTORE_HOST}:${process.env.MEMORYSTORE_PORT}`,
    });

    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }
}
