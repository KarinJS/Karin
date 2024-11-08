import { log } from '..'
import { karin } from '@/karin'
import { config as cfg } from '@start/index'
import { cache } from '@plugin/cache/cache'
import { isAdapter } from '@/utils/message/adapter'
import { FriendNoticeEventMap, NoticeEventSubEnum } from '@/event/types/types'
import type { Accept } from '@plugin/cache/types'
import type { ConfigType, FriendDirectFileCfg } from '@/utils/config/types'

const userCD: Record<string, NodeJS.Timeout> = {}

export interface FriendNoticeHandlerType {

}

export class FriendNoticeHandle {
  event: FriendNoticeEventMap[keyof FriendNoticeEventMap]
  config: ConfigType
  friendCfg: FriendDirectFileCfg

  constructor (event: FriendNoticeEventMap[keyof FriendNoticeEventMap]) {
    this.event = event
    this.config = cfg.config()
    this.friendCfg = cfg.getFriendCfg(this.event.userId, this.event.selfId)
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
  }

  /** 检查是否存在cd中 */
  get isCD (): boolean {
    /** 并非所有事件都需要cd */
    const list: string[] = [
      NoticeEventSubEnum.FRIENT_POKE,
      NoticeEventSubEnum.RECEIVE_LIKE,
    ]
    const userKey = this.event.userId
    /** 计时器存在直接返回即可 */
    if (userCD[userKey] && list.includes(this.event.subEvent)) {
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
      case NoticeEventSubEnum.FRIENT_POKE:
        this.event.tips = `戳一戳: ${this.event.content.operatorId} ${this.event.content.action || '戳了戳'} ${this.event.content.targetId}`
        break
      case NoticeEventSubEnum.RECEIVE_LIKE:
        this.event.tips = `收到点赞: ${this.event.content.count}`
        break
      case NoticeEventSubEnum.FRIEND_RECALL:
        this.event.tips = `撤回消息: ${this.event.content.messageId}`
        break
      case NoticeEventSubEnum.FRIEND_FILE_UPLOADED:
        this.event.tips = `文件上传: [fid:${this.event.content.fid}][url:${this.event.content.url}][name:${this.event.content.name}]`
        break
      case NoticeEventSubEnum.FRIEND_INCREASE:
        this.event.tips = `新增好友: ${this.event.content.targetId}`
        break
      case NoticeEventSubEnum.FRIEND_DECREASE:
        this.event.tips = `好友减少: ${this.event.content.targetId}`
        break
      default:
        this.event.tips = `未知子事件: ${JSON.stringify(this.event)}`
    }
  }

  /** 打印日志 */
  print () {
    this.event.logText = `[private:${this.event.userId}(${this.event.sender.nick || ''})]`
    const text = `[${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.tips}`
    logger.bot('info', this.event.selfId, `${logger.green('私聊通知: ')}${text}`)
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
  isPluginBlack (plugin: Accept): boolean {
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
