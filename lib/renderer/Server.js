import { randomUUID } from 'crypto'
import { logger, Renderer, Bot, RenderBase } from '#Karin'

class Puppeteer extends RenderBase {
  constructor (socket, request) {
    super()
    this.socket = socket
    this.request = request
    this.index = 0
    this.#start()
  }

  async #start () {
    this.id = this.request.headers['renderer-id']
    this.type = this.request.headers['renderer-type']

    /** 注册渲染器 */
    this.host = this.request.headers.host
    this.url = `ws://${this.host + this.request.url}`

    logger.info(`[渲染器:${this.id}] 收到新的连接请求：` + logger.green(this.url))
    /** 监听上报事件 */
    this.socket.on('message', data => {
      data = JSON.parse(data)
      if (data.echo) {
        Bot.emit(data.echo, data)
      } else if (data.action === 'heartbeat') {
        logger.debug(`[渲染器:${this.id}] 心跳：${this.url}`)
      } else {
        logger.warn(`[渲染器:${this.id}] 收到未知数据：`, data)
      }
    })

    /** 监听断开 */
    this.socket.on('close', () => {
      logger.warn(`[渲染器:${this.id}] 连接断开：${this.url}`)
      /** 卸载渲染器 */
      this.index && Renderer.unapp(this.index)
      this.index = 0
    })

    /** 注册渲染器 */
    try {
      const index = Renderer.app({
        id: this.id,
        type: this.type,
        render: this.render.bind(this)
      })
      this.index = index
    } catch (error) {
      logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
      /** 断开连接 */
      this.socket.close()
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
    const file = options.file.includes('http') ? options.file : this.dealTpl(options)
    if (!file) return false
    const echo = randomUUID()
    const action = 'render'
    const data = options
    /** 移除掉模板参数 */
    if (data.data) delete data.data
    data.file = file
    this.socket.send(JSON.stringify({ echo, action, data }))

    return new Promise((resolve, reject) => {
      Bot.once(echo, data => {
        if (data.ok) return resolve(data.data)
        reject(new Error(JSON.stringify(data)))
      })
    })
  }
}

export default { url: '/puppeteer', adapter: Puppeteer }