import { log } from '..'
import { karin } from '@/karin'
import { config as cfg } from '@/start'
import { createRawMessage } from '@/utils/message'
import { GroupMessage } from '@/event/create/message/group'
import type { ConfigType, GroupGuildFileCfg } from '@/utils/config/types'
import { cache } from '@plugin/cache/cache'
import { CommandFnc } from '@plugin/cache/types'
import { AdapterProtocol } from '@/adapter/adapter'

const groupCD: Record<string, NodeJS.Timeout> = {}
const groupUserCD: Record<string, NodeJS.Timeout> = {}

export class GroupHandler {
  event: GroupMessage
  config: ConfigType
  groupCfg: GroupGuildFileCfg

  constructor (event: GroupMessage) {
    this.event = event
    this.config = cfg.ConfigSync()
    this.groupCfg = cfg.groupGuildCfgSync(this.event.groupId, this.event.selfId)
  }

  init () {
    const { msg, raw } = createRawMessage(this.event.elements)
    this.event.msg = msg
    this.event.rawMessage = raw
    this.print()
    this.admin()
    this.alias()

    // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉先兼容旧版 2024年10月31日14:33:53
    karin.emit('message', this.event)
    karin.emit('message.group', this.event)
    const isRestricted = this.isRestricted()

    if (!isRestricted) {
      this.deal()
    }
  }

  /** 检查是否存在cd中 */
  get isCD (): boolean {
    const groupKey = this.event.groupId
    const userKey = `${groupKey}.${this.event.userId}`

    /** 计时器存在直接返回即可 */
    if (groupCD[groupKey] || groupUserCD[userKey]) {
      return true
    }

    /** 群CD */
    if (this.groupCfg.cd > 0) {
      groupCD[groupKey] = setTimeout(() => {
        delete groupCD[groupKey]
      }, this.groupCfg.cd * 1000)
    }

    /** 群个人cd */
    if (this.groupCfg.userCD > 0) {
      groupUserCD[userKey] = setTimeout(() => {
        delete groupUserCD[userKey]
      }, this.groupCfg.userCD * 1000)
    }

    return false
  }

  /** 检查是否通过群白名单 */
  get isGroupEnable () {
    if (!this.config.enable.groups.length) return true
    return this.config.enable.groups.includes(this.event.groupId)
  }

  /** 检查是否通过群黑名单 */
  get isGroupDisable () {
    if (!this.config.disable.groups.length) return false
    return !this.config.disable.groups.includes(this.event.groupId)
  }

  /** 检查是否通过群成员白名单 */
  get isMemberEnable () {
    const enable = [...this.groupCfg.memberEnable, ...this.config.enable.users]
    if (!enable.length) return true
    return enable.includes(this.event.userId)
  }

  /** 检查是否通过群成员黑名单 没在黑名单才返回`true`  */
  get isMemberDisable () {
    const disable = [...this.groupCfg.memberDisable, ...this.config.disable.users]
    if (!disable.length) return false
    return !disable.includes(this.event.userId)
  }

  /** 检查是否通过群日志打印白名单 */
  get isLogEnable () {
    if (!this.config.enable.groups.length) return true
    return this.config.enable.groups.includes(this.event.groupId)
  }

  /** 检查是否通过群日志打印黑名单 没在黑名单才返回`true` */
  get isLogDisable () {
    if (!this.config.disable.groups.length) return false
    return !this.config.disable.groups.includes(this.event.groupId)
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示事件受限，`false` 表示事件未受限
   */
  isRestricted () {
    if (!this.isCD) {
      log(`[${this.event.groupId}][${this.event.userId}] 正在冷却中: ${this.event.messageId}`)
      return true
    }

    if (!this.isGroupEnable) {
      log(`[${this.event.groupId}][${this.event.userId}] 未通过群白名单: ${this.event.messageId}`)
      return true
    }

    if (!this.isGroupDisable) {
      log(`[${this.event.groupId}][${this.event.userId}] 通过群黑名单: ${this.event.messageId}`)
      return true
    }

    if (!this.isMemberEnable) {
      log(`[${this.event.groupId}][${this.event.userId}] 未通过群成员白名单: ${this.event.messageId}`)
      return true
    }

    if (!this.isMemberDisable) {
      log(`[${this.event.groupId}][${this.event.userId}] 通过群成员黑名单: ${this.event.messageId}`)
      return true
    }

    if (this.groupCfg.mode === 0) {
      return false
    }

    if (this.groupCfg.mode === 1 && !this.event.atBot) {
      log(`[${this.event.groupId}][${this.event.userId}] 当前响应模式仅允许@机器人使用: ${this.event.messageId}`)
      return true
    }

    if (this.groupCfg.mode === 2 && !this.event.isAdmin && !this.event.isMaster) {
      log(`[${this.event.groupId}][${this.event.userId}] 当前响应模式仅允许管理员使用: ${this.event.messageId}`)
      return true
    }

    if (this.groupCfg.mode === 3 && !this.event.alias) {
      log(`[${this.event.groupId}][${this.event.userId}] 当前响应模式仅允许Bot别名触发使用: ${this.event.messageId}`)
      return true
    }

    if (this.groupCfg.mode === 4 && !this.event.alias && !this.event.atBot) {
      log(`[${this.event.groupId}][${this.event.userId}] 当前响应模式仅允许Bot别名或@机器人触发使用: ${this.event.messageId}`)
      return true
    }

    if (this.groupCfg.mode === 5 && !this.event.isAdmin && !this.event.isMaster && !this.event.alias && !this.event.atBot) {
      log(`[${this.event.groupId}][${this.event.userId}] 当前响应模式管理员无限制，非管理员仅可通过别名或@机器人触发使用: ${this.event.messageId}`)
      return true
    }

    if (this.groupCfg.mode === 6 && !this.event.isMaster) {
      log(`[${this.event.groupId}][${this.event.userId}] 当前响应模式仅允许主人使用: ${this.event.messageId}`)
      return true
    }

    return false
  }

  /** 打印日志 */
  print () {
    this.event.logText = `[Group:${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})]`
    if (this.isLogEnable && this.isLogDisable) {
      logger.bot('info', this.event.selfId, `群消息：[${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.rawMessage}`)
    }
  }

  /** 管理员身份 */
  admin () {
    /** 主人 */
    if (this.config.master.includes(this.event.userId)) {
      this.event.isMaster = true
      this.event.isAdmin = true
    } else if (this.config.admin.includes(this.event.userId)) {
      /** 管理员 */
      this.event.isAdmin = true
    }
  }

  /** 处理Bot别名 */
  alias () {
    const aliasRegex = new RegExp(`^(${this.groupCfg.alias.join('|')})`)
    const match = this.event.msg.match(aliasRegex)
    if (match) {
      this.event.msg = this.event.msg.replace(aliasRegex, '').trim()
      this.event.alias = match[1]
      return true
    }
    return false
  }

  /** 过滤时间 返回false表示未通过 */
  filterEvent (event: CommandFnc['event']): boolean {
    return !!(event === 'message' || event !== 'message.group')
  }

  /**
   * 检查当前适配器是否受到限制
   * @param plugin
   * @returns 返回`true`表示受限
   */
  isAdapter (plugin: CommandFnc): boolean {
    if (plugin.adapter.length && !plugin.adapter.includes(this.event.bot.adapter.protocol)) {
      return false
    }

    if (plugin.dsbAdapter.length && plugin.dsbAdapter.includes(this.event.bot.adapter.protocol)) {
      return false
    }

    return true
  }

  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.group') continue
      if (plugin.type === 'fnc') {
        const reg = plugin.reg
        if (reg && !reg.test(this.event.msg)) continue
        if (this.isAdapter(plugin)) continue
        const info = cache.index[plugin.index]
        /** 判断黑白名单插件 */
        if (this.groupCfg.enable.length) {
          if (this.groupCfg.enable.some(item => item.plugin === info.name || item.name === plugin.)) {
            continue
          }
        }
        await plugin.fnc(this.event)
      }
    }
  }
// export const groupHandler = async (event: GroupMessage) => {
//   /** 是否处于限制 */
//   const data = {
//     /** 处于限制 `true=限制中` */
//     limit: false,
//     type: '',
//   }

//   const groupCfg = await cfg.groupGuildCfg(event.groupId, event.selfId)
//   if (isCD(event.groupId, event.userId, groupCfg)) {
//     data.type = 'cd'
//     data.limit = true
//     return data
//   }

//   const config = await cfg.Config()
//   /** 群白名单 */
//   if (config.enable.groups.length && config.enable.groups.includes(event.groupId)) {
//     /** 群成员白名单、全局用户白名单 */
//     const enable = [...groupCfg.memberEnable, ...config.enable.users]
//     if (enable.length && enable.includes(event.userId)) {
//       data.type = 'memberEnable'
//       data.limit = false
//       return data
//     }

//     /** 群成员黑名单、全局用户黑名单 */
//     const disable = [...groupCfg.memberDisable, ...config.disable.users]
//     if (disable.length && disable.includes(event.userId)) {
//       data.type = 'memberDisable'
//       data.limit = true
//       return data
//     }

//     /** 通过了全部白名单、用户黑名单 */
//     data.type = 'groupEnable'
//     return data
//   }

//   /** 群黑名单 */
//   if (config.disable.groups.length && config.disable.groups.includes(event.groupId)) {
//     data.type = 'groupDisable'
//     data.limit = true
//     return data
//   }

//   /** 群成员、用户白名单 */
//   const enable = [...groupCfg.memberEnable, ...config.enable.users]
//   if (enable.length && enable.includes(event.userId)) {
//     data.type = 'memberEnable'
//     data.limit = false
//     return data
//   }

//   /** 群成员、用户黑名单 */
//   const disable = [...groupCfg.memberDisable, ...config.disable.users]
//   if (disable.length && disable.includes(event.userId)) {
//     data.type = 'memberDisable'
//     data.limit = true
//     return data
//   }

//   /** 通过了全部白名单、用户黑名单 */
//   data.type = 'groupEnable'
//   return data
// }

// /**
//  * 检查是否处于cd中
//  * @param groupId 群号
//  * @param userId 用户号
//  * @param GroupCfg 群配置或botId
//  */
// export const isCD = (groupId: string, userId: string, GroupCfg: GroupGuildFileCfg) => {
//   const groupKey = groupId
//   const userKey = `${groupKey}.${userId}`

//   /** 计时器存在直接返回即可 */
//   if (groupCD[groupKey] || groupUserCD[userKey]) {
//     return true
//   }

//   /** 群CD */
//   if (GroupCfg.cd > 0) {
//     groupCD[groupKey] = setTimeout(() => {
//       delete groupCD[groupKey]
//     }, GroupCfg.cd * 1000)
//   }

//   /** 群个人cd */
//   if (GroupCfg.userCD > 0) {
//     groupUserCD[userKey] = setTimeout(() => {
//       delete groupUserCD[userKey]
//     }, GroupCfg.userCD * 1000)
//   }

//   return false
// }

// /**
//  * 检查是否处于黑白名单
//  * @param groupId 群号
//  * @param userId 用户号
//  * @param GroupCfgOrSelfId 群配置或botId
//  */
// export const isBlackWhite = (groupId: string, userId: string, GroupCfgOrSelfId: GroupGuildFileCfg | string) => {
//   let GroupCfg: GroupGuildFileCfg

//   if (typeof GroupCfgOrSelfId === 'string') {
//     GroupCfg = cfg.groupGuildCfgSync(groupId, GroupCfgOrSelfId)
//   } else {
//     GroupCfg = GroupCfgOrSelfId
//   }

//   if (GroupCfg.memberDisable.includes(userId)) {
//     return true
//   }

//   if (GroupCfg.memberEnable.includes(userId)) {
//     return false
//   }

//   return false
// }
