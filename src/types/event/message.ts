import { KarinElement } from '../element/element'
import { KarinEventType, BaseEventDataType, EventType, MessageSubType } from './event'

/** 消息事件定义 */
export interface KarinMessageType extends KarinEventType {
  event: EventType.Message
  sub_event: MessageSubType
  /** 消息ID */
  message_id: string
  /** 消息序列号 */
  message_seq?: number
  /** 原始消息文本 */
  raw_message: string
  /** 消息体元素 */
  elements: Array<KarinElement>
  /** 群ID */
  group_id: string
  /** 经过处理后的消息 */
  msg: string
  /** 消息图片 */
  image: string[]
  /** 语音url */
  record: string
  file: any // 暂时先any 字段未确定
  /** 是否atBot */
  atBot: boolean
  /** 是否atAll */
  atAll: boolean
  /** at的用户列表 不会出现Bot自身的at */
  at: string[]
  /** 引用回复的消息id */
  reply_id: string
  /** bot别名 */
  alias: string
}

/** 创建一个消息事件 */
export class KarinMessage implements KarinMessageType {
  self_id: KarinMessageType['self_id']
  user_id: KarinMessageType['user_id']
  group_id: KarinMessageType['group_id']
  event: KarinMessageType['event']
  sub_event: KarinMessageType['sub_event']
  event_id: KarinMessageType['event_id']
  time: KarinMessageType['time']
  contact: KarinMessageType['contact']
  sender: KarinMessageType['sender']
  isMaster: KarinMessageType['isMaster']
  isAdmin: KarinMessageType['isAdmin']
  isPrivate: KarinMessageType['isPrivate']
  isGroup: KarinMessageType['isGroup']
  isGuild: KarinMessageType['isGuild']
  isGroupTemp: KarinMessageType['isGroupTemp']
  logFnc: KarinMessageType['logFnc']
  logText: KarinMessageType['logText']
  store: KarinMessageType['store']
  raw_event: KarinMessageType['raw_event']
  raw_message: KarinMessageType['raw_message']
  message_id: KarinMessageType['message_id']
  message_seq?: KarinMessageType['message_seq']
  elements: KarinMessageType['elements']
  bot!: KarinMessageType['bot']
  reply!: KarinMessageType['reply']
  replyCallback!: KarinMessageType['replyCallback']
  msg: KarinMessageType['msg']
  image: KarinMessageType['image']
  record: KarinMessageType['record']
  file: KarinMessageType['file']
  atBot: KarinMessageType['atBot']
  atAll: KarinMessageType['atAll']
  at: KarinMessageType['at']
  reply_id: KarinMessageType['reply_id']
  alias: KarinMessageType['alias']
  isDirect: KarinMessageType['isDirect']

  constructor ({
    event,
    self_id: selfId,
    user_id: userId,
    group_id: groupId = '',
    time,
    contact,
    sender,
    sub_event: subEvent,
    event_id: eventId,
    message_id: messageId,
    message_seq: messageSeq,
    elements,
    raw_event: rawEvent,
  }: BaseEventDataType & {
    event: KarinMessageType['event']
    sub_event: KarinMessageType['sub_event']
    message_id: KarinMessageType['message_id']
    message_seq?: KarinMessageType['message_seq']
    elements: KarinMessageType['elements']
  }) {
    this.self_id = selfId
    this.user_id = userId
    this.time = time
    this.event = event
    this.event_id = eventId
    this.contact = contact
    this.sender = sender
    this.sub_event = subEvent
    this.message_id = messageId
    this.message_seq = messageSeq
    this.elements = elements
    this.group_id = contact.scene === 'group' ? (contact.peer || groupId) : groupId
    this.raw_event = rawEvent
    this.isMaster = false
    this.isAdmin = false
    this.isPrivate = false
    this.isGroup = false
    this.isGuild = false
    this.isGroupTemp = false
    this.isDirect = false
    this.logFnc = ''
    this.logText = ''
    this.store = new Map()
    this.raw_message = ''
    this.msg = ''
    this.image = []
    this.file = {}
    this.record = ''
    this.atBot = false
    this.atAll = false
    this.at = []
    this.reply_id = ''
    this.alias = ''
  }
}
