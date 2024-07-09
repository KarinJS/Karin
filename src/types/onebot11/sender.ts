export type OB11Sex = 'male' | 'female' | 'unknown'
export type OB11Role = 'owner' | 'admin' | 'member' | ''

export interface PrivateSender {
  /**
   * - 发送者 QQ 号
   */
  user_id: string
  /**
   * - 昵称 不存在则为空字符串
   */
  nickname: string
  /**
   * - 性别
   */
  sex?: OB11Sex
  /**
   * - 年龄
   */
  age?: number
}

export interface GroupSender {
  /**
   * - 发送者 QQ 号
   */
  user_id: string
  /**
   * - 昵称 不存在则为空字符串
   */
  nickname: string
  /**
   * - 性别
   */
  sex?: OB11Sex
  /**
   * - 年龄
   */
  age?: number
  /**
   * - 群名片/备注
   */
  card?: string
  /**
   * - 地区
   */
  area?: string
  /**
   * - 成员等级
   */
  level?: string
  /**
   * - 角色 不存在则为空字符串
   */
  role: OB11Role
  /**
   * - 专属头衔
   */
  title?: string
}

export type ob11Sender = PrivateSender | GroupSender
