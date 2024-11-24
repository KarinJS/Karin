import { config } from '@/utils'
import { unregisterBot } from '@/service/bot'
import { WsAdapterOneBot11 } from './ws'
import { registerWSPath } from '@/service/server'
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
      unregisterBot('index', this.adapter.index)
      logger.bot('info', this.selfId, '连接关闭')
      /** 停止全部监听 */
      this.socket.removeAllListeners()
      this.socket.close()
    })
  }

  /**
   * @description 鉴权
   * @returns 返回`true`表示鉴权成功
   */
  private auth (selfId: string) {
    const server = config.server()
    if (!server.reverseWsToken) {
      logger.bot('debug', selfId, '未设置反向ws鉴权秘钥，跳过鉴权')
      return true
    }

    const token = this.request.headers['authorization']
    if (token !== `Bearer ${server.reverseWsToken}`) {
      logger.bot('error', selfId, `[oneBot11][鉴权失败] address: ${this.adapter.address} token: ${token}`)
      this.socket.close()
      return false
    }

    logger.bot('debug', selfId, `鉴权成功: ${token}`)
    return true
  }
}

registerWSPath('/', AdapterServerOneBot11)
registerWSPath('/onebot/v11/ws', AdapterServerOneBot11)
