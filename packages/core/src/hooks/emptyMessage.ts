import lodash from 'lodash'
import { isPromise } from 'util/types'
import { cache, createHookId } from './cache'
import type { Message } from '@/types/event/event'
import type { MessageHookItem, HookCallback, HookOptions } from '@/types/hooks/message'

/**
 * 添加钩子
 * @param list 钩子列表
 * @param callback 钩子回调函数
 * @param options 钩子配置项
 * @returns 钩子ID
 */
const addHook = (list: MessageHookItem<Message>[], callback: HookCallback<Message>, options: HookOptions = {}) => {
  const id = createHookId()
  list.push({
    id,
    priority: options.priority ?? 10000,
    callback
  })
  return { id, list: lodash.orderBy(list, ['priority'], ['asc']) }
}

/**
 * 未找到匹配插件消息钩子
 */
export const emptyMessage = Object.assign(
  /**
   * 添加未找到匹配插件消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: HookCallback<Message>, options: HookOptions = {}) => {
    const { id, list } = addHook(cache.emptyMessage, callback, options)
    logger.mark(`[hooks] 添加未找到匹配插件消息钩子: ${id}`)
    cache.emptyMessage = list
    return id
  },
  {
    /**
     * 删除未找到匹配插件消息钩子
     * @param id 钩子ID
     */
    remove (id: number) {
      logger.mark(`[hooks] 移除未找到匹配插件消息钩子: ${id}`)
      cache.emptyMessage = cache.emptyMessage.filter(item => item.id !== id)
    }
  }
)

/**
 * 触发未找到匹配插件消息钩子
 * @param event 消息事件
 * @returns 是否继续正常流程
 */
const emitHooks = async (event: Message) => {
  let isNext = false
  for (const hook of cache.emptyMessage) {
    const result = hook.callback(event, () => {
      isNext = true
    })
    if (isPromise(result)) await result
    if (!isNext) return false
  }
  return isNext
}

/**
 * 触发未找到匹配插件消息钩子
 * @param event 消息事件
 * @returns 是否继续正常流程
 */
export const hooksEmptyMessageEmit = {
  /**
   * 触发未找到匹配插件消息钩子
   * @param event 消息事件
   * @returns 是否继续正常流程
   */
  emptyMessage: (event: Message) => emitHooks(event)
}
