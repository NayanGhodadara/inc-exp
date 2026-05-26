// redis.provider.ts
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
    provide: REDIS_CLIENT,
    useFactory: () => {
        return new Redis({
            host: '127.0.0.1',
            port: 6379,
        });
    },
};