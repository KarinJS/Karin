import { KarinEventType, BaseEventDataType, EventType, RequestSubType } from './event'

/**
 * - 好友申请
 */
export interface PrivateApplyType {
  /**
   * - 申请者uid
   */
  applier_uid: string
  /**
   * - 申请者uin
   */
  applier_uin: string
  /**
   * - 申请理由
   */
  message: string
}

/**
 * - 群申请
 */
export interface GroupApply {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 申请者uid
   */
  applier_uid: string
  /**
   * - 申请者uin
   */
  applier_uin: string
  /**
   * - 邀请者uid
   */
  inviter_uid: string
  /**
   * - 邀请者uin
   */
  inviter_uin: string
  /**
   * - 申请理由
   */
  reason: string
}

/**
 * - 邀请入群
 */
export interface GroupInvite {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 邀请者uid
   */
  inviter_uid: string
  /**
   * - 邀请者uin
   */
  inviter_uin: string
}

/**
 * - 通知事件子类型
 */
export interface RequestType {
  [RequestSubType.PrivateApply]: PrivateApplyType
  [RequestSubType.GroupApply]: GroupApply
  [RequestSubType.InvitedGroup]: GroupInvite
}

/**
 * - 请求事件基类
 */
export interface KarinRequestEventBase extends KarinEventType {
  event: EventType.Request
}

/**
 * - 辅助类型，用于生成 KarinRequestEvent 的联合类型来自动推导content的类型
 */
type RequestEvent<T extends RequestSubType> = KarinRequestEventBase & {
  sub_event: T
  content: RequestType[T]
}

/**
 * - 请求事件定义
 */
export type KarinRequestType = RequestEvent<RequestSubType.GroupApply> | RequestEvent<RequestSubType.InvitedGroup> | RequestEvent<RequestSubType.PrivateApply>

/**
 * - 创建一个请求事件
 */
export class KarinRequest implements KarinRequestEventBase {
  self_id: KarinRequestType['self_id']
  user_id: KarinRequestType['user_id']
  group_id: KarinRequestType['group_id']
  event: KarinRequestType['event']
  sub_event: KarinRequestType['sub_event']
  event_id: KarinRequestType['event_id']
  time: KarinRequestType['time']
  contact: KarinRequestType['contact']
  sender: KarinRequestType['sender']
  isMaster: KarinRequestType['isMaster']
  isAdmin: KarinRequestType['isAdmin']
  isPrivate: KarinRequestType['isPrivate']
  isGroup: KarinRequestType['isGroup']
  isGuild: KarinRequestType['isGuild']
  isGroupTemp: KarinRequestType['isGroupTemp']
  logFnc: KarinRequestType['logFnc']
  logText: KarinRequestType['logText']
  store: KarinRequestType['store']
  raw_message: KarinRequestType['raw_message']
  reply!: KarinRequestType['reply']
  replyCallback!: KarinRequestType['replyCallback']
  bot!: KarinRequestType['bot']
  content: RequestType[RequestSubType]
  raw_event: KarinRequestType['raw_event']

  constructor ({
    self_id,
    user_id,
    group_id = '',
    time,
    contact,
    sender,
    sub_event,
    event_id,
    content,
  }: BaseEventDataType & {
    sub_event: KarinRequestType['sub_event']
    /**
     * - 事件对应的内容参数
     */
    content: KarinRequestType['content']
  }) {
    this.self_id = self_id
    this.user_id = user_id
    this.group_id = contact.scene === 'group' ? (contact.peer || group_id) : group_id
    this.time = time
    this.event = EventType.Request
    this.event_id = event_id
    this.contact = contact
    this.sender = sender
    this.sub_event = sub_event
    this.content = content
    this.isMaster = false
    this.isAdmin = false
    this.isPrivate = false
    this.isGroup = false
    this.isGuild = false
    this.isGroupTemp = false
    this.logFnc = ''
    this.logText = ''
    this.store = new Map()
    this.raw_message = ''
  }
}
