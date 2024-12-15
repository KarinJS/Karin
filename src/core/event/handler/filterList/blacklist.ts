import { config as cfg } from '@/utils/config'
import type { GroupGuildFileCfg } from '@/utils/config/types'
import type {
  PluginTypes,
  EventCfg,
  GroupEvent,
  FriendEvent,
  GuildEvent,
  DirectEvent,
} from '@/event/handler/filterList/types'

/**
 * 检查当前插件是否通过插件黑名单
 * @param plugin 插件对象
 * @param eventCfg 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export const disableViaPluginBlacklist = (plugin: PluginTypes, eventCfg: EventCfg) => {
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
 * 检查是否通过用户黑名单
 * @param event 好友事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaBlacklist = (event: FriendEvent | DirectEvent) => {
  const config = cfg()
  if (!config.disable.users.length) return true
  return !config.disable.users.includes(event.userId)
}

/**
 * 检查是否通过群黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaGroupBlacklist = (event: GroupEvent) => {
  const config = cfg()
  if (!config.disable.groups.length) return true
  return !config.disable.groups.includes(event.groupId)
}

/**
 * 检查是否通过频道黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaChannelBlacklist = (event: GuildEvent) => {
  const { disable } = cfg()
  if (!disable.guilds.length && !disable.channels.length) return true
  return !disable.channels.includes(event.channelId) && !disable.guilds.includes(event.guildId)
}

/**
 * 检查是否通过群、频道成员黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const disableViaMemberBlacklist = (
  event: GroupEvent | GuildEvent,
  eventCfg: GroupGuildFileCfg
) => {
  const config = cfg()
  const disable = [...eventCfg.memberDisable, ...config.disable.users]
  if (!disable.length) return true
  return !disable.includes(event.userId)
}

/**
 * 检查是否通过群日志打印黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaLogBlacklist = (event: GroupEvent) => {
  const config = cfg()
  if (!config.disable.groups.length) return true
  return !config.disable.groups.includes(event.groupId)
}

/**
 * 检查是否通过频道日志打印黑名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaChannelLogBlacklist = (event: GuildEvent) => {
  const { disable } = cfg()
  if (!disable.guildLog.length && !disable.channelLog.length) return true
  return !disable.channelLog.includes(event.channelId) && !disable.guildLog.includes(event.guildId)
}
