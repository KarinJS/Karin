import type {
  GroupMessage,
  FriendMessage,
  FriendNotice,
  GroupNotice,
  GroupRequest,
  FriendRequest,
  GuildMessage,
  DirectMessage,
} from '@/event'

import type { FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'

/**
* 打印handler日志
* @param args 日志参数
*/
export const log = (...args: string[]) => logger.handler(`${logger.violet('[消息处理]')}${args.join('')}`)

/**
 * 检查是否通过群模式限制
 * @param event 群事件对象
 * @param eventCfg 当前群的配置对象
 * @returns `true` 表示通过
 */
export const disableViaSwarmMode = (
  event: GroupMessage,
  eventCfg: GroupGuildFileCfg
) => {
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
 * 检查是否通过频道模式限制
 * @param event 群事件对象
 * @param eventCfg 当前频道的配置对象
 * @returns `true` 表示通过
 */
export const disableViaChannelMode = (
  event: GuildMessage,
  eventCfg: GroupGuildFileCfg
) => {
  switch (eventCfg.mode) {
    case 0: {
      return true
    }
    case 1: {
      if (!event.atBot) {
        log(`[${event.guildId}-${event.channelId}][${event.userId}] 当前响应模式仅允许@机器人使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 2: {
      if (!event.isAdmin && !event.isMaster) {
        log(`[${event.guildId}-${event.channelId}][${event.userId}] 当前响应模式仅允许管理员使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 3: {
      if (!event.alias) {
        log(`[${event.guildId}-${event.channelId}][${event.userId}] 当前响应模式仅允许Bot别名触发使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 4: {
      if (!event.alias && !event.atBot) {
        log(`[${event.guildId}-${event.channelId}][${event.userId}] 当前响应模式仅允许Bot别名或@机器人触发使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 5: {
      if (!event.isAdmin && !event.isMaster && !event.alias && !event.atBot) {
        log(`[${event.guildId}-${event.channelId}][${event.userId}] 当前响应模式管理员无限制，非管理员仅可通过别名或@机器人触发使用: ${event.eventId}`)
        return false
      }
      return true
    }
    case 6: {
      if (!event.isMaster) {
        log(`[${event.guildId}-${event.channelId}][${event.userId}] 当前响应模式仅允许主人使用: ${event.eventId}`)
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
export const disableViaFriendsMode = (
  event: FriendMessage | DirectMessage
  , eventCfg: FriendDirectFileCfg
) => {
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
export const disableViaSwarmModeOther = (
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
export const disableViaPrivateModeOther = (
  event: FriendNotice | FriendRequest,
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
