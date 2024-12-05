import { karin } from '@/karin'
import { config as cfg } from '@/utils'
import { context as ctx } from '@/event/handler/message/context'
import type { AdapterProtocol } from '@/adapter/adapter'
import type { Accept, CommandClass, CommandFnc } from '@/plugin/cache/types'
import type { FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'
import type {
  FriendNoticeEventMap,
  FriendRequestEventMap,
  GroupNoticeEventMap,
  GroupRequestEventMap,
  MessageEventMap,
} from '@/event/types/types'
import type {
  Message,
  GroupMessage,
  FriendMessage,
  Event,
  PrivateNotice,
  GroupNotice,
  GroupRequest,
  FriendRequest,
} from '@/event'

type PluginTypes = CommandClass | CommandFnc | Accept
type EventCfg = FriendDirectFileCfg | GroupGuildFileCfg

type GroupEvent = GroupRequestEventMap[keyof GroupRequestEventMap]
  | GroupNoticeEventMap[keyof GroupNoticeEventMap]
  | MessageEventMap['message.group']

type FriendEvent = FriendRequestEventMap[keyof FriendRequestEventMap]
  | FriendNoticeEventMap[keyof FriendNoticeEventMap]
  | MessageEventMap['message.friend']

/**
* 打印handler日志
* @param args 日志参数
*/
export const log = (...args: string[]) => logger.handler(`${logger.violet('[消息处理]')}${args.join('')}`)

/**
 * 事件分发
 * @param event 事件对象
 */
export const emit = (event: any) => {
  // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉 先兼容旧版 2024年10月31日14:33:53
  karin.emit(event.event, event)
  const key = `${event.event}.${event.subEvent}` as any
  karin.emit(key, event)
}

/**
 * 事件调用次数+1
 * @param plugin 插件对象
 * @param event 事件对象
 */
export const addEventCount = (plugin: PluginTypes, event: Event) => {
  karin.emit('karin:count:fnc', { name: plugin.info.name, file: plugin.file, event })
}

/**
 * 错误事件分发
 * @param error 错误对象
 */
export const emitError = (error: Error) => {
  karin.emit('error', error)
}

/**
 * 处理Bot别名
 * @param event 消息事件
 * @param alias Bot别名列表
 * @returns 是否匹配到Bot别名
 */
export const alias = (event: Message, alias: string[]): boolean => {
  const aliasRegex = new RegExp(`^(${alias.join('|')})`)
  const match = event.msg.match(aliasRegex)
  if (match) {
    event.msg = event.msg.replace(aliasRegex, '').trim()
    event.alias = match[1]
    return true
  }
  return false
}

/**
 * 初始化事件的角色身份
 * @param event 事件对象
 */
export const setEventRole = (event: GroupEvent | FriendEvent) => {
  const config = cfg.config()
  /** 主人 */
  if (config.master.includes(`${event.selfId}@${event.userId}`) || config.master.includes(event.userId)) {
    event.isMaster = true
    event.isAdmin = true
  } else if (config.admin.includes(`${event.selfId}@${event.userId}`) || config.admin.includes(event.userId)) {
    /** 管理员 */
    event.isAdmin = true
  }
}

/**
 * 检查当前插件是否通过插件白名单
 * @param plugin 插件对象
 * @param eventCfg 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedPluginEnable = (plugin: PluginTypes, eventCfg: EventCfg) => {
  if (!eventCfg.enable.length) return true

  const list = [
    plugin.info.name,
    `${plugin.info.name}:${plugin.file.basename}`,
    `${plugin.info.name}:${plugin.file.method}`,
  ]

  for (const item of list) {
    if (eventCfg.enable.includes(item)) {
      return true
    }
  }

  return false
}

/**
 * 检查当前插件是否通过插件黑名单
 * @param plugin 插件对象
 * @param eventCfg 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedPluginDisable = (plugin: PluginTypes, eventCfg: EventCfg) => {
  if (!eventCfg.disable.length) return true

  const list = [
    plugin.info.name,
    `${plugin.info.name}:${plugin.file.basename}`,
    `${plugin.info.name}:${plugin.file.method}`,
  ]

  for (const item of list) {
    if (eventCfg.disable.includes(item)) {
      return false
    }
  }

  return true
}

/**
 * 检查触发事件的适配器是否收到限制
 * @param plugin 插件缓存对象
 * @param protocol 适配器协议实现名称
 * @returns `true` 表示通过
 */
export const adapterLimited = (
  plugin: PluginTypes,
  protocol: `${AdapterProtocol}`
): boolean => {
  if (plugin.adapter.length && !plugin.adapter.includes(protocol)) {
    return false
  }

  if (plugin.dsbAdapter.length && plugin.dsbAdapter.includes(protocol)) {
    return false
  }

  return true
}

/**
 * 检查是否通过用户白名单
 * @param event 好友事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const isLimitedFriendEnable = (event: FriendEvent) => {
  const config = cfg.config()
  if (!config.enable.users.length) return true
  return config.enable.users.includes(event.userId)
}

/**
 * 检查是否通过用户黑名单
 * @param event 好友事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const isLimitedFriendDisable = (event: FriendEvent) => {
  const config = cfg.config()
  if (!config.disable.users.length) return true
  return !config.disable.users.includes(event.userId)
}

/**
 * 检查是否通过群白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const isLimitedGroupEnable = (event: GroupEvent) => {
  const config = cfg.config()
  if (!config.enable.groups.length) return true
  return config.enable.groups.includes(event.groupId)
}

/**
 * 检查是否通过群黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const isLimitedGroupDisable = (event: GroupEvent) => {
  const config = cfg.config()
  if (!config.disable.groups.length) return true
  return !config.disable.groups.includes(event.groupId)
}

/**
 * 检查是否通过群成员白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedMemberEnable = (event: GroupEvent, eventCfg: GroupGuildFileCfg) => {
  const config = cfg.config()
  const enable = [...eventCfg.memberEnable, ...config.enable.users]
  if (!enable.length) return true
  return enable.includes(event.userId)
}

/**
 * 检查是否通过群成员黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedMemberDisable = (event: GroupEvent, eventCfg: GroupGuildFileCfg) => {
  const config = cfg.config()
  const disable = [...eventCfg.memberDisable, ...config.disable.users]
  if (!disable.length) return true
  return !disable.includes(event.userId)
}

/**
 * 检查是否通过群日志打印白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const isLimitedLogEnable = (event: GroupEvent) => {
  const config = cfg.config()
  if (!config.enable.groups.length) return true
  return config.enable.groups.includes(event.groupId)
}

/**
 * 检查是否通过群日志打印黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const isLimitedLogDisable = (event: GroupEvent) => {
  const config = cfg.config()
  if (!config.disable.groups.length) return true
  return !config.disable.groups.includes(event.groupId)
}

/**
 * 检查是否通过群模式限制
 * @param event 群事件对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedGroupMode = (event: GroupMessage, eventCfg: GroupGuildFileCfg) => {
  switch (eventCfg.mode) {
    case 0: {
      return true
    }
    case 1: {
      if (!event.atBot) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许@机器人使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 2: {
      if (!event.isAdmin && !event.isMaster) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许管理员使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 3: {
      if (!event.alias) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许Bot别名触发使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 4: {
      if (!event.alias && !event.atBot) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许Bot别名或@机器人触发使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 5: {
      if (!event.isAdmin && !event.isMaster && !event.alias && !event.atBot) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式管理员无限制，非管理员仅可通过别名或@机器人触发使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 6: {
      if (!event.isMaster) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许主人使用: ${event.eventId}`)
        return false
      }
      return true
    }
    default: {
      return true
    }
  }
}

/**
 * 检查是否通过好友模式限制
 * @param event 好友事件对象
 * @param eventCfg 当前好友的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedFriendMode = (event: FriendMessage, eventCfg: FriendDirectFileCfg) => {
  switch (eventCfg.mode) {
    case 0: {
      return true
    }
    case 2: {
      if (!event.isAdmin && !event.isMaster) {
        log(`[${event.userId}] 当前响应模式仅允许管理员使用: ${event.messageId}`)
        return false
      }
      return true
    }
    case 3: {
      if (!event.alias) {
        log(`[${event.userId}] 当前响应模式仅允许Bot别名触发使用: ${event.messageId}`)
        return false
      }
      return true
    }
    case 5: {
      if (!event.isAdmin && !event.isMaster && !event.alias && !event.atBot) {
        log(`[${event.userId}] 当前响应模式管理员无限制，非管理员仅可通过别名或@机器人触发使用: ${event.messageId}`)
        return false
      }
      return true
    }
    case 6: {
      if (!event.isMaster) {
        log(`[${event.userId}] 当前响应模式仅允许主人使用: ${event.messageId}`)
        return false
      }
      return true
    }
    default: {
      return true
    }
  }
}

/**
 * 检查是否通过群模式限制 (通知请求事件)
 * @param event 群事件对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedGroupModeNoticeAndRequest = (
  event: GroupNotice | GroupRequest,
  eventCfg: GroupGuildFileCfg
) => {
  switch (eventCfg.mode) {
    case 0: {
      return true
    }
    case 2: {
      if (!event.isAdmin && !event.isMaster) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许管理员使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 6: {
      if (!event.isMaster) {
        log(`[${event.groupId}][${event.userId}] 当前响应模式仅允许主人使用: ${event.eventId}`)
        return false
      }
      return true
    }
    default: {
      return true
    }
  }
}

/**
 * 检查是否通过好友模式限制 (通知请求事件)
 * @param event 好友事件对象
 * @param eventCfg 当前好友的配置对象
 * @returns `true` 表示通过
 */
export const isLimitedFriendModeNoticeAndRequest = (
  event: PrivateNotice | FriendRequest,
  eventCfg: FriendDirectFileCfg
) => {
  switch (eventCfg.mode) {
    case 0: {
      return true
    }
    case 2: {
      if (!event.isAdmin && !event.isMaster) {
        log(`[${event.userId}] 当前响应模式仅允许管理员使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 6: {
      if (!event.isMaster) {
        log(`[${event.userId}] 当前响应模式仅允许主人使用: ${event.eventId}`)
        return false
      }
      return true
    }
    default: {
      return true
    }
  }
}

/**
 * 处理事件上下文
 * @param event 事件对象
 */
export const context = (e: Message) => {
  const key = e.contact.subPeer
    ? `${e.contact.peer}:${e.contact.subPeer}:${e.userId}`
    : `${e.contact.peer}:${e.userId}`

  if (!ctx.has(key)) {
    return false
  }

  karin.emit(`ctx:${key}`, e)
  ctx.delete(key)
  return true
}
