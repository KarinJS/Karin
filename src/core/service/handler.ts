import { cache } from '@/plugin/cache/cache'

/**
 * 调用事件处理器
 * @param key 事件键
 * @param args 自定义参数 一般用来传递e之类的
 */
export const call = async (key: string, args: { [key: string]: any, e?: any }) => {
  let result
  for (const info of cache.handler[key] || []) {
    try {
      let done = true
      /**
       * 拒绝处理器 调用后则不再继续执行下一个处理器
       * @param msg 错误信息
       */
      const next = () => { done = false }
      result = await info.fnc(args, next)
      if (done) {
        logger.mark(`[Handler][Done]: [${info.name}][${info.file.method}][${key}]`)
        return result
      }
    } catch (error) {
      logger.error(`[Handler][Error]: [${info.name}][${info.file.method}][${key}]`)
      logger.error(error)
    }
  }
  return result
}

/**
 * 检查是否存在指定键的事件处理器
 */
export const has = (key: string) => !!cache.handler[key]
