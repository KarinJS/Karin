/** 事件来源枚举 */
export type Scene = 'group' | 'friend' | 'guild' | 'direct' | 'groupTemp'
// export const enum Scene {
//   /** 群 */
//   GROUP = 'group',
//   /** 好友 */
//   FRIEND = 'friend',
//   /** 频道 */
//   GUILD = 'guild',
//   /** 频道私信 */
//   DIRECT = 'direct',
//   /** 临时群会话 */
//   GROUP_TEMP = 'groupTemp',
// }

/** 具有 sub_peer 的事件联系人信息 */
export interface ContactWithSubPeer<
  T extends 'guild' | 'direct' | 'groupTemp' = 'guild' | 'direct' | 'groupTemp'
> {
  /** 事件来源场景 */
  scene: `${T}`
  /** 事件来源id 群号或者用户id */
  peer: string
  /** 事件来源子id 仅在频道、频道私信和临时会话中存在 */
  subPeer: string
  /** @deprecated 即将废弃 请使用 `subPeer` */
  sub_peer: string
}

/** 不具有 sub_peer 的事件联系人信息 */
export interface ContactWithoutSubPeer<
  T extends 'friend' | 'group' = 'friend' | 'group'
> {
  /** 事件来源场景 */
  scene: `${T}`
  /** 事件来源id 群号或者用户id */
  peer: string
  /** 事件来源子id 不存在 */
  subPeer?: undefined | null
  /** @deprecated 即将废弃 请使用 `subPeer` */
  sub_peer?: undefined | null
}

/** 事件联系人信息的泛型类型 */
export type Contact<T extends `${Scene}` = `${Scene}`> = T extends 'guild' | 'direct' | 'groupTemp'
  ? ContactWithSubPeer
  : ContactWithoutSubPeer
