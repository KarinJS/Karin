import { exec } from 'node:child_process'
import { createClient } from 'redis'
import Common from '../common/common.js'
import Cfg from '../config/config.js'
import logger from '../config/log.js'

class Redis {
  async start () {
    const rc = Cfg.redis
    const redisUn = rc.username || ''
    let redisPw = rc.password ? `:${rc.password}` : ''
    if (rc.username || rc.password) {
      redisPw += '@'
    }
    const redisUrl = `redis://${redisUn}${redisPw}${rc.host}:${rc.port}/${rc.db}`
    let client = createClient({ url: redisUrl })
    try {
      logger.info(`正在连接 ${logger.blue(redisUrl)}`)
      await client.connect()
    } catch (err) {
      logger.error(`Redis 错误：${logger.red(err)}`)
      const cmd = 'redis-server --save 900 1 --save 300 10 --daemonize yes' + await this.aarch64()
      logger.info('正在启动 Redis...')
      await this.execSync(cmd)
      await Common.sleep(1000)
      try {
        client = createClient({ url: redisUrl })
        await client.connect()
      } catch (err) {
        logger.error(`Redis 错误：${logger.red(err)}`)
        logger.error(`请先启动 Redis：${logger.blue(cmd)}`)
        return false
      }
    }
    client.on('error', async (err) => {
      logger.error(`Redis 错误：${logger.red(err)}`)
      const cmd = 'redis-server --save 900 1 --save 300 10 --daemonize yes' + await this.aarch64()
      logger.error(`请先启动 Redis：${cmd}`)
      return false
    })
    logger.info('Redis 连接成功')
    return client
  }

  async aarch64 () {
    if (process.platform == 'win32') { return false }
    /** 判断arch */
    const arch = await this.execSync('uname -m')
    if (arch.stdout && arch.stdout.includes('aarch64')) {
      /** 判断redis版本 */
      let v = await this.execSync('redis-server -v')
      if (v.stdout) {
        v = v.stdout.match(/v=(\d)./)
        /** 忽略arm警告 */
        if (v && v[1] >= 6) { return ' --ignore-warnings ARM64-COW-BUG' }
      }
    }
    return false
  }

  execSync (cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }
}

/** 初始化redis */
const Class = new Redis()

/**
 * @type {createClient}
 */
const redis = await Class.start()
export default Object.freeze(redis)
