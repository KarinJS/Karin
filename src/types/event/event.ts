import { Sender } from './sender'
import { Contact } from './contact'
import { KarinAdapter } from 'karin/types'
import { Reply, replyCallback } from './reply'

/**
 * 事件类型枚举
 */
export const enum EventType {
  /**
   * - 消息事件
   */
  Message = 'message',
  /**
   * - 通知事件
   */
  Notice = 'notice',
  /**
   * - 请求事件
   */
  Request = 'request'
}

/**
 * 消息事件子类型枚举
 */
export const enum MessageSubType {
  /**
   * - 群消息
   */
  GroupMessage = 'group_message',
  /**
   * - 私聊消息
   */
  PrivateMessage = 'private_message',
  /**
   * - 频道消息
   */
  GuildMessage = 'guild_message',
  /**
   * - 附近消息
   */
  Nearby = 'nearby',
  /**
   * - 陌生人消息
   */
  Stranger = 'stranger'
}

/**
 * 通知事件子类型枚举
 */
export const enum NoticeSubType {
  /**
   * - 私聊戳一戳
   */
  PrivatePoke = 'private_poke',
  /**
   * - 私聊撤回消息
   */
  PrivateRecall = 'private_recall',
  /**
   * - 私聊发送文件
   */
  PrivateFileUploaded = 'private_file_uploaded',
  /**
   * - 群聊戳一戳
   */
  GroupPoke = 'group_poke',
  /**
   * - 群聊名片变动
   */
  GroupCardChanged = 'group_card_changed',
  /**
   * - 群聊成员头衔变动
   */
  GroupMemberUniqueTitleChanged = 'group_member_unique_title_changed',
  /**
   * - 群聊精华消息变动
   */
  GroupEssenceChanged = 'group_essence_changed',
  /**
   * - 群聊撤回消息
   */
  GroupRecall = 'group_recall',
  /**
   * - 群聊成员增加
   */
  GroupMemberIncrease = 'group_member_increase',
  /**
   * - 群聊成员减少
   */
  GroupMemberDecrease = 'group_member_decrease',
  /**
   * - 群聊管理员变动
   */
  GroupAdminChanged = 'group_admin_changed',
  /**
   * - 群聊成员禁言
   */
  GroupMemberBan = 'group_member_ban',
  /**
   * - 群聊签到
   */
  GroupSignIn = 'group_sign_in',
  /**
   * - 群聊全员禁言
   */
  GroupWholeBan = 'group_whole_ban',
  /**
   * - 群聊发送文件
   */
  GroupFileUploaded = 'group_file_uploaded',
  /**
   * - 群聊消息表情动态回应
   */
  GroupMessageReaction = 'group_message_reaction'
}

/**
 * 请求事件子类型枚举
 */
export const enum RequestSubType {
  /**
   * - 好友申请
   */
  PrivateApply = 'private_apply',
  /**
   * - 群聊申请
   */
  GroupApply = 'group_apply',
  /**
   * - 邀请入群
   */
  InvitedGroup = 'invited_group'
}

/**
 * - 类型映射
 */
export type EventToSubEvent = {
  [EventType.Message]: MessageSubType
  [EventType.Notice]: NoticeSubType
  [EventType.Request]: RequestSubType
}

/**
 * 所有消息事件类型
 */
export type AllMessageSubType = `${EventType.Message}` | `${EventType.Message}.${MessageSubType}`

/**
 * 所有通知事件类型
 */
export type AllNoticeSubType = `${EventType.Notice}` | `${EventType.Notice}.${NoticeSubType}`

/**
 * 所有请求事件类型
 */
export type AllRequestSubType = `${EventType.Request}` | `${EventType.Request}.${RequestSubType}`

/**
 * 所有组合事件类型
 */
export type CombinedEventType = AllMessageSubType | AllNoticeSubType | AllRequestSubType

/**
 * 所有监听事件
 */
export type AllListenEvent = `${EventType}` | `${CombinedEventType}`

/**
 * 事件基类定义
 */
export interface KarinEventType {
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
  event: EventType
  /**
   * - 事件子类型
   */
  sub_event: EventToSubEvent[EventType]
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
  contact: Contact
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
   * - 原始消息
   */
  raw_message: string
  /**
   * - 原始事件字段
   */
  raw_event: any
  /**
   * - 回复函数
   */
  reply: Reply
  /**
   * - 回复函数 由适配器实现，开发者不应该直接调用
   */
  replyCallback: replyCallback
  /**
   * - bot实例
   */
  bot: KarinAdapter
}

/**
 * - 基本事件参数
 */
export interface BaseEventDataType {
  /**
   * - 机器人ID 请尽量使用UID
   */
  self_id: KarinEventType['self_id']
  /**
   * - 用户ID
   */
  user_id: KarinEventType['user_id']
  /**
   * - 群ID 仅在群聊中需要提供
   */
  group_id?: KarinEventType['group_id']
  /**
   * - 事件触发时间戳
   */
  time: KarinEventType['time']
  /**
   * - 事件联系人信息
   */
  contact: KarinEventType['contact']
  /**
   * - 事件发送者信息
   */
  sender: KarinEventType['sender']
  /**
   * - 事件子类型
   */
  sub_event: KarinEventType['sub_event']
  /**
   * - 事件ID
   */
  event_id: KarinEventType['event_id']
  /**
   * - 原始事件字段
   */
  raw_event: KarinEventType['raw_event']
}
