/**
 * - 群身份枚举 值不存在时为unknown
 */
export const enum Role {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
  Unknown = 'unknown',
}

/**
 * - 权限类型枚举
 */
export const enum Permission {
  All = 'all',
  Master = 'master',
  Admin = 'admin',
  GroupOwner = 'group.owner',
  GroupAdmin = 'group.admin',
}

/**
 * - 事件发送者信息
 */
export interface Sender {
  /**
   * - 发送者uid
   */
  uid: string
  /**
   * - 发送者uin
   */
  uin: string
  /**
   * - 发送者昵称
   */
  nick: string | ''
  /**
   * - 发送者在群的角色身份
   */
  role: Role
}
