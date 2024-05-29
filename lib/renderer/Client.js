import fs from 'fs'
import WebSocket from 'ws'
import { randomUUID } from 'crypto'
import { logger, Renderer, Bot, common, RenderBase } from '#Karin'

export default class RenderClient extends RenderBase {
  constructor (url) {
    super()
    this.url = url
    this.type = 'image'
    this.id = 'puppeteer'
    this.index = 0
    this.retry = 0
    this.reg = new RegExp(`(${process.cwd().replace(/\\/g, '\\\\')}|${process.cwd().replace(/\\/g, '/')})`, 'g')
  }

  /**
   * 初始化
   */
  async start () {
    /** 连接ws */
    this.ws = new WebSocket(this.url)
    /** 建立连接 */
    this.ws.on('open', () => {
      logger.mark(`[渲染器:${this.id}][WebSocket] 建立连接：${logger.green(this.url)}`)
      /** 注册渲染器 */
      try {
        this.index = Renderer.app({ id: this.id, type: this.type, render: this.render.bind(this) })
        this.retry = 0
      } catch (error) {
        logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
        /** 断开连接 */
        this.ws.close()
      }
      /** 心跳 */
      this.heartbeat()
      /** 监听消息 */
      this.ws.on('message', (data) => this.message(data))
    })

    /** 监听断开 */
    this.ws.once('close', async () => {
      this.retry++
      /** 停止监听 */
      this.ws.removeAllListeners()
      /** 卸载渲染器 */
      this.index && Renderer.unapp(this.index) && (this.index = 0)
      logger.warn(`[渲染器:${this.id}][重连次数:${this.retry}] 连接断开，5秒后将尝试重连：${this.url}`)
      await common.sleep(5000)
      await this.start()
    })

    /** 监听错误 */
    this.ws.on('error', async (e) => {
      logger.debug(e)
      await common.sleep(5000)
      this.ws.close()
    })
  }

  /**
   * 心跳
   */
  async heartbeat () {
    /** 无限循环 错误则停止 */
    while (true) {
      try {
        this.ws.send(JSON.stringify({ action: 'heartbeat' }))
        logger.debug(`[渲染器:${this.id}] 心跳：${this.url}`)
      } catch (e) {
        logger.debug(`[渲染器:${this.id}] 心跳失败：`, e)
        this.ws.close()
        break
      }
      await common.sleep(5000)
    }
  }

  /**
   * 接受消息
   */
  async message (data) {
    data = JSON.parse(data)
    switch (data.action) {
      /** 静态文件 */
      case 'static': {
        let file = decodeURIComponent(data.params.file)
        logger.info(`[渲染器:${this.id}] 访问静态文件：${file}`)
        file = fs.readFileSync('.' + file)
        const params = {
          echo: data.echo,
          action: 'static',
          status: 'ok',
          data: { file }
        }
        return this.ws.send(JSON.stringify(params))
      }
      /** 渲染结果 */
      case 'renderRes': {
        Bot.emit(data.echo, data)
        break
      }
      /** 未知数据 */
      default: {
        logger.warn(`[渲染器:${this.id}] 收到未知数据：`, data)
      }
    }
  }

  /**
   * 渲染模板
   * @param {object} options 渲染参数
   * @param {string} options.file http地址或本地文件路径
   * @param {string} [options.name] 模板名称
   * @param {string} [options.fileID] art-template后的文件名
   * @param {object} [options.data] 传递给模板的数据 template.render(data)
   * @param {'png'|'jpeg'|'webp'} [options.type] 截图类型 默认'webp'
   * @param {number} [options.quality] 截图质量 默认90 1-100
   * @param {boolean} options.omitBackground 是否隐藏背景 默认false
   * @param {object} [options.setViewport] 设置视窗大小和设备像素比 默认1920*1080、1
   * @param {number} [options.setViewport.width] 视窗宽度
   * @param {number} [options.setViewport.height] 视窗高度
   * @param {string} [options.setViewport.deviceScaleFactor] 设备像素比
   * @param {number|boolean} [options.multiPage] 分页截图 传递数字则视为视窗高度 返回数组
   * @param {object} [options.pageGotoParams] 页面goto时的参数
   * @param {number} [options.pageGotoParams.timeout] 页面加载超时时间
   * @param {'load'|'domcontentloaded'|'networkidle0'|'networkidle2'} [options.pageGotoParams.waitUntil] 页面加载状态
   * @returns {Promise<string|string[]>} 返回图片base64或数组
   */
  async render (options) {
    /** 渲染模板 */
    let file = options.file
    let action = 'renderHtml'
    if (options.file.includes('http')) {
      action = 'render'
    } else {
      file = this.dealTpl(options)
      /** 判断是本地karin-puppeteer还是远程 */
      if (!/127\.0\.0\.1|localhost/.test(this.url)) {
        file = fs.readFileSync(file, 'utf-8').replace(this.reg, '')
      } else {
        action = 'render'
        file = 'file://' + file
      }
    }

    if (!file) {
      logger.error(`[渲染器:${this.id}:${this.index}] 渲染文件不存在：${options.file}`)
      return false
    }

    /** 编码 */
    file = encodeURIComponent(file)

    const data = options
    const echo = randomUUID()
    /** 移除掉模板参数 */
    if (data.data) delete data.data
    data.file = file

    const req = JSON.stringify({ echo, action, data })
    logger.debug(`[渲染器:${this.id}:${this.index}][正向WS] 请求：${this.url} \nhtml: ${options.file} \ndata: ${JSON.stringify(data)}`)
    this.ws.send(req)

    return new Promise((resolve, reject) => {
      Bot.once(echo, data => {
        if (data.ok) return resolve(data.data)
        reject(new Error(JSON.stringify(data)))
      })
    })
  }
}
