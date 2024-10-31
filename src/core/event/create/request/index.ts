import {
  BaseEventOptions,
  BaseEventType,
  EventParentEnum,
  RequestEventSubEnum,
} from '../../types/types'
import { BaseEvent } from '../base'

/** 消息事件基类定义 */
export interface BaseRequestEventType extends BaseEventType {
  /** 事件类型 */
  event: `${EventParentEnum.REQUEST}`
  /** 事件子类型 */
  subEvent: `${RequestEventSubEnum}`
}

export type RequestOptions = Omit<BaseEventOptions, 'event'> & {
  subEvent: BaseRequestEventType['subEvent']
}

/**
 * @description 请求事件类
 * @class RequestBase
 */
export class RequestBase extends BaseEvent implements BaseRequestEventType {
  /** 事件子类型 */
  #subEvent: BaseRequestEventType['subEvent']

  constructor (options: RequestOptions) {
    super(Object.assign(options, { event: EventParentEnum.REQUEST }))
    this.#subEvent = options.subEvent
  }

  get event () {
    return `${EventParentEnum.REQUEST}` as const
  }

  get subEvent () {
    return this.#subEvent
  }
}
