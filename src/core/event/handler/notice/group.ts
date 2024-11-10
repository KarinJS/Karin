import { log } from '..'
import { karin } from '@/karin'
import { config as cfg } from '@start/index'
import { cache } from '@plugin/cache/cache'
import { isAdapter } from '@/utils/message/adapter'
import type { Accept } from '@plugin/cache/types'
import type { ConfigType, GroupGuildFileCfg } from '@/utils/config/types'
import { GroupNoticeEventMap, NoticeEventSubEnum } from '@/event/types/types'

const userCD: Record<string, NodeJS.Timeout> = {}

export class GroupNoticeHandler {
  event: GroupNoticeEventMap[keyof GroupNoticeEventMap]
  config: ConfigType
  GroupCfg: GroupGuildFileCfg

  constructor (event: GroupNoticeEventMap[keyof GroupNoticeEventMap]) {
    this.event = event
    this.config = cfg.config()
    this.GroupCfg = cfg.getGroupCfg(this.event.groupId, this.event.selfId)
  }

  init () {
    this.tips()
    this.print()
    this.admin()

    // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉先兼容旧版 2024年10月31日14:33:53
    karin.emit('notice', this.event)
    karin.emit(`notice.${this.event.subEvent}`, this.event)
    const isRestricted = this.isRestricted()
    !isRestricted && this.deal()
    return this
  }

  /** 检查是否存在cd中 */
  get isCD (): boolean {
    /** 并非所有事件都需要cd */
    const list: string[] = [
      NoticeEventSubEnum.GROUP_POKE,
      NoticeEventSubEnum.GROUP_MESSAGE_REACTION,
    ]
    const userKey = this.event.userId
    /** 计时器存在直接返回即可 */
    if (userCD[userKey] && list.includes(this.event.subEvent)) {
      return true
    }

    /** 用户个人CD */
    if (this.GroupCfg.cd > 0) {
      userCD[userKey] = setTimeout(() => {
        delete userCD[userKey]
      }, this.GroupCfg.cd * 1000)
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
      log(`[${this.event.userId}] 正在冷却中: ${this.event.eventId}`)
      return true
    }

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
      case NoticeEventSubEnum.GROUP_POKE:
        this.event.tips = `戳一戳: ${this.event.content.operatorId} ${this.event.content.action || '戳了戳'} ${this.event.content.targetId}`
        break
      case NoticeEventSubEnum.GROUP_MESSAGE_REACTION:
        this.event.tips = `表情动态: 给消息 ${this.event.content.messageId} ${this.event.content.isSet ? '添加' : '取消'}了表情 ${this.event.content.faceId}`
        break
      case NoticeEventSubEnum.GROUP_RECALL:
        this.event.tips = `撤回消息: ${this.event.content.messageId}`
        break
      case NoticeEventSubEnum.GROUP_FILE_UPLOADED:
        this.event.tips = `文件上传: [fid:${this.event.content.fid}][url:${this.event.content.url}][name:${this.event.content.name}]`
        break
      case NoticeEventSubEnum.GROUP_MEMBER_ADD:
        this.event.tips = `新增成员: [操作者:${this.event.content.operatorId}][目标成员:${this.event.content.targetId}]`
        break
      case NoticeEventSubEnum.GROUP_MEMBER_REMOVE:
        this.event.tips = `移除成员: [操作者:${this.event.content.operatorId}][目标成员:${this.event.content.targetId}]`
        break
      case NoticeEventSubEnum.GROUP_CARD_CHANGED:
        this.event.tips = `名片变动: [操作者:${this.event.content.operatorId}][目标成员:${this.event.content.targetId}]`
        break
      case NoticeEventSubEnum.GROUP_ADMIN_CHANGED:
        this.event.tips = `管理员变动: ${this.event.content.targetId} 被${this.event.content.isAdmin ? '设置' : '取消'}管理员`
        break
      case NoticeEventSubEnum.GROUP_SIGN_IN:
        this.event.tips = `签到: ${this.event.content.targetId}`
        break
      case NoticeEventSubEnum.GROUP_MEMBER_TITLE_UPDATED:
        this.event.tips = `头衔变动: ${this.event.content.title}`
        break
      case NoticeEventSubEnum.GROUP_HONOR_CHANGE:
        this.event.tips = `荣誉变更: ${this.event.userId} 获得了 ${this.event.content.honorType} 荣誉`
        break
      case NoticeEventSubEnum.GROUP_LUCKY_KING:
        this.event.tips = `运气王: ${this.event.content.userId} 从 ${this.event.content.userId} 发的红包中获得了运气王`
        break
      case NoticeEventSubEnum.GROUP_HIGHLIGHTS_CHANGED: {
        if (this.event.content.isSet) {
          this.event.tips = `设置精华: ${this.event.content.operatorId} 将 ${this.event.content.messageId} 设置为精华消息`
        } else {
          this.event.tips = `取消精华: ${this.event.content.operatorId} 将 ${this.event.content.messageId} 取消精华消息`
        }
        break
      }
      case NoticeEventSubEnum.GROUP_MEMBER_BAN: {
        if (this.event.content.isBan) {
          this.event.tips = `禁言成员: ${this.event.content.operatorId} 将 ${this.event.content.targetId} 禁言 ${this.event.content.duration}秒`
        } else {
          this.event.tips = `解除禁言: ${this.event.content.operatorId} 解除了 ${this.event.content.targetId} 的禁言`
        }
        break
      }
      case NoticeEventSubEnum.GROUP_WHOLE_BAN: {
        if (this.event.content.isBan) {
          this.event.tips = `全员禁言: ${this.event.content.operatorId}`
        } else {
          this.event.tips = `解除全员禁言: ${this.event.content.operatorId}`
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
    logger.bot('info', this.event.selfId, `${logger.green('群通知: ')}${text}`)
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
