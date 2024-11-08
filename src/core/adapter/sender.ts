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

/** 性别枚举 */
export const enum SexEnum {
  /** 男 */
  Male = 'male',
  /** 女 */
  Female = 'female',
  /** 未知 */
  Unknown = 'unknown',
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

/** 通知及请求事件发送者信息 */
export interface NoticeAndRequestSender {
  /** 发送者QQ号 */
  userId: string
  /** 发送者昵称 */
  nick: string
}

/** 私聊发送者信息 */
export interface FriendSender {
  /** 发送者QQ号 */
  userId: string
  /** 发送者昵称 */
  nick: string
  /** 发送者性别 */
  sex?: `${SexEnum}`
  /** 发送者年龄 */
  age?: number
  /** 发送者uid */
  uid?: string
  /** 发送者uin */
  uin?: number
}

/** 群发送者信息 */
export interface GroupSender extends FriendSender {
  /** 发送者QQ号 */
  userId: string
  /** 发送者昵称 */
  nick: string
  /** 发送者在群的角色身份 非群、频道场景为`unknown` */
  role: `${RoleEnum}`
  /** 发送者性别 */
  sex?: `${SexEnum}`
  /** 发送者年龄 */
  age?: number
  /** 群名片/备注 */
  card?: string
  /** 地区 */
  area?: string
  /** 成员等级 */
  level?: number
  /** 专属头衔 */
  title?: string
  /** 发送者uid */
  uid?: string
  /** 发送者uin */
  uin?: number
}

/** 发送者 */
export type Sender = FriendSender | GroupSender | NoticeAndRequestSender
