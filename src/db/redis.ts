import { exec } from 'child_process'
import RedisLevel from './redis_level'
import { logger, config } from 'karin/utils'
import NodeRedis, { createClient, createCluster, RedisClientType } from 'redis'

class Redis {
  id: 'redis'
  RunCmd: string
  constructor () {
    this.id = 'redis'
    this.RunCmd = ''
  }

  /**
   * redis实例化
   */
  async start (): Promise<(NodeRedis.RedisClientType | string) | RedisLevel | false> {
    const { host, port, username, password, db: database, cluster } = config.redis
    /** 集群模式 */
    if (cluster && cluster.enable) {
      const rootNodes = cluster.rootNodes.map((node: string) => ({ url: node }))
      logger.info('正在连接 Redis 集群...')
      const { status, data } = await this.connectCluster(rootNodes)
      if (status === 'ok') {
        logger.info('Redis 集群连接成功')
        return data as RedisClientType
      }
      logger.error(`Redis 集群建立连接失败：${logger.red(data as string)}`)
      return false
    }

    logger.info(`正在连接 ${logger.green(`Redis://${host}:${port}/${database}`)}`)

    const options = { socket: { host, port }, username, password, database }

    /** 第一次连接 */
    const { status, data } = await this.connect(options)

    if (status === 'ok') {
      logger.info('Redis 连接成功')
      return data as RedisClientType
    }

    /** 第一次连接失败尝试拉起 windows直接降级 */
    if (process.platform === 'win32') {
      // logger.info(`Redis 建立连接失败：${data}`)
      return await this.LevelDB()
    }

    this.RunCmd = 'redis-server --save 900 1 --save 300 10 --daemonize yes' + (await this.aarch64())
    logger.info('正在尝试启动 Redis...')

    try {
      await this.execSync(this.RunCmd)
      /** 启动成功再次重试 */
      const { status, data } = await this.connect(options)
      if (status === 'ok') {
        logger.info('Redis 连接成功')
        return data as RedisClientType
      }

      logger.warn(`Redis 二次建立连接失败：${logger.red(data as string)}`)
      return false
    } catch (error) {
      logger.warn(`Redis 启动失败：${logger.red(data as string)}`)
      return await this.LevelDB()
    }
  }

  /**
   * 降级为 LevelDB
   */
  async LevelDB () {
    try {
      logger.info('使用LevelDB代替Redis实现基础Api')
      const redis = new RedisLevel()
      return redis
    } catch (error) {
      logger.error('降级为 LevelDB 失败')
      logger.error(error)
      return false
    }
  }

  /**
   * 连接 Redis 单例
   */
  async connect (options: NodeRedis.RedisClientOptions): Promise<{ status: 'ok'; data: NodeRedis.RedisClientType } | { status: 'error'; data: string }> {
    const client = createClient(options)
    try {
      await client.connect()
      return { status: 'ok', data: client as NodeRedis.RedisClientType }
    } catch (error) {
      return { status: 'error', data: error as string }
    }
  }

  /**
   * 连接 Redis 集群
   */
  async connectCluster (rootNodes: { url: string }[]) {
    const client = createCluster({ rootNodes })
    try {
      await client.connect()
      return { status: 'ok', data: client }
    } catch (error) {
      return { status: 'error', data: error }
    }
  }

  /**
   * 判断是否为 ARM64 并返回参数
   */
  async aarch64 (): Promise<string> {
    try {
      /** 判断arch */
      const arch = await this.execSync('uname -m')
      if (arch && arch.includes('aarch64')) {
        /** 提取 Redis 版本 */
        const version = await this.execSync('redis-server -v')
        if (version) {
          /** 提取版本号 */
          const RedisVersion = version.match(/v=(\d)./)
          /** 如果>=6版本则忽略警告 */
          if (RedisVersion && Number(RedisVersion[1]) >= 6) return ' --ignore-warnings ARM64-COW-BUG'
        }
      }
      return ''
    } catch {
      return ''
    }
  }

  execSync (cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout) => {
        if (error) return reject(error)
        resolve(stdout)
      })
    })
  }
}

export const redis: RedisClientType = await new Redis().start() as RedisClientType
