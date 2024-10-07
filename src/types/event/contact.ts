/**
 * 事件来源枚举
 */
export const enum Scene {
  /** 群 */
  Group = 'group',
  /** 好友 */
  Private = 'friend',
  /** 频道 */
  Guild = 'guild',
  /** 频道私信 */
  GuildDirect = 'guild_direct',
  /** 临时会话 */
  Nearby = 'nearby',
  /** 陌生人 */
  Stranger = 'stranger',
  /** 临时群会话 */
  StrangerFromGroup = 'stranger_from_group',
}

/**
 * 事件联系人信息 也就是从哪来的这条消息
 */
export interface Contact<T extends `${Scene}` = `${Scene}`> {
  /** 事件来源场景 */
  scene: T
  /** 事件来源id 群号或者用户id */
  peer: string
  /** 事件来源子id 仅在频道和临时会话中存在 */
  sub_peer: T extends Scene.Guild | Scene.Nearby ? string : null
}
