import fs from 'node:fs'
import crypto from 'node:crypto'
import { isStatic } from '@/utils'
import { renderTpl } from '../template'
import { registerRender, unregisterRender } from '../cache'
import type { WebSocket } from 'ws'
import type { Options, RenderResult } from '../types'

export abstract class WebSocketRender {
  /** websocket实例 */
  public socket: WebSocket
  /** 唯一标识符 */
  public echo = 0
  /** 索引 */
  public index: number
  constructor (socket: WebSocket) {
    this.socket = socket
    this.index = -1
  }

  async init () {
    this.socket.on('close', () => {
      unregisterRender(this.index)
      this.socket.removeAllListeners()
      this.socket.close()
    })

    this.socket.on('message', (event) => {
      const raw = event.toString()
      const { echo, action, status, data } = JSON.parse(raw)
      logger.debug(`[WebSocket] ${echo} ${action} ${status}`)
      logger.trace(`[WebSocket] ${echo} ${data}`)

      if (action === 'response') {
        this.socket.emit(echo, { action, status, data })
      } else if (action === 'close') {
        logger.debug(`[WebSocket] 收到断开连接请求: ${echo} ${action} ${data}`)
        this.socket.close()
      } else if (action === 'static') {
        return this.static(echo, data)
      } else {
        logger.error(`[WebSocket] 未知的请求: ${echo} ${action} ${status} ${data}`)
      }
    })

    this.index = registerRender('puppeteer', this.render.bind(this))
  }

  /**
   * @description 鉴权
   * @param token
   * @param targetToken 目标的token
   * @returns 是否鉴权成功
   */
  auth (token: string, targetToken: string) {
    // const bearer = crypto.createHash('md5').update(`Bearer ${config.http.token}`).digest('hex')

    if (token !== targetToken) {
      /** 再次检查长度 非md5转md5 */
      if (token.length !== 32) {
        token = crypto.createHash('md5').update(`Bearer ${token}`).digest('hex')
      }

      if (targetToken.length !== 32) {
        targetToken = crypto.createHash('md5').update(`Bearer ${targetToken}`).digest('hex')
      }

      if (token !== targetToken) {
        return false
      }
    }
    return true
  }

  /**
   * @description 处理静态资源请求
   * @param echo 唯一标识符
   * @param data 数据
   */
  async static (echo: string, data: { file: string, type: string, url: string }) {
    const result = isStatic(data.file)
    if (!result) {
      logger.warn(`[WebSocket] 访问的路径非法: echo: ${echo} data: ${JSON.stringify(data)}`)
      return this.socket.send(JSON.stringify({ echo, status: 'error', data: '非法的访问路径' }))
    }

    const fileData = fs.readFileSync(data.file)
    return this.socket.send(JSON.stringify({ echo, status: 'ok', data: fileData }))
  }

  render<T extends Options> (data: T): Promise<RenderResult<T>> {
    const options = renderTpl(data)
    return this.sendApi('render', options)
  }

  async sendApi (action: 'render' | 'close', data: object): Promise<any> {
    const echo = ++this.echo
    const str = JSON.stringify({ echo, action, data })
    logger.debug(`[sendApi][WebSocket] ${echo} ${action} ${str}`)

    this.socket.send(str)
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`[sendApi] 请求错误:\n  action: ${action}\n  params: ${str}\n  error: 请求超时}`))
      }, 120 * 1000)

      this.socket.once(echo + '', ({ status, data }) => {
        clearTimeout(timeoutId)
        if (status === 'ok') {
          return resolve(data)
        }

        reject(new Error(`[sendApi] 请求错误:\n  action: ${action}\n  params: ${str}\n  error: ${data}}`))
      })
    })
  }
}
