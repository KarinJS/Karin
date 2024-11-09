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
export type NoticeOptions = Omit<BaseEventOptions, 'event' | 'sender' | 'subEvent'> & {
  sender: NoticeAndRequestSender
}

/**
 * @description 通知事件类
 * @class NoticeBase
 */
export abstract class NoticeBase extends BaseEvent implements BaseNoticeEventType {
  /** 提示: 123戳了戳Bot */
  tips: string
  /** 事件内容 */
  content: any
  /** 事件子类型 */
  #subEvent: BaseNoticeEventType['subEvent'] = 'privateRecall'
  /** 事件发送者信息 */
  #sender: NoticeAndRequestSender

  constructor (options: NoticeOptions) {
    super(Object.assign(options, {
      event: EventParentEnum.NOTICE,
      /** 给一个默认子事件 */
      subEvent: 'privateRecall' as const,
    }))
    this.tips = ''
    this.#sender = options.sender
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
