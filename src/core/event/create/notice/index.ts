import {
  BaseEventOptions,
  BaseEventType,
  EventParentEnum,
  NoticeEventSubEnum,
} from '../../types/types'
import { BaseEvent } from '../base'

/** 消息事件基类定义 */
export interface BaseNoticeEventType extends BaseEventType {
  /** 事件类型 */
  event: `${EventParentEnum.NOTICE}`
  /** 事件子类型 */
  subEvent: `${NoticeEventSubEnum}`
}

export type NoticeOptions = Omit<BaseEventOptions, 'event'> & {
  subEvent: BaseNoticeEventType['subEvent']
}

/**
 * @description 通知事件类
 * @class NoticeBase
 */
export class NoticeBase extends BaseEvent implements BaseNoticeEventType {
  /** 事件子类型 */
  #subEvent: BaseNoticeEventType['subEvent']

  constructor (options: NoticeOptions) {
    super(Object.assign(options, { event: EventParentEnum.NOTICE }))
    this.#subEvent = options.subEvent
  }

  get event () {
    return `${EventParentEnum.NOTICE}` as const
  }

  get subEvent () {
    return this.#subEvent
  }
}
