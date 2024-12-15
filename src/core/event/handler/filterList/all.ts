import { log } from '@/event/handler/filterList/mode'
import {
  disableViaWhitelist,
  disableViaGroupWhitelist,
  disableViaMemberWhitelist,
  disableViaChannelWhitelist,
} from '@/event/handler/filterList/whitelist'
import {
  disableViaBlacklist,
  disableViaGroupBlacklist,
  disableViaMemberBlacklist,
  disableViaChannelBlacklist,
} from '@/event/handler/filterList/blacklist'
import {
  disableViaFriendsMode,
  disableViaSwarmMode,
  disableViaChannelMode,
  disableViaSwarmModeOther,
  disableViaPrivateModeOther,
} from '@/event/handler/filterList/mode'
import type { FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'
import type { DirectMessage, FriendMessage, GroupMessage, GuildMessage } from '@/event'
import type { FriendNoticeEventMap, FriendRequestEventMap, GroupNoticeEventMap, GroupRequestEventMap } from '@/event/types/types'

/**
 * 群消息过滤器
 * @param event 群事件对象
 * @param eventCfg 当前群的配置对象
 * @param isCD 是否通过CD
 * @param tips 日志提示
 * @returns `true` 表示通过
 */
export const allGroupFilter = (
  event: GroupMessage,
  eventCfg: GroupGuildFileCfg,
  isCD: boolean,
  tips: string
): boolean => {
  const name = '群'
  if (!isCD) {
    log(`${tips} 正在冷却中: ${event.eventId}`)
    return false
  }

  if (!disableViaGroupWhitelist(event)) {
    log(`${tips} 未通过${name}白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaGroupBlacklist(event)) {
    log(`${tips} 未通过${name}黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaMemberWhitelist(event, eventCfg)) {
    log(`${tips} 未通过${name}成员白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaMemberBlacklist(event, eventCfg)) {
    log(`${tips} 未通过${name}成员黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaSwarmMode(event, eventCfg)) {
    return false
  }

  return true
}

/**
 * 频道消息过滤器
 * @param event 群事件对象
 * @param eventCfg 当前群的配置对象
 * @param isCD 是否通过CD
 * @param tips 日志提示
 * @returns `true` 表示通过
 */
export const allGuildFilter = (
  event: GuildMessage,
  eventCfg: GroupGuildFileCfg,
  isCD: boolean,
  tips: string
): boolean => {
  const name = '频道'
  if (!isCD) {
    log(`${tips} 正在冷却中: ${event.eventId}`)
    return false
  }

  if (!disableViaChannelWhitelist(event)) {
    log(`${tips} 未通过${name}白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaChannelBlacklist(event)) {
    log(`${tips} 未通过${name}黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaMemberWhitelist(event, eventCfg)) {
    log(`${tips} 未通过${name}成员白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaMemberBlacklist(event, eventCfg)) {
    log(`${tips} 未通过${name}成员黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaChannelMode(event, eventCfg)) {
    return false
  }

  return true
}

/**
 * 好友消息过滤器
 * @param event 好友事件对象
 * @param eventCfg 当前好友的配置对象
 * @param isCD 是否通过CD
 * @param tips 日志提示
 * @returns `true` 表示通过
 */
export const allFriendFilter = (
  event: FriendMessage,
  eventCfg: FriendDirectFileCfg,
  isCD: boolean,
  tips: string
): boolean => {
  if (!isCD) {
    log(`${tips} 正在冷却中: ${event.messageId}`)
    return false
  }

  if (!disableViaWhitelist(event)) {
    log(`${tips} 未通过好友白名单: ${event.messageId}`)
    return false
  }

  if (!disableViaBlacklist(event)) {
    log(`${tips} 未通过好友黑名单: ${event.messageId}`)
    return false
  }

  if (!disableViaFriendsMode(event, eventCfg)) {
    return false
  }

  return true
}

/**
 * 频道私信过滤器
 * @param event 频道私信事件对象
 * @param eventCfg 当前频道私信的配置对象
 * @param isCD 是否通过CD
 * @param tips 日志提示
 * @returns `true` 表示通过
 */
export const allChannelFilter = (
  event: DirectMessage,
  eventCfg: FriendDirectFileCfg,
  isCD: boolean,
  tips: string
): boolean => {
  if (!isCD) {
    log(`${tips} 正在冷却中: ${event.messageId}`)
    return false
  }

  if (!disableViaWhitelist(event)) {
    log(`${tips} 未通过频道私信白名单: ${event.messageId}`)
    return false
  }

  if (!disableViaBlacklist(event)) {
    log(`${tips} 未通过频道私信黑名单: ${event.messageId}`)
    return false
  }

  if (!disableViaFriendsMode(event, eventCfg)) {
    return false
  }

  return true
}

/**
 * 群通知、请求事件过滤器
 * @param event 通知、请求事件对象
 * @param eventCfg 当前事件的配置对象
 * @param isCD 是否通过CD
 * @param tips 日志提示
 * @returns `true` 表示通过
 */
export const allGroupSwarmFilter = (
  event: GroupNoticeEventMap[keyof GroupNoticeEventMap] | GroupRequestEventMap[keyof GroupRequestEventMap],
  eventCfg: GroupGuildFileCfg,
  isCD: boolean,
  tips: string
): boolean => {
  const name = '群'

  if (isCD) {
    log(`${tips} 正在冷却中: ${event.eventId}`)
    return false
  }

  if (!disableViaGroupWhitelist(event)) {
    log(`${tips} 未通过${name}白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaGroupBlacklist(event)) {
    log(`${tips} 未通过${name}黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaMemberWhitelist(event, eventCfg)) {
    log(`${tips} 未通过${name}成员白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaMemberBlacklist(event, eventCfg)) {
    log(`${tips} 未通过${name}成员黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaSwarmModeOther(event, eventCfg)) {
    return false
  }

  return true
}

/**
 * 好友通知、请求事件过滤器
 * @param event 通知、请求事件对象
 * @param eventCfg 当前事件的配置对象
 * @param isCD 是否通过CD
 * @param tips 日志提示
 * @returns `true` 表示通过
 */
export const allFriendSwarmFilter = (
  event: FriendNoticeEventMap[keyof FriendNoticeEventMap] | FriendRequestEventMap[keyof FriendRequestEventMap],
  eventCfg: FriendDirectFileCfg,
  isCD: boolean,
  tips: string
): boolean => {
  const name = '好友'

  if (isCD) {
    log(`${tips} 正在冷却中: ${event.eventId}`)
    return false
  }

  if (!disableViaWhitelist(event)) {
    log(`${tips} 未通过${name}白名单: ${event.eventId}`)
    return false
  }

  if (!disableViaBlacklist(event)) {
    log(`${tips} 未通过${name}黑名单: ${event.eventId}`)
    return false
  }

  if (!disableViaPrivateModeOther(event, eventCfg)) {
    return false
  }

  return true
}
