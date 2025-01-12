import WebSocket from 'ws'
import { WsAdapterOneBot11 } from './ws'
import { unregisterBot } from '@/service/bot'

export class AdapterClientOneBot11 extends WsAdapterOneBot11 {
  token?: string
  constructor (socket: WebSocket, token?: string) {
    super(socket)
    this.token = token
    this.socket.on('close', () => {
      try {
        /** 停止全部监听 */
        this.socket.removeAllListeners()
        unregisterBot('index', this.adapter.index)
        logger.bot('info', this.selfId, `连接关闭，将在5秒后重连: ${this.adapter.address}`)
      } finally {
        setTimeout(() => {
          AdapterClientOneBot11.init(this.adapter.address, this.token)
        }, 5000)
      }
    })
  }

  static async init (url: string, token?: string) {
    const authorization = token ? `Bearer ${token}` : undefined
    const socket = authorization ? new WebSocket(url, { headers: { authorization } }) : new WebSocket(url)

    socket.on('open', async () => {
      await new AdapterClientOneBot11(socket, token).init('获取中...', url, 'webSocketClient')
    })

    socket.on('error', (error) => {
      logger.error(`[onebot][webSocketClient]连接失败: ${url}`)
      logger.error(error)
    })
  }
}
