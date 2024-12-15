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
 * 检查当前插件是否通过插件白名单
 * @param plugin 插件对象
 * @param eventCfg 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export const disableViaPluginWhitelist = (plugin: PluginTypes, eventCfg: EventCfg) => {
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
 * 检查是否通过用户白名单
 * @param event 好友事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaWhitelist = (event: FriendEvent | DirectEvent) => {
  const config = cfg()
  if (!config.enable.users.length) return true
  return config.enable.users.includes(event.userId)
}

/**
 * 检查是否通过群白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaGroupWhitelist = (event: GroupEvent) => {
  const config = cfg()
  if (!config.enable.groups.length) return true
  return config.enable.groups.includes(event.groupId)
}

/**
 * 检查是否通过频道白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaChannelWhitelist = (event: GuildEvent) => {
  const { enable } = cfg()
  if (!enable.guilds.length && !enable.channels.length) return true
  return enable.channels.includes(event.channelId) || enable.guilds.includes(event.guildId)
}

/**
 * 检查是否通过群、频道成员白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const disableViaMemberWhitelist = (
  event: GroupEvent | GuildEvent,
  eventCfg: GroupGuildFileCfg
) => {
  const config = cfg()
  const enable = [...eventCfg.memberEnable, ...config.enable.users]
  if (!enable.length) return true
  return enable.includes(event.userId)
}

/**
 * 检查是否通过群日志打印白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaLogWhitelist = (event: GroupEvent) => {
  const config = cfg()
  if (!config.enable.groups.length) return true
  return config.enable.groups.includes(event.groupId)
}

/**
 * 检查是否通过频道日志打印白名单
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const disableViaChannelLogWhitelist = (event: GuildEvent) => {
  const { enable } = cfg()
  if (!enable.guildLog.length && !enable.channelLog.length) return true
  return enable.channelLog.includes(event.channelId) || enable.guildLog.includes(event.guildId)
}
