import { webSocketServerToken } from '@/utils/config/file/adapter'
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
    this.adapter.address = url
    this.adapter.communication = 'webSocketServer'
    this.account.selfId = String(this.request.headers['x-self-id'])

    /** 有些适配器不在请求头设置selfId */
    const isSetSelfId = typeof this.account.selfId === 'string' && this.account.selfId.length > 1

    try {
      /** 监听事件 接收api回调 事件推送 */
      this.onEvent()
      /** 获取登录号信息 */
      await Promise.all([this.setBotInfo(isSetSelfId), this.setAdapterInfo()])
      if (!this.auth()) return

      this.account.uin = this.selfId
      this.registerBot()

      this.socket.on('close', () => {
        this.unregisterBot()
      })
    } catch (error) {
      this.socket.close()
      throw new Error(`[onebot11][${this.adapter.communication}] 连接失败: ${this.adapter.address}`)
    }
  }

  /**
   * @description 鉴权
   * @returns 返回`true`表示鉴权成功
   */
  private auth () {
    const token = webSocketServerToken()
    if (!token) {
      this.logger('debug', '未设置反向ws鉴权秘钥，跳过鉴权')
      return true
    }

    const auth = this.request.headers['authorization']
    if (auth !== `Bearer ${token}`) {
      this.logger('error', `[oneBot11][鉴权失败] address: ${this.adapter.address} token: ${token}`)
      this.socket.close()
      return false
    }

    this.logger('debug', `鉴权成功: ${auth}`)
    return true
  }
}
