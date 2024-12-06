import { RequestEventSubEnum } from '@/event/types/types'
import { RequestBase, RequestOptions } from '@/event/create/request/base'
import { GroupRequestHandler } from '@/event/handler/request/group'

export type GroupRequest = GroupApplyRequest | GroupInviteRequest

/** 新成员加入群聊申请 */
export interface GroupApply {
  /** 申请者id */
  applierId: string
  /** 邀请者id */
  inviterId: string
  /** 申请理由 */
  reason: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}

/** 邀请Bot加入群聊 */
export interface GroupInvite {
  /** 邀请者id */
  inviterId: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}

abstract class GroupRequestBase extends RequestBase {
  /** 群id */
  get groupId () {
    return this.contact.peer
  }

  /** @deprecated 已废弃 请使用groupId */
  get group_id () {
    return this.groupId
  }
}

/**
 * @description 新成员加入群聊申请事件
 * @class GroupApplyRequest
 */
export class GroupApplyRequest extends GroupRequestBase {
  /** 事件内容 */
  content: GroupApply
  #subEvent: RequestEventSubEnum.GROUP_APPLY
  constructor (options: RequestOptions, content: GroupApply) {
    super(options)

    this.content = content
    this.#subEvent = RequestEventSubEnum.GROUP_APPLY
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 邀请Bot加入群聊事件
 * @class GroupInviteRequest
 */
export class GroupInviteRequest extends GroupRequestBase {
  /** 事件内容 */
  content: GroupInvite
  #subEvent: RequestEventSubEnum.GROUP_INVITE
  constructor (options: RequestOptions, content: GroupInvite) {
    super(options)

    this.content = content
    this.#subEvent = RequestEventSubEnum.GROUP_INVITE
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 创建新成员申请加入群聊事件
 * @param options 新成员申请加入群聊事件所需参数
 * @param content 新成员申请加入群聊事件内容
 */
export const createGroupApplyRequest = (options: RequestOptions, content: GroupApply) => {
  const event = new GroupApplyRequest(options, content)
  return new GroupRequestHandler(event).init()
}

/**
 * @description 创建邀请Bot加入群聊事件
 * @param options 邀请Bot加入群聊事件所需参数
 * @param content 邀请Bot加入群聊事件内容
 */
export const createGroupInviteRequest = (options: RequestOptions, content: GroupInvite) => {
  const event = new GroupInviteRequest(options, content)
  return new GroupRequestHandler(event).init()
}

interface CreateGroupRequestOptions {
  /**
   * @description 创建群聊请求事件
   * @param type 事件子类型
   * @param options 群聊请求事件所需参数
   * @param content 群聊请求事件内容
   */
  (type: `${RequestEventSubEnum.GROUP_APPLY}`, options: RequestOptions, content: GroupApply): void
  /**
   * @description 创建群聊请求事件
   * @param type 事件子类型
   * @param options 群聊请求事件所需参数
   * @param content 群聊请求事件内容
   */
  (type: `${RequestEventSubEnum.GROUP_INVITE}`, options: RequestOptions, content: GroupInvite): void
}

/**
 * @description 创建群聊请求事件
 * @param type 事件子类型
 * @param options 群聊请求事件所需参数
 * @param content 群聊请求事件内容
 */
export const createGroupRequest: CreateGroupRequestOptions = (type, options, content) => {
  switch (type) {
    case RequestEventSubEnum.GROUP_APPLY:
      return createGroupApplyRequest(options, content as GroupApply)
    case RequestEventSubEnum.GROUP_INVITE:
      return createGroupInviteRequest(options, content as GroupInvite)
    default:
      break
  }
}
