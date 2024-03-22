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
    for (let i of app.rule) cla.prototype[i.fnc] = app[i.fnc]
    return cla
  }
}

export default App
