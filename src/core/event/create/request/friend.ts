import { RequestBase, RequestOptions } from './base'
import { RequestEventSubEnum } from '../../types/types'

/** 好友申请 */
export interface PrivateApplyType {
  /** 申请者id */
  applierId: string
  /** 申请理由 */
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
  constructor (options: RequestOptions, content: PrivateApplyType) {
    super(Object.assign(options, {
      subEvent: RequestEventSubEnum.FRIEND,
    }))

    this.content = content
  }
}
