import { RedisClientType } from 'redis';
/** Redis 客户端类型 */
export type Client = RedisClientType & {
    id: 'redis' | 'mock';
};
/**
 * @description Redis 服务
 * @returns Redis 客户端
 */
export declare const createRedis: () => Promise<Client>;
