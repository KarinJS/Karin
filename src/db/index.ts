import Redis from './redis'
import LevelDB from './level'
import { RedisClientType } from 'redis'

export const level = new LevelDB()
export const redis: RedisClientType = await new Redis().start() as RedisClientType
