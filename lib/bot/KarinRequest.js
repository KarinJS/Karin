import { KarinEvent } from './KarinEvent.js'
import { Contacts } from './UserInfo.js'

/**
 * @class KarinRequest
 */
export class KarinRequest extends KarinEvent {
  /**
  * 构造一个请求事件
  * @param {{
  *   self_id: string,
  *   user_id: string,
  *   group_id?: string,
  *   time: number,
  *   raw_message: string,
  *   contact: {
  *     scene: 'group'|'friend',
  *     peer: string,
  *     sub_peer?: string
  *   },
  *   sender: {
  *     applier_uid?: string,
  *     applier_uin?: string,
  *     inviter_uid?: string,
  *     inviter_uin?: string
  *   },
  *   content: any,
  *   sub_event: 'friend_apply' | 'group_apply' | 'invited_group'
  * }} params
  */
  constructor ({ self_id, sub_event, time, contact, sender, user_id, raw_message = '', group_id = '' }) {
    super({ event: 'request', self_id, user_id, group_id, time, contact, sender, sub_event })
    this.raw_message = raw_message
  }

  /**
   * 适合人类阅读的消息体
   * @type {string}
   */
  raw_message

  /**
   * 对应事件的结构体
   * @type {any}
   */
  content
}

/**
 * 新的好友请求
 */
export class KarinFriendApplyRequest extends KarinRequest {
  sub_event = 'friend_apply'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   applier_uid: string,
    *   applier_uin: string,
    *   message: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { applier_uid, applier_uin, raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('friend', applier_uid)
    /** 构建发送者信息 */
    const sender = {
      applier_uid,
      applier_uin
    }

    /** 构建通知 */
    const data = {
      self_id,
      sub_event: 'friend_apply',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: applier_uid,
      raw_message
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  applier_uid: string,
  *  applier_uin: string,
  *  message: string
  * }}
  */
  content
}

/**
 * 新的加群请求
 */
export class KarinGroupApplyRequest extends KarinRequest {
  sub_event = 'group_apply'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   applier_uid: string,
    *   applier_uin: string,
    *   inviter_uid: string,
    *   inviter_uin: string,
    *   reason: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { group_id, applier_uid, applier_uin, inviter_uid, inviter_uin, raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = {
      applier_uid,
      applier_uin,
      inviter_uid,
      inviter_uin
    }

    /** 构建通知 */
    const data = {
      self_id,
      sub_event: 'group_apply',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid 这里指申请者
      user_id: applier_uid,
      raw_message
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  applier_uid: string,
  *  applier_uin: string,
  *  inviter_uid: string,
  *  inviter_uin: string,
  *  reason: string
  * }}
  */
  content
}

/**
 * 收到邀请加群请求
 */
export class KarinInvitedJoinGroupRequest extends KarinRequest {
  sub_event = 'invited_group'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   inviter_uid: string,
    *   inviter_uin: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { group_id, inviter_uid, inviter_uin, raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = {
      inviter_uid,
      inviter_uin
    }

    /** 构建通知 */
    const data = {
      self_id,
      sub_event: 'invited_group',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid 这里指申请者
      user_id: inviter_uid,
      raw_message
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  inviter_uid: string,
  *  inviter_uin: string,
  *  reason: string
  * }}
  */
  content
}
