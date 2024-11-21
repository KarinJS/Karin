import axios from 'axios'
import { config } from '@/utils'
import { buildError } from '../convert'
import { AdapterOneBot } from '../base'
import { listeners } from '@/internal/listeners'
import { Action, Params, Request } from '../types'
import { registerBot, unregisterBot } from '@/service/bot'
import { registerHttpBot, unregisterHttpBot } from '@/service/server'

export class HttpAdapterOneBot11 extends AdapterOneBot {
  #token?: string
  constructor (selfId: string, api: string, token?: string) {
    super()
    this.account.selfId = selfId
    this.adapter.address = api
    this.adapter.communication = 'http'
    this.#token = token
  }

  async init () {
    const result = await this.firstRequest()
    if (!result) {
      unregisterHttpBot(this.selfId)
      throw new Error(`[onebot11][${this.adapter.communication}] 连接失败: ${this.adapter.address}`)
    }

    await this.setBotInfo()
    logger.bot('info', this.selfId, `[onebot11][${this.adapter.communication}] 连接成功: ${this.adapter.address}`)
    this.adapter.index = registerBot(this.adapter.communication, this)

    // 每1分钟请求一次 如果出现失败则卸载适配器
    const timer = setInterval(async () => {
      const result = await this.firstRequest()
      if (!result) {
        logger.bot('info', this.selfId, `[onebot11][${this.adapter.communication}] 连接关闭: ${this.adapter.address}`)
        unregisterBot('index', this.adapter.index)
        unregisterHttpBot(this.selfId)
        clearInterval(timer)
      }
    }, 60 * 1000)

    // tips: ??? 为什么这里会导致整个vscode都卡掉。。。
    listeners.on(`onebot:${this.selfId}`, (event) => {
      const str = JSON.stringify(event)
      this.eventHandlers(event, str)
    })
  }

  /** 第一次请求 */
  private async firstRequest () {
    try {
      await this.setAdapterInfo()
      return true
    } catch {
      return false
    }
  }

  /** 获取登录号信息 */
  private async setAdapterInfo () {
    const info = await this.sendApi(Action.getVersionInfo, {})
    this.adapter.name = info.app_name
    this.adapter.version = info.app_version
  }

  /** 设置登录号详细信息 */
  private async setBotInfo () {
    const info = await this.sendApi(Action.getLoginInfo, {})
    this.account.name = info.nickname
    this.account.selfId = info.user_id + ''
    this.account.avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${info.user_id}`
  }

  async sendApi<T extends keyof Params> (
    action: T | `${T}`,
    params: Params[T],
    time = 120
  ): Promise<Request[T]> {
    if (!time) time = config.timeout()
    const request = JSON.stringify(params)
    logger.bot('debug', this.selfId, `发送Api请求 ${action}: ${request}`)

    try {
      const headers = this.#token ? { Authorization: `Bearer ${this.#token}` } : {}
      const { data } = await axios.post(`${this.adapter.address}/${action}`, params, { headers, timeout: time * 1000 })
      if (data.status === 'ok') {
        return data.data
      }

      throw buildError(this.selfId, action, request, data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw buildError(this.selfId, action, request, '请求超时')
      }

      buildError(this.selfId, action, request)
      throw error
    }
  }
}

export const createHttp = async () => {
  const server = config.server()
  if (!server.onebotHttp || !Array.isArray(server.onebotHttp)) return

  for (let { selfId, api, token } of server.onebotHttp) {
    try {
      if (selfId === 'default') continue
      selfId = String(selfId)
      token = String(token)
      if (!selfId || !api || !api.startsWith('http')) {
        logger.bot('error', selfId, '请配置正确的 onebot http 信息')
        continue
      }

      registerHttpBot(selfId, token)
      const adapter = new HttpAdapterOneBot11(selfId, api, token)
      await adapter.init()
    } catch (error) {
      logger.error(error)
    }
  }
}
