import { Reply, replyCallback } from '../types/Reply'
import { KarinAdapter } from '../types/Adapter'
import { Event, contact, Sender, SubEventForEvent } from '../types/Types'

/**
 * - 事件基类 所有事件都继承自此类并且需要实现此类的所有属性
 * @class KarinEvent
 */
export class KarinEvent {
  /**
   * - 机器人ID 请尽量使用UID
   */
  self_id: string
  /**
   * - 用户ID
   */
  user_id: string
  /**
   * - 群ID 仅在群聊中存在
   * @default ''
   */
  group_id: string
  /**
   * - 事件类型
   */
  event: Event
  /**
   * - 事件子类型
   */
  sub_event: SubEventForEvent<Event>
  /**
   * - 事件ID
   */
  event_id: string
  /**
   * - 事件触发时间戳
   */
  time: number
  /**
   * - 事件联系人信息
   */
  contact: contact
  /**
   * - 事件发送者信息
   */
  sender: Sender
  /**
   * - 是否为主人
   * @default false
   */
  isMaster: boolean
  /**
   * - 是否为管理员
   * @default false
   */
  isAdmin: boolean
  /**
   * - 是否为私聊
   * @default false
   */
  isPrivate: boolean
  /**
   * - 是否为群聊
   * @default false
   */
  isGroup: boolean
  /**
   * - 是否为频道
   * @default false
   */
  isGuild: boolean
  /**
   * - 是否为群临时会话
   * @default false
   */
  isGroupTemp: boolean
  /**
   * - 日志函数字符串
   */
  logFnc: string
  /**
   * - 日志用户字符串
   */
  logText: string
  /**
   * - 存储器 由开发者自行调用
   */
  store: Map<string, any>
  /**
   * - 回复函数
   */
  reply!: Reply
  /**
   * - 回复函数 由适配器实现，开发者不应该直接调用
   */
  replyCallback: replyCallback
  /**
   * - bot实现
   */
  bot: KarinAdapter

  constructor({
    event,
    self_id,
    user_id,
    group_id = '',
    time,
    contact,
    sender,
    sub_event,
    event_id,
  }: {
    /**
     * - 事件类型
     */
    event: Event
    /**
     * - 机器人ID 请尽量使用UID
     */
    self_id: string
    /**
     * - 用户ID
     */
    user_id: string
    /**
     * - 群ID 仅在群聊中需要提供
     */
    group_id?: string
    /**
     * - 事件触发时间戳
     */
    time: number
    /**
     * - 事件联系人信息
     */
    contact: contact
    /**
     * - 事件发送者信息
     */
    sender: Sender
    /**
     * - 事件子类型
     */
    sub_event: SubEventForEvent<Event>
    /**
     * - 事件ID
     */
    event_id: string
  }) {
    this.self_id = self_id
    this.user_id = user_id
    this.group_id = group_id
    this.time = time
    this.event = event
    this.event_id = event_id
    this.contact = contact
    this.sender = sender
    this.sub_event = sub_event
    this.isMaster = false
    this.isAdmin = false
    this.isPrivate = false
    this.isGroup = false
    this.isGuild = false
    this.isGroupTemp = false
    this.logFnc = ''
    this.logText = ''
    this.store = new Map()
    this.reply = (elements, options) => Promise.resolve({ message_id: '' })
    this.replyCallback = (elements, options) => Promise.resolve({ message_id: '' })
    this.bot = {} as KarinAdapter
  }
}
