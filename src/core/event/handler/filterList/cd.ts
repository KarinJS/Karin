import type { FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'

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
 */
export const friendAndDirectCD = (
  eventCfg: FriendDirectFileCfg,
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
 */
export const groupAndGuildCD = (
  eventCfg: GroupGuildFileCfg,
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
