import os from 'node:os'
import path from 'node:path'
import { isWin } from '@/env'
import { redis as redisConfig } from '@/utils/config'
import { redisSqlite3Path } from '@/root'
import { exec } from '@/utils/system/exec'
import { RedisClient } from '@/core/db/redis/mock'
import { SQLiteWrapper } from '@/core/db/redis/mock/sqlite'
import { createClient, RedisClientType, RedisClientOptions } from 'redis'

/**
 * @public
 * @description Redis数据库
 */
export let redis: Client

/** Redis 客户端类型 */
export type Client = RedisClientType & { id: 'redis' | 'mock' }

/**
 * @description 创建 Redis 客户端
 * @param options Redis 客户端配置
 * @returns Redis 客户端
 */
const create = async (options: RedisClientOptions) => {
  try {
    const client = createClient(options)
    await client.connect()
    Object.defineProperty(client, 'id', { value: 'Redis' })
    return client
  } catch (error) {
    logger.debug(`${logger.red('[redis] 启动失败:')} ${JSON.stringify(options)}`)
    logger.debug(error)
  }
}

/**
 * @description 尝试主动拉起 Redis
 * @returns 是否成功
 */
const start = async () => {
  logger.debug('[redis] 正在尝试启动 Redis...')

  if (isWin()) {
    // tips: windows仅适配 https://github.com/redis-windows/redis-windows 项目
    const result = await exec('redis-server.exe redis.conf', { booleanResult: true })
    if (result) return result

    /** 服务项 */
    const service = 'net start Redis'
    return await exec(service, { booleanResult: true })
  }

  const cmd = 'redis-server --save 300 10 --daemonize yes' + await isArm64()
  return await exec(cmd, { booleanResult: true })
}

/**
 * @description Redis 服务
 * @returns Redis 客户端
 */
export const createRedis = async (): Promise<Client> => {
  try {
    const options = redisConfig()
    let client = await create(options)
    if (client) {
      logger.info(`[redis] ${logger.green('Redis 连接成功')}`)
      return client as Client
    }

    /** 第一次启动失败 */
    const result = await start()
    if (result) {
      logger.debug(logger.green('[redis] 主动拉起 Redis 成功'))
      client = await create(options)
    } else {
      logger.debug(logger.red('[redis] 主动拉起 Redis 失败'))
    }
    if (client) {
      redis = client as Client
      return redis
    }
    throw new Error('Redis 启动失败')
  } catch (error) {
    logger.debug(`[redis] ${logger.red('Redis 连接失败')}`)
    logger.debug(error)
    logger.debug(logger.yellow('[redis] 将降级为 redis-mock 实现'))
    return mock()
  }
}

/**
 * @description 判断是否为 arm64 架构
 * @returns 返回 arm64 专属参数
 */
const isArm64 = async (): Promise<string> => {
  if (os.arch() !== 'arm64') return ''

  /** 提取版本 只有>=6的版本才忽略警告 */
  const { stdout } = await exec('redis-server -v')
  const version = stdout.toString()
  if (!version) return ''

  const RedisVersion = version.match(/v=(\d)./)
  if (RedisVersion && Number(RedisVersion[1]) >= 6) return ' --ignore-warnings ARM64-COW-BUG'
  return ''
}

/**
 * @description 伪 Redis 实现
 * @returns Redis 客户端
 */
const mock = async (): Promise<Client> => {
  const sqlite = await new SQLiteWrapper(path.join(redisSqlite3Path, 'redis.db')).init()
  const redis = await new RedisClient(sqlite).init()
  Object.defineProperty(redis, 'id', { value: 'mock' })
  return redis as unknown as Client
}
