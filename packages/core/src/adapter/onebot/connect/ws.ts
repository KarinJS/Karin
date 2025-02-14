import { timeout } from '@/utils/config/file/adapter'
import { AdapterOneBot } from '@/adapter/onebot/core/base'
import { OB11ApiAction, OB11ApiParams, OB11ApiRequest } from '../types'
import { OB11Event, type OB11AllEvent } from '@/adapter/onebot/types/event'
import { registerBot, unregisterBot } from '@/service/bot'
import { buildError } from '@/adapter/onebot/core/convert'

import type { WebSocket } from 'ws'

export abstract class WsAdapterOneBot11 extends AdapterOneBot {
  /** 请求id */
  seq: number
  /** WebSocket实例 */
  socket: WebSocket

  constructor (socket: WebSocket) {
    super()
    this.seq = 0
    this.socket = socket
  }

  onEvent () {
    this.socket.on('message', (rawData) => {
      const str = rawData.toString()
      const json = JSON.parse(str)

      const data = {
        ...json,
        self_id: this.selfId,
      } as OB11AllEvent

      if (json.echo) {
        logger.bot('debug', this.selfId, `Api调用回应: ${str}`)
        return this.socket.emit(json.echo, json)
      } else {
        if (data.post_type === OB11Event.MetaEvent && data.meta_event_type === 'heartbeat') {
          logger.bot('trace', this.selfId, '心跳')
          return
        }

        logger.bot('debug', this.selfId, `收到上报事件: ${str}`)
      }

      this.eventHandlers(data, str)
    })
  }

  /**
   * 注册机器人
   */
  registerBot () {
    logger.bot('info', this.selfId, `[onebot11][${this.adapter.communication}] 连接成功: ${this.adapter.address}`)
    this.adapter.index = registerBot(this.adapter.communication, this)
  }

  /**
   * 卸载注册的机器人
   */
  unregisterBot () {
    this.socket.removeAllListeners()
    unregisterBot('index', this.adapter.index)
    logger.bot('info', this.selfId, `连接关闭: ${this.adapter.address}`)
  }

  /** 获取登录号信息 */
  async setAdapterInfo () {
    const info = await this.sendApi(OB11ApiAction.getVersionInfo, {})
    this.adapter.name = info.app_name
    this.adapter.version = info.app_version
    this.adapter.platform = 'qq'
    if (/gocq/i.test(info.app_name)) {
      this.adapter.protocol = 'gocq-http'
    } else if (/napcat/i.test(info.app_name)) {
      this.adapter.protocol = 'napcat'
    } else if (/llonebot/i.test(info.app_name)) {
      this.adapter.protocol = 'llonebot'
    } else if (/lagrange/i.test(info.app_name)) {
      this.adapter.protocol = 'lagrange'
    } else if (/conwechat/i.test(info.app_name)) {
      this.adapter.protocol = 'conwechat'
    } else {
      this.adapter.protocol = 'other'
    }
  }

  /**
   * 设置登录号详细信息
   * @param setSelfId 是否设置selfId
   */
  async setBotInfo (setSelfId: boolean = false) {
    const info = await this.sendApi(OB11ApiAction.getLoginInfo, {})
    this.account.name = info.nickname
    this.account.avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${info.user_id}`
    if (setSelfId) this.account.selfId = String(info.user_id)
  }

  async sendApi<T extends keyof OB11ApiParams> (
    action: T | `${T}`,
    params: OB11ApiParams[T],
    time = 120
  ): Promise<OB11ApiRequest[T]> {
    if (!time) time = timeout()
    const echo = ++this.seq + ''
    const request = JSON.stringify({ echo, action, params })
    logger.bot('debug', this.selfId, `发送Api请求 ${action}: ${request}`)

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(buildError(this.selfId, action, request, '请求超时'))
      }, time * 1000)

      this.socket.send(request)
      this.socket.once(echo, data => {
        /** 停止监听器 */
        clearTimeout(timeoutId)

        if (data.status === 'ok') {
          resolve(data.data)
        } else {
          reject(buildError(this.selfId, action, request, data))
        }
      })
    })
  }
}
