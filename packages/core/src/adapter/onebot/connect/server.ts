import { webSocketServerToken } from '@/utils/config/adapter'
import { unregisterBot } from '@/service/bot'
import { WsAdapterOneBot11 } from './ws'
import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

export class AdapterServerOneBot11 extends WsAdapterOneBot11 {
  /** websocket实例 */
  public socket: WebSocket
  /** 请求实例 */
  public request: IncomingMessage

  constructor (socket: WebSocket, request: IncomingMessage) {
    super(socket)
    this.socket = socket
    this.request = request
  }

  async init () {
    const url = `ws://${this.request.headers.host}${this.request.url}`
    const selfId = String(this.request.headers['x-self-id'])

    if (!this.auth(selfId)) return
    super.init(selfId, url, 'webSocketServer')

    this.socket.on('close', () => {
      /** 停止全部监听 */
      this.socket.removeAllListeners()
      unregisterBot('index', this.adapter.index)
      logger.bot('info', this.selfId, '连接关闭')
    })
  }

  /**
   * @description 鉴权
   * @returns 返回`true`表示鉴权成功
   */
  private auth (selfId: string) {
    const token = webSocketServerToken()
    if (!token) {
      logger.bot('debug', selfId, '未设置反向ws鉴权秘钥，跳过鉴权')
      return true
    }

    const auth = this.request.headers['authorization']
    if (auth !== `Bearer ${token}`) {
      logger.bot('error', selfId, `[oneBot11][鉴权失败] address: ${this.adapter.address} token: ${token}`)
      this.socket.close()
      return false
    }

    logger.bot('debug', selfId, `鉴权成功: ${auth}`)
    return true
  }
}
