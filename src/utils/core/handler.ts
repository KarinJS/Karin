import logger from './logger'
import { pluginLoader as loader } from 'karin/core'

/**
 * 事件处理器类
 */
export const handler = new (class EventHandler {
  /**
   * 调用事件处理器
   * @param key 事件键
   * @param args 自定义参数 一般用来传递e之类的
   */
  async call (key: string, args: { [key: string]: any, e?: any }) {
    let res
    for (const info of loader.handler[key] || []) {
      const plugin = loader.plugin.get(info.key)!
      try {
        let done = true
        /**
         * 拒绝处理器 调用后则不再继续执行下一个处理器
         * @param msg 错误信息
         */
        const next = () => { done = false }
        res = await info.fn(args, next)

        if (done) {
          logger.mark(`[Handler][Done]: [${plugin.plugin}][${info.name}][${key}]`)
          return res
        }
      } catch (e) {
        // 产生错误继续下一个处理器
        logger.error(`[Handler][Error]: [${plugin.plugin}][${info.name}][${key}] ${e}`)
      }
    }
    return res
  }

  /**
   * 检查是否存在指定键的事件处理器
   */
  has (key: string): boolean {
    return !!loader.handler[key]
  }
})()
