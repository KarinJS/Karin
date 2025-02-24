import lodash from 'lodash'
import { isPromise } from 'util/types'
import { cache, createHookId } from './cache'

import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  DirectMessage,
  GroupTempMessage
} from '@/event'
import type { Message } from '@/types/event/event'
import type { MessageHookItem, HookCallback, HookOptions, UnionMessage } from '@/types/hooks/message'

/**
 * 添加钩子并排序
 */
const addHook = <T extends UnionMessage> (
  list: MessageHookItem<T>[],
  callback: HookCallback<T>,
  options: HookOptions = {}
) => {
  const id = createHookId()
  list.push({
    id,
    priority: options.priority ?? 10000,
    callback
  })
  return { id, list: lodash.orderBy(list, ['priority'], ['asc']) }
}

/**
 * 消息hook
 */
export const message = Object.assign(
  /**
   * 添加消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: HookCallback<Message>, options: HookOptions = {}) => {
    const { id, list } = addHook(cache.message.message, callback, options)
    logger.mark(`[hooks] 添加全部消息钩子: ${id}`)
    cache.message.message = list
    return id
  },
  {
    /**
     * 添加好友消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    friend (callback: HookCallback<FriendMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.message.friend, callback, options)
      logger.mark(`[hooks] 添加好友消息钩子: ${id}`)
      cache.message.friend = list
      return id
    },
    /**
     * 添加群消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    group (callback: HookCallback<GroupMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.message.group, callback, options)
      logger.mark(`[hooks] 添加群消息钩子: ${id}`)
      cache.message.group = list
      return id
    },
    /**
     * 添加频道消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    guild (callback: HookCallback<GuildMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.message.guild, callback, options)
      logger.mark(`[hooks] 添加频道消息钩子: ${id}`)
      cache.message.guild = list
      return id
    },
    /**
     * 添加临时消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    direct (callback: HookCallback<DirectMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.message.direct, callback, options)
      logger.mark(`[hooks] 添加临时消息钩子: ${id}`)
      cache.message.direct = list
      return id
    },
    /**
     * 添加临时消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    groupTemp (callback: HookCallback<GroupTempMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.message.groupTemp, callback, options)
      logger.mark(`[hooks] 添加群临时消息钩子: ${id}`)
      cache.message.groupTemp = list
      return id
    },
    /**
     * 删除钩子
     * @param id 钩子ID
     */
    remove (id: number) {
      logger.mark(`[hooks] 移除钩子: ${id}`)
      cache.message.message = cache.message.message.filter(item => item.id !== id)
      cache.message.friend = cache.message.friend.filter(item => item.id !== id)
      cache.message.group = cache.message.group.filter(item => item.id !== id)
      cache.message.guild = cache.message.guild.filter(item => item.id !== id)
      cache.message.direct = cache.message.direct.filter(item => item.id !== id)
      cache.message.groupTemp = cache.message.groupTemp.filter(item => item.id !== id)
    },
  }
)

/**
 * 通用的钩子触发处理函数
 * @param event 消息事件
 * @param hooks 钩子列表
 * @returns 是否继续正常流程
 */
const emitHooks = async <T extends UnionMessage> (
  event: T,
  hooks: MessageHookItem<T>[]
): Promise<boolean> => {
  let isNext = false
  for (const hook of hooks) {
    const result = hook.callback(event, () => {
      isNext = true
    })
    if (isPromise(result)) await result
    if (!isNext) return false
  }
  return isNext
}

/**
 * 触发消息钩子
 */
export const hooksMessageEmit = {
  /**
   * 触发消息钩子
   * @param event 消息事件
   * @returns 是否继续正常流程
   */
  message: (event: Message) => emitHooks(event, cache.message.message),

  /**
   * 触发好友消息钩子
   * @param event 好友消息事件
   * @returns 是否继续正常流程
   */
  friend: (event: FriendMessage) => emitHooks(event, cache.message.friend),

  /**
   * 触发群消息钩子
   * @param event 群消息事件
   * @returns 是否继续正常流程
   */
  group: (event: GroupMessage) => emitHooks(event, cache.message.group),

  /**
   * 触发频道消息钩子
   * @param event 频道消息事件
   * @returns 是否继续正常流程
   */
  guild: (event: GuildMessage) => emitHooks(event, cache.message.guild),

  /**
   * 触发私聊消息钩子
   * @param event 私聊消息事件
   * @returns 是否继续正常流程
   */
  direct: (event: DirectMessage) => emitHooks(event, cache.message.direct),

  /**
   * 触发群临时消息钩子
   * @param event 群临时消息事件
   * @returns 是否继续正常流程
   */
  groupTemp: (event: GroupTempMessage) => emitHooks(event, cache.message.groupTemp)
}
