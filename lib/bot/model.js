/**
 * todo 本文件下可能要与type.js转移到同一个地方
 */

import { KarinEvent, KarinNotice } from '../event/type.js'

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
 * 联系人
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
 * @returns {Object}
 */
export function Senders (operator_uid = '', operator_uin = '', target_uid = '', target_uin = '') {
  return { operator_uid, operator_uin, target_uid, target_uin }
}

/**
 * 群撤回通知
 * @todo 统一化notice类型，和filterEvent适配
 */
export class KarinGroupRecallNotice extends KarinNotice {
  type = 'group_recall'

  /**
    * @param {{
    * selfId: string,
    * content: {
    *   group_id: Number,
    *   message_id: String,
    *   tip_text: String,
    *   operator_uid: String,
    *   operator_uin: Number,
    *   target_uid: String,
    *   target_uin: Number,
    *   message_seq: Number
    * },
    * time: Number
    * }} params
    */
  constructor ({ self_id, content, time }) {
    const { operator_uid, operator_uin, target_uid, target_uin, message_id, message_seq, group_id = '', raw_message = '' } = content
    /** 构建联系人 */
    const contact = Contacts('group', group_id, operator_uid)
    /** 构建发送者信息 */
    const sender = Senders(operator_uid, operator_uin, target_uid, target_uin)
    /** 构建通知 */
    const data = {
      self_id,
      type: 'group_recall',
      time,
      contact,
      sender,
      content,
      // user_id与peer统一使用uin
      user_id: operator_uid,
      message_id,
      message_seq,
      raw_message,
      group_id
    }
    super(data)
  }

  /**
   * @type {{
   *   group_id: Number,
   *   message_id: String,
   *   tip_text: String,
   *   operator_uid: String,
   *   operator_uin: Number,
   *   target_uid: String,
   *   target_uin: Number,
   *   message_seq: Number
   * }}
   */
  content
}

export class KarinRequest extends KarinEvent {
  /**
     * @type {string}
     */
  request_type

  /**
     * @type {string|Object}
     */
  content

  /**
     * @type {string}
     */
  logText
}
