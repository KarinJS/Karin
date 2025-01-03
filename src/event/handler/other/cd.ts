import { FriendDirect, GroupGuild } from '@/types/config'
import { Notice, Request } from '@/types/event'

/** 用户个人CD */
const userCD: Record<string, NodeJS.Timeout> = {}
/** 群CD */
const groupCD: Record<string, NodeJS.Timeout> = {}
/** 群用户CD */
const groupUserCD: Record<string, NodeJS.Timeout> = {}

/**
 * 好友、频道私信CD过滤器
 * @param eventCfg - 事件配置
 * @param key - 用户key
 * @returns `true` 表示通过 没有在CD中
 */
export const privateCD = (
  eventCfg: FriendDirect,
  key: string
): boolean => {
  if (userCD[key]) {
    return false
  }

  if (eventCfg.cd > 0) {
    userCD[key] = setTimeout(() => {
      delete userCD[key]
    }, eventCfg.cd * 1000)
  }

  return true
}

/**
 * 群、频道CD过滤器
 * @param eventCfg - 事件配置
 * @param groupKey - 群key
 * @param userKey - 用户key
 * @returns `true` 表示通过 没有在CD中
 */
export const groupsCD = (
  eventCfg: GroupGuild,
  groupKey: string,
  userKey: string
): boolean => {
  /** 计时器存在直接返回即可 */
  if (groupCD[groupKey] || groupUserCD[userKey]) {
    return false
  }

  if (eventCfg.cd > 0) {
    groupCD[groupKey] = setTimeout(() => {
      delete groupCD[groupKey]
    }, eventCfg.cd * 1000)
  }

  if (eventCfg.userCD > 0) {
    groupUserCD[userKey] = setTimeout(() => {
      delete groupUserCD[userKey]
    }, eventCfg.userCD * 1000)
  }

  return true
}

/**
 * 通知、请求事件CD过滤器
 * @param config - 事件配置
 * @param key - 用户key
 */
export const noticeRequestCD = (
  ctx: Notice | Request,
  config: FriendDirect | GroupGuild,
  key: string
): boolean => {
  /** 并非所有事件都需要cd */
  const list: string[] = [
    'frientPoke',
    'receiveLike',
    'groupPoke',
    'groupMessageReaction',
  ]

  if (!list.includes(ctx.subEvent)) {
    return true
  }
  if (userCD[key]) {
    return false
  }

  if (config.cd > 0) {
    userCD[key] = setTimeout(() => {
      delete userCD[key]
    }, config.cd * 1000)
  }

  return true
}
