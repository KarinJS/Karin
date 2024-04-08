/**
 * @typedef {} KarinNoticeType
 */

class KarinEvent {
  /**
   * 构造一个event
   * @param {{
  *   event: 'message'|'request'|'notice',
  *   self_id: string,
  *   user_id: string,
  *   group_id?: string,
  *   time: number,
  *   contact: {
  *     scene: 'group'|'private'|'guild'|'group_temp'|'stranger'|'stranger_group',
  *     peer: string,
  *     sub_peer?: string
  *   },
  *   sender: {
  *     uid: string,
  *     uin: string,
  *     nick?: string
  *   },
  *   type: 'group'|'friend'|'guild'|'group_temp'|'stranger'|'stranger_group'|'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'
  * }} params
  */
  constructor ({ event, self_id, user_id, group_id = '', time, contact, sender, type }) {
    this.self_id = self_id
    this.user_id = user_id
    this.group_id = group_id
    this.time = time
    this.event = event
    this.contact = contact
    this.sender = sender
    this.type = type
  }

  /**
   * 机器人id
   * @type {string}
   */
  self_id

  /**
   * 用户id
   * @type {string}
   */
  user_id

  /**
   * 群id
   * @type {string}
   */
  group_id

  /**
   * 事件类型
   * @type {'message'|'notice'|'request'}
   */
  event

  /**
   * 消息时间戳
   * @type {number}
   */
  time

  /**
   * 联系人信息
   * @type {Object}
   */
  contact

  /**
   * 发送者信息
   * @type {Object}
   */
  sender

  /**
   * 是否为主人
   * @type {boolean}
   */
  isMaster

  /**
   * 是否为私聊
   * @type {boolean}
   */
  isPrivate

  /**
   * 是否为群聊
   * @type {boolean}
   */
  isGroup

  /**
   * 是否为频道
   * @type {boolean}
   */
  isGuild

  /**
   * 是否为群临时会话
   * @type {boolean}
   */
  isGroupTemp

  /**
   * 日志函数字符串
   * @type {string}
   */
  logFnc

  /**
   * 日志用户字符串
   * @type {string}
   */
  logText

  /**
   * 回复函数
   * @type {replyCallback}
   */
  reply
}

/**
 * @class KarinMessage
 */
class KarinMessage extends KarinEvent {
  /**
  * 构造一个消息
  * @param {{
  *   self_id: string,
  *   user_id: string,
  *   group_id?: string,
  *   time: number,
  *   message_id: string,
  *   message_seq: string,
  *   raw_message: string,
  *   contact: {
  *     scene: 'group'|'friend'|'guild'|'group_temp'|'stranger'|'stranger_group',
  *     peer: string,
  *     sub_peer?: string
  *   },
  *   sender: {
  *     uid: string,
  *     uin: string,
  *     nick?: string
  *   },
  *   elements: Array<KarinElement>,
  *   msg?: string,
  *   game?: string,
  *   img?: Array<string>,
  *   at?: string,
  *   atBot?: boolean,
  *   atAll?: boolean,
  *   file?: object,
  *   reply_id?: string
  * }} params
  */
  constructor ({
    self_id,
    user_id,
    time,
    message_id,
    message_seq,
    raw_message = '',
    contact,
    sender,
    elements,
    group_id = '',
    msg = '',
    game = '',
    img = [],
    at = '',
    atBot = false,
    atAll = false,
    file = {},
    reply_id = ''
  }) {
    super({ event: 'message', self_id, user_id, group_id, time, contact, sender, type: contact.scene })
    this.message_id = message_id
    this.message_seq = message_seq
    this.raw_message = raw_message
    this.elements = elements
    this.msg = msg
    this.game = game
    this.img = img
    this.at = at
    this.atBot = atBot
    this.atAll = atAll
    this.file = file
    this.reply_id = reply_id
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
   * 消息体元素
   * @type {Array<KarinElement>}
   */
  elements

  /**
   * 框架处理后的文本
   * @type {string}
   */
  msg

  /**
   * 游戏类型
   * @type {string}
   */
  game

  /**
   * 图片数组
   * @type {Array<string>}
   */
  img

  /**
   * at
   * @type {string}
   */
  at

  /**
   * atBot
   * @type {boolean}
   */
  atBot

  /**
   * atAll
   * @type {boolean}
   */
  atAll

  /**
   * 文件元素
   * @type {object}
   */
  file

  /**
   * 引用消息id
   * @type {string}
   */
  reply_id
}

/**
 * @class KarinNotice
 */
class KarinNotice extends KarinEvent {
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
  *   type: 'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'
  * }} params
  */
  constructor ({ self_id, type, time, contact, sender, user_id, message_id, message_seq, raw_message = '', group_id = '' }) {
    super({ event: 'notice', self_id, user_id, group_id, time, contact, sender, type })
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
 * @class KarinRequest
 */
class KarinRequest extends KarinEvent {
  /**
  * 构造一个请求事件
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
  *   type: 'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'
  * }} params
  */
  constructor ({ self_id, type, time, contact, sender, user_id, message_id, message_seq, raw_message = '', group_id = '' }) {
    super({ event: 'request', self_id, user_id, group_id, time, contact, sender, type })
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
 * @callback replyCallback
 * @param {string|KarinElement|Array<KarinElement>} msg - 发送的消息
 * @param {object} [data] - 回复数据
 * @param {boolean} [data.at] - 是否at用户
 * @param {boolean} [data.reply] - 是否引用回复
 * @param {number} [data.recallMsg] - 群聊是否撤回消息，0-120秒，0不撤回
 * @param {boolean} [data.button] - 是否使用按钮
 * @returns {{ message_id?: string }}
 */

export { KarinEvent, KarinMessage, KarinNotice, KarinRequest }
