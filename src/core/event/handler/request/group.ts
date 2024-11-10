import { log } from '..'
import { karin } from '@/karin'
import { config as cfg } from '@start/index'
import { cache } from '@plugin/cache/cache'
import { isAdapter } from '@/utils/message/adapter'
import type { Accept } from '@plugin/cache/types'
import type { ConfigType, GroupGuildFileCfg } from '@/utils/config/types'
import { GroupRequestEventMap, RequestEventSubEnum } from '@/event/types/types'

export class GroupRequestHandler {
  event: GroupRequestEventMap[keyof GroupRequestEventMap]
  config: ConfigType
  GroupCfg: GroupGuildFileCfg

  constructor (event: GroupRequestEventMap[keyof GroupRequestEventMap]) {
    this.event = event
    this.config = cfg.config()
    this.GroupCfg = cfg.getGroupCfg(this.event.groupId, this.event.selfId)
  }

  init () {
    this.tips()
    this.print()
    this.admin()

    // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉先兼容旧版 2024年10月31日14:33:53
    karin.emit('request', this.event)
    karin.emit(`request.${this.event.subEvent}`, this.event)
    const isRestricted = this.isRestricted()
    !isRestricted && this.deal()
    return this
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
    if (!this.isFriendEnable) {
      log(`[${this.event.userId}] 未通过用户白名单: ${this.event.eventId}`)
      return true
    }

    if (!this.isFriendDisable) {
      log(`[${this.event.userId}] 未通过用户黑名单: ${this.event.eventId}`)
      return true
    }

    return false
  }

  /** 构建事件提示 */
  tips () {
    switch (this.event.subEvent) {
      case RequestEventSubEnum.GROUP_INVITE:
        this.event.tips = `邀请加群: ${this.event.content.inviterId} 邀请Bot加入群聊 ${this.event.groupId} flag: ${this.event.content.flag}`
        break
      case RequestEventSubEnum.GROUP_APPLY: {
        const { content } = this.event
        if (!content.inviterId || content.inviterId === content.applierId) {
          this.event.tips = `申请加群: ${content.applierId} 申请加入群聊 ${this.event.groupId} flag: ${content.flag}`
        } else {
          this.event.tips = `申请加群: ${content.inviterId} 邀请 ${content.applierId} 加入群聊 ${this.event.groupId} flag: ${content.flag}`
        }
        break
      }
      default: {
        // this.event.tips = `未知事件: ${this.event.subEvent}`
      }
    }
  }

  /** 打印日志 */
  print () {
    this.event.logText = `[private:${this.event.userId}(${this.event.sender.nick || ''})]`
    const text = `[${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.tips}`
    logger.bot('info', this.event.selfId, `${logger.green('群请求: ')}${text}`)
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
  isPluginWhite (plugin: Accept): boolean {
    if (!this.GroupCfg.enable.length) return true

    const list = [
      plugin.info.name,
      `${plugin.info.name}:${plugin.file.basename}`,
      `${plugin.info.name}:${plugin.file.method}`,
    ]
    for (const item of list) {
      if (this.GroupCfg.enable.includes(item)) {
        return true
      }
    }
    return false
  }

  /**
   * 检查当前插件是否通过插件黑名单 返回`true`表示通过
   * @param plugin 插件对象
   */
  isPluginBlack (plugin: Accept): boolean {
    if (!this.GroupCfg.disable.length) return true
    const list = [
      plugin.info.name,
      `${plugin.info.name}:${plugin.file.basename}`,
      `${plugin.info.name}:${plugin.file.method}`,
    ]
    for (const item of list) {
      if (this.GroupCfg.disable.includes(item)) {
        return false
      }
    }

    return true
  }

  async deal () {
    for (const plugin of cache.accept) {
      if (plugin.event !== this.event.event && plugin.event !== `${this.event.event}.${this.event.subEvent}`) {
        continue
      }

      if (isAdapter(plugin, this.event.bot.adapter.protocol)) continue
      if (!this.isPluginWhite(plugin)) continue
      if (!this.isPluginBlack(plugin)) continue

      this.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
      const logFnc = logger.fnc(this.event.logFnc)
      plugin.log(this.event.selfId, `${logFnc}${this.event.logText}`)

      /** 计算插件处理时间 */
      const start = Date.now()
      karin.emit('karin:count:fnc', { name: plugin.info.name, file: plugin.file, event: this.event })

      try {
        const result = await plugin.fnc(this.event)

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
        plugin.log(this.event.selfId, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
      }
    }

    log(`[${this.event.userId}] 未找到匹配到相应插件: ${this.event.eventId}`)
  }
}
