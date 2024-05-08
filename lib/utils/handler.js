import { logger } from '#Karin'
import lodash from 'lodash'
import util from 'util'

/**
 * 事件处理器类
 */
class EventHandler {
  /**
   * 创建一个事件处理器实例
   */
  constructor () {
    /** @type {Object<string, Array>} 事件处理器映射表 */
    this.events = {}
  }

  /**
   * 添加事件处理器
   * @param {Object} config 配置对象
   * @param {string} config.name 处理器名称
   * @param {string} config.dir 处理器所在目录
   * @param {Function} config.App 应用构造函数
   * @param {Object} config.Class 类配置
   */
  add ({ name, dir, App, Class }) {
    for (const cfg of Class.handler) {
      const { key = '', fnc = '', priority = 2000 } = cfg
      if (!key) {
        return logger.error(`[Handler][Add]: [${name}] 缺少 key`)
      }
      if (!fnc) {
        return logger.error(`[Handler][Add]: [${name}] 缺少 fnc`)
      }
      logger.mark(`[Handler][Reg]: [${name}][${key}]`)
      if (!Array.isArray(this.events[key])) this.events[key] = []
      this.events[key].push({ file: { name, dir }, App, key, fnc, priority })
      this.events[key] = lodash.orderBy(this.events[key], ['priority'], ['asc'])
    }
  }

  /**
   * 删除事件处理器
   * @param {{
   * dir: string,
   * name: string,
   * key?: string
   * }} config 配置对象
   * @param {string} config.dir 目录
   * @param {string} config.name 名称
   * @param {string} [config.key] 事件键 未传入则删除所有处理器
   */
  del ({ dir, name, key = '' }) {
    if (!key) {
      Object.keys(this.events).forEach((k) => this.del({ dir, name, key: k }))
      return
    }
    if (!this.events[key]) return
    this.events[key] = this.events[key].filter(v => v.file.dir !== dir || v.file.name !== name)
    this.events[key] = lodash.orderBy(this.events[key], ['priority'], ['asc'])
  }

  /**
   * 调用事件处理器
   * @param {string} key 事件键
   * @param {Object} args 参数数组
   * @returns {Promise<any>} 处理结果
   */
  async call (key, args) {
    let ret
    for (const v of this.events[key] || []) {
      const App = new v.App()
      if (args.e) App.e = args.e
      let done = true
      // 标记函数，用于标记处理器是否执行成功，由处理器自行调用，如果未调用则认为处理器未执行成功
      const reject = (msg = '') => {
        if (msg) {
          logger.mark(`[Handler][Reject]: [${v.file.dir}][${v.file.name}][${key}] ${msg}`)
        }
        done = false
      }
      try {
        ret = App[v.fnc] && App[v.fnc](args, reject)
        if (util.types.isPromise(ret)) ret = await ret
        if (done) {
          logger.mark(`[Handler][Done]: [${v.file.dir}][${v.file.name}][${key}]`)
          return ret
        }
      } catch (e) {
        // 产生错误继续下一个处理器
        logger.error(`[Handler][Error]: [${v.file.dir}][${v.file.name}][${key}] ${e}`)
      }
    }
    return ret
  }

  /**
   * 检查是否存在指定键的事件处理器
   * @param {string} key 事件键
   * @returns {boolean} 存在返回 true，否则返回 false
   */
  has (key) {
    return !!this.events[key]
  }
}

export default new EventHandler()
