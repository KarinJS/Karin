import lodash from 'lodash'
import { log } from '..'
import { karin } from '@/karin'
import { config as cfg } from '@start/index'
import { createRawMessage } from '@/utils/message'
import { GroupMessage } from '@/event/create/message/group'
import type { ConfigType, GroupGuildFileCfg } from '@/utils/config/types'
import { cache } from '@plugin/cache/cache'
import { CommandClass, CommandFnc } from '@plugin/cache/types'
import { PermissionEnum } from '@/adapter/sender'
import { alias } from '@/utils/message/alias'
import { isAdapter } from '@/utils/message/adapter'

const groupCD: Record<string, NodeJS.Timeout> = {}
const groupUserCD: Record<string, NodeJS.Timeout> = {}

export class GroupHandler {
  event: GroupMessage
  config: ConfigType
  groupCfg: GroupGuildFileCfg
  isPrint: boolean

  constructor (event: GroupMessage) {
    this.event = event
    this.config = cfg.config()
    this.groupCfg = cfg.getGroupCfg(this.event.groupId, this.event.selfId)
    this.isPrint = this.isLogEnable && this.isLogDisable
  }

  init () {
    const { msg, raw } = createRawMessage(this.event.elements)
    this.event.msg = msg
    this.event.rawMessage = raw
    this.print()
    this.admin()
    alias(this.event, this.groupCfg.alias)

    // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉先兼容旧版 2024年10月31日14:33:53
    karin.emit('message', this.event)
    karin.emit('message.group', this.event)
    const isRestricted = this.isRestricted()
    !isRestricted && this.deal()
  }

  /** 检查是否存在cd中 返回`true`表示通过 */
  get isCD (): boolean {
    const groupKey = this.event.groupId
    const userKey = `${groupKey}.${this.event.userId}`

    /** 计时器存在直接返回即可 */
    if (groupCD[groupKey] || groupUserCD[userKey]) {
      return false
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

    return true
  }

  /** 检查是否通过群白名单 返回`true`表示通过 */
  get isGroupEnable () {
    if (!this.config.enable.groups.length) return true
    return this.config.enable.groups.includes(this.event.groupId)
  }

  /** 检查是否通过群黑名单 返回`true`表示通过 */
  get isGroupDisable () {
    if (!this.config.disable.groups.length) return true
    return !this.config.disable.groups.includes(this.event.groupId)
  }

  /** 检查是否通过群成员白名单 返回`true`表示通过 */
  get isMemberEnable () {
    const enable = [...this.groupCfg.memberEnable, ...this.config.enable.users]
    if (!enable.length) return true
    return enable.includes(this.event.userId)
  }

  /** 检查是否通过群成员黑名单 返回`true`表示通过  */
  get isMemberDisable () {
    const disable = [...this.groupCfg.memberDisable, ...this.config.disable.users]
    if (!disable.length) return true
    return !disable.includes(this.event.userId)
  }

  /** 检查是否通过群日志打印白名单 返回`true`表示通过 */
  get isLogEnable () {
    if (!this.config.enable.groups.length) return true
    return this.config.enable.groups.includes(this.event.groupId)
  }

  /** 检查是否通过群日志打印黑名单 返回`true`表示通过 */
  get isLogDisable () {
    if (!this.config.disable.groups.length) return true
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
      log(`[${this.event.groupId}][${this.event.userId}] 未通过群黑名单: ${this.event.messageId}`)
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
    if (this.isPrint) {
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

  /**
   * 检查当前插件是否通过插件白名单 返回`true`表示通过
   * @param plugin 插件对象
   */
  isPluginWhite (plugin: CommandClass | CommandFnc): boolean {
    if (!this.groupCfg.enable.length) return true

    const list = [
      plugin.info.name,
      `${plugin.info.name}:${plugin.file.basename}`,
      `${plugin.info.name}:${plugin.file.method}`,
    ]
    for (const item of list) {
      if (this.groupCfg.enable.includes(item)) {
        return true
      }
    }
    return false
  }

  /**
   * 检查当前插件是否通过插件黑名单 返回`true`表示通过
   * @param plugin 插件对象
   */
  isPluginBlack (plugin: CommandClass | CommandFnc): boolean {
    if (!this.groupCfg.disable.length) return true
    const list = [
      plugin.info.name,
      `${plugin.info.name}:${plugin.file.basename}`,
      `${plugin.info.name}:${plugin.file.method}`,
    ]
    for (const item of list) {
      if (this.groupCfg.disable.includes(item)) {
        return false
      }
    }

    return true
  }

  /**
   * 判断触发用户是否拥有权限
   * @param permission 权限
   */
  filterPermission (permission: `${PermissionEnum}`): boolean {
    if (!permission || permission === 'all') return true

    if (permission === 'master') {
      if (!this.event.isMaster) {
        this.event.reply('暂无权限，只有主人才能操作')
        return false
      }
      return true
    }

    if (permission === 'admin') {
      if (!this.event.isMaster && !this.event.isAdmin) {
        this.event.reply('暂无权限，只有管理员才能操作')
        return false
      }
      return true
    }

    if (this.event.isGroup) {
      const list = {
        'group.owner': {
          role: 'owner',
          name: '群主',
        },
        'group.admin': {
          role: 'admin',
          name: '群管理员',
        },
      } as const

      const role = list[permission as keyof typeof list]
      if (!role) return true
      if (role.role === 'owner' && this.event.sender?.role === 'owner') return true
      if (role.role === 'admin' && (this.event.sender?.role === 'owner' || this.event.sender?.role === 'admin')) return true

      this.event.reply(`暂无权限，只有${role.name}才能操作`)
      return false
    }

    return true
  }

  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.group') continue
      if (plugin.perm === 'guild.admin' || plugin.perm === 'guild.owner') continue
      const reg = plugin.reg
      if (reg && !reg.test(this.event.msg)) continue

      if (isAdapter(plugin, this.event.bot.adapter.protocol)) continue
      if (!this.isPluginWhite(plugin)) continue
      if (!this.isPluginBlack(plugin)) continue

      this.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
      const logFnc = logger.fnc(this.event.logFnc)
      this.isPrint && plugin.log(this.event.selfId, `${logFnc}${this.event.logText} ${lodash.truncate(this.event.msg, { length: 100 })}`)

      /** 计算插件处理时间 */
      const start = Date.now()
      karin.emit('karin:count:fnc', { name: plugin.info.name, file: plugin.file, event: this.event })

      try {
        if (!this.filterPermission(plugin.perm)) return
        let result
        if (plugin.type === 'fnc') {
          result = await plugin.fnc(this.event)
        } else {
          const App = new plugin.Cls()
          if (typeof App?.[plugin.file.method as keyof typeof App] !== 'function') {
            continue
          }

          App.e = this.event
          result = await (App as any)[plugin.file.method](App.e)
        }
        /** 贪婪匹配下一个 */
        if (result === false) {
          logger.debug(`${this.event.logFnc} 继续匹配下一个插件`)
          continue
        }

        return
      } catch (error: any) {
        logger.error(`${this.event.logFnc}`)
        karin.emit('error', error)
        return
      } finally {
        this.isPrint && plugin.log(this.event.selfId, `${logFnc} ${lodash.truncate(this.event.msg, { length: 100 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
      }
    }

    log(`[${this.event.groupId}][${this.event.userId}] 未找到匹配到相应插件: ${this.event.messageId}`)
  }
}
