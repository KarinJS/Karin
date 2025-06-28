import { EventPostType } from './event'
import type { EventBase } from './event'

/**
 * 请求类型枚举
 */
export enum RequestType {
  /** 好友请求 */
  Friend = 'friend',
  /** 群请求 */
  Group = 'group',
}

/**
 * 群请求子类型枚举
 */
export enum GroupRequestSubType {
  /** 加群请求 */
  Add = 'add',
  /** 邀请入群 */
  Invite = 'invite',
}

/**
 * 加好友请求事件类型
 */
export interface FriendRequestEvent extends EventBase {
  /** 请求事件 */
  post_type: EventPostType.Request
  /** 请求类型 */
  request_type: RequestType.Friend
  /** 发送请求的用户 QQ 号 */
  user_id: number
  /** 验证信息 */
  comment: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}

/**
 * 加群请求/邀请事件类型
 */
export interface GroupRequestEvent extends EventBase {
  /** 请求事件 */
  post_type: EventPostType.Request
  /** 请求类型 */
  request_type: RequestType.Group
  /** 请求子类型，分别表示加群请求、邀请登录号入群 */
  sub_type: GroupRequestSubType
  /** 群号 */
  group_id: number
  /** 发送请求的用户 QQ 号 */
  user_id: number
  /** 验证信息 */
  comment: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}

/** OneBot 请求事件类型 */
export type OneBotRequestEvent = FriendRequestEvent | GroupRequestEvent
