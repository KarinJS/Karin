/** 群身份枚举 值不存在时为unknown */
export const enum RoleEnum {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  UNKNOWN = 'unknown',
}

/** 权限类型枚举 */
export const enum PermissionEnum {
  ALL = 'all',
  MASTER = 'master',
  ADMIN = 'admin',
  GROUP_OWNER = 'group.owner',
  GROUP_ADMIN = 'group.admin',
}

/** 事件发送者信息 */
export interface Sender {
  /** 发送者uid */
  uid: string
  /** 发送者uin */
  uin: string
  /** 发送者昵称 */
  nick: string
  /** 发送者在群的角色身份 */
  role: RoleEnum
}
