/**
 * todo 本文件下可能要与type.js转移到同一个地方
 */

import { KarinNotice, KarinRequest } from '../event/type.js'

/**
 * 消息类型.待补充
 * @typedef {'text' | 'image' | 'at' | 'file' | 'face' | 'reply' | 'xml' | 'json' | String} KarinElementType
 * 通知事件子类型
 * @typedef {'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'} KarinNoticeType
 * @typedef {}
 */

export class KarinElement {
  /**
   * @type {KarinElementType}
   */
  type
}

export class KarinTextElement extends KarinElement {
  /**
   * 构建一个文本元素
   * @param {string} text - 文本内容
   */
  constructor (text) {
    super()
    this.type = 'text'
    /**
     * @type {string} text
     */
    this.text = text
  }
}

export class KarinFaceElement extends KarinElement {
  /**
   * 构建一个表情元素
   * @param {number} id - 表情id
   * @param {boolean} is_big - 是否为大表情
   */
  constructor (id, is_big) {
    super()
    this.type = 'face'
    /**
     * @type {Number} id
     */
    this.id = id
    /**
     * @type {boolean} is_big
     */
    this.is_big = is_big || false
  }

  /**
   * @type {Number}
   */
  id

  /**
   * @type {boolean}
   */
  is_big
}

export class KarinImageElement extends KarinElement {
  /**
   * 构建一个图片元素
   * @param {string|Buffer} file - 图片文件
   * @param {any} [args]
   */
  constructor (file, ...args) {
    super()
    this.type = 'image'
    /**
     * @type {string|Buffer}
     */
    this.file = file
    if (args) Object.assign(this, ...args)
  }

  /**
   * @type {string|Buffer}
   */
  file
}

export class KarinAtElement extends KarinElement {
  /**
   * 构建一个at元素
   * @param {String} uid - 被at的uid 优先使用uid
   * @param {Number|String} [uin] - 被at的qq号
   */
  constructor (uid, uin) {
    super()
    this.type = 'at'
    /**
     * @type {String}
    */
    this.uid = uid
    /**
     * @type {Number|String}
    */
    this.uin = uin
  }

  /**
   * @type {String}
   */
  uid

  /**
   * @type {Number|String}
   */
  uin
}

export class KarinReplyElement extends KarinElement {
  /**
   * 构建一个回复元素
   * @param {String} message_id - 被回复的消息id
   */
  constructor (message_id) {
    super()
    this.type = 'reply'
    /**
     * @type {String} message_id
    */
    this.message_id = message_id
  }

  /**
   * @type {String} message_id
   */
  message_id
}

export class KarinFileElement extends KarinElement {
  /**
   * 构建一个文件元素
   * @param {string} file - 文件信息
   * @param {String} [name] - 文件名
   * @param {Number} [size] - 文件大小
   * @param {Number} [expire_time] - 过期时间
   * @param {String} [id] - 文件id
   * @param {Number} [biz] - 文件biz
   * @param {String} [sub_id] - 文件sub_id
   * @returns {KarinFileElement}
   */
  constructor (file, name, size, expire_time, id, biz, sub_id) {
    super()
    this.type = 'file'
    /**
     * @type {string} file
    */
    this.file = file
    /**
     * @type {String} name
    */
    this.name = name
    /**
     * @type {Number} size
    */
    this.size = size
    /**
     * @type {Number} expire_time
    */
    this.expire_time = expire_time
    /**
     * @type {String} id
    */
    this.id = id
    /**
     * @type {Number} biz
    */
    this.biz = biz
    /**
     * @type {String} sub_id
    */
    this.sub_id = sub_id
  }

  /**
   * @type {string} file
   */
  file

  /**
   * @type {String} name
   */
  name

  /**
   * @type {Number} size
   */
  size

  /**
   * @type {Number} expire_time
   */
  expire_time

  /**
   * @type {String} id
   */
  id

  /**
   * @type {Number} biz
   */
  biz

  /**
   * @type {String} sub_id
   */
  sub_id
}

export class KarinXmlElement extends KarinElement {
  /**
   * 构建一个xml元素
   * @param {String} xml - xml内容
   * @returns {KarinXmlElement}
   */
  constructor (xml) {
    super()
    this.type = 'xml'
    /**
     * @type {String} xml
    */
    this.xml = xml
  }

  /**
   * @type {String} xml
   */
  xml
}

export class KarinJsonElement extends KarinElement {
  /**
   * 构建一个json元素
   * @param {String} json - json内容
   * @returns {KarinJsonElement}
   */
  constructor (json) {
    super()
    this.type = 'json'
    /**
     * @type {String} json
    */
    this.json = json
  }

  /**
   * @type {String} json
   */
  json
}

// /**
//  * Notice
//  * @todo 格式待定
//  */
// export class KarinNotice extends KarinEvent {
//   constructor (self_id, user_id, group_id, time, contact, sender) {
//     super('notice', self_id, user_id, group_id, time, contact, sender)
//   }

//   /**
//    * 消息类型
//    * @type {KarinNoticeType}
//    */
//   type

//   /**
//    * @type {string|Object}
//    */
//   content

//   /**
//    * @type {string}
//    */
//   logText
// }

/**
 * 通知事件联系人
 * @param {string} scene - 场景
 * @param {string} peer - 群号或用户id
 * @param {string} sub_peer - 子群号或用户id
 * @returns {Object}
 */
export function Contacts (scene, peer, sub_peer) {
  return { scene, peer, sub_peer: sub_peer || peer }
}

/**
 * 发送者
 * @param {string} operator_uid - 操作者uid
 * @param {string} operator_uin - 操作者uin
 * @param {string} target_uid - 目标者uid
 * @param {string} target_uin - 目标者uin
 * @returns {Object}
 */
export function SendersNotice (operator_uid = '', operator_uin = '', target_uid = '', target_uin = '') {
  return { operator_uid, operator_uin, target_uid, target_uin }
}

/**
 * 好友头像戳一戳
 */
export class KarinFriendPokeNotice extends KarinNotice {
  type = 'friend_poke'

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
    const contact = Contacts('friend', operator_uin, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'friend_poke',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'friend_recall'

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
    const contact = Contacts('friend', operator_uin, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'friend_recall',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'friend_file_uploaded'

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
    const contact = Contacts('friend', operator_uin, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'friend_file_uploaded',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_poke'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_poke',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_card_changed'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_card_changed',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_member_unique_title_changed'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_member_unique_title_changed',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_essence_changed'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_essence_changed',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_recall'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_recall',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_member_increase'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_member_increase',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_member_decrease'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   operator_uid?: string,
    *   operator_uin: string,
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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_member_decrease',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_admin_change'

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
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_admin_change',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_member_ban'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_member_ban',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_sign_in'

  /**
    * @param {{
    * self_id: string,
    * content: {
    *   group_id: string,
    *   target_uid: string,
    *   target_uin: string,
    *   action: string,
    *   suffix: string,
    *   rank_image: string
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid = '', operator_uin = '', target_uid = '', target_uin = '', message_id = '', message_seq = '', group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_sign_in',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_whole_ban'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_whole_ban',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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
  type = 'group_file_uploaded'

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
    const contact = Contacts('group', group_id, operator_uin)
    /** 构建发送者信息 */
    const sender = SendersNotice(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_file_uploaded',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uin,
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

/**
 * 新的好友请求
 */
export class KarinFriendApplyRequest extends KarinRequest {
  type = 'friend_apply'

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
    const contact = Contacts('friend', applier_uid || applier_uin, applier_uin || applier_uid)
    /** 构建发送者信息 */
    const sender = {
      applier_uid,
      applier_uin
    }

    /** 构建通知 */
    const data = {
      self_id,
      type: 'friend_apply',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: applier_uin,
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
  type = 'group_apply'

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
    const contact = Contacts('group', group_id, applier_uid || applier_uin)
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
      type: 'group_apply',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin 这里指申请者
      user_id: applier_uin,
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
  type = 'invited_group'

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
    const contact = Contacts('group', group_id, inviter_uin || inviter_uid)
    /** 构建发送者信息 */
    const sender = {
      inviter_uid,
      inviter_uin
    }

    /** 构建通知 */
    const data = {
      self_id,
      type: 'invited_group',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin 这里指申请者
      user_id: inviter_uin,
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
