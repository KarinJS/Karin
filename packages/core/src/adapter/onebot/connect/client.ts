import WebSocket from 'ws'
import { WsAdapterOneBot11 } from './ws'
import { unregisterBot } from '@/service/bot'

export class AdapterClientOneBot11 extends WsAdapterOneBot11 {
  token?: string
  constructor (socket: WebSocket, url: string, token: string | null) {
    super(socket)
    this.adapter.secret = token
    this.adapter.address = url
    this.adapter.communication = 'webSocketClient'
  }

  async init () {
    try {
      /** 监听事件 接收api回调 事件推送 */
      this.onEvent()
      /** 获取登录号信息 */
      await Promise.all([this.setBotInfo(true), this.setAdapterInfo()])

      this.account.uin = this.selfId
      this.registerBot()
    } catch (error) {
      this.socket.close()
      throw new Error(`[onebot11][${this.adapter.communication}] 连接失败: ${this.adapter.address}`, { cause: error })
    }
  }
}

/**
 * @description 创建OneBot11客户端
 * @param url 连接地址
 * @param token 鉴权token
 */
export const createOneBot11Client = async (url: string, token?: string) => {
  try {
    const authorization = token ? `Bearer ${token}` : undefined
    const socket = authorization ? new WebSocket(url, { headers: { authorization } }) : new WebSocket(url)
    let onebot: AdapterClientOneBot11

    socket.on('close', () => {
      try {
        socket.removeAllListeners()
        onebot && unregisterBot('index', onebot.adapter.index)
        onebot && logger.bot('info', onebot.selfId, `连接关闭: ${onebot.adapter.address}`)
      } finally {
        reconnect(url, token)
      }
    })

    socket.on('open', () => {
      onebot = new AdapterClientOneBot11(socket, url, token ?? null)
      onebot.init()
    })

    socket.on('error', (error) => {
      logger.error(`创建OneBot11客户端失败 将在5秒后重试: ${url}`)
      logger.error(error)
      reconnect(url, token)
      socket.removeAllListeners()
    })
  } catch (error) {
    logger.error(`创建OneBot11客户端失败 将在5秒后重试: ${url}`)
    logger.error(error)
    reconnect(url, token)
  }
}

/**
 * 重连
 * @param url 连接地址
 * @param token 鉴权token
 */
const reconnect = (url: string, token?: string) => {
  setTimeout(() => createOneBot11Client(url, token), 5000)
}
