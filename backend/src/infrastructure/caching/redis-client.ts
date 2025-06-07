import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
