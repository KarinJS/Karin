import { Action } from './types'
import { AdapterOneBot } from './base'
import { OB11Event } from './types/event'
import { registerWSPath } from '@service/server'
import { createMessage, createNotice, createRequest } from './event'
import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'http'
import type { OB11Message, OB11Meta, OB11Notice, OB11Request } from './types/event'
import { registerBot, unregisterBot } from '@service/adapter'

export class AdapterServerOneBot11 extends AdapterOneBot {
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
    this.account.selfId = String(this.request.headers['x-self-id'])
    this.adapter.address = url
    try {
      this.adapter.communication = 'webSocketClient'

      this.onEvent()
      await Promise.all([this.setAdapterInfo(), this.setBotInfo()])
      logger.bot('info', this.selfId, `[onebot11][server] 连接成功: ${url}`)

      registerBot('webSocketClient', this)
    } catch (error) {
      unregisterBot(this.selfId, this.adapter.address)
      this.socket.close()
      throw new Error(`[onebot11][server] 连接失败: ${url}`)
    }
  }

  private onEvent () {
    this.socket.on('message', (rawData) => {
      const str = rawData.toString()
      const json = JSON.parse(str)
      const data = json as OB11Meta | OB11Message | OB11Request | OB11Notice

      if (json.echo) {
        logger.bot('debug', this.selfId, `Api调用回应: ${str}`)
        return this.socket.emit(json.echo, json)
      } else {
        if (data.post_type === OB11Event.MetaEvent && data.meta_event_type === 'heartbeat') {
          logger.bot('trace', this.selfId, `下次心跳: ${data.status.interval}`)
          return
        }

        logger.bot('debug', this.selfId, `收到上报事件: ${str}`)
      }

      if (data.post_type === OB11Event.Message) {
        createMessage(data, this)
        return
      }

      if (data.post_type === OB11Event.Notice) {
        createNotice(data, this)
        return
      }

      if (data.post_type === OB11Event.Request) {
        createRequest(data, this)
        return
      }

      if (data.post_type === OB11Event.MetaEvent) {
        if (data.meta_event_type === 'lifecycle') {
          if (data.sub_type === 'enable') {
            logger.bot('debug', this.selfId, 'OneBot启用')
          }

          if (data.sub_type === 'disable') {
            logger.bot('debug', this.selfId, 'OneBot停用')
          }

          if (data.sub_type === 'connect') {
            logger.bot('debug', this.selfId, 'WebSocket连接成功')
          }
          return
        }

        logger.bot('warn', this.selfId, `收到未知元事件: ${str}`)
        return
      }

      logger.bot('warn', this.selfId, `收到未知事件: ${str}`)
    })

    this.socket.on('close', () => {
      /** 停止全部监听 */
      this.socket.removeAllListeners()
      this.socket.close()
      unregisterBot(this.selfId, this.adapter.address)
      logger.bot('info', this.selfId, '连接关闭')
    })
  }

  /** 获取登录号信息 */
  private async setAdapterInfo () {
    const info = await this.sendApi(Action.getVersionInfo, {})
    this.adapter.name = info.app_name
    this.adapter.version = info.app_version
  }

  private async setBotInfo () {
    const info = await this.sendApi(Action.getLoginInfo, {})
    this.account.name = info.nickname
    this.account.selfId = info.user_id + ''
    this.account.avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${info.user_id}`
  }
}

registerWSPath('/', AdapterServerOneBot11)
registerWSPath('/onebot/v11/ws', AdapterServerOneBot11)
