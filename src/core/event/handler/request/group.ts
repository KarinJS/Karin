import * as common from '../common'
import { config } from '@main/index'
import { BaseRequestHandler } from './base'
import { GroupRequestEventMap, RequestEventSubEnum } from '@/event/types/types'
import type { GroupGuildFileCfg } from '@/utils/config/types'

/**
 * @description 群聊请求事件处理器
 * @class GroupRequestHandler
 */
export class GroupRequestHandler extends BaseRequestHandler {
  event: GroupRequestEventMap[keyof GroupRequestEventMap]
  eventCfg: GroupGuildFileCfg

  constructor (event: GroupRequestEventMap[keyof GroupRequestEventMap]) {
    super(event)
    this.event = event
    this.eventCfg = config.getGroupCfg(this.event.groupId, this.event.selfId)
  }

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

  print () {
    this.event.logText = `[group:${this.event.userId}(${this.event.sender.nick || ''})]`
    const text = `[${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.tips}`
    logger.bot('info', this.event.selfId, `${logger.green('群请求: ')}${text}`)
  }

  isLimitEvent () {
    if (!common.isLimitedGroupEnable(this.event)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群白名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedGroupDisable(this.event)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群黑名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedMemberEnable(this.event, this.eventCfg)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群成员白名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedMemberDisable(this.event, this.eventCfg)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群成员黑名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedGroupModeNoticeAndRequest(this.event, this.eventCfg)) {
      return false
    }

    return false
  }
}
