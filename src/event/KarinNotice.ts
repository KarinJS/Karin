import { KarinEvent } from './KarinEvent'
import { contact, sender, SubEventForEvent, NoticeEvent } from '../types/types'

/**
 * - 通知事件基类
 */
export class KarinNotice extends KarinEvent {
  constructor({
    self_id,
    event_id,
    user_id,
    time,
    contact,
    sender,
    sub_event,
    content,
    group_id = '',
  }: {
    /**
     * - 机器人ID 请尽量使用UID
     */
    self_id: string
    /**
     * - 事件ID
     */
    event_id: string
    /**
     * - 用户ID
     */
    user_id: string
    /**
     * - 事件触发时间戳
     */
    time: number
    /**
     * 事件联系人信息
     */
    contact: contact
    /**
     * 事件发送者信息
     */
    sender: sender
    /**
     * 事件子类型
     */
    sub_event: SubEventForEvent<'notice'>
    /**
     * 事件对应的内容参数
     */
    content: NoticeEvent<SubEventForEvent<'notice'>>
    /**
     * 群ID
     */
    group_id?: string
  }) {
    super({ event: 'notice', event_id, self_id, user_id, group_id, time, contact, sender, sub_event })
    this.content = content
  }

  /**
   * - 事件对应的内容参数
   */
  content: NoticeEvent<SubEventForEvent<'notice'>>
}
