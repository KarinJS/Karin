import { NoticeAndRequestSender } from '@/adapter/sender'
import {
  BaseEventOptions,
  BaseEventType,
  EventParentEnum,
  RequestEventSubEnum,
} from '../../types/types'
import { BaseEvent } from '../base'

/** 请求事件基类定义 */
export interface BaseRequestEventType extends BaseEventType {
  /** 事件类型 */
  event: `${EventParentEnum.REQUEST}`
  /** 事件子类型 */
  subEvent: `${RequestEventSubEnum}`
  sender: NoticeAndRequestSender
}

export type RequestOptions = Omit<BaseEventOptions, 'event' | 'sender'> & {
  subEvent: BaseRequestEventType['subEvent']
  sender: NoticeAndRequestSender
}

/**
 * @description 请求事件类
 * @class RequestBase
 */
export abstract class RequestBase extends BaseEvent implements BaseRequestEventType {
  /** 提示: 123申请添加Bot为好友 */
  tips: string
  #subEvent: BaseRequestEventType['subEvent']
  #sender: NoticeAndRequestSender

  constructor (options: RequestOptions) {
    super(Object.assign(options, { event: EventParentEnum.REQUEST }))
    this.#sender = options.sender
    this.#subEvent = options.subEvent
    this.tips = ''
  }

  get event () {
    return `${EventParentEnum.REQUEST}` as const
  }

  get subEvent () {
    return this.#subEvent
  }

  get sender () {
    return this.#sender
  }
}
