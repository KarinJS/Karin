import { level } from 'karin/db'
import { EventEmitter } from 'events'
import { pluginLoader } from '../plugin/loader'
import { common, logger, config, segment } from 'karin/utils'
import { MessageHandler, NoticeHandler, RequestHandler } from 'karin/event'
import {
  Contact,
  KarinElement,
  KarinAdapter,
  KarinMessage,
  KarinNoticeType,
  KarinRequestType,
  KarinMessageType,
  NodeElement,
} from 'karin/types'

type AdapterType = KarinAdapter['adapter']['type']
type onAdapter = { type: AdapterType; adapter: new () => KarinAdapter; path?: string }

/**
 * 产生事件映射
 */
export interface EmittEventMap {
  'karin:count:send': number
  'karin:count:fnc': string
  error: any
  adapter: onAdapter
  'adapter.message': KarinMessageType
  'adapter.notice': KarinNoticeType
  'adapter.request': KarinRequestType
  message: KarinMessageType
  notice: KarinNoticeType
  request: KarinRequestType
  'plugin.watch': undefined
  'restart.grpc': undefined
  'restart.http': undefined
}

/** 上下文 */
type ContextEvents = {
  [K in `ctx:${string}`]: (e: KarinMessage) => void
}

/**
 * 监听事件映射
 */
export interface OnEventMap extends ContextEvents {
  'karin:count:send': (count: number) => void
  'karin:count:fnc': (fnc: string) => void
  error: (error: any) => void
  adapter: (data: onAdapter) => void
  'adapter.message': (data: KarinMessageType) => void
  'adapter.notice': (data: KarinNoticeType) => void
  'adapter.request': (data: KarinRequestType) => void
  message: (data: KarinMessageType) => void
  notice: (data: KarinNoticeType) => void
  request: (data: KarinRequestType) => void
  'plugin.watch': undefined
  'restart.grpc': undefined
  'restart.http': undefined
}

/**
 * 监听器实例
 */
export class Listeners extends EventEmitter {
  /** 框架名称 */
  name: string
  /** Bot列表 */
  list: Array<{ index: number; type: AdapterType; bot: KarinAdapter }>
  /** 适配器列表 */
  adapter: Array<{ type: AdapterType; adapter: new () => KarinAdapter; path: string }>
  /** Bot自增索引 */
  #index: number
  /** 是否启动 */
  #start: boolean

  constructor () {
    super()
    this.#index = 0
    this.name = 'Karin'
    this.list = []
    this.adapter = []
    this.on('error', data => logger.error(data))
    this.on('adapter', data => this.addAdapter(data))
    this.on('adapter.message', data => new MessageHandler(data))
    this.on('adapter.notice', data => new NoticeHandler(data))
    this.on('adapter.request', data => new RequestHandler(data))

    this.#start = false
  }

  on<K extends keyof OnEventMap> (event: K, listener: OnEventMap[K]): this
  on (event: string, listener: (...args: any[]) => void): this
  on (event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener)
  }

  emit<K extends keyof EmittEventMap> (event: K, ...args: Parameters<EmittEventMap[K]>): boolean
  emit (event: string | symbol, ...args: any[]): boolean
  emit (event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args)
  }

  /**
   * 注册Bot 返回索引id
   */
  addBot (data: { bot: KarinAdapter; type: AdapterType }): number | false {
    this.#index++
    const index = this.#index
    if (!data.bot) {
      logger.error('[Bot管理][注册] 注册失败: Bot实例不能为空', JSON.stringify(data))
      return false
    }

    this.list.push({ index, type: data.type, bot: data.bot })
    logger.info(`[机器人][注册][${data.type}] ` + logger.green(`[account:${data.bot.account.uid || data.bot.account.uin}(${data.bot.account.name})]`))
    this.#online(data.bot.account.uid || data.bot.account.uin)

    /** 对sendForwardMessage方法进行修改 添加中间键 */
    const sendForwardMessage = data.bot.sendForwardMessage
    data.bot.sendForwardMessage = async (contact: Contact, elements: Array<NodeElement>) => {
      for (const info of pluginLoader.use.forwardMsg) {
        try {
          let next = false
          let exit = false
          const nextFn = () => { next = true }
          const exitFn = () => { exit = true }

          await info.fn(data.bot, contact, elements, nextFn, exitFn)

          if (exit) {
            const plugin = pluginLoader.plugin.get(info.key)!
            logger.debug(`[消息中间件][${plugin.plugin}][${plugin.file}] 主动操作退出`)
            return { message_id: '' }
          }

          if (!next) break
        } catch (e) {
          logger.error('[消息中间件] 调用失败，已跳过')
          logger.error(e)
        }
      }

      const result = await sendForwardMessage.call(data.bot, contact, elements)
      return result
    }

    logger.debug('注册', this.list)
    return index
  }

  /**
   * 发送上线通知
   */
  async #online (uid: string) {
    /** 重启 */
    const key = `karin:restart:${uid}`
    const options = await level.get(key)
    if (!options) return
    const { id, contact, time, message_id } = options as any
    /** 重启花费时间 保留2位小数 */
    const restartTime = ((Date.now() - time) / 1000).toFixed(2)
    /** 超过2分钟不发 */
    if (Number(restartTime) > 120) {
      await level.del(key)
      return false
    }
    const element = [
      segment.reply(message_id),
      segment.text(`\nKarin 重启成功：${restartTime}秒`),
    ]
    await this.sendMsg(id, contact, element)
    await level.del(key)
    return true
  }

  /**
   * 卸载Bot
   * @param index - Bot的索引id
   */
  delBot (index: number) {
    this.list = this.list.filter(item => item.index !== index)
    logger.debug('[机器人][卸载] ', this.list)
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
  addAdapter (data: onAdapter) {
    let path = data.path || '无'
    if (path && data.type !== 'grpc') path = `ws://127.0.0.1:${config.Server.http.port}${data.path}`
    path = logger.green(path)
    logger.info(`[适配器][注册][${data.type}]: ` + path)

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
  async sendMsg (uid: string, contact: Contact, elements: Array<KarinElement>, options: {
    recallMsg?: number
    retry_count?: number
  } = { recallMsg: 0, retry_count: 1 }): Promise<{ message_id: string }> {
    /** 结果 */
    let result: any = {}

    /** 先调用中间件 */
    for (const info of pluginLoader.use.sendMsg) {
      try {
        let next = false
        let exit = false
        const nextFn = () => { next = true }
        const exitFn = () => { exit = true }

        await info.fn(uid, contact, elements, nextFn, exitFn)

        if (exit) {
          const plugin = pluginLoader.plugin.get(info.key)!
          logger.debug(`[消息中间件][${plugin.plugin}][${plugin.file}] 主动操作退出`)
          return result
        }

        if (!next) break
      } catch (e) {
        logger.error('[消息中间件] 调用失败，已跳过')
        logger.error(e)
      }
    }

    const bot = this.getBot(uid)
    if (!bot) throw new Error('发送消息失败: 未找到对应Bot实例')
    const { recallMsg, retry_count } = options
    /** 标准化 */
    const NewElements = common.makeMessage(elements)

    const reply_log = common.makeMessageLog(NewElements)
    const self_id = bot.account.uid || bot.account.uin
    if (contact.scene === 'group') {
      logger.bot('info', self_id, `${logger.green('Send Proactive Group')} ${contact.peer}: ${reply_log}`)
    } else {
      logger.bot('info', self_id, `${logger.green('Send Proactive private')} ${contact.peer}: ${reply_log}`)
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
    if (recallMsg && bot.RecallMessage && recallMsg > 0 && result?.message_id) {
      setTimeout(() => bot.RecallMessage(contact, result.message_id), recallMsg * 1000)
    }
    return result
  }
}
