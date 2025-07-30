import { eventLogger } from './logger'

import type { Event } from '../../event/types'
import type { GroupMessage, GroupTempMessage, GuildMessage } from '../abstract/message'
import type { ConfigConfig, ConfigGroupValue, ConfigPrivateValue } from '@karinjs/config'

/**
 * 事件过滤工具
 */
export const filter = {
  /**
   * 好友、频道私信消息过滤
   * @param ctx 好友消息事件
   * @param config 全局配置
   * @param friend 好友配置
   * @param cd 是否处于CD中
   * @returns `true` 表示通过
   */
  privateEvent: (
    ctx: Event,
    config: ConfigConfig,
    friend: ConfigPrivateValue,
    cd: boolean
  ): boolean => {
    const logEvent = (text: string) => eventLogger.filter(ctx.logText, `${text}: ${ctx.eventId}`)

    if (ctx.isFriend) {
      if (!config?.friend?.enable) {
        logEvent('当前好友事件未启用')
        return false
      }
    } else {
      if (!config?.directs?.enable) {
        logEvent('当前频道私信事件未启用')
        return false
      }
    }

    if (!cd) {
      logEvent('当前处于CD中')
      return false
    }

    /** 用户白名单 */
    if (config?.user?.enable_list?.length && !config?.user?.enable_list.includes(ctx.userId)) {
      logEvent('用户未处于白名单')
      return false
    }

    /** 用户黑名单 */
    if (config?.user?.disable_list?.length && config?.user?.disable_list.includes(ctx.userId)) {
      logEvent('用户处于黑名单')
      return false
    }

    if (ctx.event !== 'message') {
      return true
    }

    /** 响应模式 */
    const modeMap = {
      0: () => true,
      2: () => {
        if (!ctx.isAdmin && !ctx.isMaster) {
          logEvent('当前仅允许管理员使用')
          return false
        }
        return true
      },
      3: () => {
        if (!ctx.alias) {
          logEvent('当前仅允许Bot别名触发使用')
          return false
        }
        return true
      },
      5: () => {
        if (!ctx.isAdmin && !ctx.isMaster && !ctx.alias && !ctx.atBot) {
          logEvent('当前仅允许@或别名触发(管理员例外)')
          return false
        }
        return true
      },
      6: () => {
        if (!ctx.isMaster) {
          logEvent('当前仅允许主人使用')
          return false
        }
        return true
      },
      default: () => true,
    }

    const mode = modeMap[friend.mode] || modeMap.default
    return mode()
  },

  /**
   * 群、频道消息过滤
   * @param ctx 群、频道消息事件
   * @param config 全局配置
   * @param group 群配置
   * @param cd 是否处于CD中
   * @returns `true` 表示通过
   */
  groupEvent: (
    ctx: Event,
    config: ConfigConfig,
    group: ConfigGroupValue,
    cd: boolean
  ): boolean => {
    const logEvent = (text: string) => eventLogger.filter(ctx.logText, `${text}: ${ctx.eventId}`)

    if (ctx.isGroup) {
      if (!config?.group?.enable) {
        logEvent('当前群事件未启用')
        return false
      }
    } else if (ctx.isGuild) {
      if (!config?.guilds?.enable) {
        logEvent('当前频道事件未启用')
        return false
      }
    }

    if (!cd) {
      logEvent('当前处于CD中')
      return false
    }

    /** 用户白名单 */
    if (config?.user?.enable_list?.length) {
      if (!config?.user?.enable_list.includes(ctx.userId)) {
        logEvent('用户未处于白名单')
        return false
      }
    }

    /** 用户黑名单 */
    if (config?.user?.disable_list?.length) {
      if (config?.user?.disable_list.includes(ctx.userId)) {
        logEvent('用户处于黑名单')
        return false
      }
    }

    if (ctx.isGroup) {
      /** 群白名单 */
      if (config?.group?.enable_list?.length && !config?.group?.enable_list.includes(ctx.groupId)) {
        logEvent('群未处于白名单')
        return false
      }

      /** 群黑名单 */
      if (config?.group?.disable_list?.length && config?.group?.disable_list.includes(ctx.groupId)) {
        logEvent('群处于黑名单')
        return false
      }

      if (group.member_enable?.length && !group.member_enable.includes(ctx.userId)) {
        logEvent('用户未处于群成员白名单')
        return false
      }

      if (group.member_disable?.length && group.member_disable.includes(ctx.userId)) {
        logEvent('用户处于群成员黑名单')
        return false
      }
    }
    if (ctx.isGuild) {
      /** 频道白名单 */
      if (config?.guilds?.enable_list?.length && !config?.guilds?.enable_list.includes(ctx.guildId)) {
        logEvent('频道未处于白名单')
        return false
      }

      /** 频道黑名单 */
      if (
        config?.guilds?.disable_list?.length &&
        config?.guilds?.disable_list.includes(ctx.guildId)
      ) {
        logEvent('频道处于黑名单')
        return false
      }

      if (
        config?.channels?.enable_list?.length &&
        !config?.channels?.enable_list.includes(ctx.channelId)
      ) {
        logEvent('子频道未处于白名单')
        return false
      }

      if (
        config?.channels?.disable_list?.length &&
        config?.channels?.disable_list.includes(ctx.channelId)
      ) {
        logEvent('子频道处于黑名单')
        return false
      }

      if (group.member_enable?.length && !group.member_enable.includes(ctx.userId)) {
        logEvent('用户未处于频道成员白名单')
        return false
      }

      if (group.member_disable?.length && group.member_disable.includes(ctx.userId)) {
        logEvent('用户处于频道成员黑名单')
        return false
      }
    }

    if (ctx.event !== 'message') {
      return true
    }

    /** 响应模式 */
    const modeMap = {
      0: () => true,
      1: () => {
        if (!ctx.atBot) {
          logEvent('当前响应模式仅允许@机器人使用')
          return false
        }
        return true
      },
      2: () => {
        if (!ctx.isAdmin && !ctx.isMaster) {
          logEvent('当前仅允许管理员使用')
          return false
        }
        return true
      },
      3: () => {
        if (!ctx.alias) {
          logEvent('当前仅允许Bot别名触发使用')
          return false
        }
        return true
      },
      4: () => {
        if (!ctx.alias && !ctx.atBot) {
          logEvent('当前仅允许Bot别名或@机器人触发使用')
          return false
        }
        return true
      },
      5: () => {
        if (!ctx.isAdmin && !ctx.isMaster && !ctx.alias && !ctx.atBot) {
          logEvent('当前仅允许@或别名触发(管理员例外)')
          return false
        }
        return true
      },
      6: () => {
        if (!ctx.isMaster) {
          logEvent('当前仅允许主人使用')
          return false
        }
        return true
      },
      default: () => true,
    }

    const mode = modeMap[group.mode] || modeMap.default
    return mode()
  },

  /**
   * 检查是否通过群日志打印
   * @param ctx 群事件对象
   * @param config 基本配置对象
   * @returns `true` 表示通过
   */
  groupLogEnabled: (
    ctx: GroupMessage | GroupTempMessage,
    config: ConfigConfig
  ): boolean => {
    if (
      config?.group?.log_enable_list?.length &&
      !config?.group?.log_enable_list.includes(ctx.groupId)
    ) {
      eventLogger.filter(ctx.logText, `群未处于白名单: ${ctx.eventId}`)
      return false
    }

    if (
      config?.group?.log_disable_list?.length &&
      config?.group?.log_disable_list.includes(ctx.groupId)
    ) {
      eventLogger.filter(ctx.logText, `群处于黑名单: ${ctx.eventId}`)
      return false
    }

    return true
  },

  /**
   * 检查是否通过频道日志打印
   * @param ctx 频道事件对象
   * @param config 基本配置对象
   * @returns `true` 表示通过
   */
  guildLogEnabled: (ctx: GuildMessage, config: ConfigConfig): boolean => {
    const logEvent = (text: string) => eventLogger.filter(ctx.logText, `${text}: ${ctx.eventId}`)
    if (
      config?.guilds?.log_enable_list?.length &&
      !config?.guilds?.log_enable_list.includes(ctx.guildId)
    ) {
      logEvent('频道日志未处于白名单')
      return false
    }

    if (
      config?.guilds?.log_disable_list?.length &&
      config?.guilds?.log_disable_list.includes(ctx.guildId)
    ) {
      logEvent('频道日志处于黑名单')
      return false
    }

    if (
      config?.channels?.log_enable_list?.length &&
      !config?.channels?.log_enable_list.includes(ctx.channelId)
    ) {
      logEvent('子频道日志未处于白名单')
      return false
    }

    if (
      config?.channels?.log_disable_list?.length &&
      config?.channels?.log_disable_list.includes(ctx.channelId)
    ) {
      logEvent('子频道日志处于黑名单')
      return false
    }

    return true
  },
}
