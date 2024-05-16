import Bot from '../bot/bot.js'
import logger from '../config/log.js'
import redis from '../utils/redis.js'
import Cfg from '../config/config.js'
import Renderer from '../Renderer/Renderer.js'
import Kritor from '../adapter/kritor/index.js'
import puppeteer from '../Renderer/puppeteer.js'
import OneBot11 from '../adapter/onebot/OneBot11.js'
import BotWebSocket from '../adapter/server/server.js'
import HttpRenderer from '../Renderer/HttpRenderer.js'

const title = 'Karin'
/** 设置标题 */
process.title = title
/** 设置时区 */
process.env.TZ = 'Asia/Shanghai'

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

    /** 启动Kritor服务器 */
    const kritor = new Kritor()
    try {
      logger.info('[kritor][proto]', kritor.dir)
      kritor.init()
    } catch (e) {
      logger.error('Kritor初始化失败', e)
    }

    /** 启动HTTP服务器 */
    const HTTP = new BotWebSocket()
    HTTP.init(true)
    const { enable, host, url, token } = Cfg.Config.http_render
    if (enable) {
      HTTP.static()
      /** 注册渲染器 */
      const rd = new HttpRenderer(host, url, token)
      Renderer.app({ id: 'puppeteer', type: 'image', render: rd.render.bind(rd) })
    }

    /** 注册onebot11 */
    Bot.emit('WebSocket', OneBot11)
    /** 注册puppeteer渲染器 */
    Bot.emit('WebSocket', puppeteer)
  }
}
