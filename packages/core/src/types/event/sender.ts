/* eslint-disable @stylistic/indent */
import { Scene } from './contact'

/**
 * 事件发送者性别
 * - `male` 男
 * - `female` 女
 * - `unknown` 未知
 */
export type Sex = 'male' | 'female' | 'unknown'

/**
 * 事件发送者身份 仅在群聊、频道中存在
 * - `owner` 群主、频道主
 * - `admin` 管理员、超管
 * - `member` 群成员、频道成员
 * - `unknown` 未知身份
 */
export type Role = 'owner' | 'admin' | 'member' | 'unknown'

/**
 * 事件发送者信息父类
 */
export interface SenderBase {
  /** 发送者ID */
  userId: string
  /** 发送者昵称 与`name`一致 */
  nick: string
  /** 发送者昵称 与`nick`一致 */
  name: string
  /** 发送者性别 */
  sex?: Sex
  /** 发送者年龄 */
  age?: number
  /** 发送者uid QQ场景专属 */
  uid?: string
  /** 发送者uin QQ场景专属 */
  uin?: number
}

/**
 * - 好友事件发送者信息
 * - tips: 如果名称不存在则是空字符串
 */
export type FriendSender = SenderBase

/**
 * - 群聊事件发送者信息
 * - tips: 如果名称不存在则是空字符串
 */
export interface GroupSender extends SenderBase {
  /** 群成员身份 */
  role: Role
  /** 群名片/备注 */
  card?: string
  /** 地区 */
  area?: string
  /** 成员等级 */
  level?: number
  /** 专属头衔 */
  title?: string
}

/**
 * - 群聊临时会话事件发送者信息
 * - tips: 如果名称不存在则是空字符串
 */
export type GroupTempSender = SenderBase

/**
 * - 频道事件发送者信息
 * - tips: 如果名称不存在则是空字符串
 */
export interface GuildSender extends SenderBase {
  /** 频道成员身份 */
  role: Role
}

/**
 * - 频道私信事件发送者信息
 * - tips: 如果名称不存在则是空字符串
 */
export type DirectSender = SenderBase

/**
 * 事件发送者信息
 * - `friend`: 好友
 * - `group`: 群聊
 * - `guild`: 频道
 * - `direct`: 频道私信
 * - `groupTemp`: 临时群会话
 * - `notice`: 通知
 * - `request`: 请求
 */
export type Sender<T extends Scene = Scene> =
  T extends 'friend'
  ? FriendSender : T extends 'group'
  ? GroupSender : T extends 'guild'
  ? GuildSender : T extends 'direct'
  ? DirectSender : T extends 'groupTemp'
  ? GroupTempSender : never

/** 构建群聊场景的`sender`函数重载类型 */
export interface SenderGroup {
  /**
   * 构建群聊场景的`sender`
   * @param userId 用户ID
   * @param role 群成员身份
   * @param name 用户名
   * @param sex 性别
   * @param age 年龄
   * @param card 群名片/备注
   * @param area 地区
   * @param level 成员等级
   * @param title 专属头衔
   * @param uid QQ场景专属
   * @param uin QQ场景专属
   */
  (
    userId: Sender<'group'>['userId'],
    role?: Sender<'group'>['role'],
    name?: Sender<'group'>['name'],
    sex?: Sender<'friend'>['sex'],
    age?: Sender<'friend'>['age'],
    card?: Sender<'group'>['card'],
    area?: Sender<'group'>['area'],
    level?: Sender<'group'>['level'],
    title?: Sender<'group'>['title'],
    uid?: Sender<'friend'>['uid'],
    uin?: Sender<'friend'>['uin']
  ): Sender<'group'>
  (options: Sender<'group'>): Sender<'group'>
}
