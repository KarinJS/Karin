import { NoticeAndRequestSender } from '@/adapter/sender'
import {
  BaseEventOptions,
  BaseEventType,
  EventParentEnum,
  NoticeEventSubEnum,
} from '../../types/types'
import { BaseEvent } from '../base'

/** 通知事件基类定义 */
export interface BaseNoticeEventType extends BaseEventType {
  event: `${EventParentEnum.NOTICE}`
  subEvent: `${NoticeEventSubEnum}`
  sender: NoticeAndRequestSender
}

/** 所需参数 */
export type NoticeOptions = Omit<BaseEventOptions, 'event' | 'sender'> & {
  subEvent: BaseNoticeEventType['subEvent']
  sender: NoticeAndRequestSender
}

/**
 * @description 通知事件类
 * @class NoticeBase
 */
export abstract class NoticeBase extends BaseEvent implements BaseNoticeEventType {
  /** 提示: 123戳了戳Bot */
  tips: string
  /** 事件子类型 */
  #subEvent: BaseNoticeEventType['subEvent']
  #sender: NoticeAndRequestSender

  constructor (options: NoticeOptions) {
    super(Object.assign(options, { event: EventParentEnum.NOTICE }))
    this.#sender = options.sender
    this.#subEvent = options.subEvent
    this.tips = ''
  }

  get event () {
    return `${EventParentEnum.NOTICE}` as const
  }

  get subEvent () {
    return this.#subEvent
  }

  get sender () {
    return this.#sender
  }
}
