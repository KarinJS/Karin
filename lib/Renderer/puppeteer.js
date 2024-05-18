import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import RenderClass from './RenderClass.js'
import { logger, Renderer, Bot } from '#Karin'

class Puppeteer extends RenderClass {
  constructor (socket, request) {
    super()
    this.socket = socket
    this.request = request
    this._path = process.cwd()
    this.#start()
  }

  async #start () {
    this.id = this.request.headers['renderer-id']
    this.type = this.request.headers['renderer-type']

    /** 注册渲染器 */
    this.host = this.request.headers.host
    this.url = `ws://${this.host + this.request.url}`

    logger.info(`[渲染器:${this.id}] 收到新的连接请求：${this.url}`)
    /** 监听上报事件 */
    this.socket.on('message', data => {
      data = JSON.parse(data)
      if (data.action === 'static') {
        data.status = 'ok'
        data.data = decodeURIComponent(data.data)
        const file = process.cwd() + `/${data.data}`
        data.data = fs.readFileSync(file).toString('base64')
        console.log(file)
        return this.socket.send(JSON.stringify(data))
      }
      if (data.echo) {
        Bot.emit(data.echo, data)
      } else {
        logger.warn(`[渲染器:${this.id}] 收到未知数据：`, data)
      }
    })

    /** 监听断开 */
    this.socket.on('close', () => {
      logger.warn(`[渲染器:${this.id}] 连接断开：${this.url}`)
      /** 卸载渲染器 */
      Renderer.unapp(this.id)
    })

    /** 注册渲染器 */
    try {
      Renderer.app({
        id: this.id,
        type: this.type,
        render: this.render.bind(this)
      })
    } catch (error) {
      logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
      /** 断开连接 */
      this.socket.close()
    }
  }

  /**
   * `chromium` 截图
   * @param {string} name 模板名称
   * @param {{
   * tplFile: string,
   * saveId?: string,
   * imgType?: "jpeg" | "png",
   * quality?: number,
   * omitBackground?: boolean,
   * path?: string,
   * multiPage?: boolean,
   * multiPageHeight?: number,
   * setViewport?: { width: number, height: number, deviceScaleFactor: number },
   * pageGotoParams?: any
   * }} data 模板参数
   * @param data.tplFile 模板路径或http地址，必传
   * @param data.saveId  生成html名称，为空name代替
   * @param data.imgType  screenshot参数，生成图片类型：jpeg，png
   * @param data.quality  screenshot参数，图片质量 0-100，jpeg是可传，默认90
   * @param data.omitBackground  screenshot参数，隐藏默认的白色背景，背景透明。默认不透明
   * @param data.path   screenshot参数，截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
   * @param data.multiPage 是否分页截图，默认false
   * @param data.multiPageHeight 分页状态下页面高度，默认4000
   * @param data.setViewport 页面视窗大小和设备像素比 默认1920*1080、1
   * @param data.pageGotoParams 页面goto时的参数
   * @return {Promise<string|string[]>} - 分片返回数组，单页返回base64://
   */
  async render (name, data = {}) {
    /** 渲染模板 并获取模板绝对路径 */
    data.savePath = data.tplFile.includes('http') ? data.tplFile : path.resolve(this.dealTpl(name, data))

    const content = fs.readFileSync(data.savePath, 'utf-8')
    /** 处理所有绝对路径、相对路径 */
    const html = content.replace(new RegExp(`(${this._path}|${this._path.replace(/\\/g, '/')})`, 'g'), '')
    const echo = randomUUID()
    const action = 'renderHtml'
    this.socket.send(JSON.stringify({ echo, action, data: { name, data, html } }))

    return new Promise((resolve, reject) => {
      Bot.once(echo, data => {
        if (data.ok) return resolve(data.data)
        reject(new Error(data.data))
      })
    })
  }
}

export default { url: '/puppeteer', adapter: Puppeteer }
