/**
 * todo 本文件下可能要与type.js转移到同一个地方
 */

/**
 * 通知事件子类型
 * @typedef {'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'} KarinNoticeType
 * @typedef {}
 */

import { KarinEvent } from './KarinEvent.js'
import { Contacts, SendersNotice } from './UserInfo.js'

/**
 * @class KarinNotice
 */
export class KarinNotice extends KarinEvent {
  /**
  * 构造一个通知
  * @param {{
  *   self_id: string,
  *   user_id: string,
  *   group_id?: string,
  *   time: number,
  *   message_id: string,
  *   message_seq: string,
  *   raw_message: string,
  *   contact: {
  *     scene: 'group'|'friend',
  *     peer: string,
  *     sub_peer?: string
  *   },
  *   sender: {
  *     operator_uid?: string,
  *     operator_uin?: string,
  *     target_uid?: string,
  *     target_uin?: string
  *   },
  *   content: any,
  *   sub_type: 'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'
  * }} params
  */
  constructor ({ self_id, sub_type, time, contact, sender, user_id, message_id, message_seq, raw_message = '', group_id = '' }) {
    super({ event: 'notice', self_id, user_id, group_id, time, contact, sender, sub_type })
    this.message_id = message_id
    this.message_seq = message_seq
    this.raw_message = raw_message
  }

  /**
 * 消息id
 * @type {string}
 */
  message_id

  /**
   * 消息序列号
   * @type {string}
   */
  message_seq

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
 * 好友头像戳一戳
 */
export class KarinFriendPokeNotice extends KarinNotice {
  sub_type = 'friend_poke'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   operator_uid: string,
    *   operator_uin: String,
    *   action: String,
    *   suffix: String,
    *   action_image: String
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('friend', operator_uid)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'friend_poke',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
   * @type {{
  *  operator_uid: string,
  *  operator_uin: String,
  *  action: String,
  *  suffix: String,
  *  action_image: String
  * }}
  */
  content
}

/**
 * 好友消息撤回
 */
export class KarinFriendRecallNotice extends KarinNotice {
  sub_type = 'friend_recall'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   operator_uid: string,
    *   operator_uin: String,
    *   message_id: String,
    *   tip_text: String
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('friend', operator_uid)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'friend_recall',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  operator_uid: string,
  *  operator_uin: String,
  *  message_id: String,
  *  tip_text: String
  * }}
  */
  content
}

/**
 * 私聊文件上传
 */
export class KarinFriendFileUploadedNotice extends KarinNotice {
  sub_type = 'friend_file_uploaded'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   operator_uid: string,
    *   operator_uin: String,
    *   file_id: String,
    *   file_sub_id: String,
    *   file_name: String,
    *   file_size: Number,
    *   expire_time: Number,
    *   url: String
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('friend', operator_uid)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'friend_file_uploaded',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  operator_uid: string,
  *  operator_uin: String,
  *  file_id: String,
  *  file_sub_id: String,
  *  file_name: String,
  *  file_size: Number,
  *  expire_time: Number,
  *  url: String
  * }}
  */
  content
}

/**
 * 群头像戳一戳
 */
export class KarinGroupPokeNotice extends KarinNotice {
  sub_type = 'group_poke'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   target_uid: string,
    *   target_uin: string,
    *   action: string,
    *   suffix: string,
    *   action_image: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_poke',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  action: string,
  *  suffix: string,
  *  action_image: string
  * }}
  */
  content
}

/**
 * 群名片改变
 */
export class KarinGoupCardChangedNotice extends KarinNotice {
  sub_type = 'group_card_changed'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   target_uid: string,
    *   target_uin: string,
    *   new_card: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_card_changed',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  new_card: string
  * }}
  */
  content
}

/**
 * 群成员专属头衔改变
 */
export class KarinGroupUniqueTitleChangedNotice extends KarinNotice {
  sub_type = 'group_member_unique_title_changed'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   title: string,
    *   target: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_member_unique_title_changed',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  title: string,
  *  target: string
  * }}
  */
  content
}

/**
 * 群精华消息改变
 */
export class KarinGroupEssenceMessageNotice extends KarinNotice {
  sub_type = 'group_essence_changed'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   target_uid: string,
    *   target_uin: string,
    *   message_id: string,
    *   sub_type: Number
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_essence_changed',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  message_id: string,
  *  sub_type: Number
  * }}
  */
  content
}

/**
 * 群撤回通知
 */
export class KarinGroupRecallNotice extends KarinNotice {
  sub_type = 'group_recall'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: String,
    *   message_id: String,
    *   tip_text: String,
    *   operator_uid: String,
    *   operator_uin: String,
    *   target_uid: String,
    *   target_uin: String,
    *   message_seq: String
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_recall',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
   * @type {{
   *   group_id: Number,
   *   message_id: String,
   *   tip_text: String,
   *   operator_uid: String,
   *   operator_uin: String,
   *   target_uid: String,
   *   target_uin: String,
   *   message_seq: String
   * }}
   */
  content
}

/**
 * 群成员增加
 */
export class KarinGroupMemberIncreasedNotice extends KarinNotice {
  sub_type = 'group_member_increase'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   target_uid: string,
    *   target_uin: string,
    *   type: 0|1
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_member_increase',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  new_card: 0|1
  * }}
  */
  content
}

/**
 * 群成员减少
 */
export class KarinGroupMemberDecreasedNotice extends KarinNotice {
  sub_type = 'group_member_decrease'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid?: string,
    *   operator_uin?: string,
    *   target_uid?: string,
    *   target_uin: string,
    *   type: 0|1|2
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_member_decrease',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid?: string,
  *  operator_uin: string,
  *  target_uid?: string,
  *  target_uin: string,
  *  type: 0|1|2
  * }}
  */
  content
}

/**
 * 群管理员变动
 */
export class KarinGroupAdminChangedNotice extends KarinNotice {
  sub_type = 'group_admin_change'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   target_uid: string,
    *   target_uin: string,
    *   is_admin: boolean
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = { target_uid, target_uin }
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_admin_change',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: target_uid || target_uin,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  target_uid: string,
  *  target_uin: string,
  *  is_admin: boolean
  * }}
  */
  content
}

/**
 * 群成员被禁言
 */
export class KarinGroupMemberBanNotice extends KarinNotice {
  sub_type = 'group_member_ban'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   target_uid: string,
    *   target_uin: string,
    *   duration: Number,
    *   type: 0|1
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_member_ban',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  duration: Number,
  *  type: 0|1
  * }}
  */
  content
}

/**
 * 群签到
 */
export class KarinGroupSignInNotice extends KarinNotice {
  sub_type = 'group_sign_in'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   target_uid: string,
    *   target_uin: string,
    *   action: string,
    *   rank_image: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_sign_in',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: target_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  new_card: string,
  *  suffix: string,
  *  action_image: string
  * }}
  */
  content
}

/**
 * 群全员禁言
 */
export class KarinGroupWholeBanNotice extends KarinNotice {
  sub_type = 'group_whole_ban'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   is_ban: boolean
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_whole_ban',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  is_ban: boolean
  * }}
  */
  content
}

/**
 * 群文件上传
 */
export class KarinGroupFileUploadedNotice extends KarinNotice {
  sub_type = 'group_file_uploaded'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid: string,
    *   operator_uin: string,
    *   file_id: string,
    *   file_sub_id: string,
    *   file_name: string,
    *   file_size: Number,
    *   expire_time: Number,
    *   biz: Number,
    *   url: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      sub_type: 'group_file_uploaded',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uid
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
    this.content = content
  }

  /**
  * @type {{
  *  group_id: string,
  *  operator_uid: string,
  *  operator_uin: string,
  *  target_uid: string,
  *  target_uin: string,
  *  new_card: string,
  *  suffix: string,
  *  action_image: string,
  *  file_id: string,
  *  file_sub_id: string,
  *  file_name: string,
  *  file_size: Number,
  *  expire_time: Number,
  *  biz: Number,
  *  url: string
  * }}
  */
  content
}
