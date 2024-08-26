/**
 * - 事件来源枚举
 */
export const enum Scene {
  Group = 'group',
  Private = 'friend',
  Guild = 'guild',
  Nearby = 'nearby',
  Stranger = 'stranger',
  StrangerFromGroup = 'stranger_from_group',
}

/**
 * - 事件联系人信息 也就是从哪来的这条消息
 */
export interface Contact {
  /**
   * - 事件来源场景
   */
  scene: `${Scene}`
  /**
   * - 事件来源id 群号或者用户id
   */
  peer: string
  /**
   * - 事件来源子id 仅在频道和临时会话中存在
   */
  sub_peer?: string
}
