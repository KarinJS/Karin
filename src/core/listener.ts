import { EventEmitter } from 'events'
import loader from './plugin.loader'
import { KarinAdapter } from '../types/adapter'
import Common from '../utils/common'
import logger from '../utils/logger'
import Config from '../utils/config'
import { contact } from '../types/types'
import { KarinElement } from '../types/element'
import MessageHandller from '../event/message.handler'

/**
 * 监听器管理
 */
export default new (class Listeners extends EventEmitter {
  /**
   * Bot索引
   * @type - Bot索引
   */
  index: number

  /**
   * 框架名称
   */
  name: string
  list: Array<{ index: number; type: KarinAdapter['adapter']['type']; bot: KarinAdapter }>
  adapter: Array<{ type: KarinAdapter['adapter']['type']; adapter: new () => KarinAdapter; path: string }>
  constructor () {
    super()
    this.index = 0
    this.name = 'Karin'
    this.list = []
    this.adapter = []
    this.on('error', data => logger.error(data))
    this.on('plugin', () => loader.load())
    this.on('adapter', data => {
      let path = data.path || '无'
      if (path && data.type !== 'grpc') path = `ws://127.0.0.1:/${Config.Server.http.port}${data.path}`
      path = logger.green(path)
      logger.info(`[适配器][注册][${data.type}] ` + path)
      this.addAdapter(data)
    })
    this.on('bot', data => {
      this.addBot(data)
      logger.info(`[机器人][注册][${data.type}] ` + logger.green(`[account:${data.bot.account.uid || data.bot.account.uin}(${data.bot.account.name})]`))
      this.emit('karin:online', data.bot.account.uid || data.bot.account.uin)
    })
    this.on('message', data => new MessageHandller(data))
  }

  /**
   * 注册Bot 返回索引id
   */
  addBot (data: { bot: KarinAdapter; type: KarinAdapter['adapter']['type'] }): number | false {
    this.index++
    const index = this.index
    if (!data.bot) {
      logger.error('[Bot管理][注册] 注册失败: Bot实例不能为空')
      return false
    }

    this.list.push({ index, type: data.type, bot: data.bot })
    return index
  }

  /**
   * 卸载Bot
   * @param index - Bot的索引id
   */
  delBot (index: number) {
    this.list = this.list.filter(item => item.index !== index)
  }

  /**
   * 通过Bot uid 获取Bot
   * @param uid - Bot的uid 未传入则返回第一个Bot
   */
  getBot (uid = ''): KarinAdapter | undefined {
    uid = String(uid)
    if (this.list.length === 0) {
      logger.error('[Bot管理][UID] 当前Bot列表为空')
      return undefined
    }

    if (!uid) return this.list[0].bot

    const index = this.list.findIndex(item => String(item.bot.account.uid) === uid)
    if (index === -1) {
      logger.error('[Bot管理][UID] 无法找到对应的 Bot 实例')
      return undefined
    }

    return this.list[index].bot
  }

  /**
   * 根据索引获取Bot
   * @param index - Bot的索引id
   */
  getBotByIndex (index: number): KarinAdapter {
    index = this.list.findIndex(item => item.index === index)
    if (index === -1) {
      throw new Error('[Bot管理][索引] 无法找到对应的 Bot 实例')
    }
    return this.list[index].bot
  }

  /**
   * 获取当前已注册Bot数量
   */
  getBotCount (): number {
    return this.list.length
  }

  /**
   * 获取所有Bot列表
   * @param isIndex - 是否返回包含的索引列表 默认返回Bot实例列表
   */
  getBotAll (isIndex = false): KarinAdapter[] | { index: number; bot: KarinAdapter }[] {
    if (isIndex) return this.list
    return this.list.map(item => item.bot)
  }

  /**
   * 注册适配器
   * @param data - 适配器信息
   * @param data.type - 适配器类型
   * @param data.adapter - 适配器实例
   * @param data.path - 适配器路径
   */
  addAdapter (data: { type: KarinAdapter['adapter']['type']; adapter: new () => KarinAdapter; path?: string }) {
    const adapter = { type: data.type, adapter: data.adapter, path: '' }
    if (data.path) adapter.path = data.path
    this.adapter.push(adapter)
  }

  /**
   * 通过path获取适配器 仅适用于反向WS适配器
   * @param path - 适配器路径
   */
  getAdapter (path = ''): (new () => KarinAdapter) | undefined {
    const index = this.adapter.findIndex(item => item?.path === path)
    if (index === -1) {
      logger.error('[适配器管理] 无法找到对应的适配器实例')
      return undefined
    }
    return this.adapter[index].adapter
  }

  /**
   * 获取适配器列表
   * @param isType - 是否返回包含的类型列表 默认返回适配器实例列表
   */
  getAdapterAll (isType = false) {
    if (isType) return this.adapter
    return this.adapter.map(item => item.adapter)
  }

  /**
   * 发送主动消息
   * @param uid - Bot的uid
   * @param contact - 目标信息
   * @param elements - 消息内容
   * @param options - 消息选项
   * @param options.recallMsg - 发送成功后撤回消息时间
   * @param options.retry_count - 重试次数
   */
  async sendMsg (uid: string, contact: contact, elements: KarinElement, options = { recallMsg: 0, retry_count: 1 }): Promise<{ message_id: string }> {
    const bot = this.getBot(uid)
    if (!bot) throw new Error('发送消息失败: 未找到对应Bot实例')
    const { recallMsg, retry_count } = options
    /** 标准化 */
    const NewElements = Common.makeMessage(elements)

    /** 结果 */
    let result = { message_id: '' }

    const reply_log = Common.makeMessageLog(NewElements)
    const self_id = bot.account.uid || bot.account.uin
    if (contact.scene === 'group') {
      logger.bot('info', self_id, `Send Proactive Group ${contact.peer}: ${reply_log}`)
    } else {
      logger.bot('info', self_id, `Send Proactive private ${contact.peer}: ${reply_log}`)
    }

    try {
      this.emit('karin:count:send', 1)
      /** 取结果 */
      result = await bot.SendMessage(contact, NewElements, retry_count)
      logger.bot('debug', self_id, `主动消息结果:${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      logger.bot('error', self_id, `主动消息发送失败:${reply_log}`)
      logger.bot('error', self_id, error as string)
    }

    /** 快速撤回 */
    if (bot.RecallMessage && recallMsg > 0 && result?.message_id) {
      setTimeout(() => bot.RecallMessage(contact, result.message_id), recallMsg * 1000)
    }
    return result
  }
})()
