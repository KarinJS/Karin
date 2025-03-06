import WebSocket from 'ws'
import { WsAdapterOneBot11 } from './ws'
import { getAllBot, unregisterBot } from '@/service/bot'
import type { AdapterType } from '@/types/adapter/class'

/**
 * 重连次数映射表 用于热重载管理
 */
const reconnectAttemptsMap = new Map<WebSocket, number>()

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
        /** 重连次数 */
        const count = reconnectAttemptsMap.get(socket) ?? 0
        count > 0 && reconnect(url, token)
      }
    })

    socket.on('open', () => {
      reconnectAttemptsMap.set(socket, 1)
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
 * 判断是否为OneBot11客户端
 * @param bot 适配器实例
 */
const isOneBot11Client = (bot: AdapterType): bot is AdapterClientOneBot11 => {
  return bot.adapter.communication === 'webSocketClient'
}

/**
 * 断开指定客户端
 * @param url 连接地址
 */
export const disconnectOneBot11Client = (url: string) => {
  const list = getAllBot()
  list.forEach(bot => {
    if (bot.adapter.address === url && isOneBot11Client(bot)) {
      if (reconnectAttemptsMap.has(bot.socket)) {
        reconnectAttemptsMap.delete(bot.socket)
        bot?.socket?.close()
      }
    }
  })
}

/**
 * 重连
 * @param url 连接地址
 * @param token 鉴权token
 */
const reconnect = (url: string, token?: string) => {
  setTimeout(() => createOneBot11Client(url, token), 5000)
}
