import * as common from '../common'
import { config } from '@start/index'
import { BaseNoticeHandler } from './base'
import type { FriendDirectFileCfg } from '@/utils/config/types'
import { type FriendNoticeEventMap, NoticeEventSubEnum } from '@/event/types/types'

const userCD: Record<string, NodeJS.Timeout> = {}

export class FriendNoticeHandler extends BaseNoticeHandler {
  event: FriendNoticeEventMap[keyof FriendNoticeEventMap]
  eventCfg: FriendDirectFileCfg

  constructor (event: FriendNoticeEventMap[keyof FriendNoticeEventMap]) {
    super(event)
    this.event = event
    this.eventCfg = config.getFriendCfg(this.event.userId, this.event.selfId)
  }

  /**
   * 检查是否存在cd中
   * @returns `true` 表示没有在CD中
   */
  get isCD (): boolean {
    /** 并非所有事件都需要cd */
    const list: string[] = [
      NoticeEventSubEnum.FRIENT_POKE,
      NoticeEventSubEnum.RECEIVE_LIKE,
    ]

    if (!list.includes(this.event.subEvent)) {
      return true
    }

    const userKey = this.event.userId
    /** 计时器存在直接返回即可 */
    if (userCD[userKey]) {
      return true
    }

    /** 用户个人CD */
    if (this.eventCfg.cd > 0) {
      userCD[userKey] = setTimeout(() => {
        delete userCD[userKey]
      }, this.eventCfg.cd * 1000)
    }

    return false
  }

  isLimitEvent () {
    if (this.isCD) {
      common.log(`[${this.event.userId}] 正在冷却中: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedFriendEnable(this.event)) {
      common.log(`[${this.event.userId}] 未通过好友白名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedFriendDisable(this.event)) {
      common.log(`[${this.event.userId}] 未通过好友黑名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedFriendModeNoticeAndRequest(this.event, this.eventCfg)) {
      return false
    }

    return false
  }

  print () {
    this.event.logText = `[private:${this.event.userId}(${this.event.sender.nick || ''})]`
    const text = `[${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.tips}`
    logger.bot('info', this.event.selfId, `${logger.green('好友通知: ')}${text}`)
  }

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
      // this.event.tips = `未知子事件: ${JSON.stringify(this.event)}`
    }
  }
}
