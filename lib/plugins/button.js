import { logger } from '#Karin'
import lodash from 'lodash'
import util from 'node:util'

class Button {
  constructor () {
    /**
     * @type {Array<{
     * App: class,
     * name: string,
     * priority: number,
     * file: { name: string, dir: string },
     * rule: Array<{ reg: RegExp, fnc: string }>
     * }>}
     */
    this.Apps = []
  }

  add ({ name, dir, App, Class }) {
    const rule = []
    /** 创建正则表达式 */
    for (let v of Class.button) {
      try {
        let { reg, fnc } = v
        reg = new RegExp(reg)
        rule.push({ reg, fnc })
      } catch (error) {
        logger.error(error)
        continue
      }
    }

    this.Apps.push({
      App,
      name: Class.name,
      priority: Class.priority,
      file: { name, dir },
      rule
    })
  }

  /**
   * 卸载按钮
   * @param {string} dir 插件目录
   * @param {string} name 插件文件名称
   */
  del (dir, name) {
    /** 未传入name则删除所有 */
    if (!name) {
      this.Apps = this.Apps.filter(v => v.file.dir !== dir)
    } else {
      /** 传入name则删除指定 */
      this.Apps = this.Apps.filter(v => v.file.dir !== dir || v.file.name !== name)
    }
    /** 排序 */
    this.Apps = lodash.orderBy(this.Apps, ['priority'], ['asc'])
    return this.Apps
  }

  update ({ name, dir, App, Class }) {
    this.del(dir, name)
    this.add({ name, dir, App, Class })
  }

  async get (e) {
    const button = []
    for (let app of this.Apps) {
      for (let v of app.rule) {
        /** 这里的lastIndex是为了防止正则无法从头开始匹配 */
        v.reg.lastIndex = 0
        if (v.reg.test(e.msg)) {
          try {
            const App = new app.App()
            App.e = e
            let res = App[v.fnc] && App[v.fnc](e)
            if (util.types.isPromise(res)) res = await res
            if (!res) continue
            /** 是否继续循环 */
            const cycle = res.cycle ?? true
            delete res.cycle
            button.push(res)
            if (cycle !== false) return button
          } catch (error) {
            logger.error(error)
          }
        }
      }
    }
    /** 理论上不会走到这里，但是还是要稳一手，不排除有所有插件都false... */
    return button
  }
}

export default new Button()
