import lodash from 'lodash'
import plugin from '../plugins/plugin.js'

export default class App {
  constructor ({ name = '插件名称', dsc = '', event = 'message', priority = 5000, task = [], rule = [] }) {
    this.name = name
    this.dsc = dsc || name
    this.event = event
    this.priority = priority
    this.rule = rule
    this.task = task
  }

  /**
   * karin插件构建器
   * @param {object} params - 插件配置对象
   * @param {string} params.name - 插件名称
   * @param {string} [params.dsc='描述'] - 插件描述
   * @param {string} [params.event='message'] - 监听事件
   * @param {number} [params.priority=5000] - 插件优先级
   * @param {object} [params.task={ fnc: '', cron: '' }[]] - 插件任务
   * @param {Array} [params.rule=[]] - 插件规则
   * @returns {App} - 返回插件对象
   */
  static init (params) {
    return new App(params)
  }

  /**
   * 注册插件规则
   * @param {Object} rule - 插件规则对象
   * @param {string|Function} rule.fnc - 插件函数名或函数
   * @param {string} [rule.reg=''] - 插件规则
   * @throws {Error} 如果缺少fnc或fnc类型错误
   * @throws {Error} 如果指定的方法不存在
   */
  reg (rule) {
    /** 判断是否传入reg和fnc */
    if (!rule.fnc) throw new Error('[插件构建] 缺少fnc')
    /** 如果fnc是字符串，则在传入的对象中查找对应的方法 */
    if (typeof rule.fnc === 'string') {
      if (!rule[rule.fnc]) throw new Error(`[插件构建] ${rule.fnc} 方法不存在`)
      this[rule.fnc] = rule[rule.fnc]
      /** 删除掉这个函数 */
      delete rule[rule.fnc]
    } else if (typeof rule.fnc === 'function') {
      /** 随机生成一个方法名 */
      const fnc_name = `fnc_${Math.random().toString(36)}`
      const fnc = rule.fnc
      this[fnc_name] = fnc
      rule.fnc = fnc_name
      delete rule[fnc_name]
    }

    /** 将函数注册到当前对象中 */
    lodash.forIn(rule, (value, key) => {
      if (typeof value === 'function') this[key] = value
    })

    this.rule.push({
      fnc: rule.fnc,
      reg: rule.reg || '',
      log: rule.log || true,
      permission: rule.permission || 'all',
    })
  }

  /**
   * 将函数或函数对象注册到当前对象中
   * @param {string} name - 函数名
   * @param {Function|Object} fnc - 要注册的函数或函数对象
   */
  fnc (name, fnc) {
    if (!name) throw new Error('[插件构建] 缺少name')
    if (typeof fnc !== 'function') throw new Error('[插件构建] fnc类型错误')
    this[name] = fnc
  }

  /**
   * 设置插件接收函数
   * @param {Function} fnc - 接收函数
   */
  accept (fnc) {
    if (typeof fnc === 'function') {
      this.accept = fnc
    }
  }

  /**
   * 新增插件定时任务
   * @param {{
   *   name: string,
   *   cron: string,
   *   fnc: string|Function,
   *   log?: boolean,
   * }} task - 插件定时任务对象
   * @param {string} task.name - 定时任务名称
   * @param {string} task.cron - 定时任务表达式
   * @param {string|Function} task.fnc - 定时任务函数名或函数
   * @param {boolean} [task.log=true] - 是否记录日志
   */
  cron (task) {
    /** 检查传入的参数是否符合规则 */
    if (!task.name) throw new Error('[插件构建][定时任务] 缺少name')
    if (!task.cron) throw new Error('[插件构建][定时任务] 缺少cron')
    if (!task.fnc) throw new Error('[插件构建][定时任务] 缺少fnc')
    if (typeof task.fnc !== 'function') throw new Error('[插件构建][定时任务] fnc类型错误，必须为function')

    /** 如果fnc是字符串，则在传入的对象中查找对应的方法 */
    if (typeof task.fnc === 'string') {
      this[task.fnc] = task[task.fnc]
    } else if (typeof task.fnc === 'function') {
      /** 随机生成一个方法名 */
      const fnc_name = `fnc_${Math.random().toString(36)}`
      const fnc = task.fnc
      this[fnc_name] = fnc
      task.fnc = fnc_name
    }

    /** 将函数注册到当前对象中 */
    lodash.forIn(task, (value, key) => {
      if (typeof value === 'function') this[key] = value
    })

    this.task.push({
      name: task.name,
      cron: task.cron,
      fnc: task.fnc,
      log: task.log || true,
    })
  }

  /**
   * 创建插件类
   * @param {Object} app - 插件配置对象
   * @param {string} app.name - 插件名称
   * @param {string} app.dsc - 插件描述
   * @param {string} app.event - 插件事件
   * @param {number} app.priority - 插件优先级
   * @param {string} app.task - 插件任务
   * @param {Object} app.rule - 插件规则对象
   * @returns {Class} - 返回创建的插件类
   */
  plugin (app) {
    const cla = class extends plugin {
      constructor () {
        super({
          name: app.name,
          dsc: app.dsc,
          event: app.event,
          priority: app.priority,
          task: app.task,
          rule: app.rule,
        })
      }
    }
    // 循环app中的所有函数，构建到cla的原型中
    lodash.forIn(app, (value, key) => {
      if (typeof value === 'function') cla.prototype[key] = value
    })
    return cla
  }
}
