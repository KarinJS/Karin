import { cache } from '@/plugin/cache'
import { RECV_MSG } from '@/utils/fs/key'
import { lock } from '@/utils/system/lock'
import { listeners } from '@/core/internal'
import { createRawMessage } from '@/utils/common'
import { config as cfg, getFriendCfg, getGroupCfg } from '@/utils/config'

import type { Message, Event } from '@/types/event'
import type { AdapterProtocol } from '@/types/adapter'
import type {
  GroupMessage,
  GroupTempMessage,
  GuildMessage,
} from '../../message'

/**
 * @description 日志
 * @param userId 用户ID
 * @param text 日志内容
 */
export const log = (
  userId: string,
  text: string
) => logger.debug(`[消息过滤][${userId}] ${text}`)

/**
 * @description 初始化`msg` `rawMessage`
 * @param ctx 消息事件对象
 */
export const initMsg = (ctx: Message) => {
  const { msg, raw } = createRawMessage(ctx.elements)
  ctx.msg = msg
  ctx.rawMessage = raw
}

/**
 * @description 初始化事件的角色身份
 * @param ctx 事件对象
 * @param config 基本配置
 */
export const initRole = (
  ctx: Event,
  config: ReturnType<typeof cfg>
) => {
  /** 主人 */
  if (config.master.includes(`${ctx.selfId}@${ctx.userId}`) || config.master.includes(ctx.userId)) {
    ctx.isMaster = true
    ctx.isAdmin = true
  } else if (config.admin.includes(`${ctx.selfId}@${ctx.userId}`) || config.admin.includes(ctx.userId)) {
    /** 管理员 */
    ctx.isAdmin = true
    ctx.isMaster = false
  } else {
    ctx.isAdmin = false
    ctx.isMaster = false
  }

  // tips: 不锁有狗瞎搞
  lock.prop(ctx, 'isMaster')
  lock.prop(ctx, 'isAdmin')
}

/**
 * @description 初始化Bot的前缀
 * @param ctx 消息事件对象
 * @param alias Bot前缀列表
 */
export const initAlias = (ctx: Message, alias: string[]) => {
  const aliasRegex = new RegExp(`^(${alias.join('|')})`)
  const match = ctx.msg.match(aliasRegex)
  if (!match) {
    ctx.alias = ''
    return
  }

  ctx.msg = ctx.msg.replace(aliasRegex, '').trim()
  ctx.alias = match[1] || ''
}

/**
 * @description 事件发布
 */
export const initEmit = (ctx: Event) => {
  listeners.emit(RECV_MSG, ctx.contact)
}

/**
 * 检查触发事件的适配器是否收到限制
 * @param plugin 插件缓存对象
 * @param protocol 适配器协议实现名称
 * @returns `true` 表示通过
 */
export const disableViaAdapter = (
  plugin: typeof cache.command[number] | typeof cache.accept[number],
  protocol: AdapterProtocol
): boolean => {
  /** 插件指定只允许特定适配器使用 */
  if (plugin.adapter.length && !plugin.adapter.includes(protocol)) {
    return false
  }

  /** 插件禁止适配器使用 */
  if (plugin.dsbAdapter.length && plugin.dsbAdapter.includes(protocol)) {
    return false
  }

  return true
}

/**
 * 检查当前插件是否通过插件白名单
 * @param plugin 插件对象
 * @param config 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export const disableViaPluginWhitelist = (
  plugin: typeof cache.command[number] | typeof cache.accept[number],
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
) => {
  /** 未设置白名单 */
  if (!config.enable.length) return true

  /**
   * 编写规则:
   * - `karin-plugin-example`: 插件包名
   * - `karin-plugin-example:index.ts`: 插件文包名:文件名
   * - `karin-plugin-example:fnc`: 插件包名:导出的方法名
   */
  const list = [
    plugin.pkg.name,
    `${plugin.pkg.name}:${plugin.file.basename}`,
    `${plugin.pkg.name}:${plugin.file.method}`,
  ]

  for (const item of list) {
    if (config.enable.includes(item)) {
      return true
    }
  }

  return false
}

/**
 * 检查当前插件是否通过插件黑名单
 * @param plugin 插件对象
 * @param config 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export const disableViaPluginBlacklist = (
  plugin: typeof cache.command[number] | typeof cache.accept[number],
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
) => {
  /** 未设置黑名单 */
  if (!config.disable.length) return true

  /**
   * 规则同`disableViaPluginWhitelist`
   * {@link disableViaPluginWhitelist}
   */
  const list = [
    plugin.pkg.name,
    `${plugin.pkg.name}:${plugin.file.basename}`,
    `${plugin.pkg.name}:${plugin.file.method}`,
  ]

  for (const item of list) {
    if (config.disable.includes(item)) {
      return false
    }
  }

  return true
}

/**
 * @description 过滤事件
 * @param ctx 好友消息事件
 * @param friend 好友配置
 * @param cd 是否处于CD中
 * @returns `true` 表示通过
 */
export const privateFilterEvent = (
  ctx: Event,
  config: ReturnType<typeof cfg>,
  friend: ReturnType<typeof getFriendCfg>,
  cd: boolean
): boolean => {
  if (!cd) {
    log(ctx.userId, `当前处于CD中: ${ctx.eventId}`)
    return false
  }

  /** 用户白名单 */
  if (config?.user?.enable_list?.length && !config?.user?.enable_list.includes(ctx.userId)) {
    log(ctx.userId, `用户未处于白名单: ${ctx.eventId}`)
    return false
  }

  /** 用户黑名单 */
  if (config?.user?.disable_list?.length && config?.user?.disable_list.includes(ctx.userId)) {
    log(ctx.userId, `用户处于黑名单: ${ctx.eventId}`)
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
        log(ctx.userId, `当前仅允许管理员使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    3: () => {
      if (!ctx.alias) {
        log(ctx.userId, `当前仅允许Bot别名触发使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    5: () => {
      if (!ctx.isAdmin && !ctx.isMaster && !ctx.alias && !ctx.atBot) {
        log(ctx.userId, `当前仅允许@或别名触发(管理员例外): ${ctx.messageId}`)
        return false
      }
      return true
    },
    6: () => {
      if (!ctx.isMaster) {
        log(ctx.userId, `当前仅允许主人使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    default: () => true,
  }

  const mode = modeMap[friend.mode] || modeMap.default
  return mode()
}

/**
 * @description 过滤事件
 * @param ctx 群、频道消息事件
 * @param group 群配置
 * @param cd 是否处于CD中
 * @returns `true` 表示通过
 */
export const groupFilterEvent = (
  ctx: Event,
  config: ReturnType<typeof cfg>,
  group: ReturnType<typeof getGroupCfg>,
  cd: boolean
): boolean => {
  if (!cd) {
    log(ctx.userId, `当前处于CD中: ${ctx.eventId}`)
    return false
  }

  /** 用户白名单 */
  if (config?.user?.enable_list?.length) {
    if (!config?.user?.enable_list.includes(ctx.userId)) {
      log(ctx.userId, `用户未处于白名单: ${ctx.eventId}`)
      return false
    }
  }

  /** 用户黑名单 */
  if (config?.user?.disable_list?.length) {
    if (config?.user?.disable_list.includes(ctx.userId)) {
      log(ctx.userId, `用户处于黑名单: ${ctx.eventId}`)
      return false
    }
  }

  if (ctx.isGroup) {
    /** 群白名单 */
    if (config?.group?.enable_list?.length && !config?.group?.enable_list.includes(ctx.groupId)) {
      log(ctx.groupId, `群未处于白名单: ${ctx.eventId}`)
      return false
    }

    /** 群黑名单 */
    if (config?.group?.disable_list?.length && config?.group?.disable_list.includes(ctx.groupId)) {
      log(ctx.groupId, `群处于黑名单: ${ctx.eventId}`)
      return false
    }

    if (group.memberEnable?.length && !group.memberEnable.includes(ctx.userId)) {
      log(ctx.userId, `用户未处于群成员白名单: ${ctx.eventId}`)
      return false
    }

    if (group.memberDisable?.length && group.memberDisable.includes(ctx.userId)) {
      log(ctx.userId, `用户处于群成员黑名单: ${ctx.eventId}`)
      return false
    }
  } if (ctx.isGuild) {
    /** 频道白名单 */
    if (config?.guilds?.enable_list?.length && !config?.guilds?.enable_list.includes(ctx.guildId)) {
      log(ctx.guildId, `频道未处于白名单: ${ctx.eventId}`)
      return false
    }

    /** 频道黑名单 */
    if (config?.guilds?.disable_list?.length && config?.guilds?.disable_list.includes(ctx.guildId)) {
      log(ctx.guildId, `频道处于黑名单: ${ctx.eventId}`)
      return false
    }

    if (config?.channels?.enable_list?.length && !config?.channels?.enable_list.includes(ctx.channelId)) {
      log(ctx.channelId, `子频道未处于白名单: ${ctx.eventId}`)
      return false
    }

    if (config?.channels?.disable_list?.length && config?.channels?.disable_list.includes(ctx.channelId)) {
      log(ctx.channelId, `子频道处于黑名单: ${ctx.eventId}`)
      return false
    }

    if (group.memberEnable?.length && !group.memberEnable.includes(ctx.userId)) {
      log(ctx.userId, `用户未处于频道成员白名单: ${ctx.eventId}`)
      return false
    }

    if (group.memberDisable?.length && group.memberDisable.includes(ctx.userId)) {
      log(ctx.userId, `用户处于频道成员黑名单: ${ctx.eventId}`)
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
        log(ctx.userId, `当前响应模式仅允许@机器人使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    2: () => {
      if (!ctx.isAdmin && !ctx.isMaster) {
        log(ctx.userId, `当前仅允许管理员使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    3: () => {
      if (!ctx.alias) {
        log(ctx.userId, `当前仅允许Bot别名触发使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    4: () => {
      if (!ctx.alias && !ctx.atBot) {
        log(ctx.userId, `当前仅允许Bot别名或@机器人触发使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    5: () => {
      if (!ctx.isAdmin && !ctx.isMaster && !ctx.alias && !ctx.atBot) {
        log(ctx.userId, `当前仅允许@或别名触发(管理员例外): ${ctx.messageId}`)
        return false
      }
      return true
    },
    6: () => {
      if (!ctx.isMaster) {
        log(ctx.userId, `当前仅允许主人使用: ${ctx.messageId}`)
        return false
      }
      return true
    },
    default: () => true,
  }

  const mode = modeMap[group.mode] || modeMap.default
  return mode()
}

/**
 * 检查是否通过群日志打印
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const groupPrint = (
  ctx: GroupMessage | GroupTempMessage,
  config: ReturnType<typeof cfg>
): boolean => {
  if (config?.group?.log_enable_list?.length && !config?.group?.log_enable_list.includes(ctx.groupId)) {
    log(ctx.groupId, `群未处于白名单: ${ctx.eventId}`)
    return false
  }

  if (config?.group?.log_disable_list?.length && config?.group?.log_disable_list.includes(ctx.groupId)) {
    log(ctx.groupId, `群处于黑名单: ${ctx.eventId}`)
    return false
  }

  return true
}

/**
 * 检查是否通过频道日志打印
 * @param event 频道事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export const guildPrint = (
  ctx: GuildMessage,
  config: ReturnType<typeof cfg>
): boolean => {
  if (config?.guilds?.log_enable_list?.length && !config?.guilds?.log_enable_list.includes(ctx.guildId)) {
    log(ctx.guildId, `频道日志未处于白名单: ${ctx.eventId}`)
    return false
  }

  if (config?.guilds?.log_disable_list?.length && config?.guilds?.log_disable_list.includes(ctx.guildId)) {
    log(ctx.guildId, `频道日志处于黑名单: ${ctx.eventId}`)
    return false
  }

  if (config?.channels?.log_enable_list?.length && !config?.channels?.log_enable_list.includes(ctx.channelId)) {
    log(ctx.channelId, `子频道日志未处于白名单: ${ctx.eventId}`)
    return false
  }

  if (config?.channels?.log_disable_list?.length && config?.channels?.log_disable_list.includes(ctx.channelId)) {
    log(ctx.channelId, `子频道日志处于黑名单: ${ctx.eventId}`)
    return false
  }

  return true
}
