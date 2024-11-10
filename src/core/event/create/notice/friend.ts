import { NoticeBase, NoticeOptions } from './base'
import { NoticeEventSubEnum } from '../../types/types'
import { FriendNoticeHandler } from '@/event/handler/notice/friend'

/** 收到点赞 */
export interface ReceiveLikeType {
  /** 点赞者id */
  operatorId: string
  /** 点赞者数量 */
  count: number
}

/** 新增好友 */
export interface FriendIncreaseType {
  /** 新好友id */
  targetId: string
}

/** 好友减少 */
export interface FriendDecreaseType {
  /** 减少的好友id */
  targetId: string
}

/** 私聊戳一戳 */
export interface PrivatePokeType {
  /** 操作者id */
  operatorId: string
  /** 被戳者id */
  targetId: string
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
  tips: string
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
 * @description 收到点赞事件
 * @class ReceiveLikeNotice
 */
export class ReceiveLikeNotice extends NoticeBase {
  content: ReceiveLikeType
  #subEvent: NoticeEventSubEnum.RECEIVE_LIKE
  constructor (options: NoticeOptions, content: ReceiveLikeType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.RECEIVE_LIKE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 新增好友事件
 * @class FriendIncreaseNotice
 */
export class FriendIncreaseNotice extends NoticeBase {
  content: FriendIncreaseType
  #subEvent: NoticeEventSubEnum.FRIEND_INCREASE
  constructor (options: NoticeOptions, content: FriendIncreaseType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.FRIEND_INCREASE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 好友减少事件
 * @class FriendDecreaseNotice
 */
export class FriendDecreaseNotice extends NoticeBase {
  content: FriendDecreaseType
  #subEvent: NoticeEventSubEnum.FRIEND_DECREASE
  constructor (options: NoticeOptions, content: FriendDecreaseType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.FRIEND_DECREASE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 私聊戳一戳事件
 * @class PrivatePokeNotice
 */
export class PrivatePokeNotice extends NoticeBase {
  content: PrivatePokeType
  #subEvent: NoticeEventSubEnum.FRIENT_POKE
  constructor (options: NoticeOptions, content: PrivatePokeType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.FRIENT_POKE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 私聊撤回消息事件
 * @class PrivateRecallNotice
 */
export class PrivateRecallNotice extends NoticeBase {
  content: PrivateRecallType
  #subEvent: NoticeEventSubEnum.FRIEND_RECALL
  constructor (options: NoticeOptions, content: PrivateRecallType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.FRIEND_RECALL
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 私聊文件上传事件
 * @class PrivateFileUploadedNotice
 */
export class PrivateFileUploadedNotice extends NoticeBase {
  content: PrivateFileUploadedType
  #subEvent: NoticeEventSubEnum.FRIEND_FILE_UPLOADED
  constructor (options: NoticeOptions, content: PrivateFileUploadedType) {
    super(options)

    this.content = content
    this.#subEvent = NoticeEventSubEnum.FRIEND_FILE_UPLOADED
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 创建收到点赞事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createReceiveLikeNotice = (options: NoticeOptions, content: ReceiveLikeType) => {
  const event = new ReceiveLikeNotice(options, content)
  return new FriendNoticeHandler(event).init()
}

/**
 * @description 创建好友新增事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createFriendIncreaseNotice = (options: NoticeOptions, content: FriendIncreaseType) => {
  const event = new FriendIncreaseNotice(options, content)
  return new FriendNoticeHandler(event).init()
}

/**
 * @description 创建好友减少事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createFriendDecreaseNotice = (options: NoticeOptions, content: FriendDecreaseType) => {
  const event = new FriendDecreaseNotice(options, content)
  return new FriendNoticeHandler(event).init()
}

/**
 * @description 创建私聊戳一戳事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createPrivatePokeNotice = (options: NoticeOptions, content: PrivatePokeType) => {
  const event = new PrivatePokeNotice(options, content)
  return new FriendNoticeHandler(event).init()
}

/**
 * @description 创建私聊撤回消息事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createPrivateRecallNotice = (options: NoticeOptions, content: PrivateRecallType) => {
  const event = new PrivateRecallNotice(options, content)
  return new FriendNoticeHandler(event).init()
}

/**
 * @description 创建私聊文件上传事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createPrivateFileUploadedNotice = (options: NoticeOptions, content: PrivateFileUploadedType) => {
  const event = new PrivateFileUploadedNotice(options, content)
  return new FriendNoticeHandler(event).init()
}

export interface CreatePrivateNoticeOptions {
  /**
   * @description 创建收到点赞事件
   * @param type 事件子类型
   * @param options 事件所需参数
   * @param content 事件内容
   */
  (type: `${NoticeEventSubEnum.RECEIVE_LIKE}`, options: NoticeOptions, content: ReceiveLikeType): FriendNoticeHandler
  /**
   * @description 创建好友新增事件
   * @param type 事件子类型
   * @param options 事件所需参数
   * @param content 事件内容
   */
  (type: `${NoticeEventSubEnum.FRIEND_INCREASE}`, options: NoticeOptions, content: FriendIncreaseType): FriendNoticeHandler
  /**
   * @description 创建好友减少事件
   * @param type 事件子类型
   * @param options 事件所需参数
   * @param content 事件内容
   */
  (type: `${NoticeEventSubEnum.FRIEND_DECREASE}`, options: NoticeOptions, content: FriendDecreaseType): FriendNoticeHandler
  /**
   * @description 创建私聊戳一戳事件
   * @param type 事件子类型
   * @param options 事件所需参数
   * @param content 事件内容
   */
  (type: `${NoticeEventSubEnum.FRIENT_POKE}`, options: NoticeOptions, content: PrivatePokeType): FriendNoticeHandler
  /**
   * @description 创建私聊撤回消息事件
   * @param type 事件子类型
   * @param options 事件所需参数
   * @param content 事件内容
   */
  (type: `${NoticeEventSubEnum.FRIEND_RECALL}`, options: NoticeOptions, content: PrivateRecallType): FriendNoticeHandler
  /**
   * @description 创建私聊文件上传事件
   * @param type 事件子类型
   * @param options 事件所需参数
   * @param content 事件内容
   */
  (type: `${NoticeEventSubEnum.FRIEND_FILE_UPLOADED}`, options: NoticeOptions, content: PrivateFileUploadedType): FriendNoticeHandler
}

/**
 * @description 创建私聊通知事件
 * @param type 事件子类型
 * @param options 事件所需参数
 * @param content 事件内容
 */
export const createPrivateNotice: CreatePrivateNoticeOptions = (type, options, content) => {
  switch (type) {
    case `${NoticeEventSubEnum.RECEIVE_LIKE}`: {
      const event = new ReceiveLikeNotice(options, content as ReceiveLikeType)
      return new FriendNoticeHandler(event).init()
    }
    case `${NoticeEventSubEnum.FRIEND_DECREASE}`: {
      const event = new FriendDecreaseNotice(options, content as FriendDecreaseType)
      return new FriendNoticeHandler(event).init()
    }
    case `${NoticeEventSubEnum.FRIEND_INCREASE}`: {
      const event = new FriendIncreaseNotice(options, content as FriendIncreaseType)
      return new FriendNoticeHandler(event).init()
    }
    case `${NoticeEventSubEnum.FRIENT_POKE}`: {
      const event = new PrivatePokeNotice(options, content as PrivatePokeType)
      return new FriendNoticeHandler(event).init()
    }
    case `${NoticeEventSubEnum.FRIEND_RECALL}`: {
      const event = new PrivateRecallNotice(options, content as PrivateRecallType)
      return new FriendNoticeHandler(event).init()
    }
    case `${NoticeEventSubEnum.FRIEND_FILE_UPLOADED}`: {
      const event = new PrivateFileUploadedNotice(options, content as PrivateFileUploadedType)
      return new FriendNoticeHandler(event).init()
    }
    default:
      throw new Error(`[createPrivateNotice]: 未知的事件子类型: ${JSON.stringify({ type, options, content })}`)
  }
}

/** 私聊通知事件 */
export type PrivateNotice = ReceiveLikeNotice | FriendIncreaseNotice | FriendDecreaseNotice | PrivatePokeNotice | PrivateRecallNotice | PrivateFileUploadedNotice
