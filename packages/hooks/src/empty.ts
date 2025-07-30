import lodash from 'lodash'
import { isPromise } from 'util/types'
import { cache, createHookId } from './cache'

import type { Message, Notice, Request as Requests } from '@karinjs/adapter'
import type {
  HookOptions,
  HookCallback,
  MessageHookItem,
  GeneralHookItem,
  GeneralHookCallback,
} from './types/message'

/**
 * 添加消息钩子并排序
 */
const addMessageHook = (
  list: MessageHookItem<Message>[],
  callback: HookCallback<Message>,
  options: HookOptions = {}
) => {
  const id = createHookId()
  list.push({
    id,
    priority: options.priority ?? 10000,
    callback,
  })
  return { id, list: lodash.orderBy(list, ['priority'], ['asc']) }
}

/**
 * 添加通用钩子并排序
 */
const addGeneralHook = <T> (
  list: GeneralHookItem<T>[],
  callback: GeneralHookCallback<T>,
  options: HookOptions = {}
) => {
  const id = createHookId()
  list.push({
    id,
    priority: options.priority ?? 10000,
    callback,
  })
  return { id, list: lodash.orderBy(list, ['priority'], ['asc']) }
}

/**
 * 未找到匹配插件钩子
 */
export const empty = Object.assign(
  /**
   * 添加未找到匹配插件消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: HookCallback<Message>, options: HookOptions = {}) => {
    const { id, list } = addMessageHook(cache.empty.message, callback, options)
    logger.mark(`[hooks] 添加未找到匹配插件消息钩子: ${id}`)
    cache.empty.message = list
    return id
  },
  {
    /**
     * 添加未找到匹配插件消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    message (callback: HookCallback<Message>, options: HookOptions = {}) {
      const { id, list } = addMessageHook(cache.empty.message, callback, options)
      logger.mark(`[hooks] 添加未找到匹配插件消息钩子: ${id}`)
      cache.empty.message = list
      return id
    },
    /**
     * 添加未找到匹配插件通知钩子
     * @param callback 通知处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    notice (callback: GeneralHookCallback<Notice>, options: HookOptions = {}) {
      const { id, list } = addGeneralHook(cache.empty.notice, callback, options)
      logger.mark(`[hooks] 添加未找到匹配插件通知钩子: ${id}`)
      cache.empty.notice = list
      return id
    },
    /**
     * 添加未找到匹配插件请求钩子
     * @param callback 请求处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    request (callback: GeneralHookCallback<Requests>, options: HookOptions = {}) {
      const { id, list } = addGeneralHook(cache.empty.request, callback, options)
      logger.mark(`[hooks] 添加未找到匹配插件请求钩子: ${id}`)
      cache.empty.request = list
      return id
    },
    /**
     * 删除未找到匹配插件钩子
     * @param id 钩子ID
     */
    remove (id: number) {
      logger.mark(`[hooks] 移除未找到匹配插件钩子: ${id}`)
      cache.empty.message = cache.empty.message.filter(item => item.id !== id)
      cache.empty.notice = cache.empty.notice.filter(item => item.id !== id)
      cache.empty.request = cache.empty.request.filter(item => item.id !== id)
    },
  }
)

/**
 * 通用的消息钩子触发处理函数
 * @param event 事件
 * @param hooks 钩子列表
 * @returns 是否继续正常流程
 */
const emitMessageHooks = async (
  event: Message,
  hooks: MessageHookItem<Message>[]
): Promise<boolean> => {
  let isNext = false
  for (const hook of hooks) {
    const result = hook.callback(event, () => {
      isNext = true
    })
    if (isPromise(result)) await result
    if (!isNext) return false
    isNext = false
  }
  return true
}

/**
 * 通用的钩子触发处理函数
 * @param event 事件
 * @param hooks 钩子列表
 * @returns 是否继续正常流程
 */
const emitGeneralHooks = async <T> (
  event: T,
  hooks: GeneralHookItem<T>[]
): Promise<boolean> => {
  let isNext = false
  for (const hook of hooks) {
    const result = hook.callback(event, () => {
      isNext = true
    })
    if (isPromise(result)) await result
    if (!isNext) return false
    isNext = false
  }
  return true
}

/**
 * 触发未找到匹配插件钩子
 */
export const emptyEmit = {
  /**
   * 触发未找到匹配插件消息钩子
   * @param event 消息事件
   * @returns 是否继续正常流程
   */
  message: (event: Message) => emitMessageHooks(event, cache.empty.message),

  /**
   * 触发未找到匹配插件通知钩子
   * @param event 通知事件
   * @returns 是否继续正常流程
   */
  notice: (event: Notice) => emitGeneralHooks(event, cache.empty.notice),

  /**
   * 触发未找到匹配插件请求钩子
   * @param event 请求事件
   * @returns 是否继续正常流程
   */
  request: (event: Requests) => emitGeneralHooks(event, cache.empty.request),
}
