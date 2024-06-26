import util from 'util'
import lodash from 'lodash'
import Plugin from '../core/plugin'
import { E } from '../types/types'
import logger from './logger'
import { dirName, fileName } from '../types/plugin'

/**
 * 事件处理器类
 */
export default new (class EventHandler {
  events: {
    [key: string]: Array<{
      /**
       * - 文件信息
       */
      file: {
        /**
         * - 插件包名称
         */
        dir: dirName
        /**
         * - 文件名称
         */
        name: fileName
      }
      /**
       * - 事件class
       */
      App: new () => Plugin
      /**
       * - 事件键
       */
      key: string
      /**
       * - 事件处理函数名称
       */
      fnc: string
      /**
       * - 优先级
       */
      priority: number
    }>
  }

  constructor () {
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
  add ({ name, dir, App, Class }: { dir: dirName; name: fileName; App: new () => Plugin; Class: Plugin }) {
    for (const cfg of Class.handler) {
      const { key = '', fnc = '', priority = 2000 } = cfg
      if (!key) {
        return logger.error(`[Handler][Add]: [${name}] 缺少 key`)
      }
      if (!fnc) {
        return logger.error(`[Handler][Add]: [${name}] 缺少 fnc`)
      }
      logger.debug(`[Handler][Reg]: [${name}][${key}]`)
      if (!Array.isArray(this.events[key])) this.events[key] = []
      this.events[key].push({ file: { name, dir }, App, key, fnc, priority })
      this.events[key] = lodash.orderBy(this.events[key], ['priority'], ['asc'])
    }
  }

  /**
   * 删除事件处理器
   */
  del ({
    dir = '',
    name = '',
    key = '',
  }: {
    dir: dirName | ''
    name: fileName | ''
    /**
     * 事件键 未传入则删除所有处理器
     */
    key: string | ''
  }) {
    /** 这里是删除所有 全部重新初始化 */
    if (!key && !dir && !name) {
      this.events = {}
      return true
    }

    /** 热重载 删除指定目录 */
    if (!key) {
      for (const v of Object.keys(this.events)) {
        this.events[v] = this.events[v].filter(v => v.file.dir !== dir || v.file.name !== name)
        // 如果处理器为空则删除键
        if (!this.events[v].length) {
          delete this.events[v]
        } else {
          this.events[v] = lodash.orderBy(this.events[v], ['priority'], ['asc'])
        }
      }
      return true
    }

    if (!this.events[key]) return false
    this.events[key] = this.events[key].filter(v => v.file.dir !== dir || v.file.name !== name)
    this.events[key] = lodash.orderBy(this.events[key], ['priority'], ['asc'])
    return true
  }

  /**
   * 调用事件处理器
   * @param key 事件键
   * @param args 自定义参数 一般用来传递e之类的
   */
  async call (key: string, args = {}) {
    let ret
    for (const v of this.events[key] || []) {
      const App = new v.App()
      if ('e' in args && args.e) App.e = args.e as E
      let done = true
      // 标记函数，用于标记处理器是否执行成功，由处理器自行调用，如果未调用则认为处理器未执行成功
      const reject = (msg = '') => {
        if (msg) logger.mark(`[Handler][Reject]: [${v.file.dir}][${v.file.name}][${key}] ${msg}`)
        done = false
      }
      try {
        ret = await (App[v.fnc as keyof typeof App] as Function)(args, reject)
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
   */
  has (key: string): boolean {
    return !!this.events[key]
  }
})()
