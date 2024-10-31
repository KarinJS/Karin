import { NoticeBase, NoticeOptions } from '.'
import { NoticeEventSubEnum } from '../../types/types'

/** 新增好友 */
export interface FriendIncreaseType {
  /** 新好友id */
  targetId: string
}

/** 私聊戳一戳 */
export interface PrivatePokeType {
  /** 操作者id */
  operatorId: string
  /** 操作名称，如“戳了戳” */
  action: string
  /** 后缀，未设置则未空字符串 */
  suffix: string
  /** 操作图标url */
  actionImage: string
}

/** 私聊撤回消息 */
export interface PrivateRecallType {
  /** 操作者id */
  operatorId: string
  /** 撤回的消息id */
  messageId: string
  /** 操作提示，如“撤回了一条消息”  一般此项为空字符串 */
  tip: string
}

/**
 * 私聊文件上传
 * 文件信息最少需要提供一个url
 */
export interface PrivateFileUploadedType {
  /** 操作者id */
  operatorId: string
  /** 文件ID 此项没有则为空字符串 */
  fid: string
  /** 文件子ID 此项没有则为空字符串 */
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

/**
 * @description 新增好友事件
 * @class FriendIncreaseNotice
 */
export class FriendIncreaseNotice extends NoticeBase {
  /** 事件内容 */
  content: FriendIncreaseType
  constructor (options: NoticeOptions, content: FriendIncreaseType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.FRIEND_INCREASE,
    }))

    this.content = content
  }
}

/**
 * @description 私聊戳一戳事件
 * @class PrivatePokeNotice
 */
export class PrivatePokeNotice extends NoticeBase {
  /** 事件内容 */
  content: PrivatePokeType
  constructor (options: NoticeOptions, content: PrivatePokeType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.FRIENT_POKE,
    }))

    this.content = content
  }
}

/**
 * @description 私聊撤回消息事件
 * @class PrivateRecallNotice
 */
export class PrivateRecallNotice extends NoticeBase {
  /** 事件内容 */
  content: PrivateRecallType
  constructor (options: NoticeOptions, content: PrivateRecallType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.FRIEND_RECALL,
    }))

    this.content = content
  }
}

/**
 * @description 私聊文件上传事件
 * @class PrivateFileUploadedNotice
 */
export class PrivateFileUploadedNotice extends NoticeBase {
  /** 事件内容 */
  content: PrivateFileUploadedType
  constructor (options: NoticeOptions, content: PrivateFileUploadedType) {
    super(Object.assign(options, {
      subEvent: NoticeEventSubEnum.FRIEND_FILE_UPLOADED,
    }))

    this.content = content
  }
}
