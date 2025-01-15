import { BaseEvent } from './base'

import type {
  RequestEventSub,
  RequestOptions,
  PrivateApplyRequestOptions,
  GroupApplyRequestOptions,
  GroupInviteRequestOptions,
} from '@/types/event'

/**
 * @description 请求事件基类
 * @class RequestBase
 */
export abstract class RequestBase extends BaseEvent<'request'> {
  #event: 'request'
  #subEvent: RequestEventSub
  /** 通知内容str */
  tips: string
  /** 事件内容 */
  content: unknown

  constructor ({
    subEvent,
    eventId,
    rawEvent,
    time,
    contact,
    sender,
    srcReply,
    bot,
  }: RequestOptions) {
    super({
      subEvent,
      eventId,
      rawEvent,
      time,
      contact,
      sender,
      srcReply,
      bot,
      event: 'request',
    })

    this.#event = 'request'
    this.#subEvent = subEvent

    this.tips = ''
  }

  get event () {
    return this.#event
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 创建好友申请请求事件
 * @class ReceiveLikeNotice
 */
export class PrivateApplyRequest extends RequestBase {
  #subEvent: 'friendApply'
  #contact: PrivateApplyRequestOptions['contact']
  #sender: PrivateApplyRequestOptions['sender']
  content: PrivateApplyRequestOptions['content']

  constructor (options: PrivateApplyRequestOptions) {
    super(Object.assign(options, { subEvent: 'friendApply' as const }))

    this.#subEvent = 'friendApply'
    this.#contact = options.contact
    this.#sender = options.sender
    this.content = options.content
  }

  get subEvent () {
    return this.#subEvent
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get isPrivate (): true {
    return true
  }

  get isFriend (): true {
    return true
  }

  get isGroup (): false {
    return false
  }

  get isGuild (): false {
    return false
  }

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }
}

/**
 * @description 创建入群请求事件
 * @class ReceiveLikeNotice
 */
export class GroupApplyRequest extends RequestBase {
  #subEvent: 'groupApply'
  #contact: GroupApplyRequestOptions['contact']
  #sender: GroupApplyRequestOptions['sender']
  content: GroupApplyRequestOptions['content']

  constructor (options: GroupApplyRequestOptions) {
    super(Object.assign(options, { subEvent: 'groupApply' as const }))

    this.#subEvent = 'groupApply'
    this.#contact = options.contact
    this.#sender = options.sender
    this.content = options.content
  }

  /**
   * @deprecated 已经弃用 请使用`groupId`
   */
  get group_id () {
    return this.contact.peer
  }

  get groupId () {
    return this.contact.peer
  }

  get subEvent () {
    return this.#subEvent
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get isPrivate (): false {
    return false
  }

  get isFriend (): false {
    return false
  }

  get isGroup (): true {
    return true
  }

  get isGuild (): false {
    return false
  }

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }
}

/**
 * @description 创建邀请Bot入群请求事件
 * @class GroupInviteRequest
 */
export class GroupInviteRequest extends RequestBase {
  #subEvent: 'groupInvite'
  #contact: GroupInviteRequestOptions['contact']
  #sender: GroupInviteRequestOptions['sender']
  content: GroupInviteRequestOptions['content']

  constructor (options: GroupInviteRequestOptions) {
    super(Object.assign(options, { subEvent: 'groupInvite' as const }))

    this.#subEvent = 'groupInvite'
    this.#contact = options.contact
    this.#sender = options.sender
    this.content = options.content
  }

  /**
   * @deprecated 已经弃用 请使用`groupId`
   */
  get group_id () {
    return this.contact.peer
  }

  get groupId () {
    return this.contact.peer
  }

  get subEvent () {
    return this.#subEvent
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get isPrivate (): false {
    return false
  }

  get isFriend (): false {
    return false
  }

  get isGroup (): true {
    return true
  }

  get isGuild (): false {
    return false
  }

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }
}
