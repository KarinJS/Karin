/**
 * @typedef {string | import('../bot/KarinElement.js').KarinElement |Array<import('../bot/KarinElement.js').KarinElement|string>} element - 发送的消息结构
 */

/**
 * 上下文状态
 * @type {object}
 * @property {plugin} plugin 插件
 * @property {string} fnc 执行方法
 */
const stateArr = {}
export { stateArr }

/**
 * 插件基类
 * @type {KarinPlugin}
 */
export default class plugin {
  /**
   * event
   * @type {import('../bot/KarinEvent.js').KarinEvent | import('../bot/KarinNotice.js').KarinNotice | import('../bot/KarinMessage.js').KarinMessage | import('../bot/KarinRequest.js').KarinRequest}
   */
  e

  /**
   * @param {KarinPlugin}
   */
  constructor ({
    name,
    dsc,
    event = 'message',
    priority = 5000,
    task = [],
    rule = [],
    handler = [],
    button = [],
  }) {
    /**
     * @type {string} 插件名称
     */
    this.name = name
    /**
     * @type {string} 插件描述
     */
    this.dsc = dsc
    /**
     * @type {string} 监听事件
     */
    this.event = event
    /**
     * @type {number} 优先级
     */
    this.priority = priority
    /**
     * @type {Array<{name: string, cron: string, fnc: string, log?: boolean}>} 定时任务
     */
    this.task = task
    /**
     * @type {Array<{reg: string, event?: string, fnc: string, permission?: 'master'|'admin'|'group.owner'|'group.admin'|'all'}>} 命令规则
     */
    this.rule = rule
    /**
     * @type {Array<{key: string, fnc: string, priority: number}>} 按钮
     */
    this.button = button
    /**
     * @type {Array<{key: string, fnc: string, priority: number}>} handler
     */
    this.handler = handler
  }

  /**
   * 快速回复
   * @param {element} element - 发送的消息
   * @param {object} options - 回复数据
   * @param {boolean?} options.at - 是否at用户
   * @param {boolean?} options.reply - 是否引用回复
   * @param {number?} options.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
   * @param {boolean?} options.button - 是否使用按钮
   * @param {number?} options.retry_count - 重试次数
   * @returns {Promise<{ message_id?: string }>} - 返回消息ID
   */
  reply (element = '', options = { reply: false, recallMsg: 0, at: false, button: false, retry_count: 1 }) {
    return this.e.reply(element, options)
  }

  /**
   * 快速回复合并转发
   * @param {Array<KarinNodeElement>} element
   * @return {Promise<SendMessageByResIdResponse>}
   */
  async replyForward (element) {
    await this.e.bot.sendForwardMessage(this.e.contact, element)
  }

  /**
   * 构建上下文键
   * @returns {string} - 上下文键
   */
  conKey () {
    return `${this.e.isGroup ? `${this.e.group_id}.` : ''}` + (this.userId || this.e.user_id)
  }

  /**
   * 设置上下文状态
   * @param {string} fnc - 执行方法
   * @param {boolean} reply - 超时后是否回复
   * @param {number} time - 操作时间，默认120秒
   */
  setContext (fnc, reply = true, time = 120) {
    const key = this.conKey()
    stateArr[key] = { plugin: this, fnc }
    /** 操作时间 */
    this.timeout = setTimeout(() => {
      if (stateArr[key]) {
        delete stateArr[key]
        if (reply) this.e.reply('操作超时已取消', { at: true })
      }
    }, time * 1000)
  }

  /**
   * 获取上下文状态
   * @returns {StateArr} - 上下文状态对象
   */
  getContext () {
    const key = this.conKey()
    return stateArr[key]
  }

  /**
   * 清除上下文状态
   */
  finish () {
    const key = this.conKey()
    if (stateArr[key] && stateArr[key]) {
      /** 清除定时器 */
      clearTimeout(this.timeout)
      delete stateArr[key]
    }
  }
}

/**
 * @typedef {object} StateArr 上下文状态对象
 * @property {plugin} StateArr.plugin 插件
 * @property {string} StateArr.fnc 执行方法
 */

/**
 * @typedef {object} KarinPlugin
 * @property {string} KarinPlugin.name 插件名称
 * @property {string} KarinPlugin.dsc 插件描述
 * @property {string} KarinPlugin.event 监听事件
 * @property {number} KarinPlugin.priority 优先级
 * @property {Array<KarinTask>} KarinPlugin.task 定时任务
 * @property {Array<KarinRule>} KarinPlugin.rule 命令规则
 * @property {Array<KarinButton>} KarinPlugin.button 按钮
 * @property {Array<KarinHandler>} KarinPlugin.handler handler
 */

/**
 * @typedef {object} KarinTask
 * @property {string} KarinTask.name 定时任务名称
 * @property {string} KarinTask.cron 定时任务cron表达式
 * @property {string} KarinTask.fnc 定时任务方法名
 * @property {boolean} [KarinTask.log] 是否显示执行日志
 */

/**
 * @typedef {object} KarinRule
 * @property {string} KarinRule.reg 命令正则
 * @property {string} KarinRule.fnc 命令执行方法
 * @property {string} [KarinRule.event] 子事件
 * @property {boolean} [KarinRule.log] 是否显示执行日志
 * @property {'master'|'admin'|'group.owner'|'group.admin'|'all'} [KarinRule.permission] 子权限
 */

/**
 * @typedef {object} KarinButton
 * @property {string} KarinButton.reg 按钮命令正则
 * @property {string} KarinButton.fnc 按钮执行方法
 */

/**
 * @typedef {object} KarinHandler
 * @property {string} KarinHandler.key handler支持的事件key
 * @property {string} KarinHandler.fnc handler的处理fnc
 * @property {number} [KarinHandler.priority] handler优先级
 */
