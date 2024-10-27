import { RequestBase, RequestOptions } from '.'
import { RequestEventSubEnum } from '../types'

/** 新成员加入群聊申请 */
export interface GroupApply {
  /** 群ID */
  groupId: string
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
  /** 群ID */
  groupId: string
  /** 邀请者id */
  inviterId: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}

/**
 * @description 新成员加入群聊申请事件
 * @class GroupApplyRequest
 */
export class GroupApplyRequest extends RequestBase {
  /** 事件内容 */
  content: GroupApply
  constructor (options: RequestOptions, content: GroupApply) {
    super(Object.assign(options, {
      subEvent: RequestEventSubEnum.GROUP,
    }))

    this.content = content
  }
}

/**
 * @description 邀请Bot加入群聊事件
 * @class GroupInviteRequest
 */
export class GroupInviteRequest extends RequestBase {
  /** 事件内容 */
  content: GroupInvite
  constructor (options: RequestOptions, content: GroupInvite) {
    super(Object.assign(options, {
      subEvent: RequestEventSubEnum.GROUP,
    }))

    this.content = content
  }
}
