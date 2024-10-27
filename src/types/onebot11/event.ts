import { OB11Segment } from './segment'
import { GroupSender, PrivateSender, ob11Sender } from './sender'

/**
 * OneBot11消息类型枚举
 */
export const enum OB11PostType {
  Message = 'message',
  Notice = 'notice',
  Request = 'request',
  MetaEvent = 'meta_event',
  MessageSent = 'message_sent',
}

/**
 * 消息事件类型
 */
export const enum OB11MessageType {
  Private = 'private',
  Group = 'group',
}

/**
 * 消息子类型
 */
export const enum OB11MessageSubType {
  Friend = 'friend',
  Group = 'group',
  Other = 'other',
  Normal = 'normal',
  Anonymous = 'anonymous',
  Notice = 'notice',
}

/**
 * 消息事件类型映射
 */
export interface ob11MessageEventMapp {
  [OB11MessageType.Group]: 'normal' | 'anonymous' | 'notice'
  [OB11MessageType.Private]: 'friend' | 'group' | 'other'
}

/**
 * 消息事件子类型泛型
 */
export type OB11MessageToSub<T extends OB11MessageType> = T extends keyof ob11MessageEventMapp ? ob11MessageEventMapp[T] : never

/**
 * 所有事件基类
 */
export interface OB11Event {
  /** 事件发生的时间戳 */
  time: number
  /** 事件类型 */
  post_type: OB11PostType
  /** 收到事件的机器人 QQ 号 */
  self_id: string
}

/**
 * 消息事件基类
 */
export interface OB11Message extends OB11Event {
  /** 事件类型 */
  post_type: OB11PostType.Message | OB11PostType.MessageSent
  /** 消息类型 */
  message_type: OB11MessageType[keyof OB11MessageType]
  /** 消息子类型 */
  sub_type: OB11MessageToSub<OB11MessageType>
  /** 消息 ID */
  message_id: string
  /** 发送者 QQ 号 */
  user_id: string
  /** 消息内容 */
  message: OB11Segment[]
  /** 原始消息内容 */
  raw_message: string
  /** 字体 */
  font: number
  /** 发送人信息 */
  sender: ob11Sender
}

/**
 * 私聊消息事件
 */
export interface OB11PrivateMessage extends OB11Message {
  /** 消息类型 */
  message_type: 'private'
  /** 消息子类型 */
  sub_type: 'friend'
  /** 发送人信息 */
  sender: PrivateSender
}

/**
 * 群消息事件
 */
export interface OB11GroupMessage extends OB11Message {
  /** 消息类型 */
  message_type: 'group'
  /** 消息子类型 */
  sub_type: 'normal' | 'anonymous' | 'notice'
  /** 群号 */
  group_id: string
  /** 匿名信息 */
  anonymous?: {
    /** 匿名用户 ID */
    id: string
    /** 匿名用户名称 */
    name: string
    /** 匿名用户 flag，在调用禁言 API 时需要传入 */
    flag: string
  }
  sender: GroupSender
}

/**
 * 通知事件类型
 */
export const enum OB11NoticeType {
  GroupUpload = 'group_upload',
  GroupAdmin = 'group_admin',
  GroupDecrease = 'group_decrease',
  GroupIncrease = 'group_increase',
  GroupBan = 'group_ban',
  FriendAdd = 'friend_add',
  GroupRecall = 'group_recall',
  FriendRecall = 'friend_recall',
  Notify = 'notify',
  GroupMsgEmojiLike = 'group_msg_emoji_like',
  GroupMsgEmojiLikeLagrange = 'reaction',
}

/**
 * 通知事件基类
 */
export interface OneBot11Notice extends OB11Event {
  /** 事件类型 */
  post_type: OB11PostType.Notice
  /** 通知类型 */
  notice_type: OB11NoticeType
}

/**
 * 群文件上传事件
 */
export interface OneBot11GroupUpload extends OneBot11Notice {
  /** 通知类型 */
  notice_type: | OB11NoticeType.GroupUpload
  /** 群号 */
  group_id: string
  /** 发送者 QQ 号 */
  user_id: string
  /** 文件信息 */
  file: {
    /** 文件 ID */
    id: string
    /** 文件名 */
    name: string
    /** 文件大小（字节数） */
    size: number
    /** busid（目前不清楚有什么作用） */
    busid: number
  }
}

/**
 * 群管理员变动事件
 */
export interface OneBot11GroupAdmin extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.GroupAdmin
  /** 事件子类型，分别表示设置和取消管理员 */
  sub_type: 'set' | 'unset'
  /** 群号 */
  group_id: string
  /** 管理员 QQ 号 */
  user_id: string
}

/**
 * 群减少事件
 */
export interface OneBot11GroupDecrease extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.GroupDecrease
  /** 事件子类型，分别表示主动退群、成员被踢、登录号被踢 */
  sub_type: 'leave' | 'kick' | 'kickBot'
  /** 群号 */
  group_id: string
  /** 操作者 QQ 号（如果是主动退群，则和 user_id 相同） */
  operator_id: string
  /** 离开者 QQ 号 */
  user_id: string
}

/**
 * 群增加事件
 */
export interface OneBot11GroupIncrease extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.GroupIncrease
  /** 事件子类型，分别表示管理员已同意入群、管理员邀请入群 */
  sub_type: 'approve' | 'invite'
  /** 群号 */
  group_id: string
  /** 操作者 QQ 号 */
  operator_id: string
  /** 加入者 QQ 号 */
  user_id: string
}

/**
 * 群禁言事件
 */
export interface OneBot11GroupBan extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.GroupBan
  /** 事件子类型，分别表示禁言、解除禁言 */
  sub_type: 'ban' | 'lift_ban'
  /** 群号 */
  group_id: string
  /** 操作者 QQ 号 */
  operator_id: string
  /** 被禁言 QQ 号 */
  user_id: string
  /** 禁言时长，单位秒 */
  duration: number
}

/**
 * 新添加好友事件
 */
export interface OneBot11FriendAdd extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.FriendAdd
  /** 新添加好友 QQ 号 */
  user_id: string
}

/**
 * 群撤回事件
 */
export interface OneBot11GroupRecall extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.GroupRecall
  /** 群号 */
  group_id: string
  /** 消息发送者 QQ 号 */
  user_id: string
  /** 操作者 QQ 号 */
  operator_id: string
  /** 被撤回的消息 ID */
  message_id: string
}

/**
 * 好友消息撤回事件
 */
export interface OneBot11FriendRecall extends OneBot11Notice {
  /** 通知类型 */
  notice_type: OB11NoticeType.FriendRecall
  /** 好友 QQ 号 */
  user_id: string
  /** 被撤回的消息 ID */
  message_id: string
}

/**
 * 戳一戳事件
 */
export interface OneBot11Poke extends OneBot11Notice {
  /** 消息类型 */
  notice_type: OB11NoticeType.Notify
  /** 提示类型 */
  sub_type: 'poke'
  /** 群号 */
  group_id: string
  /** 发送者 QQ 号 */
  user_id: string
  /** 被戳者 QQ 号 */
  target_id: string
}

/**
 * 运气王事件
 */
export interface OneBot11LuckyKing extends OneBot11Notice {
  /** 消息类型 */
  notice_type: OB11NoticeType.Notify
  /** 提示类型 */
  sub_type: 'lucky_king'
  /** 群号 */
  group_id: string
  /** 红包发送者 QQ 号 */
  user_id: string
  /** 运气王 QQ 号 */
  target_id: string
}

/**
 * 荣誉变更事件
 */
export interface OneBot11Honor extends OneBot11Notice {
  /** 消息类型 */
  notice_type: OB11NoticeType.Notify
  /** 提示类型 */
  sub_type: 'honor'
  /** 群号 */
  group_id: string
  /** 荣誉类型，分别表示龙王、群聊之火、快乐源泉 */
  honor_type: 'talkative' | 'performer' | 'emotion'
  /** 成员 QQ 号 */
  user_id: string
}

/**
 * 群表情回应事件
 */
export interface OneBot11GroupMessageReaction extends OneBot11Notice {
  /** 消息类型 */
  notice_type: OB11NoticeType.GroupMsgEmojiLike
  /** 群号 */
  group_id: string
  /** 发送者 QQ 号 */
  user_id: string
  /** 消息 ID */
  message_id: string
  /** 表情信息 此处目前只有llob有 */
  likes: Array<{
    count: number
    /** 表情ID参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType */
    emoji_id: number
  }>
}

/**
 * 群表情回应事件 Lagrange
 */
export interface OneBot11GroupMessageReactionLagrange extends OneBot11Notice {
  /** 消息类型 */
  notice_type: OB11NoticeType.GroupMsgEmojiLikeLagrange
  /** 提示类型 */
  sub_type: 'remove' | 'add'
  /** 群号 */
  group_id: string
  /** 发送者 QQ 号 */
  operator_id: string
  /** 消息 ID */
  message_id: string
  /** 表情ID */
  code: string
  /** 表情数量 */
  count: number
}

/**
 * 请求事件类型
 */
export const enum OB11RequestType {
  Friend = 'friend',
  Group = 'group',
}

/**
 * 请求事件基类
 */
export interface OneBot11Request extends OB11Event {
  /** 事件发生的时间戳 */
  time: number
  /** 事件类型 */
  post_type: OB11PostType.Request
  /** 收到事件的机器人 QQ 号 */
  self_id: string
  /** 请求类型 */
  request_type: OB11RequestType.Friend | OB11RequestType.Group
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
  /** 发送请求的 QQ 号 */
  user_id: string
  /** 验证信息 */
  comment: string
}

/**
 * 好友请求事件
 */
export interface OneBot11FriendRequest extends OneBot11Request {
  /** 请求类型 */
  request_type: OB11RequestType.Friend
}

/**
 * 群请求事件
 */
export interface OneBot11GroupRequest extends OneBot11Request {
  /** 请求类型 */
  request_type: OB11RequestType.Group
  /** 请求子类型，分别表示加群请求、邀请登录号入群 */
  sub_type: 'add' | 'invite'
  /** 群号 */
  group_id: string
}

/**
 * 元事件基类
 */
export interface OneBot11MetaEvent extends OB11Event {
  /** 事件类型 */
  post_type: OB11PostType.MetaEvent
  /** 元事件类型 */
  meta_event_type: 'lifecycle' | 'heartbeat'
}

/**
 * 生命周期元事件
 */
export interface OneBot11Lifecycle extends OneBot11MetaEvent {
  /** 元事件类型 */
  meta_event_type: 'lifecycle'
  /** 事件子类型，分别表示 OneBot 启用、停用、WebSocket 连接成功 */
  sub_type: 'enable' | 'disable' | 'connect'
}

/**
 * 心跳元事件
 */
export interface OneBot11Heartbeat extends OneBot11MetaEvent {
  /** 元事件类型 */
  meta_event_type: 'heartbeat'
  /** 状态信息 */
  status: {
    /** 到下次心跳的间隔，单位毫秒 */
    interval: number
  }
}

/**
 * 所有消息事件类型
 */
export type OB11MessageEvent = OB11PrivateMessage | OB11GroupMessage

/**
 * 所有通知事件类型
 */
export type OB11NoticeEvent = OneBot11GroupUpload | OneBot11GroupAdmin | OneBot11GroupDecrease | OneBot11GroupIncrease | OneBot11GroupBan | OneBot11FriendAdd | OneBot11GroupRecall | OneBot11FriendRecall | OneBot11Poke | OneBot11LuckyKing | OneBot11Honor | OneBot11GroupMessageReaction | OneBot11GroupMessageReactionLagrange

/**
 * 所有请求事件类型
 */
export type OB11RequestEvent = OneBot11FriendRequest | OneBot11GroupRequest

/**
 * 所有元事件类型
 */
export type OB11MetaEvent = OneBot11Lifecycle | OneBot11Heartbeat

/**
 * 所有事件类型
 */
export type OB11EventAll = OB11MessageEvent | OB11NoticeEvent | OB11RequestEvent | OB11MetaEvent

export interface EventMap {
  [OB11PostType.Message]: OB11MessageEvent
  [OB11PostType.MessageSent]: OB11MessageEvent
  [OB11PostType.Notice]: OB11NoticeEvent
  [OB11PostType.Request]: OB11RequestEvent
  [OB11PostType.MetaEvent]: OB11MetaEvent
}

/**
 * 事件泛型 传入 post_type 返回对应的事件类型
 */
export type EventByPostType<T extends OB11PostType> = T extends keyof EventMap ? EventMap[T] : never
