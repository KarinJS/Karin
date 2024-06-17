import { exec } from 'child_process'
import RedisLevel from './redis_level.js'
import { createClient, createCluster } from 'redis'

export default class Redis {
  /**
   * @type {import('../init.js').logger}
   */
  #logger

  /**
   * @private
   * @type {import('../init.js').config}
   */
  #config

  constructor (logger, config) {
    this.RunCmd = ''
    this.#logger = logger
    this.#config = config
  }

  /**
   * redis实例
   * @return {Promise<RedisClientType>}
   * @typedef {import('redis').RedisClientType} RedisClientType
   */
  async start () {
    const { host, port, username, password, db: database, cluster } = this.#config.redis
    /** 集群模式 */
    if (cluster && cluster.enable) {
      this.#logger.info('正在连接 Redis 集群...')
      const { status, data } = await this.connectCluster(cluster.rootNodes)
      if (status === 'ok') {
        this.#logger.info('Redis 集群连接成功')
        return data
      }
      this.#logger.error(`Redis 集群建立连接失败：${this.#logger.red(data)}`)
      return false
    }

    this.#logger.info(`正在连接 ${this.#logger.green(`Redis://${host}:${port}/${database}`)}`)

    const options = { socket: { host, port }, username, password, database }

    /** 第一次连接 */
    const { status, data } = await this.connect(options)

    if (status === 'ok') {
      this.#logger.info('Redis 连接成功')
      return data
    }

    /** 第一次连接失败尝试拉起 windows直接降级 */
    if (process.platform === 'win32') {
      this.#logger.error(`Redis 建立连接失败：${this.#logger.red(data)}`)
      return await this.LevelDB()
    }

    this.RunCmd = 'redis-server --save 900 1 --save 300 10 --daemonize yes' + await this.aarch64()
    this.#logger.info('正在尝试启动 Redis...')

    try {
      await this.execSync(this.RunCmd)
      /** 启动成功再次重试 */
      const { status, data } = await this.connect(options)
      if (status === 'ok') {
        this.#logger.info('Redis 连接成功')
        return data
      }

      this.#logger.error(`Redis 二次建立连接失败：${this.#logger.red(data)}`)
      return false
    } catch (error) {
      this.#logger.error(`Redis 启动失败：${this.#logger.red(error)}`)
      return await this.LevelDB()
    }
  }

  /**
   * 降级为 LevelDB
   */
  async LevelDB () {
    try {
      this.#logger.mark(this.#logger.red('正在降级为 LevelDB 代替 Redis 只能使用基础功能'))
      const redis = new RedisLevel()
      this.#logger.info('LevelDB 降级成功')
      return redis
    } catch (error) {
      this.#logger.error('降级为 LevelDB 失败')
      this.#logger.error(error)
      return false
    }
  }

  /**
   * 连接 Redis 单例
   * @param {import("redis").RedisClientOptions} options
   * @return {Promise<{status: 'ok', data: import("redis").RedisClientType} | {status: 'error', data: Error}>}
   */
  async connect (options) {
    const client = createClient(options)
    try {
      await client.connect()
      return { status: 'ok', data: client }
    } catch (error) {
      return { status: 'error', data: error }
    }
  }

  /**
   * 连接 Redis 集群
   * @param {string[]} rootNodes
   * @return {Promise<{status: 'ok', data: <import('redis').RedisClusterType>} | {status: 'error', data: Error}>}
   */
  async connectCluster (rootNodes) {
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
   * @return {Promise<''|' --ignore-warnings ARM64-COW-BUG'>}
   */
  async aarch64 () {
    try {
      /** 判断arch */
      const arch = await this.execSync('uname -m')
      if (arch && arch.includes('aarch64')) {
        /** 提取 Redis 版本 */
        let version = await this.execSync('redis-server -v')
        if (version) {
          /** 提取版本号 */
          version = version.match(/v=(\d)./)
          /** 如果>=6版本则忽略警告 */
          if (version && version[1] >= 6) return ' --ignore-warnings ARM64-COW-BUG'
        }
      }
      return ''
    } catch {
      return ''
    }
  }

  execSync (cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout) => {
        if (error) return reject(error)
        resolve(stdout)
      })
    })
  }
}
