import lodash from 'lodash'
import { log } from '..'
import { karin } from '@/karin'
import { config as cfg } from '@start/index'
import { createRawMessage } from '@/utils/message'
import type { ConfigType, FriendDirectFileCfg } from '@/utils/config/types'
import { cache } from '@plugin/cache/cache'
import { CommandClass, CommandFnc } from '@plugin/cache/types'
import { PermissionEnum } from '@/adapter/sender'
import { FriendMessage } from '@/event/create/message/friend'
import { alias } from '@/utils/message/alias'
import { isAdapter } from '@/utils/message/adapter'

const userCD: Record<string, NodeJS.Timeout> = {}

export class FriendHandler {
  event: FriendMessage
  config: ConfigType
  friendCfg: FriendDirectFileCfg

  constructor (event: FriendMessage) {
    this.event = event
    this.config = cfg.ConfigSync()
    this.friendCfg = cfg.friendDirectCfgSync(this.event.userId, this.event.selfId)
  }

  init () {
    const { msg, raw } = createRawMessage(this.event.elements)
    this.event.msg = msg
    this.event.rawMessage = raw
    this.print()
    this.admin()
    alias(this.event, this.friendCfg.alias)

    // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉先兼容旧版 2024年10月31日14:33:53
    karin.emit('message', this.event)
    karin.emit('message.friend', this.event)
    const isRestricted = this.isRestricted()
    !isRestricted && this.deal()
  }

  /** 检查是否存在cd中 */
  get isCD (): boolean {
    const userKey = this.event.userId
    /** 计时器存在直接返回即可 */
    if (userCD[userKey]) {
      return true
    }

    /** 用户个人CD */
    if (this.friendCfg.cd > 0) {
      userCD[userKey] = setTimeout(() => {
        delete userCD[userKey]
      }, this.friendCfg.cd * 1000)
    }

    return false
  }

  /** 检查是否通过好友白名单 */
  get isFriendEnable () {
    if (!this.config.enable.users.length) return true
    return this.config.enable.users.includes(this.event.userId)
  }

  /** 检查是否通过好友黑名单 */
  get isFriendDisable () {
    if (!this.config.disable.users.length) return true
    return !this.config.disable.users.includes(this.event.userId)
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示事件受限，`false` 表示事件未受限
   */
  isRestricted () {
    if (this.isCD) {
      log(`[${this.event.userId}] 正在冷却中: ${this.event.messageId}`)
      return true
    }

    if (!this.isFriendEnable) {
      log(`[${this.event.userId}] 未通过好友白名单: ${this.event.messageId}`)
      return true
    }

    if (!this.isFriendDisable) {
      log(`[${this.event.userId}] 未通过好友黑名单: ${this.event.messageId}`)
      return true
    }

    if (this.friendCfg.mode === 0) {
      return false
    }

    if (this.friendCfg.mode === 2 && !this.event.isAdmin && !this.event.isMaster) {
      log(`[${this.event.userId}] 当前响应模式仅允许管理员使用: ${this.event.messageId}`)
      return true
    }

    if (this.friendCfg.mode === 3 && !this.event.alias) {
      log(`[${this.event.userId}] 当前响应模式仅允许Bot别名触发使用: ${this.event.messageId}`)
      return true
    }

    if (this.friendCfg.mode === 5 && !this.event.isAdmin && !this.event.isMaster && !this.event.alias && !this.event.atBot) {
      log(`[${this.event.userId}] 当前响应模式管理员无限制，非管理员仅可通过别名触发使用: ${this.event.messageId}`)
      return true
    }

    if (this.friendCfg.mode === 6 && !this.event.isMaster) {
      log(`[${this.event.userId}] 当前响应模式仅允许主人使用: ${this.event.messageId}`)
      return true
    }

    return false
  }

  /** 打印日志 */
  print () {
    this.event.logText = `[friend:${this.event.userId}(${this.event.sender.nick || ''})]`
    logger.bot('info', this.event.selfId, `好友消息: [${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.rawMessage}`)
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
    if (!this.friendCfg.enable.length) return true

    const list = [
      plugin.info.name,
      `${plugin.info.name}:${plugin.file.basename}`,
      `${plugin.info.name}:${plugin.file.method}`,
    ]
    for (const item of list) {
      if (this.friendCfg.enable.includes(item)) {
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
    if (!this.friendCfg.disable.length) return true
    const list = [
      plugin.info.name,
      `${plugin.info.name}:${plugin.file.basename}`,
      `${plugin.info.name}:${plugin.file.method}`,
    ]
    for (const item of list) {
      if (this.friendCfg.disable.includes(item)) {
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

    return true
  }

  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.friend') continue
      /** 好友场景只有这三种权限 非这三种一律跳过 */
      if (plugin.perm !== 'all' && plugin.perm !== 'master' && plugin.perm !== 'admin') continue

      const reg = plugin.reg
      if (reg && !reg.test(this.event.msg)) continue

      if (isAdapter(plugin, this.event.bot.adapter.protocol)) continue
      if (!this.isPluginWhite(plugin)) continue
      if (!this.isPluginBlack(plugin)) continue

      this.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
      const logFnc = logger.fnc(this.event.logFnc)
      plugin.log(this.event.selfId, `${logFnc}${this.event.logText} ${lodash.truncate(this.event.msg, { length: 100 })}`)

      /** 计算插件处理时间 */
      const start = Date.now()
      karin.emit('karin:count:fnc', this.event)

      try {
        if (!this.filterPermission(plugin.perm)) return
        let result
        if (plugin.type === 'fnc') {
          result = await plugin.fnc(this.event)
        } else {
          const App = new plugin.Cls()
          App.e = this.event
          result = await (App as any)[plugin.file.method](App.e)
        }
        /** 贪婪匹配下一个 */
        if (result === false) continue
        return
      } catch (error: any) {
        logger.error(`${this.event.logFnc}`)
        karin.emit('error', error)
        return
      } finally {
        plugin.log(this.event.selfId, `${logFnc} ${lodash.truncate(this.event.msg, { length: 100 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
      }
    }

    log(`[${this.event.userId}] 未找到匹配到相应插件: ${this.event.messageId}`)
  }
}
