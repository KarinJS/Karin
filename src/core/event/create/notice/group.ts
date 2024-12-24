import { GroupNoticeHandler } from '@/event/handler/notice/group'
import { NoticeBase, NoticeOptions } from '@/event/create/notice/base'
import { NoticeEventSubEnum } from '@/event/types/types'

/** 群聊通知事件联合类型 */
export type GroupNotice =
  GroupRecallNotice
  | GroupPokeNotice
  | GroupFileUploadedNotice
  | GroupCardChangedNotice
  | GroupMemberTitleUpdatedNotice
  | GroupHlightsChangedNotice
  | GroupMemberIncreaseNotice
  | GroupMemberDecreaseNotice
  | GroupAdminChangedNotice
  | GroupSignInNotice
  | GroupMemberBanNotice
  | GroupWholeBanNotice
  | GroupMessageReactionNotice
  | GroupLuckKingNotice
  | GroupHonorChangedNotice

/** 群聊戳一戳 */
export interface GroupPokeType {
  /** 操作者id */
  operatorId: string
  /** 操作名称，如“戳了戳” */
  action: string
  /** 后缀，未设置则未空字符串 */
  suffix: string
  /** 操作图标url */
  actionImage: string
  /** 被戳目标id */
  targetId: string
}

/**
 * 群聊撤回
 * 撤回自己消息时，operator和target为自己
 * 撤回别人消息时，operator为操作者，target为被撤回者
 */
export interface GroupRecallType {
  /** 操作者id */
  operatorId: string
  /** 目标id 撤回自己消息为自己 否则是被撤回者 */
  targetId: string
  /** 撤回的消息id */
  messageId: string
  /** 操作提示，如“撤回了一条消息”  一般此项为空字符串 */
  tip: string
}

/**
 * 群文件上传
 * 文件信息最少需要提供一个url
 */
export interface GroupFileUploadedType {
  /** 文件ID */
  fid: string
  /** 文件子ID */
  subId: number
  /** 文件名 */
  name: string
  /** 文件大小 */
  size: number
  /** 过期时间 */
  expireTime?: number
  /** 文件URL */
  url?: string
}

/** 群名片变动 */
export interface GroupCardChangedType {
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 新名片 */
  newCard: string
}

/** 群成员头衔变动 */
export interface GroupMemberUniqueTitleChangedType {
  /** 目标id */
  targetId: string
  /** 新头衔 */
  title: string
}

/** 群精华消息变动 */
export interface GroupHlightsChangedType {
  /** 操作者id */
  operatorId: string
  /** 发送者id */
  senderId: string
  /** 被操作的消息id */
  messageId: string
  /** 设置、取消精华 */
  isSet: boolean
}

/** 群成员增加 */
export interface GroupMemberIncreaseType {
  /** 操作者id */
  operatorId: string
  /** 加入者id */
  targetId: string
  /** 加入方式 APPROVE:管理员批准 INVITE:管理员邀请 */
  type: 'invite' | 'approve'
}

/** 群成员减少 */
export interface GroupMemberDecreaseType {
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 减少方式 leave:主动退群 kick:成员被踢 kickBot:机器人自身被踢 */
  type: 'leave' | 'kick' | 'kickBot'
}

/** 群管理员变动 */
export interface GroupAdminChangedType {
  /** 目标id */
  targetId: string
  /** 设置、取消管理员 */
  isAdmin: boolean
}

/** 群打卡 */
export interface GroupSignInType {
  /** 目标id */
  targetId: string
  /** 操作名称，如“打卡了” */
  action: string
  /** 打卡图标url */
  rankImage: string
}

/** 群成员被禁言 */
export interface GroupMemberBanType {
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 禁言时长，单位秒 */
  duration: number
  /** 是否为禁言 */
  isBan: boolean
}

/** 群全员禁言 */
export interface GroupWholeBanType {
  /** 操作者id */
  operatorId: string
  /** 是否开启全体禁言 */
  isBan: boolean
}

/** 群表情动态 */
export interface GroupMessageReactionType {
  /** 消息ID */
  messageId: string
  /** 表情ID 参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType */
  faceId: number
  /** 数量 */
  count: number
  /** 添加、取消回应 */
  isSet: boolean
}

/** 群聊运气王 */
export interface GroupLuckKingType {
  /** 红包发送者id */
  userId: string
  /** 运气王id */
  targetId: string
}

/** 群聊荣誉变更事件 */
export interface GroupHonorChangedType {
  /** 荣誉类型，分别表示龙王、群聊之火、快乐源泉 */
  honorType: 'talkative' | 'performer' | 'emotion'
}

class GroupNoticeBase extends NoticeBase {
  /** 群ID */
  get groupId () {
    return this.contact.peer
  }

  /** @deprecated 已废弃 请使用`groupId` */
  get group_id () {
    return this.groupId
  }
}

/**
 * @description 群聊戳一戳事件
 * @class GroupPokeNotice
 */
export class GroupPokeNotice extends GroupNoticeBase {
  content: GroupPokeType
  #subEvent: NoticeEventSubEnum.GROUP_POKE
  constructor (options: NoticeOptions, content: GroupPokeType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_POKE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群聊撤回消息事件
 * @class GroupRecallNotice
 */
export class GroupRecallNotice extends GroupNoticeBase {
  content: GroupRecallType
  #subEvent: NoticeEventSubEnum.GROUP_RECALL
  constructor (options: NoticeOptions, content: GroupRecallType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_RECALL
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群聊文件上传事件
 * @class GroupFileUploadedNotice
 */
export class GroupFileUploadedNotice extends GroupNoticeBase {
  content: GroupFileUploadedType
  #subEvent: NoticeEventSubEnum.GROUP_FILE_UPLOADED
  constructor (options: NoticeOptions, content: GroupFileUploadedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_FILE_UPLOADED
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群名片变动事件
 * @class GroupCardChangedNotice
 */
export class GroupCardChangedNotice extends GroupNoticeBase {
  content: GroupCardChangedType
  #subEvent: NoticeEventSubEnum.GROUP_CARD_CHANGED
  constructor (options: NoticeOptions, content: GroupCardChangedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_CARD_CHANGED
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群成员头衔变动事件
 * @class GroupMemberUniqueTitleChangedNotice
 */
export class GroupMemberTitleUpdatedNotice extends GroupNoticeBase {
  content: GroupMemberUniqueTitleChangedType
  #subEvent: NoticeEventSubEnum.GROUP_MEMBER_TITLE_UPDATED
  constructor (options: NoticeOptions, content: GroupMemberUniqueTitleChangedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_MEMBER_TITLE_UPDATED
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群精华消息变动事件
 * @class GroupEssenceChangedNotice
 */
export class GroupHlightsChangedNotice extends GroupNoticeBase {
  content: GroupHlightsChangedType
  #subEvent: NoticeEventSubEnum.GROUP_HIGHLIGHTS_CHANGED
  constructor (options: NoticeOptions, content: GroupHlightsChangedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_HIGHLIGHTS_CHANGED
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群成员增加事件
 * @class GroupMemberIncreaseNotice
 */
export class GroupMemberIncreaseNotice extends GroupNoticeBase {
  content: GroupMemberIncreaseType
  #subEvent: NoticeEventSubEnum.GROUP_MEMBER_ADD
  constructor (options: NoticeOptions, content: GroupMemberIncreaseType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_MEMBER_ADD
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群成员减少事件
 * @class GroupMemberDecreaseNotice
 */
export class GroupMemberDecreaseNotice extends GroupNoticeBase {
  content: GroupMemberDecreaseType
  #subEvent: NoticeEventSubEnum.GROUP_MEMBER_REMOVE
  constructor (options: NoticeOptions, content: GroupMemberDecreaseType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_MEMBER_REMOVE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群管理员变动事件
 * @class GroupAdminChangedNotice
 */
export class GroupAdminChangedNotice extends GroupNoticeBase {
  content: GroupAdminChangedType
  #subEvent: NoticeEventSubEnum.GROUP_ADMIN_CHANGED
  constructor (options: NoticeOptions, content: GroupAdminChangedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_ADMIN_CHANGED
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群打卡事件
 * @class GroupSignInNotice
 */
export class GroupSignInNotice extends GroupNoticeBase {
  content: GroupSignInType
  #subEvent: NoticeEventSubEnum.GROUP_SIGN_IN
  constructor (options: NoticeOptions, content: GroupSignInType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_SIGN_IN
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群成员被禁言事件
 * @class GroupMemberBanNotice
 */
export class GroupMemberBanNotice extends GroupNoticeBase {
  content: GroupMemberBanType
  #subEvent: NoticeEventSubEnum.GROUP_MEMBER_BAN
  constructor (options: NoticeOptions, content: GroupMemberBanType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_MEMBER_BAN
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群全员禁言事件
 * @class GroupWholeBanNotice
 */
export class GroupWholeBanNotice extends GroupNoticeBase {
  content: GroupWholeBanType
  #subEvent: NoticeEventSubEnum.GROUP_WHOLE_BAN
  constructor (options: NoticeOptions, content: GroupWholeBanType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_WHOLE_BAN
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群表情动态事件
 * @class GroupMessageReactionNotice
 */
export class GroupMessageReactionNotice extends GroupNoticeBase {
  content: GroupMessageReactionType
  #subEvent: NoticeEventSubEnum.GROUP_MESSAGE_REACTION
  constructor (options: NoticeOptions, content: GroupMessageReactionType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_MESSAGE_REACTION
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群聊运气王事件
 * @class GroupLuckKingNotice
 */
export class GroupLuckKingNotice extends GroupNoticeBase {
  content: GroupLuckKingType
  #subEvent: NoticeEventSubEnum.GROUP_LUCKY_KING
  constructor (options: NoticeOptions, content: GroupLuckKingType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_LUCKY_KING
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 群聊荣誉变更事件
 * @class GroupHonorChangedNotice
 */
export class GroupHonorChangedNotice extends GroupNoticeBase {
  content: GroupHonorChangedType
  #subEvent: NoticeEventSubEnum.GROUP_HONOR_CHANGE
  constructor (options: NoticeOptions, content: GroupHonorChangedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.GROUP_HONOR_CHANGE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 创建群聊戳一戳事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupPokeNotice = (options: NoticeOptions, content: GroupPokeType) => {
  const event = new GroupPokeNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群聊撤回消息事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupRecallNotice = (options: NoticeOptions, content: GroupRecallType) => {
  const event = new GroupRecallNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群文件上传事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupFileUploadedNotice = (options: NoticeOptions, content: GroupFileUploadedType) => {
  const event = new GroupFileUploadedNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群名片变动事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupCardChangedNotice = (options: NoticeOptions, content: GroupCardChangedType) => {
  const event = new GroupCardChangedNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群成员头衔变动事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupMemberTitleUpdatedNotice = (options: NoticeOptions, content: GroupMemberUniqueTitleChangedType) => {
  const event = new GroupMemberTitleUpdatedNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群精华消息变动事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupHlightsChangedNotice = (options: NoticeOptions, content: GroupHlightsChangedType) => {
  const event = new GroupHlightsChangedNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群成员增加事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupMemberAddNotice = (options: NoticeOptions, content: GroupMemberIncreaseType) => {
  const event = new GroupMemberIncreaseNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群成员减少事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupMemberDelNotice = (options: NoticeOptions, content: GroupMemberDecreaseType) => {
  const event = new GroupMemberDecreaseNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群管理员变动事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupAdminChangedNotice = (options: NoticeOptions, content: GroupAdminChangedType) => {
  const event = new GroupAdminChangedNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群打卡事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupSignInNotice = (options: NoticeOptions, content: GroupSignInType) => {
  const event = new GroupSignInNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群成员被禁言事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupMemberBanNotice = (options: NoticeOptions, content: GroupMemberBanType) => {
  const event = new GroupMemberBanNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群全员禁言事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupWholeBanNotice = (options: NoticeOptions, content: GroupWholeBanType) => {
  const event = new GroupWholeBanNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群表情动态事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupMessageReactionNotice = (options: NoticeOptions, content: GroupMessageReactionType) => {
  const event = new GroupMessageReactionNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群聊运气王事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupLuckKingNotice = (options: NoticeOptions, content: GroupLuckKingType) => {
  const event = new GroupLuckKingNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

/**
 * @description 创建群聊荣誉变更事件
 * @param type 事件子类型
 * @param content 事件内容
 * @param options 事件参数
 */
export const createGroupHonorChangedNotice = (options: NoticeOptions, content: GroupHonorChangedType) => {
  const event = new GroupHonorChangedNotice(options, content)
  new GroupNoticeHandler(event).init()
  return event
}

// export interface CreateGroupNoticeOptions {
//   /**
//    * @description 创建群聊戳一戳事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_POKE}`, options: NoticeOptions, content: GroupPokeType): GroupNoticeHandler
//   /**
//    * @description 创建群聊撤回消息事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_RECALL}`, options: NoticeOptions, content: GroupRecallType): GroupNoticeHandler
//   /**
//    * @description 创建群文件上传事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_FILE_UPLOADED}`, options: NoticeOptions, content: GroupFileUploadedType): GroupNoticeHandler
//   /**
//    * @description 创建群名片变动事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_CARD_CHANGED}`, options: NoticeOptions, content: GroupCardChangedType): GroupNoticeHandler
//   /**
//    * @description 创建群成员头衔变动事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_MEMBER_TITLE_UPDATED}`, options: NoticeOptions, content: GroupMemberUniqueTitleChangedType): GroupNoticeHandler
//   /**
//    * @description 创建群精华消息变动事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_HIGHLIGHTS_CHANGED}`, options: NoticeOptions, content: GroupHlightsChangedType): GroupNoticeHandler
//   /**
//    * @description 创建群成员增加事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_MEMBER_ADD}`, options: NoticeOptions, content: GroupMemberIncreaseType): GroupNoticeHandler
//   /**
//    * @description 创建群成员减少事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_MEMBER_REMOVE}`, options: NoticeOptions, content: GroupMemberDecreaseType): GroupNoticeHandler
//   /**
//    * @description 创建群管理员变动事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_ADMIN_CHANGED}`, options: NoticeOptions, content: GroupAdminChangedType): GroupNoticeHandler
//   /**
//    * @description 创建群打卡事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_SIGN_IN}`, options: NoticeOptions, content: GroupSignInType): GroupNoticeHandler
//   /**
//    * @description 创建群成员被禁言事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_MEMBER_BAN}`, options: NoticeOptions, content: GroupMemberBanType): GroupNoticeHandler
//   /**
//    * @description 创建群全员禁言事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_WHOLE_BAN}`, options: NoticeOptions, content: GroupWholeBanType): GroupNoticeHandler
//   /**
//    * @description 创建群表情动态事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_MESSAGE_REACTION}`, options: NoticeOptions, content: GroupMessageReactionType): GroupNoticeHandler
//   /**
//    * @description 创建群聊运气王事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_LUCKY_KING}`, options: NoticeOptions, content: GroupLuckKingType): GroupNoticeHandler
//   /**
//    * @description 创建群聊荣誉变更事件
//    * @param type 事件子类型
//    * @param content 事件内容
//    * @param options 事件参数
//    */
//   (type: `${NoticeEventSubEnum.GROUP_HONOR_CHANGE}`, options: NoticeOptions, content: GroupHonorChangedType): GroupNoticeHandler
// }

// /**
//  * @description 创建群聊通知事件
//  * @param type 事件子类型
//  * @param options 事件所需参数
//  * @param content 事件内容
//  */
// export const createGroupNotice: CreateGroupNoticeOptions = (type, options, content) => {
//   switch (type) {
//     case `${NoticeEventSubEnum.GROUP_POKE}`: {
//       const event = new GroupPokeNotice(options, content as GroupPokeType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_RECALL}`: {
//       const event = new GroupRecallNotice(options, content as GroupRecallType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_FILE_UPLOADED}`: {
//       const event = new GroupFileUploadedNotice(options, content as GroupFileUploadedType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_CARD_CHANGED}`: {
//       const event = new GroupCardChangedNotice(options, content as GroupCardChangedType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_MEMBER_TITLE_UPDATED}`: {
//       const event = new GroupMemberTitleUpdatedNotice(options, content as GroupMemberUniqueTitleChangedType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_HIGHLIGHTS_CHANGED}`: {
//       const event = new GroupHlightsChangedNotice(options, content as GroupHlightsChangedType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_MEMBER_ADD}`: {
//       const event = new GroupMemberIncreaseNotice(options, content as GroupMemberIncreaseType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_MEMBER_REMOVE}`: {
//       const event = new GroupMemberDecreaseNotice(options, content as GroupMemberDecreaseType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_ADMIN_CHANGED}`: {
//       const event = new GroupAdminChangedNotice(options, content as GroupAdminChangedType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_SIGN_IN}`: {
//       const event = new GroupSignInNotice(options, content as GroupSignInType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_MEMBER_BAN}`: {
//       const event = new GroupMemberBanNotice(options, content as GroupMemberBanType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_WHOLE_BAN}`: {
//       const event = new GroupWholeBanNotice(options, content as GroupWholeBanType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_MESSAGE_REACTION}`: {
//       const event = new GroupMessageReactionNotice(options, content as GroupMessageReactionType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_LUCKY_KING}`: {
//       const event = new GroupLuckKingNotice(options, content as GroupLuckKingType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     case `${NoticeEventSubEnum.GROUP_HONOR_CHANGE}`: {
//       const event = new GroupHonorChangedNotice(options, content as GroupHonorChangedType)
//       new GroupNoticeHandler(event).init()
//       return event
//     }
//     default: {
//       throw new Error(`[createGroupNotice]: 未知的事件子类型: ${JSON.stringify({ type, options, content })}`)
//     }
//   }
// }
