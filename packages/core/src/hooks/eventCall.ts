import lodash from 'lodash'
import { isPromise } from 'util/types'
import { cache, createHookId } from './cache'

import type { cache as pluginCache } from '@/plugin/system/cache'
import type { Message, Notice, Request } from '@/types/event/event'
import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  GroupTempMessage,
  DirectMessage,
} from '@/event'
import type { HookOptions, EventCallHookItem, EventCallCallback } from '@/types/hooks/message'
import type { CommandCache } from '@/core/karin/command'

/**
 * 添加钩子并排序
 */
const addHook = <T, P> (
  list: EventCallHookItem<T, P>[],
  callback: EventCallCallback<T, P>,
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
 * 事件调用插件钩子
 */
export const eventCall = Object.assign(
  /**
   * 添加通用事件调用钩子
   * @param callback 事件处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: EventCallCallback<Message, CommandCache>, options: HookOptions = {}) => {
    const { id, list } = addHook(cache.eventCall.message, callback, options)
    logger.mark(`[hooks] 添加通用事件调用钩子: ${id}`)
    cache.eventCall.message = list
    return id
  },
  {
    /**
     * 添加群聊事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    group (callback: EventCallCallback<GroupMessage, CommandCache>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.group, callback, options)
      logger.mark(`[hooks] 添加群聊事件调用钩子: ${id}`)
      cache.eventCall.group = list
      return id
    },
    /**
     * 添加频道事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    guild (callback: EventCallCallback<GuildMessage, CommandCache>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.guild, callback, options)
      logger.mark(`[hooks] 添加频道事件调用钩子: ${id}`)
      cache.eventCall.guild = list
      return id
    },
    /**
     * 添加群临时事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    groupTemp (callback: EventCallCallback<GroupTempMessage, CommandCache>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.groupTemp, callback, options)
      logger.mark(`[hooks] 添加群临时事件调用钩子: ${id}`)
      cache.eventCall.groupTemp = list
      return id
    },
    /**
     * 添加好友事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    friend (callback: EventCallCallback<FriendMessage, CommandCache>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.friend, callback, options)
      logger.mark(`[hooks] 添加好友事件调用钩子: ${id}`)
      cache.eventCall.friend = list
      return id
    },
    /**
     * 添加私聊事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    direct (callback: EventCallCallback<DirectMessage, CommandCache>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.direct, callback, options)
      logger.mark(`[hooks] 添加私聊事件调用钩子: ${id}`)
      cache.eventCall.direct = list
      return id
    },
    /**
     * 添加通知事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    notice (callback: EventCallCallback<Notice, typeof pluginCache.accept[number]>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.notice, callback, options)
      logger.mark(`[hooks] 添加通知事件调用钩子: ${id}`)
      cache.eventCall.notice = list
      return id
    },
    /**
     * 添加请求事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    request (callback: EventCallCallback<Request, typeof pluginCache.accept[number]>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.eventCall.request, callback, options)
      logger.mark(`[hooks] 添加请求事件调用钩子: ${id}`)
      cache.eventCall.request = list
      return id
    },
    /**
     * 删除钩子
     * @param id 钩子ID
     */
    remove (id: number) {
      logger.mark(`[hooks] 移除事件调用钩子: ${id}`)
      cache.eventCall.message = cache.eventCall.message.filter(item => item.id !== id)
      cache.eventCall.group = cache.eventCall.group.filter(item => item.id !== id)
      cache.eventCall.guild = cache.eventCall.guild.filter(item => item.id !== id)
      cache.eventCall.groupTemp = cache.eventCall.groupTemp.filter(item => item.id !== id)
      cache.eventCall.friend = cache.eventCall.friend.filter(item => item.id !== id)
      cache.eventCall.direct = cache.eventCall.direct.filter(item => item.id !== id)
      cache.eventCall.notice = cache.eventCall.notice.filter(item => item.id !== id)
      cache.eventCall.request = cache.eventCall.request.filter(item => item.id !== id)
    },
  }
)

/**
 * 通用的钩子触发处理函数
 * @param event 事件
 * @param plugin 插件对象
 * @param hooks 钩子列表
 * @returns 是否继续正常流程
 */
const emitHooks = async <T, P> (
  event: T,
  plugin: P,
  hooks: EventCallHookItem<T, P>[]
): Promise<boolean> => {
  let isNext = false
  for (const hook of hooks) {
    const result = hook.callback(event, plugin, () => {
      isNext = true
    })
    if (isPromise(result)) await result
    if (!isNext) return false
    isNext = false
  }
  return true
}

/**
 * 触发事件调用插件钩子
 */
export const eventCallEmit = {
  /**
   * 触发通用事件调用钩子
   * @param event 事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  message: (event: Message, plugin: CommandCache) =>
    emitHooks(event, plugin, cache.eventCall.message),

  /**
   * 触发群聊事件调用钩子
   * @param event 群聊事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  group: (event: GroupMessage, plugin: CommandCache) =>
    emitHooks(event, plugin, cache.eventCall.group),

  /**
   * 触发频道事件调用钩子
   * @param event 频道事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  guild: (event: GuildMessage, plugin: CommandCache) =>
    emitHooks(event, plugin, cache.eventCall.guild),

  /**
   * 触发群临时事件调用钩子
   * @param event 群临时事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  groupTemp: (event: GroupTempMessage, plugin: CommandCache) =>
    emitHooks(event, plugin, cache.eventCall.groupTemp),

  /**
   * 触发好友事件调用钩子
   * @param event 好友事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  friend: (event: FriendMessage, plugin: CommandCache) =>
    emitHooks(event, plugin, cache.eventCall.friend),

  /**
   * 触发私聊事件调用钩子
   * @param event 私聊事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  direct: (event: DirectMessage, plugin: CommandCache) =>
    emitHooks(event, plugin, cache.eventCall.direct),

  /**
   * 触发通知事件调用钩子
   * @param event 通知事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  notice: (event: Notice, plugin: typeof pluginCache.accept[number]) =>
    emitHooks(event, plugin, cache.eventCall.notice),

  /**
   * 触发请求事件调用钩子
   * @param event 请求事件
   * @param plugin 插件对象
   * @returns 是否继续正常流程
   */
  request: (event: Request, plugin: typeof pluginCache.accept[number]) =>
    emitHooks(event, plugin, cache.eventCall.request),
}
