import { NoticeBase, NoticeOptions } from '.'
import { NoticeEventSubEnum } from '../../types/types'

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
}

/**
 * 群聊撤回
 * 撤回自己消息时，operator和target为自己
 * 撤回别人消息时，operator为操作者，target为被撤回者
 */
export interface GroupRecallType {
  /** 操作者id */
  operatorId: string
  /** 目标id */
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
  /** 操作者id */
  operatorId: string
  /** 文件ID 此项没有则为空字符串 */
  fid: string
  /** 文件子ID 此项没有则为0 */
  subId: number
  /** 文件名 此项没有则为空字符串 */
  name: string
  /** 文件大小 此项没有则为0 */
  size: number
  /** 过期时间 此项没有则为0 */
  expireTime: number
  /** 文件URL */
  url: string
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
  /** 群ID */
  groupId: string
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 被操作的消息id */
  messageId: string
  /** 设置、取消精华 */
  isSet: boolean
}

/** 群成员增加 */
export interface GroupMemberIncreaseType {
  /** 群ID */
  groupId: string
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 加入方式 APPROVE:管理员批准 INVITE:管理员邀请 */
  type: 'invite' | 'approve'
}

/** 群成员减少 */
export interface GroupMemberDecreaseType {
  /** 群ID */
  groupId: string
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 减少方式 leave:主动退群 kick:成员被踢 kickBot:机器人自身被踢 */
  type: 'leave' | 'kick' | 'kickBot'
}

/** 群管理员变动 */
export interface GroupAdminChangedType {
  /** 群ID */
  groupId: string
  /** 目标id */
  targetId: string
  /** 设置、取消管理员 */
  is_admin: boolean
}

/** 群打卡 */
export interface GroupSignInType {
  /** 群ID */
  groupId: string
  /** 目标id */
  targetId: string
  /** 操作名称，如“打卡了” */
  action: string
  /** 打卡图标url */
  rankImage: string
}

/** 群成员被禁言 */
export interface GroupMemberBanType {
  /** 群ID */
  groupId: string
  /** 操作者id */
  operatorId: string
  /** 目标id */
  targetId: string
  /** 禁言时长，单位秒 */
  duration: number
  /** 禁言类型 ban:禁言 lift_ban:解禁 */
  type: 'ban' | 'liftBan'
}

/** 群全员禁言 */
export interface GroupWholeBanType {
  /** 群ID */
  group_id: string
  /** 操作者id */
  operatorId: string
  /** 是否开启全体禁言 */
  isBan: boolean
}

/** 群表情动态 */
export interface GroupMessageReactionType {
  /** 群ID */
  groupId: string
  /** 消息ID */
  messageId: string
  /** 表情ID 参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType */
  faceId: number
  /** 添加、取消回应 */
  isSet: boolean
}

/**
 * @description 群聊戳一戳事件
 * @class GroupPokeNotice
 */
export class GroupPokeNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupPokeType
  constructor (options: NoticeOptions, content: GroupPokeType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_POKE,
    }))

    this.content = content
  }
}

/**
 * @description 群聊撤回消息事件
 * @class GroupRecallNotice
 */
export class GroupRecallNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupRecallType
  constructor (options: NoticeOptions, content: GroupRecallType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_RECALL,
    }))

    this.content = content
  }
}

/**
 * @description 群聊文件上传事件
 * @class GroupFileUploadedNotice
 */
export class GroupFileUploadedNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupFileUploadedType
  constructor (options: NoticeOptions, content: GroupFileUploadedType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_FILE_UPLOADED,
    }))

    this.content = content
  }
}

/**
 * @description 群名片变动事件
 * @class GroupCardChangedNotice
 */
export class GroupCardChangedNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupCardChangedType
  constructor (options: NoticeOptions, content: GroupCardChangedType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_CARD_CHANGED,
    }))

    this.content = content
  }
}

/**
 * @description 群成员头衔变动事件
 * @class GroupMemberUniqueTitleChangedNotice
 */
export class GroupMemberTitleUpdatedNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupMemberUniqueTitleChangedType
  constructor (options: NoticeOptions, content: GroupMemberUniqueTitleChangedType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_MEMBER_TITLE_UPDATED,
    }))

    this.content = content
  }
}

/**
 * @description 群精华消息变动事件
 * @class GroupEssenceChangedNotice
 */
export class GroupHlightsChangedNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupHlightsChangedType
  constructor (options: NoticeOptions, content: GroupHlightsChangedType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_HIGHLIGHTS_CHANGED,
    }))

    this.content = content
  }
}

/**
 * @description 群成员增加事件
 * @class GroupMemberIncreaseNotice
 */
export class GroupMemberIncreaseNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupMemberIncreaseType
  constructor (options: NoticeOptions, content: GroupMemberIncreaseType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_MEMBER_ADD,
    }))

    this.content = content
  }
}

/**
 * @description 群成员减少事件
 * @class GroupMemberDecreaseNotice
 */
export class GroupMemberDecreaseNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupMemberDecreaseType
  constructor (options: NoticeOptions, content: GroupMemberDecreaseType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_MEMBER_REMOVE,
    }))

    this.content = content
  }
}

/**
 * @description 群管理员变动事件
 * @class GroupAdminChangedNotice
 */
export class GroupAdminChangedNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupAdminChangedType
  constructor (options: NoticeOptions, content: GroupAdminChangedType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_ADMIN_CHANGED,
    }))

    this.content = content
  }
}

/**
 * @description 群打卡事件
 * @class GroupSignInNotice
 */
export class GroupSignInNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupSignInType
  constructor (options: NoticeOptions, content: GroupSignInType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_SIGN_IN,
    }))

    this.content = content
  }
}

/**
 * @description 群成员被禁言事件
 * @class GroupMemberBanNotice
 */
export class GroupMemberBanNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupMemberBanType
  constructor (options: NoticeOptions, content: GroupMemberBanType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_MEMBER_BAN,
    }))

    this.content = content
  }
}

/**
 * @description 群全员禁言事件
 * @class GroupWholeBanNotice
 */
export class GroupWholeBanNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupWholeBanType
  constructor (options: NoticeOptions, content: GroupWholeBanType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_WHOLE_BAN,
    }))

    this.content = content
  }
}

/**
 * @description 群表情动态事件
 * @class GroupMessageReactionNotice
 */
export class GroupMessageReactionNotice extends NoticeBase {
  /** 事件内容 */
  content: GroupMessageReactionType
  constructor (options: NoticeOptions, content: GroupMessageReactionType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.GROUP_MESSAGE_REACTION,
    }))

    this.content = content
  }
}

/** 群聊通知事件联合类型 */
export type GroupNotice = GroupRecallNotice | GroupPokeNotice | GroupFileUploadedNotice | GroupCardChangedNotice | GroupMemberTitleUpdatedNotice | GroupHlightsChangedNotice | GroupMemberIncreaseNotice | GroupMemberDecreaseNotice | GroupAdminChangedNotice | GroupSignInNotice | GroupMemberBanNotice | GroupWholeBanNotice | GroupMessageReactionNotice
