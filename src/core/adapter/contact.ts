/** 事件来源枚举 */
export const enum Scene {
  /** 群 */
  GROUP = 'group',
  /** 好友 */
  FRIEND = 'friend',
  /** 频道 */
  GUILD = 'guild',
  /** 频道私信 */
  GUILD_DIRECT = 'direct',
  /** 临时群会话 */
  GROUP_TEMP = 'groupTemp',
}

/** 具有 sub_peer 的事件联系人信息 */
export interface ContactWithSubPeer<T extends Scene.GUILD | Scene.GUILD_DIRECT> {
  /** 事件来源场景 */
  scene: T
  /** 事件来源id 群号或者用户id */
  peer: string
  /** 事件来源子id 仅在频道、频道私信和临时会话中存在 */
  sub_peer: string
}

/** 不具有 sub_peer 的事件联系人信息 */
export interface ContactWithoutSubPeer<T extends Exclude<Scene, Scene.GUILD | Scene.GUILD_DIRECT>> {
  /** 事件来源场景 */
  scene: T
  /** 事件来源id 群号或者用户id */
  peer: string
  /** 事件来源子id 不存在 */
  sub_peer?: undefined | null
}

/** 事件联系人信息的联合类型 */
export type Contact =
  | ContactWithSubPeer<Scene.GUILD>
  | ContactWithSubPeer<Scene.GUILD_DIRECT>
  | ContactWithoutSubPeer<Exclude<Scene, Scene.GUILD | Scene.GUILD_DIRECT>>
