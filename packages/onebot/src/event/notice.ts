import { EventPostType } from './event'
import type { EventBase } from './event'

/**
 * 通知类型枚举
 */
export enum NoticeType {
  /** 群文件上传 */
  GroupUpload = 'group_upload',
  /** 群管理员变动 */
  GroupAdmin = 'group_admin',
  /** 群成员减少 */
  GroupDecrease = 'group_decrease',
  /** 群成员增加 */
  GroupIncrease = 'group_increase',
  /** 群禁言 */
  GroupBan = 'group_ban',
  /** 好友添加 */
  FriendAdd = 'friend_add',
  /** 群消息撤回 */
  GroupRecall = 'group_recall',
  /** 好友消息撤回 */
  FriendRecall = 'friend_recall',
  /** 通知 */
  Notify = 'notify',
  /** napcat表情回应 */
  Nc_EmojiLike = 'group_msg_emoji_like',
  /** Lagrange表情回应 */
  Lgl_EmojiLike = 'reaction',
  /** 精华消息变动 */
  GroupEssence = 'essence',
  /** 群成员名片更新 */
  GroupCard = 'group_card',
  /** 好友离线文件 Lagrange.OneBot */
  Lgl_FriendOfflineFile = 'offline_file',
}

/**
 * 群管理员变动子类型枚举
 */
export enum GroupAdminSubType {
  /** 设置管理员 */
  Set = 'set',
  /** 取消管理员 */
  Unset = 'unset',
}

/**
 * 群成员减少子类型枚举
 */
export enum GroupDecreaseSubType {
  /** 主动退群 */
  Leave = 'leave',
  /** 成员被踢 */
  Kick = 'kick',
  /** 登录号被踢 */
  KickMe = 'kick_me',
}

/**
 * 群成员增加子类型枚举
 */
export enum GroupIncreaseSubType {
  /** 管理员已同意入群 */
  Approve = 'approve',
  /** 管理员邀请入群 */
  Invite = 'invite',
}

/**
 * 群禁言子类型枚举
 */
export enum GroupBanSubType {
  /** 禁言 */
  Ban = 'ban',
  /** 解除禁言 */
  LiftBan = 'lift_ban',
}

/**
 * 通知子类型枚举
 */
export enum NotifySubType {
  /** 戳一戳 */
  Poke = 'poke',
  /** 红包运气王 */
  LuckyKing = 'lucky_king',
  /** 群成员荣誉变更 */
  Honor = 'honor',
}

/**
 * 群成员荣誉类型枚举
 */
export enum HonorType {
  /** 龙王 */
  Talkative = 'talkative',
  /** 群聊之火 */
  Performer = 'performer',
  /** 快乐源泉 */
  Emotion = 'emotion',
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  /** 文件 ID */
  id: string
  /** 文件名 */
  name: string
  /** 文件大小（字节数） */
  size: number
  /** busid */
  busid: number
}

/**
 * 群文件上传通知事件
 */
export interface GroupUploadNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupUpload
  /** 群号 */
  group_id: number
  /** 发送者 QQ 号 */
  user_id: number
  /** 文件信息 */
  file: FileInfo
}

/**
 * 群管理员变动通知事件
 */
export interface GroupAdminNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupAdmin
  /** 事件子类型 */
  sub_type: GroupAdminSubType
  /** 群号 */
  group_id: number
  /** 管理员 QQ 号 */
  user_id: number
}

/**
 * 群成员减少通知事件
 */
export interface GroupDecreaseNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupDecrease
  /** 事件子类型 */
  sub_type: GroupDecreaseSubType
  /** 群号 */
  group_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 离开者 QQ 号 */
  user_id: number
}

/**
 * 群成员增加通知事件
 */
export interface GroupIncreaseNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupIncrease
  /** 事件子类型 */
  sub_type: GroupIncreaseSubType
  /** 群号 */
  group_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 加入者 QQ 号 */
  user_id: number
}

/**
 * 群禁言通知事件
 */
export interface GroupBanNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupBan
  /** 事件子类型 */
  sub_type: GroupBanSubType
  /** 群号 */
  group_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 被禁言 QQ 号 */
  user_id: number
  /** 禁言时长，单位秒 */
  duration: number
}

/**
 * 好友添加通知事件
 */
export interface FriendAddNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.FriendAdd
  /** 新添加好友 QQ 号 */
  user_id: number
}

/**
 * 群消息撤回通知事件
 */
export interface GroupRecallNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupRecall
  /** 群号 */
  group_id: number
  /** 消息发送者 QQ 号 */
  user_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 被撤回的消息 ID */
  message_id: number
}

/**
 * 好友消息撤回通知事件
 */
export interface FriendRecallNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.FriendRecall
  /** 好友 QQ 号 */
  user_id: number
  /** 被撤回的消息 ID */
  message_id: number
}

/**
 * 群内戳一戳通知事件
 */
export interface PokeNotifyEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.Notify
  /** 提示类型 */
  sub_type: NotifySubType.Poke
  /** 群号 */
  group_id: number
  /** 发送者 QQ 号 */
  user_id: number
  /** 被戳者 QQ 号 */
  target_id: number
}

/**
 * 群红包运气王通知事件
 */
export interface LuckyKingNotifyEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.Notify
  /** 提示类型 */
  sub_type: NotifySubType.LuckyKing
  /** 群号 */
  group_id: number
  /** 红包发送者 QQ 号 */
  user_id: number
  /** 运气王 QQ 号 */
  target_id: number
}

/**
 * 群成员荣誉变更通知事件
 */
export interface HonorNotifyEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.Notify
  /** 提示类型 */
  sub_type: NotifySubType.Honor
  /** 群号 */
  group_id: number
  /** 荣誉类型 */
  honor_type: HonorType
  /** 成员 QQ 号 */
  user_id: number
}

/**
 * Napcat 群消息表情回应通知事件
 */
export interface NcGroupEmojiLikeNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.Nc_EmojiLike
  /** 群号 */
  group_id: number
  /** 发送者 QQ 号 */
  user_id: number
  /** 消息 ID */
  message_id: number
  /** 表情信息 */
  likes: Array<{
    count: number
    /** 表情ID参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType */
    emoji_id: number
  }>
}

/**
 * Lagrange 表情回应通知事件
 */
export interface LglEmojiLikeNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.Lgl_EmojiLike
  /** 提示类型 */
  sub_type: 'remove' | 'add'
  /** 群号 */
  group_id: number
  /** 发送者 QQ 号 */
  operator_id: number
  /** 消息 ID */
  message_id: number
  /** 表情ID */
  code: string
  /** 表情数量 */
  count: number
}

/**
 * 精华消息变动通知事件
 */
export interface GroupEssenceNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupEssence
  /** 操作类型 */
  sub_type: 'add' | 'delete'
  /** 群号 */
  group_id: number
  /** 精华消息 ID */
  message_id: number
  /** 消息发送者 */
  sender_id: number
  /** 操作者id */
  operator_id: number
}

/**
 * 群成员名片更新通知事件
 */
export interface GroupCardNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.GroupCard
  /** 通知类型 */
  time: number,
  /** 事件类型 */
  self_id: number,
  /** 群号 */
  group_id: number,
  /** 用户ID */
  user_id: number,
  /** 新名片 */
  card_new: string,
  /** 旧名片 */
  card_old: string,
}

/**
 * Lagrange 好友离线文件通知事件
 */
export interface LglFriendOfflineFileNoticeEvent extends EventBase {
  /** 通知事件 */
  post_type: EventPostType.Notice
  /** 通知类型 */
  notice_type: NoticeType.Lgl_FriendOfflineFile
  /** 好友 QQ 号 */
  user_id: number
  /** 文件信息 */
  file: {
    /** 文件 ID */
    id: string
    /** 文件名 */
    name: string
    /** 文件大小 */
    size: number
    /** 文件 hash */
    hash: string
    /** 文件 URL */
    url: string
  }
}

/** OneBot 通知事件类型 */
export type OneBotNoticeEvent =
  | GroupUploadNoticeEvent
  | GroupAdminNoticeEvent
  | GroupDecreaseNoticeEvent
  | GroupIncreaseNoticeEvent
  | GroupBanNoticeEvent
  | FriendAddNoticeEvent
  | GroupRecallNoticeEvent
  | FriendRecallNoticeEvent
  | PokeNotifyEvent
  | LuckyKingNotifyEvent
  | HonorNotifyEvent
  | NcGroupEmojiLikeNoticeEvent
  | LglEmojiLikeNoticeEvent
  | GroupEssenceNoticeEvent
  | GroupCardNoticeEvent
  | LglFriendOfflineFileNoticeEvent
