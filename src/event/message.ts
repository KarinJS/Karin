import { KarinEvent } from './event'
import { contact, Sender, KarinElement } from 'karin/types'

/**
 * - 消息事件基类
 */
export class KarinMessage extends KarinEvent {
  constructor ({
    event = 'message',
    event_id,
    self_id,
    user_id,
    time,
    message_id,
    message_seq = '',
    raw_message = '',
    contact,
    sender,
    elements,
    group_id = '',
  }: {
    /**
     * - 事件类型
     */
    event: 'message' | 'message_sent'
    /**
     * - 事件ID
     */
    event_id: string
    /**
     * - 机器人ID 请尽量使用UID
     */
    self_id: string
    /**
     * - 用户ID
     */
    user_id: string
    /**
     * - 事件触发时间戳
     */
    time: number
    /**
     * - 消息ID
     */
    message_id: string
    /**
     * - 消息序列号
     */
    message_seq?: string
    /**
     * - 原始消息文本
     */
    raw_message: string
    /**
     * 事件联系人信息
     */
    contact: contact
    /**
     * 事件发送者信息
     */
    sender: Sender
    /**
     * 消息体元素
     */
    elements: Array<KarinElement>
    /**
     * 群ID
     */
    group_id: string
  }) {
    super({ event, event_id: event_id || message_id, self_id, user_id, group_id, time, contact, sender, sub_event: contact.scene === 'group' ? 'group_message' : 'private_message' })
    this.message_id = message_id
    this.message_seq = message_seq
    this.raw_message = raw_message
    this.elements = elements
    this.msg = ''
    this.at = []
    this.image = []
    this.file = {}
    this.reply_id = ''
    this.atBot = false
    this.atAll = false
    this.alias = ''
  }

  /**
   * - 消息ID
   */
  message_id: string
  /**
   * - 消息序列号
   */
  message_seq?: string
  /**
   * - 原始消息文本
   */
  raw_message: string
  /**
   * - 消息体元素
   */
  elements: Array<KarinElement>
  /**
   * - 框架处理后的文本
   */
  msg: string
  /**
   * - 图片数组
   */
  image: Array<string>
  /**
   * - AT数组
   */
  at: Array<string>
  /**
   * - 是否AT机器人
   */
  atBot: boolean
  /**
   * - 是否AT全体
   */
  atAll: boolean
  /**
   * - 文件元素
   */
  file: object
  /**
   * - 引用消息ID
   */
  reply_id: string
  /**
   * - 消息别名
   */
  alias: string
}
