import fs from 'fs'
import WebSocket from 'ws'
import { render } from './app'
import { RenderBase } from './base'
import { randomUUID } from 'crypto'
import { listener } from 'karin/core'
import { common, logger } from 'karin/utils'
import { KarinRenderType, RenderResult } from 'karin/types/render'

export class RenderClient extends RenderBase {
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
    /** 连接ws */
    this.ws = new WebSocket(this.url)
    /** 建立连接 */
    this.ws.on('open', () => {
      logger.mark(`[渲染器:${this.id}][WebSocket] 建立连接：${logger.green(this.url)}`)
      /** 注册渲染器 */
      try {
        this.index = render.app({ id: this.id, type: this.type, render: this.render.bind(this) })
        this.retry = 0
      } catch (error) {
        logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
        /** 断开连接 */
        this.ws.close()
      }
      /** 心跳 */
      this.heartbeat()
      /** 监听消息 */
      this.ws.on('message', data => this.message(data.toString()))
    })

    /** 监听断开 */
    this.ws.once('close', async () => {
      this.retry++
      /** 停止监听 */
      this.ws.removeAllListeners()
      /** 卸载渲染器 */
      this.index && render.unapp(this.index) && (this.index = 0)
      logger.warn(`[渲染器:${this.id}][重连次数:${this.retry}] 连接断开，5秒后将尝试重连：${this.url}`)
      await common.sleep(5000)
      await this.start()
    })

    /** 监听错误 */
    this.ws.on('error', async e => {
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
  async message (str: string) {
    const data: {
      echo: string
      action: string
      params: {
        file: string
      }
    } = JSON.parse(str)
    switch (data.action) {
      /** 静态文件 */
      case 'static': {
        const filePath = decodeURIComponent(data.params.file)
        logger.debug(`[渲染器:${this.id}][正向WS] 访问静态文件：${filePath}`)
        const file = fs.readFileSync('.' + filePath)
        const params = {
          echo: data.echo,
          action: 'static',
          status: 'ok',
          data: { file },
        }
        return this.ws.send(JSON.stringify(params))
      }
      /** 渲染结果 */
      case 'renderRes': {
        listener.emit(data.echo, data)
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
    this.ws.send(req)

    return new Promise((resolve, reject) => {
      listener.once(echo, (data: { ok: boolean; data: string | string[] }) => {
        if (data.ok) return resolve((data.data as RenderResult<T>))
        reject(new Error(JSON.stringify(data)))
      })
    })
  }
}
