import type { WriteStream } from 'node:fs'
import type { Elements } from '../segment'
import type { Role, Sex } from '../event'

/**
 * 存档消息记录
 */
export interface SandboxMsgRecord {
  /** 消息类型 */
  type: 'friend' | 'group'
  /** 目标id */
  targetId: string
  /** 消息段 */
  elements: Elements[]
  /** 消息索引 */
  seq: number
  /** 消息id */
  messageId: string
  /** 消息时间 */
  time: number
  /** 消息状态 正常/撤回 */
  status: 'normal' | 'recall'
}

/**
 * 好友数据
 */
export interface FriendData {
  /** 好友ID */
  userId: string
  /** 好友昵称 */
  nick: string
  /** 好友性别 */
  sex: Sex
  /** 好友头像 */
  avatar: string
}

/**
 * 群数据
 */
export interface GroupData {
  /** 群ID */
  groupId: string
  /** 群昵称 */
  name: string
  /** 群头像 */
  avatar: string
}

/**
 * 群成员数据
 */
export interface GroupMemberData {
  /** 群ID */
  groupId: string
  /** 群成员ID */
  userId: string
  /** 群成员身份 */
  role: Role
  /** 群成员加入时间 */
  joinTime: number
  /** 群成员最后发言时间 */
  lastSpeakTime: number
  /** 群成员禁言时间 */
  muteTime: number
  /** 群成员群名片 */
  card: string
  /** 群成员群头衔 */
  title: string
}

/**
 * 数据库写入流状态
 */
export interface DbStreamStatus {
  /** 写入数量 */
  count: number
  /** 写入流 */
  stream: WriteStream | undefined
}

/**
 * 数据库写入流集合
 */
export interface DbStreams {
  /** 好友列表 */
  frinendList: DbStreamStatus
  /** 好友消息记录 */
  friendHistory: DbStreamStatus
  /** 好友通知 */
  friendNotice: DbStreamStatus
  /** 好友请求 */
  friendRequest: DbStreamStatus
  /** 群列表 */
  groupList: DbStreamStatus
  /** 群成员列表 */
  groupMemberList: DbStreamStatus
  /** 群消息记录 */
  groupHistory: DbStreamStatus
  /** 群通知 */
  groupNotice: DbStreamStatus
  /** 群请求 */
  groupRequest: DbStreamStatus
}
