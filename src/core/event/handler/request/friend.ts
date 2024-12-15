import { config } from '@/utils'
import { BaseRequestHandler } from './base'
import * as filter from '@/event/handler/filterList'
import { FriendRequestEventMap, RequestEventSubEnum } from '@/event/types/types'
import type { FriendDirectFileCfg } from '@/utils/config/types'

/**
 * @description 好友请求事件处理器
 * @class PrivateApplyRequest
 */
export class FriendRequestHandler extends BaseRequestHandler {
  event: FriendRequestEventMap[keyof FriendRequestEventMap]
  eventCfg: FriendDirectFileCfg

  constructor (event: FriendRequestEventMap[keyof FriendRequestEventMap]) {
    super(event)
    this.event = event
    this.eventCfg = config.getFriendCfg(this.event.userId, this.event.selfId)
  }

  isLimitEvent () {
    const tips = `[${this.event.userId}]`
    return filter.allFriendSwarmFilter(this.event, this.eventCfg, false, tips)
  }

  tips () {
    switch (this.event.subEvent) {
      case RequestEventSubEnum.FRIEND:
        this.event.tips = `好友申请: [申请者:${this.event.content.applierId}][${this.event.content.flag}] ${this.event.content.message}`
        break
      default:
      // this.event.tips = `未知子事件: ${JSON.stringify(this.event)}`
    }
  }

  print () {
    this.event.logText = `[private:${this.event.userId}(${this.event.sender.nick || ''})]`
    const text = `[${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.tips}`
    logger.bot('info', this.event.selfId, `${logger.green('好友请求: ')}${text}`)
  }
}
