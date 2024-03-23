import title from './init.js'
import logger from './log.js'
import redis from './redis.js'
import Bot from '../bot/bot.js'
import server from '../server/server.js'

export default class Karin {
  static async start () {
    logger.mark(`${title} 启动中...`)
    process.on('SIGHUP', () => process.exit())
    /** 捕获未处理的错误 */
    process.on('uncaughtException', error => Bot.emit('error', error))
    /** 捕获未处理的Promise错误 */
    process.on('unhandledRejection', (error, promise) => Bot.emit('error', error))
    /** 退出事件 */
    process.on('exit', async (code) => {
      await redis.save()
      logger.mark(`${title} 已停止运行`)
    })

    /** 启动HTTP服务器 */
    await server()
  }
}
