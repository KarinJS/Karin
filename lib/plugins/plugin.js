/** 上下文状态 */
let stateArr = {}
export { stateArr }

/** 插件基类 */
export default class plugin {
  /**
   * event
   * @type {KarinEvent}
   */
  e
  /**
    * @param {string} name 插件名称
    * @param {string} dsc 插件描述
    * @param {string} event 执行事件，默认message todo list all event types
    * @param {number} priority 优先级，数字越小优先级越高
    * @param {'master'|'owner'|'admin'|'all'} permission 权限 master,owner,admin,all
    * @param {Array<{reg: string, event?: string, fnc: string, permission?: 'master'|'owner'|'admin'|'all'}>} rule
    * @param rule.reg 命令正则
    * @param rule.fnc 命令执行方法
    * @param rule.log  false时不显示执行日志
    * @param rule.event  子事件 可选
    * @param rule.permission 子权限 master,owner,admin,all
    * @param button 按钮配置
    * @param button.reg 按钮命令正则
    * @param button.fnc 按钮执行方法
    * @param handler handler配置
    * @param handler.key handler支持的事件key
    * @param handler.fnc handler的处理fnc
    * @param handler.priority handler优先级，数字越小优先级越高，默认2000
    * @param {Array<{name: string, cron: string, fnc: string, log?: boolean}>} task
    * @param task.name 定时任务名称
    * @param task.cron 定时任务cron表达式
    * @param task.fnc 定时任务方法名
    * @param task.log  false时不显示执行日志
    */
  constructor ({
    name,
    dsc,
    event = 'message',
    priority = 5000,
    task = [],
    rule = [],
    handler = [],
    button = []
  }) {
    /** 插件名称 */
    this.name = name
    /** 插件描述 */
    this.dsc = dsc
    /** 监听事件 */
    this.event = event
    /** 优先级 */
    this.priority = priority
    /** 定时任务，可以是数组 */
    this.task = task
    /** 命令规则 */
    this.rule = rule
    /** 按钮 */
    this.button = button
    /** handler */
    this.handler = handler
  }

  /**
   * @param {string|object|Array} msg - 发送的消息
   * @param {object} data - 回复数据
   * @param {boolean?} data.at - 是否at用户
   * @param {boolean?} data.reply - 是否引用回复
   * @param {number?} data.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
   * @param {boolean?} data.button - 是否使用按钮
   */
  reply (msg = '', data = {}) {
    return this.e.reply(msg, data)
  }

  /**
   * 快速回复合并转发
   * @param {Array<KarinNodeElement>} msg
   * @return {Promise<SendMessageByResIdResponse>}
   */
  async replyForward (msg) {
    await this.e.bot.sendForwardMessage(this.e.contact, msg)
  }

  /**
   * 构建上下文键
   * @returns {string} - 上下文键
   */
  conKey () {
    return `${this.e.isGroup ? `${this.e.group_id}.` : ''}` + this.userId || this.e.user_id
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
   * @returns {object} - 上下文状态对象
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
