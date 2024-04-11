let stateArr = {}
/** 导出方便快速处理 */
export { stateArr }

/** 插件基类 */
export default class plugin {
  /**
    * @param name 插件名称
    * @param dsc 插件描述
    * @param handler handler配置
    * @param event 执行事件，默认message
    * @param priority 优先级，数字越小优先级越高
    * @param rule
    * @param rule.reg 命令正则
    * @param rule.fnc 命令执行方法
    * @param rule.log  false时不显示执行日志
    * @param rule.event  子事件
    * @param rule.permission 权限 master,owner,admin,all
    * @param button 按钮配置
    * @param button.reg 按钮命令正则
    * @param button.fnc 按钮执行方法
    * @param task
    * @param task.name 定时任务名称
    * @param task.cron 定时任务cron表达式
    * @param task.fnc 定时任务方法名
    * @param task.log  false时不显示执行日志
    */
  constructor ({
    name = 'your-plugin',
    dsc = '无',
    event = 'message',
    priority = 5000,
    task = { fnc: '', cron: '' },
    rule = []
  }) {
    /** 插件名称 */
    this.name = name
    /** 插件描述 */
    this.dsc = dsc
    /** 监听事件，默认message https://oicqjs.github.io/oicq/#events */
    this.event = event
    /** 优先级 */
    this.priority = priority
    /** 定时任务，可以是数组 */
    this.task = {
      /** 任务名 */
      name: '',
      /** 任务方法名 */
      fnc: task.fnc || '',
      /** 任务cron表达式 */
      cron: task.cron || ''
    }
    /** 命令规则 */
    this.rule = rule
  }

  /**
   * @param {string|object|Array} msg - 发送的消息
   * @param {object} data - 回复数据
   * @param {boolean} data.at - 是否at用户
   * @param {boolean} data.reply - 是否引用回复
   * @param {number} data.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
   * @param {boolean} data.button - 是否使用按钮
   */
  reply (msg = '', data = {}) {
    if (!this.e.reply || !msg) return false
    return this.e.reply(msg, data)
  }

  /**
   * 根据是否群聊返回对应的上下文键
   * @param {boolean} isGroup - 是否为群聊
   * @returns {string} - 上下文键
   */
  conKey (isGroup = false) {
    if (isGroup) {
      return `${this.name}.${this.e.group_id}`
    } else {
      return `${this.name}.${this.group_id}.${this.userId || this.e.user_id}`
    }
  }

  /**
   * 设置上下文状态
   * @param {string} type - 执行方法
   * @param {boolean} isGroup - 是否群聊
   * @param {number} time - 操作时间，默认120秒
   */
  setContext (type, isGroup = false, time = 120) {
    const key = this.conKey(isGroup)
    if (!stateArr[key]) stateArr[key] = {}
    stateArr[key][type] = this.e
    if (time) {
      /** 操作时间 */
      setTimeout(() => {
        if (stateArr[key][type]) {
          delete stateArr[key][type]
          this.e.reply('操作超时已取消', true)
        }
      }, time * 1000)
    }
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
   * 获取群聊上下文状态
   * @returns {object} - 上下文状态对象
   */
  getContextGroup () {
    const key = this.conKey(true)
    return stateArr[key]
  }

  /**
   * 清除上下文状态
   * @param {string} type - 执行方法
   * @param {boolean} isGroup - 是否群聊
   */
  finish (type, isGroup = false) {
    const key = this.conKey(isGroup)
    if (stateArr[key] && stateArr[key][type]) {
      delete stateArr[key][type]
    }
  }
}
