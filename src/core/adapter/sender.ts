/** 群身份枚举 值不存在时为unknown */
export const enum RoleEnum {
  /** 群主 */
  OWNER = 'owner',
  /** 群管理员 */
  ADMIN = 'admin',
  /** 群成员 */
  MEMBER = 'member',
  /** 未知身份 */
  UNKNOWN = 'unknown',
}

/** 权限类型枚举 */
export const enum PermissionEnum {
  /** 所有权限 */
  ALL = 'all',
  /** Bot主人 */
  MASTER = 'master',
  /** Bot管理员 */
  ADMIN = 'admin',
  /** 群主 */
  GROUP_OWNER = 'group.owner',
  /** 群管理 */
  GROUP_ADMIN = 'group.admin',
  /** 频道主 */
  Guild_OWNER = 'guild.owner',
  /** 频道管理 */
  Guild_ADMIN = 'guild.admin',
}

/** 事件发送者信息 */
export interface Sender {
  /** 发送者用户ID */
  userId: string
  /** 发送者uid */
  uid: string | null
  /** 发送者uin */
  uin: string | null
  /** 发送者昵称 */
  nick: string
  /** 发送者在群的角色身份 非群、频道场景为`unknown` */
  role: RoleEnum
}
