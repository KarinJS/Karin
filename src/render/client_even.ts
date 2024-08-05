import fs from 'fs'
import axios from 'axios'
import WebSocket from 'ws'
import { render } from './app'
import { RenderBase } from './base'
import { createHash, randomUUID } from 'crypto'
import { listener } from 'karin/core'
import { logger } from 'karin/utils'
import { KarinRenderType, RenderResult } from 'karin/types'

export class RenderClientEven extends RenderBase {
  url: string
  type: string
  id: string
  index: number
  retry: number
  reg: RegExp
  ws!: WebSocket
  constructor (url: string) {
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
    try {
      const response = await axios.head(this.url)
      if (response.status === 200) {
        logger.mark(`[渲染器:${this.id}][WebSocket] 注册渲染器：${logger.green(this.url)}`)
        try {
          this.index = render.app({ id: this.id, type: this.type, render: this.render.bind(this) })
        } catch (error) {
          logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
        }
      } else {
        logger.error(`[渲染器:${this.id}] 注册渲染器失败：渲染器发生错误`)
      }
    } catch (error) {
      logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
    }
  }

  /**
   * 创建连接
   */
  async link () {
    return new Promise<void>((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return resolve()
      }
      /** 连接ws */
      this.ws = new WebSocket(this.url)
      /** 建立连接 */
      this.ws.on('open', () => {
        logger.mark(`[渲染器:${this.id}][WebSocket] 建立连接：${logger.green(this.url)}`)
        /** 监听消息 */
        this.ws.on('message', data => this.message(data.toString()))
        resolve()
      })
      /** 监听断开 */
      this.ws.once('close', async () => {
        /** 停止监听 */
        this.ws.removeAllListeners()
      })
      /** 监听错误 */
      this.ws.on('error', async (e) => {
        this.ws.close()
      })
    })
  }

  /**
   * 接受消息
   */
  async message (str: string) {
    const data: {
      echo: string
      action: string
      params: {
        md5?: string[]
        file: string
      }
    } = JSON.parse(str)
    switch (data.action) {
      /** 静态文件 */
      case 'static': {
        const filePath = decodeURIComponent(data.params.file)
        logger.debug(`[渲染器:${this.id}][正向WS] 访问静态文件：${filePath}`)
        const file = fs.readFileSync('.' + filePath)
        const md5 = createHash('md5').update(file).digest('hex')
        const params = data.params.md5?.includes(md5)
          ? { echo: data.echo, action: 'static', status: 'ok', data: { verifiedMd5: md5 } }
          : { echo: data.echo, action: 'static', status: 'ok', data: { file } }
        return this.ws.send(JSON.stringify(params))
      }
      /** 渲染结果 */
      case 'renderRes': {
        listener.emit(data.echo, data)
        break
      }
      /** 超时 */
      case 'timeout': {
        logger.debug(`[渲染器:${this.id}][正向WS] 处理超时`)
        break
      }
      /** 未知数据 */
      default: {
        logger.warn(`[渲染器:${this.id}] 收到未知数据：`, data)
      }
    }
  }

  /**
   * 渲染标准方法
   * @param options 渲染参数
   */
  async render<T extends KarinRenderType> (options: T): Promise<RenderResult<T>> {
    /** 渲染模板 */
    let file = options.file
    let action = 'renderHtml'
    if (options.file.includes('http') || options.vue) {
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
      return '' as RenderResult<T>
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
    await this.link()
    this.ws.send(req)

    return new Promise((resolve, reject) => {
      listener.once(echo, (data: { ok: boolean; data: string | string[] }) => {
        if (data.ok) return resolve((data.data as RenderResult<T>))
        reject(new Error(JSON.stringify(data)))
      })
    })
  }
}
