import { BaseEvent } from './base'

import type {
  NoticeEventSub,
  NoticeOptions,
  ReceiveLikeOptions,
  FriendIncreaseOptions,
  FriendDecreaseOptions,
  PrivatePokeOptions,
  PrivateRecallOptions,
  PrivateFileUploadedOptions,
  GroupPokeOptions,
  GroupRecallOptions,
  GroupFileUploadedOptions,
  GroupCardChangedOptions,
  GroupMemberUniqueTitleChangedOptions,
  GroupHlightsChangedOptions,
  GroupMemberIncreaseOptions,
  GroupMemberDecreaseOptions,
  GroupAdminChangedOptions,
  GroupSignInOptions,
  GroupMemberBanOptions,
  GroupWholeBanOptions,
  GroupMessageReactionOptions,
  GroupLuckKingOptions,
  GroupHonorChangedOptions,
} from '@/types/event'

/**
 * @description 通知事件基类
 * @class NoticeBase
 */
export abstract class NoticeBase extends BaseEvent<'notice'> {
  #event: 'notice'
  #subEvent: NoticeEventSub
  /** 通知内容str */
  tips: string
  /** 事件内容 */
  content: any

  constructor ({
    subEvent,
    eventId,
    rawEvent,
    time,
    contact,
    sender,
    srcReply,
    bot,
  }: NoticeOptions) {
    super({
      subEvent,
      eventId,
      rawEvent,
      time,
      contact,
      sender,
      srcReply,
      bot,
      event: 'notice',
    })

    this.#event = 'notice'
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
 * @description 收到点赞事件
 * @class ReceiveLikeNotice
 */
export class ReceiveLikeNotice extends NoticeBase {
  #subEvent: 'receiveLike'
  #contact: ReceiveLikeOptions['contact']
  #sender: ReceiveLikeOptions['sender']

  constructor (options: ReceiveLikeOptions) {
    super(Object.assign(options, { subEvent: 'receiveLike' as const }))

    this.#subEvent = 'receiveLike'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 好友增加事件
 * @class FriendIncreaseNotice
 */
export class FriendIncreaseNotice extends NoticeBase {
  #subEvent: 'friendIncrease'
  #contact: FriendIncreaseOptions['contact']
  #sender: FriendIncreaseOptions['sender']

  constructor (options: FriendIncreaseOptions) {
    super(Object.assign(options, { subEvent: 'friendIncrease' as const }))

    this.#subEvent = 'friendIncrease'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 好友减少事件
 * @class FriendDecreaseNotice
 */
export class FriendDecreaseNotice extends NoticeBase {
  #subEvent: 'friendDecrease'
  #contact: FriendDecreaseOptions['contact']
  #sender: FriendDecreaseOptions['sender']

  constructor (options: FriendDecreaseOptions) {
    super(Object.assign(options, { subEvent: 'friendDecrease' as const }))

    this.#subEvent = 'friendDecrease'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 收到私聊戳一戳事件
 * @class PrivatePokeNotice
 */
export class PrivatePokeNotice extends NoticeBase {
  #subEvent: 'friendPoke'
  #contact: PrivatePokeOptions['contact']
  #sender: PrivatePokeOptions['sender']

  constructor (options: PrivatePokeOptions) {
    super(Object.assign(options, { subEvent: 'friendPoke' as const }))

    this.#subEvent = 'friendPoke'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 收到私聊撤回事件
 * @class PrivateRecallNotice
 */
export class PrivateRecallNotice extends NoticeBase {
  #subEvent: 'friendRecall'
  #contact: PrivateRecallOptions['contact']
  #sender: PrivateRecallOptions['sender']

  constructor (options: PrivateRecallOptions) {
    super(Object.assign(options, { subEvent: 'friendRecall' as const }))

    this.#subEvent = 'friendRecall'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 收到私聊文件上传事件
 * @class PrivateFileUploadedNotice
 */
export class PrivateFileUploadedNotice extends NoticeBase {
  #subEvent: 'friendFileUploaded'
  #contact: PrivateFileUploadedOptions['contact']
  #sender: PrivateFileUploadedOptions['sender']

  constructor (options: PrivateFileUploadedOptions) {
    super(Object.assign(options, { subEvent: 'friendFileUploaded' as const }))

    this.#subEvent = 'friendFileUploaded'
    this.#contact = options.contact
    this.#sender = options.sender
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

export class GroupNotice extends NoticeBase {
  /**
   * @deprecated 已经弃用 请使用`groupId`
   */
  get group_id () {
    return this.contact.peer
  }

  get groupId () {
    return this.contact.peer
  }
}

/**
 * @description 收到群聊戳一戳事件
 * @class GroupPokeNotice
 */
export class GroupPokeNotice extends GroupNotice {
  #subEvent: 'groupPoke'
  #contact: GroupPokeOptions['contact']
  #sender: GroupPokeOptions['sender']

  constructor (options: GroupPokeOptions) {
    super(Object.assign(options, { subEvent: 'groupPoke' as const }))

    this.#subEvent = 'groupPoke'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 收到群聊撤回事件
 * @class GroupRecallNotice
 */
export class GroupRecallNotice extends GroupNotice {
  #subEvent: 'groupRecall'
  #contact: GroupRecallOptions['contact']
  #sender: GroupRecallOptions['sender']

  constructor (options: GroupRecallOptions) {
    super(Object.assign(options, { subEvent: 'groupRecall' as const }))

    this.#subEvent = 'groupRecall'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 收到群聊文件上传事件
 * @class GroupFileUploadedNotice
 */
export class GroupFileUploadedNotice extends GroupNotice {
  #subEvent: 'groupFileUploaded'
  #contact: GroupFileUploadedOptions['contact']
  #sender: GroupFileUploadedOptions['sender']

  constructor (options: GroupFileUploadedOptions) {
    super(Object.assign(options, { subEvent: 'groupFileUploaded' as const }))

    this.#subEvent = 'groupFileUploaded'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群名片变动事件
 * @class GroupCardChangedNotice
 */
export class GroupCardChangedNotice extends GroupNotice {
  #subEvent: 'groupCardChanged'
  #contact: GroupCardChangedOptions['contact']
  #sender: GroupCardChangedOptions['sender']

  constructor (options: GroupCardChangedOptions) {
    super(Object.assign(options, { subEvent: 'groupCardChanged' as const }))

    this.#subEvent = 'groupCardChanged'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群成员头衔变动事件
 * @class GroupMemberTitleUpdatedNotice
 */
export class GroupMemberTitleUpdatedNotice extends GroupNotice {
  #subEvent: 'groupMemberTitleUpdate'
  #contact: GroupMemberUniqueTitleChangedOptions['contact']
  #sender: GroupMemberUniqueTitleChangedOptions['sender']

  constructor (options: GroupMemberUniqueTitleChangedOptions) {
    super(Object.assign(options, { subEvent: 'groupMemberTitleUpdate' as const }))

    this.#subEvent = 'groupMemberTitleUpdate'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群精华消息变动事件
 * @class GroupHlightsChangedNotice
 */
export class GroupHlightsChangedNotice extends GroupNotice {
  #subEvent: 'groupHighlightsChange'
  #contact: GroupHlightsChangedOptions['contact']
  #sender: GroupHlightsChangedOptions['sender']

  constructor (options: GroupHlightsChangedOptions) {
    super(Object.assign(options, { subEvent: 'groupHighlightsChange' as const }))

    this.#subEvent = 'groupHighlightsChange'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群成员增加事件
 * @class GroupMemberIncreaseNotice
 */
export class GroupMemberIncreaseNotice extends GroupNotice {
  #subEvent: 'groupMemberAdd'
  #contact: GroupMemberIncreaseOptions['contact']
  #sender: GroupMemberIncreaseOptions['sender']

  constructor (options: GroupMemberIncreaseOptions) {
    super(Object.assign(options, { subEvent: 'groupMemberAdd' as const }))

    this.#subEvent = 'groupMemberAdd'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群成员减少事件
 * @class GroupMemberDecreaseNotice
 */
export class GroupMemberDecreaseNotice extends GroupNotice {
  #subEvent: 'groupMemberRemove'
  #contact: GroupMemberDecreaseOptions['contact']
  #sender: GroupMemberDecreaseOptions['sender']

  constructor (options: GroupMemberDecreaseOptions) {
    super(Object.assign(options, { subEvent: 'groupMemberRemove' as const }))

    this.#subEvent = 'groupMemberRemove'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群管理员变动事件
 * @class GroupAdminChangedNotice
 */
export class GroupAdminChangedNotice extends GroupNotice {
  #subEvent: 'groupAdminChanged'
  #contact: GroupAdminChangedOptions['contact']
  #sender: GroupAdminChangedOptions['sender']

  constructor (options: GroupAdminChangedOptions) {
    super(Object.assign(options, { subEvent: 'groupAdminChanged' as const }))

    this.#subEvent = 'groupAdminChanged'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群打卡事件
 * @class GroupSignInNotice
 */
export class GroupSignInNotice extends GroupNotice {
  #subEvent: 'groupSignIn'
  #contact: GroupSignInOptions['contact']
  #sender: GroupSignInOptions['sender']

  constructor (options: GroupSignInOptions) {
    super(Object.assign(options, { subEvent: 'groupSignIn' as const }))

    this.#subEvent = 'groupSignIn'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群成员被禁言事件
 * @class GroupMemberBanNotice
 */
export class GroupMemberBanNotice extends GroupNotice {
  #subEvent: 'groupMemberBan'
  #contact: GroupMemberBanOptions['contact']
  #sender: GroupMemberBanOptions['sender']

  constructor (options: GroupMemberBanOptions) {
    super(Object.assign(options, { subEvent: 'groupMemberBan' as const }))

    this.#subEvent = 'groupMemberBan'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群全员禁言事件
 * @class GroupWholeBanNotice
 */
export class GroupWholeBanNotice extends GroupNotice {
  #subEvent: 'groupWholeBan'
  #contact: GroupWholeBanOptions['contact']
  #sender: GroupWholeBanOptions['sender']

  constructor (options: GroupWholeBanOptions) {
    super(Object.assign(options, { subEvent: 'groupWholeBan' as const }))

    this.#subEvent = 'groupWholeBan'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群表情动态事件
 * @class GroupMessageReactionNotice
 */
export class GroupMessageReactionNotice extends GroupNotice {
  #subEvent: 'groupMessageReaction'
  #contact: GroupMessageReactionOptions['contact']
  #sender: GroupMessageReactionOptions['sender']

  constructor (options: GroupMessageReactionOptions) {
    super(Object.assign(options, { subEvent: 'groupMessageReaction' as const }))

    this.#subEvent = 'groupMessageReaction'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群聊运气王事件
 * @class GroupLuckKingNotice
 */
export class GroupLuckKingNotice extends GroupNotice {
  #subEvent: 'groupLuckyKing'
  #contact: GroupLuckKingOptions['contact']
  #sender: GroupLuckKingOptions['sender']

  constructor (options: GroupLuckKingOptions) {
    super(Object.assign(options, { subEvent: 'groupLuckyKing' as const }))

    this.#subEvent = 'groupLuckyKing'
    this.#contact = options.contact
    this.#sender = options.sender
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
 * @description 群聊荣誉变更事件
 * @class GroupHonorChangedNotice
 */
export class GroupHonorChangedNotice extends GroupNotice {
  #subEvent: 'groupHonorChange'
  #contact: GroupHonorChangedOptions['contact']
  #sender: GroupHonorChangedOptions['sender']

  constructor (options: GroupHonorChangedOptions) {
    super(Object.assign(options, { subEvent: 'groupHonorChange' as const }))

    this.#subEvent = 'groupHonorChange'
    this.#contact = options.contact
    this.#sender = options.sender
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
