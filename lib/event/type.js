/**
 * @typedef {} KarinNoticeType
 */

class KarinEvent {
  /**
   * 构造一个event
   * @param {'message'|'request'|'notice'} event - 事件类型
   * @param {string} self_id - 机器人id
   * @param {string} user_id - 用户id
   * @param {string} [group_id] - 群id
   * @param {number} time - 消息时间戳
   * @param {{
   *   scene: 'group'|'private'|'guild'|'group_temp'|'stranger'|'stranger_group',
   *   peer: string,
   *   sub_peer?: string
   * }} contact - 联系人信息
   * @param {'group'|'friend'|'guild'|'nearby'|'stranger'|'stranger_from_group'} contact.scene - 场景
   * @param {string} contact.peer - 群聊/私聊/频道号
   * @param {string} [contact.sub_peer] - 群临时会话/子频道号
   * @param {{
   *   uid: string,
   *   uin: string,
   *   nick?: string
   * }} sender - 发送者信息
   * @param {string} sender.uid - 发送者uid
   * @param {string} sender.uin - 发送者uin
   * @param {string} [sender.nick] - 发送者昵称
   * @param {'group'|'friend'|'guild'|'group_temp'|'stranger'|'stranger_group'|'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'} type - 子事件类型
   */
  constructor (event, self_id, user_id, group_id, time, contact, sender, type) {
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
  * @param {string} self_id - 机器人id
  * @param {string} user_id - 用户id
  * @param {string} [group_id] - 群id
  * @param {number} time - 消息时间戳
  * @param {string} message_id - 消息id
  * @param {string} message_seq - 消息序列号
  * @param {string} raw_message - 适合人类阅读的消息体
  * @param {{
   *   scene: 'group'|'friend'|'guild'|'group_temp'|'stranger'|'stranger_group',
   *   peer: string,
   *   sub_peer?: string
   * }} contact - 联系人信息
  * @param {'group'|'friend'|'guild'|'nearby'|'stranger'|'stranger_from_group'} contact.scene - 场景
  * @param {string} contact.peer - 群聊/私聊/频道号
  * @param {string} [contact.sub_peer] - 群临时会话/子频道号
  * @param {{
  *   uid: string,
  *   uin: string,
  *   nick?: string
  * }} sender - 发送者信息
  * @param {string} sender.uid - 发送者uid
  * @param {string} sender.uin - 发送者uin
  * @param {string} [sender.nick] - 发送者昵称
  * @param {Array<KarinElement>} elements - 消息体元素
  * @param {string} msg - 框架处理后的文本
  * @param {string} game - 游戏类型
  * @param {Array<string>} img - 图片数组
  * @param {string} at - at
  * @param {boolean} atBot - atBot
  * @param {boolean} atAll - atAll
  * @param {object} file - 文件元素
  * @param {string} reply_id - 引用消息id
  */
  constructor (self_id, user_id, group_id, time, message_id, message_seq, raw_message, contact, sender, elements, msg, game, img, at, atBot, atAll, file, reply_id) {
    super('message', self_id, user_id, group_id, time, contact, sender, contact.scene)
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
  * @param {string} self_id - 机器人id
  * @param {string} user_id - 用户id
  * @param {string} [group_id] - 群id
  * @param {number} time - 消息时间戳
  * @param {string} message_id - 消息id
  * @param {string} message_seq - 消息序列号
  * @param {string} raw_message - 适合人类阅读的消息体
  * @param {{
   *   scene: 'group'|'friend',
   *   peer: string,
   *   sub_peer?: string
   * }} contact - 联系人信息
  * @param {'group'|'friend'} contact.scene - 场景
  * @param {string} contact.peer - 群聊/私聊/频道号
  * @param {string} [contact.sub_peer] - 群临时会话/子频道号
  * @param {{
  *   operator_uid?: string,
  *   operator_uin?: string,
  *   target_uid?: string,
  *   target_uin?: string
  * }} sender - 发送者信息
  * @param {string} sender.operator_uid - 操作者uid
  * @param {string} sender.operator_uin - 操作者uin
  * @param {string} sender.target_uid - 目标uid
  * @param {string} sender.target_uin - 目标uin
  * @param {any} content - 对应事件的结构体
  * @param {'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'} type - 子事件类型
  */
  constructor (self_id, type, time, contact, sender, content, user_id, message_id, message_seq, raw_message, group_id) {
    super('notice', self_id, user_id, group_id, time, contact, sender, type)
    this.message_id = message_id
    this.message_seq = message_seq
    this.raw_message = raw_message
    this.content = content
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

export { KarinEvent, KarinMessage, KarinNotice }
