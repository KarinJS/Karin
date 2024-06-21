import axios from 'axios'
import Bot from '../bot/bot.js'
import logger from '../config/log.js'
import Cfg from '../config/config.js'
import Renderer from '../renderer/App.js'
import puppeteer from '../renderer/Server.js'
import BotWebSocket from '../server/server.js'
import HttpRenderer from '../renderer/Http.js'
import Kritor from '../adapter/kritor/index.js'
import RenderClient from '../renderer/Client.js'
import connect from '../renderer/Wormhole.js'
import OneBot11, { OneBot11 as OneBot11Forward } from '../adapter/onebot/OneBot11.js'

export default class Karin {
  /**
   * 启动Karin
   */
  static async start () {
    this.process()
    await this.check()
    await this.server()
  }

  /**
   * 进程初始化
   */
  static async process () {
    /** 启动日志 */
    logger.mark('Karin 启动中...')
    /** 设置标题 */
    process.title = 'Karin'
    /** 设置时区 */
    process.env.TZ = 'Asia/Shanghai'

    /** 捕获警告 */
    process.on('warning', (warning) => Bot.emit('warn', warning))
    /** 捕获错误 */
    process.on('uncaughtException', (error) => Bot.emit('error', error))
    /** 捕获未处理的Promise错误 */
    process.on('unhandledRejection', (error) => Bot.emit('error', error))

    /** 监听退出信号 */
    process.on('SIGHUP', async (code) => await this.exit(code))
    process.on('SIGINT', async (code) => await this.exit(code))
    process.on('SIGTERM', async (code) => await this.exit(code))
    process.on('SIGBREAK', async (code) => await this.exit(code))
    process.on('exit', async (code) => await this.exit(code))
  }

  /**
   * 检查后台进程
   * @returns {Promise<boolean>} 是否检测到后台进程
   */
  static async check () {
    const host = `http://localhost:${Cfg.Server.http.port}/api`
    /** 使用api来检查后台 */
    try {
      await axios.get(host + '/info', { timeout: 100 })
      logger.mark(logger.red('检测到后台进程 正在关闭'))
      try {
        await axios.get(host + '/exit', { timeout: 10 })
      } catch { }

      /** 请求异常即代表后台进程已关闭 */
      for (let i = 0; i < 50; i++) {
        try {
          await axios.get(host + '/info', { timeout: 100 })
        } catch {
          /** 再等2秒 等待端口彻底关闭 */
          return logger.mark(logger.green('后台进程已关闭'))
        }
      }

      logger.mark(logger.red('后台进程关闭失败，请手动关闭'))
    } catch {
      return false
    }
  }

  /**
   * 退出Karin
   * @param {number} code 退出码
   */
  static async exit (code) {
    try {
      const { redis } = await import('#Karin')
      await redis.save()
      logger.mark(`Karin 已停止运行 运行时间：${this.uptime} 退出码：${code || '未知'}`)
    } finally {
      process.exit()
    }
  }

  /**
   * 启动服务器
   */
  static async server () {
    /** 启动Kritor服务器 */
    const kritor = new Kritor()
    try {
      kritor.init()
    } catch (e) {
      logger.error('Kritor proto 初始化失败', e)
    }

    /** 启动HTTP服务器 */
    const HTTP = new BotWebSocket()
    HTTP.init(true)
    const { enable, host, post, token, WormholeClient } = Cfg.Server.HttpRender
    if (enable) {
      HTTP.static()
      if (WormholeClient) {
        connect()
      } else {
        /** 注册渲染器 */
        const rd = new HttpRenderer(host, post, token)
        Renderer.app({
          id: 'puppeteer',
          type: 'image',
          render: rd.render.bind(rd),
        })
      }
    }

    /** 注册onebot11 */
    Bot.emit('WebSocket', OneBot11)
    /** 注册puppeteer渲染器 */
    Bot.emit('WebSocket', puppeteer)

    /** onebot11 主动ws */
    const onebot11 = Cfg.Server.websocket.OneBot11Host
    if (Array.isArray(onebot11) && onebot11.length) {
      for (const url of onebot11) {
        new OneBot11Forward().start_forward(url)
      }
    }

    /** ws渲染器 */
    const render = Cfg.Server.websocket.render
    if (Array.isArray(render) && render.length) {
      for (const url of render) {
        new RenderClient(url).start()
      }
    }
  }

  /**
   * 获取运行时间
   */
  static get uptime () {
    const time = process.uptime()
    const day = Math.floor(time / 86400)
    const hour = Math.floor((time % 86400) / 3600)
    const min = Math.floor((time % 3600) / 60)
    const sec = Math.floor(time % 60)

    const parts = [day ? `${day}天` : '', hour ? `${hour}小时` : '', min ? `${min}分钟` : '', !day && sec ? `${sec}秒` : '']

    return parts.filter(Boolean).join('')
  }
}
