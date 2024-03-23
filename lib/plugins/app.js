import plugin from './plugin.js'

class App {
  constructor ({ name = '插件名称', dsc = '描述', event = 'message', priority = 5000, task = { fnc: '', cron: '' }, rule = [] }) {
    this.name = name
    this.dsc = dsc
    this.event = event
    this.priority = priority
    this.rule = rule
    this.task = task
  }

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
    // 判断是否传入reg和fnc
    if (!rule.fnc) throw new Error('[插件构建] 缺少fnc')
    // 如果fnc是字符串，则在传入的对象中查找对应的方法
    if (typeof rule.fnc === 'string') {
      if (!rule[rule.fnc]) throw new Error(`[插件构建] ${rule.fnc} 方法不存在`)
      this[rule.fnc] = rule[rule.fnc]
    } else if (typeof rule.fnc === 'function') {
      // 随机生成一个方法名
      let fncNme = `fnc_${Math.random().toString(36)}`
      const fnc = rule.fnc
      this[fncNme] = fnc
      rule.fnc = fncNme
    } else {
      throw new Error('[插件构建] fnc类型错误')
    }
    if (!rule.reg) rule.reg = ''
    this.rule.push({
      fnc: rule.fnc,
      reg: rule.reg
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

  /** 设置accept方法 */
  accept (fnc) {
    if (typeof fnc === 'function') {
      this.accept = fnc
    }
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
    let cla = class extends plugin {
      constructor () {
        super({
          name: app.name,
          dsc: app.dsc,
          event: app.event,
          priority: app.priority,
          task: app.task,
          rule: app.rule
        })
      }
    }
    // 循环app中的所有函数，构建到cla的原型中
    for (let i in app) {
      if (typeof app[i] === 'function') cla.prototype[i] = app[i]
    }
    return cla
  }
}

export default App
