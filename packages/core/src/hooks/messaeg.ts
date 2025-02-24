import lodash from 'lodash'
import { isPromise } from 'util/types'

import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  DirectMessage,
  GroupTempMessage
} from '@/event'
import type { Message } from '@/types/event/event'
import type { HookItem, HookCallback, HookOptions, HookCache, UnionMessage } from '@/types/hooks/message'

/** 钩子计数器 */
let hookId = 0

/**
 * 存储钩子
 */
const cache: HookCache = {
  message: [],
  friend: [],
  group: [],
  guild: [],
  direct: [],
  groupTemp: []
}

/**
 * 创建新的钩子ID
 */
const createHookId = () => ++hookId

/**
 * 添加钩子并排序
 */
function addHook<T extends UnionMessage> (
  list: HookItem<T>[],
  callback: HookCallback<T>,
  options: HookOptions = {}
) {
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
    const { id, list } = addHook(cache.message, callback, options)
    logger.mark(`[hooks] 添加全部消息钩子: ${id}`)
    cache.message = list
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
      const { id, list } = addHook(cache.friend, callback, options)
      logger.mark(`[hooks] 添加好友消息钩子: ${id}`)
      cache.friend = list
      return id
    },
    /**
     * 添加群消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    group (callback: HookCallback<GroupMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.group, callback, options)
      logger.mark(`[hooks] 添加群消息钩子: ${id}`)
      cache.group = list
      return id
    },
    /**
     * 添加频道消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    guild (callback: HookCallback<GuildMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.guild, callback, options)
      logger.mark(`[hooks] 添加频道消息钩子: ${id}`)
      cache.guild = list
      return id
    },
    /**
     * 添加临时消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    direct (callback: HookCallback<DirectMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.direct, callback, options)
      logger.mark(`[hooks] 添加临时消息钩子: ${id}`)
      cache.direct = list
      return id
    },
    /**
     * 添加临时消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    groupTemp (callback: HookCallback<GroupTempMessage>, options: HookOptions = {}) {
      const { id, list } = addHook(cache.groupTemp, callback, options)
      logger.mark(`[hooks] 添加群临时消息钩子: ${id}`)
      cache.groupTemp = list
      return id
    },
    /**
     * 删除钩子
     * @param id 钩子ID
     */
    remove (id: number) {
      logger.mark(`[hooks] 移除钩子: ${id}`)
      cache.message = cache.message.filter(item => item.id !== id)
      cache.friend = cache.friend.filter(item => item.id !== id)
      cache.group = cache.group.filter(item => item.id !== id)
      cache.guild = cache.guild.filter(item => item.id !== id)
      cache.direct = cache.direct.filter(item => item.id !== id)
      cache.groupTemp = cache.groupTemp.filter(item => item.id !== id)
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
  hooks: HookItem<T>[]
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
export const hooksEmit = {
  /**
   * 触发消息钩子
   * @param event 消息事件
   * @returns 是否继续正常流程
   */
  message: (event: Message) => emitHooks(event, cache.message),

  /**
   * 触发好友消息钩子
   * @param event 好友消息事件
   * @returns 是否继续正常流程
   */
  friend: (event: FriendMessage) => emitHooks(event, cache.friend),

  /**
   * 触发群消息钩子
   * @param event 群消息事件
   * @returns 是否继续正常流程
   */
  group: (event: GroupMessage) => emitHooks(event, cache.group),

  /**
   * 触发频道消息钩子
   * @param event 频道消息事件
   * @returns 是否继续正常流程
   */
  guild: (event: GuildMessage) => emitHooks(event, cache.guild),

  /**
   * 触发私聊消息钩子
   * @param event 私聊消息事件
   * @returns 是否继续正常流程
   */
  direct: (event: DirectMessage) => emitHooks(event, cache.direct),

  /**
   * 触发群临时消息钩子
   * @param event 群临时消息事件
   * @returns 是否继续正常流程
   */
  groupTemp: (event: GroupTempMessage) => emitHooks(event, cache.groupTemp)
}
