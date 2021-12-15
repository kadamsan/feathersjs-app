import { createClient } from 'redis';
import { Application } from './declarations';
import logger from './logger';

export default async (app: Application) => {
  const { connection } = app.get('redis');

  const redisClient: any = createClient({
    url: `redis://${connection.username}:${connection.password}@${connection.host}:${connection.port}`
  });

  redisClient.on('error', (err: Error | any) => logger.error('Redis connection error', err));
  redisClient.on('connect', () => logger.info('Initiating a connection to the Redis server.'));
  redisClient.on('ready', () => logger.info('Successfully initiated the connection to the Redis server.'));
  redisClient.on('end', () => logger.info('Disconnected the connection to the Redis server via .quit() or .disconnect().'));

  await redisClient.connect();

  // Returns PONG - Just to make sure connection is successful
  logger.info(`Response of redisClient from PING command: ${await redisClient.ping()}`);
  app.set('redisClient', redisClient);
};
