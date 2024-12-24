import { RequestBase, RequestOptions } from '@/event/create/request/base'
import { RequestEventSubEnum } from '@/event/types/types'
import { FriendRequestHandler } from '@/event/handler/request/friend'

/** 好友请求事件 */
export type FriendRequest = PrivateApplyRequest

/** 好友申请 */
export interface PrivateApplyType {
  /** 申请者id */
  applierId: string
  /** 验证信息 */
  message: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}

/**
 * @description 好友申请事件
 * @class PrivateApplyRequest
 */
export class PrivateApplyRequest extends RequestBase {
  /** 事件内容 */
  content: PrivateApplyType
  #subEvent: RequestEventSubEnum
  constructor (options: RequestOptions, content: PrivateApplyType) {
    super(options)

    this.content = content
    this.#subEvent = RequestEventSubEnum.FRIEND
  }

  get subEvent () {
    return this.#subEvent
  }
}

/**
 * @description 创建好友请求事件
 * @param options 好友请求事件所需参数
 * @param content 好友请求事件内容
 */
export const createPrivateApplyRequest = (options: RequestOptions, content: PrivateApplyType) => {
  const event = new PrivateApplyRequest(options, content)
  new FriendRequestHandler(event).init()
  return event
}

interface CreateFriendRequestOptions {
  /**
   * @description 创建好友请求事件
   * @param type 事件子类型
   * @param options 好友请求事件所需参数
   * @param content 好友请求事件内容
   */
  (type: `${RequestEventSubEnum.FRIEND}`, options: RequestOptions, content: PrivateApplyType): void
}

/**
 * @description 创建好友请求事件
 * @param type 事件子类型
 * @param options 好友请求事件所需参数
 * @param content 好友请求事件内容
 */
export const createFriendRequest: CreateFriendRequestOptions = (type, options, content) => {
  switch (type) {
    case RequestEventSubEnum.FRIEND:
      return createPrivateApplyRequest(options, content)
    default:
      break
  }
}
