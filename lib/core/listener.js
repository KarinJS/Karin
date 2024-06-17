import { EventEmitter } from 'events'
import loader from '../plugins/loader.js'

/**
 * 监听器管理
 */
export default class Listeners extends EventEmitter {
  /**
   * 日志模块
   * @private
   * @type {import('../index.js').logger}
   */
  #logger

  /**
   * 常用方法
   * @private
   * @type {import('../index.js').common}
   */
  #common

  /**
   * Bot索引
   * @type {number} - Bot索引
   */
  index

  /**
   * 框架名称
   * @type {string}
   */
  name

  /**
   * 注册的Bot列表
   * @type {{index: number, type: adapterType, bot: import('../adapter/adapter.js').KarinAdapter}[]}
   */
  list

  /**
   * 注册的适配器列表
   * @type {{type: adapterType, adapter: import('../adapter/adapter.js').KarinAdapter}[]}
   */
  adapter

  /**
   * @param {import('../index.js').segment} segment
   */
  #segment

  /**
   * @param {import('../index.js').logger} logger
   * @param {import('../index.js').common} common
   * @param {import('../index.js').config} config
   * @param {import('../index.js').segment} segment
   */
  constructor (logger, common, config, segment) {
    super()
    this.index = 0
    this.name = 'Karin'
    this.#logger = logger
    this.#common = common
    this.#segment = segment
    this.list = []
    this.adapter = []
    this.on('error', data => logger.error(data))
    this.on('plugin', () => loader.load())
    this.on('adapter', data => {
      let path = data.path || '无'
      if (path && data.type !== 'grpc') path = `ws://127.0.0.1:/${config.Server.http.port}${data.path}`
      path = logger.green(path)
      logger.info(`[适配器][注册][${data.type}] ` + path)
      this.addAdapter(data)
    })
    this.on('bot', data => {
      this.addBot(data)
      logger.info(`[机器人][注册][${data.type}] ` + logger.green(`[account:${data.bot.account.uid || data.bot.account.uin}(${data.bot.account.name})]`))
      this.emit('karin:online', data.bot.account.uid || data.bot.account.uin)
    })
  }

  /**
   * 注册Bot 返回索引id
   * @typedef {object} addBot
   * @property {import('../adapter/adapter.js').KarinAdapter|false} bot - Bot实例
   * @property {adapterType} type - Bot适配器类型
   * @param {addBot} data - Bot数据
   * @returns {number|false} - 注册成功返回Bot的索引id
   */
  addBot (data) {
    this.index++
    const index = this.index
    if (!data.bot) {
      this.#logger.error('[Bot管理][注册] 注册失败: Bot实例不能为空')
      return false
    }

    this.list.push({ index, type: data.type, bot: data.bot })
    return index
  }

  /**
   * 卸载Bot
   * @param {number} index - Bot的索引id
   */
  delBot (index) {
    this.list = this.list.filter(item => item.index !== index)
  }

  /**
   * 通过Bot uid 获取Bot
   * @param {string} [uid] - Bot的uid 未传入则返回第一个Bot
   * @returns {import('../adapter/adapter.js').KarinAdapter}
   */
  getBot (uid = '') {
    if (this.list.length === 0) {
      this.#logger.error('[Bot管理][UID] 当前Bot列表为空')
      return undefined
    }

    if (!uid) return this.list[0].bot

    const index = this.list.findIndex(item => item.bot.account.uid === uid)
    if (index === -1) {
      this.#logger.error('[Bot管理][UID] 无法找到对应的 Bot 实例')
      return undefined
    }

    return this.list[index].bot
  }

  /**
   * 根据索引获取Bot
   * @param {number} index - Bot的索引id
   * @returns {import('../adapter/adapter.js').KarinAdapter}
   */
  getBotByIndex (index) {
    index = this.list.findIndex(item => item.index === index)
    if (index === -1) {
      throw new Error('[Bot管理][索引] 无法找到对应的 Bot 实例')
    }
    return this.list[index].bot
  }

  /**
   * 获取当前已注册Bot数量
   */
  getBotCount () {
    return this.list.length
  }

  /**
   * 获取所有Bot列表
   * @param {boolean} [isIndex] - 是否返回包含的索引列表 默认返回Bot实例列表
   */
  getBotAll (isIndex = false) {
    if (isIndex) return this.list
    return this.list.map(item => item.bot)
  }

  /**
   * 注册适配器
   * @param {addAdapter} data - 适配器数据
   * @typedef {object} addAdapter
   * @property {adapterType} addAdapter.type - 适配器类型
   * @property {import('../adapter/adapter.js').KarinAdapter} addAdapter.adapter - 适配器实例
   * @property {string} [addAdapter.path] - 适配器路径 仅适用于反向WS适配器
   */
  addAdapter (data) {
    const adapter = { type: data.type, adapter: data.adapter }
    if (data.path) adapter.path = data.path
    this.adapter.push(adapter)
  }

  /**
   * 通过path获取适配器 仅适用于反向WS适配器
   * @param {string} path - 适配器路径
   */
  getAdapter (path) {
    const index = this.adapter.findIndex(item => item?.path === path)
    if (index === -1) {
      this.#logger.error('[适配器管理] 无法找到对应的适配器实例')
      return false
    }
    return this.adapter[index].adapter
  }

  /**
   * 获取适配器列表
   * @param {boolean} isType - 是否返回包含的类型列表 默认返回适配器实例列表
   * @returns {import('../adapter/adapter.js').KarinAdapter[]|{type: adapterType, path: string, adapter: import('../adapter/adapter.js').KarinAdapter}[]}
   */
  getAdapterAll (isType = false) {
    if (isType) return this.adapter
    return this.adapter.map(item => item.adapter)
  }

  /**
   * 发送主动消息
   * @param {string} uid - Bot的uid
   * @param {import('../bot/KarinElement.js').KarinContact} contact - 目标信息
   * @param {Array<KarinElement|string>|KarinElement|string} elements - 消息内容
   * @param {object} options - 消息选项
   * @param {number} options.recallMsg - 发送成功后撤回消息时间
   * @param {number} options.retry_count - 重试次数
   * @returns {Promise<{message_id}>}
   */
  async sendMsg (uid, contact, elements, options = { recallMsg: 0, retry_count: 1 }) {
    const bot = this.getBot(uid)
    if (!bot) throw new Error('发送消息失败: 未找到对应Bot实例')
    const { recallMsg, retry_count } = options
    /** 标准化 */
    elements = this.#common.makeMessage(elements)

    /** 先发 提升速度 */
    let result = bot.SendMessage(contact, elements, retry_count)

    const reply_log = this.#common.makeMessageLog(elements)
    const self_id = bot.account.uid || bot.account.uin
    if (contact.scene === 'group') {
      this.#logger.bot('info', self_id, `Send Proactive Group ${contact.peer}: ${reply_log}`)
    } else {
      this.#logger.bot('info', self_id, `Send Proactive private ${contact.peer}: ${reply_log}`)
    }

    try {
      this.emit('karin:count:send', 1)
      /** 取结果 */
      result = await result
      this.#logger.bot('debug', self_id, `主动消息结果:${JSON.stringify(result, null, 2)}`)
    } catch (err) {
      this.#logger.bot('error', self_id, `主动消息发送失败:${reply_log}`)
      this.#logger.bot('error', self_id, err)
    }

    /** 快速撤回 */
    if (bot.RecallMessage && recallMsg > 0 && result?.message_id) {
      setTimeout(() => bot.RecallMessage(null, result.message_id), recallMsg * 1000)
    }
    return result
  }
}

/**
 * @typedef {'internal'|'websocket'|'grpc'|'http'|'render'} adapterType
 */
