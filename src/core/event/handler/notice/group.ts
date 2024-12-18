import { config } from '@/utils'
import { BaseNoticeHandler } from './base'
import * as filter from '@/event/handler/filterList'
import type { GroupGuildFileCfg } from '@/utils/config/types'
import { GroupNoticeEventMap, NoticeEventSubEnum } from '@/event/types/types'

const userCD: Record<string, NodeJS.Timeout> = {}

export class GroupNoticeHandler extends BaseNoticeHandler {
  event: GroupNoticeEventMap[keyof GroupNoticeEventMap]
  eventCfg: GroupGuildFileCfg

  constructor (event: GroupNoticeEventMap[keyof GroupNoticeEventMap]) {
    super(event)
    this.event = event
    this.eventCfg = config.getGroupCfg(this.event.groupId, this.event.selfId)
  }

  /**
   * 检查是否存在cd中
   * @returns `true` 表示通过 没有在CD中
   */
  get cd (): boolean {
    /** 并非所有事件都需要cd */
    const list: string[] = [
      NoticeEventSubEnum.GROUP_POKE,
      NoticeEventSubEnum.GROUP_MESSAGE_REACTION,
    ]

    if (!list.includes(this.event.subEvent)) {
      return true
    }

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

  isLimitEvent () {
    const tips = `[${this.event.groupId}][${this.event.userId}]`
    return filter.allGroupSwarmFilter(this.event, this.eventCfg, this.cd, tips)
  }

  print () {
    this.event.logText = `[private:${this.event.userId}(${this.event.sender.nick || ''})]`
    const text = `[${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.tips}`
    logger.bot('info', this.event.selfId, `${logger.green('群通知: ')}${text}`)
  }

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
        this.event.tips = `文件上传: [fid:${this.event.content.fid}] [url:${this.event.content.url}] [name:${this.event.content.name}]`
        break
      case NoticeEventSubEnum.GROUP_MEMBER_ADD:
        this.event.tips = `新增成员: [操作者:${this.event.content.operatorId}] [目标成员:${this.event.content.targetId}]`
        break
      case NoticeEventSubEnum.GROUP_MEMBER_REMOVE:
        this.event.tips = `移除成员: [操作者:${this.event.content.operatorId}] [目标成员:${this.event.content.targetId}]`
        break
      case NoticeEventSubEnum.GROUP_CARD_CHANGED:
        this.event.tips = `名片变动: [操作者:${this.event.content.operatorId}] [目标成员:${this.event.content.targetId}]`
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
}
