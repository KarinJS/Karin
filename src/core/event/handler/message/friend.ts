import lodash from 'lodash'
import * as common from '../common'
import { cache } from '@plugin/cache/cache'
import { config as cfg } from '@start/index'
import { createRawMessage } from '@/utils/message'
import { PermissionEnum } from '@/adapter/sender'
import type { FriendMessage } from '@/event/create/message/friend'
import type { ConfigType, FriendDirectFileCfg } from '@/utils/config/types'

/** 用户个人CD */
const userCD: Record<string, NodeJS.Timeout> = {}

/**
 * @description 好友消息处理器
 * @class FriendHandler
 */
export class FriendHandler {
  event: FriendMessage
  config: ConfigType
  eventCfg: FriendDirectFileCfg

  constructor (event: FriendMessage) {
    this.event = event
    this.config = cfg.config()
    this.eventCfg = cfg.getFriendCfg(this.event.userId, this.event.selfId)
  }

  init () {
    const data = createRawMessage(this.event.elements)
    this.event.msg = data.msg
    this.event.rawMessage = data.raw

    this.print()
    common.setEventRole(this.event)
    common.alias(this.event, this.eventCfg.alias)
    common.emit(this.event)
    this.isLimitEvent() && this.deal()
    return this
  }

  /**
   * 检查是否存在cd中
   * @returns `true` 表示没有在CD中
   */
  get isCD (): boolean {
    const userKey = this.event.userId
    if (userCD[userKey]) {
      return false
    }

    if (this.eventCfg.cd > 0) {
      userCD[userKey] = setTimeout(() => {
        delete userCD[userKey]
      }, this.eventCfg.cd * 1000)
    }

    return true
  }

  /**
   * 打印好友消息日志
   * @returns 无返回值
   */
  print () {
    this.event.logText = `[friend:${this.event.userId}(${this.event.sender.nick || ''})]`
    logger.bot('info', this.event.selfId, `好友消息: [${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.rawMessage}`)
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示通过
   */
  isLimitEvent () {
    if (!this.isCD) {
      common.log(`[${this.event.userId}] 正在冷却中: ${this.event.messageId}`)
      return false
    }

    if (!common.isLimitedFriendEnable(this.event)) {
      common.log(`[${this.event.userId}] 未通过好友白名单: ${this.event.messageId}`)
      return false
    }

    if (!common.isLimitedFriendDisable(this.event)) {
      common.log(`[${this.event.userId}] 未通过好友黑名单: ${this.event.messageId}`)
      return false
    }

    if (!common.isLimitedFriendMode(this.event, this.eventCfg)) {
      return false
    }

    return true
  }

  /**
   * 判断触发用户是否拥有权限
   * @param permission 权限
   * @returns `true` 表示拥有权限
   */
  permission (permission: `${PermissionEnum}`): boolean {
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

  /**
   * 分发事件给插件处理
   * @returns 无返回值
   */
  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.friend') continue
      /** 好友场景只有这三种权限 非这三种一律跳过 */
      if (plugin.perm !== 'all' && plugin.perm !== 'master' && plugin.perm !== 'admin') continue

      const reg = plugin.reg
      if (reg && !reg.test(this.event.msg)) continue
      if (!common.adapterLimited(plugin, this.event.bot.adapter.protocol)) continue
      if (!common.isLimitedPluginEnable(plugin, this.eventCfg)) continue
      if (!common.isLimitedPluginDisable(plugin, this.eventCfg)) continue

      this.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
      const logFnc = logger.fnc(this.event.logFnc)
      plugin.log(this.event.selfId, `${logFnc}${this.event.logText} ${lodash.truncate(this.event.msg, { length: 100 })}`)

      /** 计算插件处理时间 */
      const start = Date.now()
      common.addEventCount(plugin, this.event)

      try {
        if (!this.permission(plugin.perm)) return

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
        common.emitError(error)
        return
      } finally {
        plugin.log(this.event.selfId, `${logFnc} ${lodash.truncate(this.event.msg, { length: 100 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
      }
    }

    common.log(`[${this.event.userId}] 未找到匹配到相应插件: ${this.event.messageId}`)
  }
}
