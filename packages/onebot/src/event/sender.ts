/**
 * 群聊角色枚举
 */
export enum GroupRole {
  /** 群主 */
  Owner = 'owner',
  /** 管理员 */
  Admin = 'admin',
  /** 成员 */
  Member = 'member',
}

/** 性别枚举 */
export enum Sex {
  /** 男 */
  Male = 'male',
  /** 女 */
  Female = 'female',
  /** 未知 */
  Unknown = 'unknown',
}

/**
 * 发送者 私聊
 */
export interface SenderPrivate {
  /** 发送者 QQ 号 */
  user_id: number
  /** 昵称 不存在则为空字符串 */
  nickname: string
  /** 性别 */
  sex: Sex
  /** 年龄 */
  age: number
}

/**
 * 发送者 群聊
 */
export interface SenderGroup extends SenderPrivate {
  /** 群名片/备注 */
  card: string
  /** 地区 */
  area: string
  /** 成员等级 */
  level: string
  /** 角色 */
  role: GroupRole
  /** 专属头衔 */
  title: string
}

/**
 * 发送者
 */
export type Sender = SenderPrivate | SenderGroup
