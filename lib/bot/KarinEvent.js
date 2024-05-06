/**
 * @typedef {} KarinNoticeType
 */

export class KarinEvent {
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
  *   sub_type: 'group'|'friend'|'guild'|'group_temp'|'stranger'|'stranger_group'|'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'
  * }} params
  */
  constructor ({ event, self_id, user_id, group_id = '', time, contact, sender, sub_type }) {
    this.self_id = self_id
    this.user_id = user_id
    this.group_id = group_id
    this.time = time
    this.event = event
    this.contact = contact
    this.sender = sender
    this.sub_type = sub_type
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
   * @type {KarinContact}
   */
  contact

  /**
   * 发送者信息
   * @type {{
   *     uid: string,
   *     uin: string,
   *     nick?: string
   *   }}
   */
  sender

  /**
   * 事件类型
   * @type {'group'|'friend'|'guild'|'group_temp'|'stranger'|'stranger_group'|'friend_poke' | 'friend_recall' | 'friend_file_come' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_banned' | 'group_sign' | 'group_whole_ban' | 'group_file_come'}
   */
  sub_type

  /**
   * 是否为主人
   * @type {boolean}
   */
  isMaster

  /**
   * 是否为管理员 机器人子权限
   * @type {boolean}
   */
  isAdmin

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
   * 存储器 由开发者自行调用
   * @type {Map<string, any>}
   */
  store

  /**
   * 回复函数 这个方法由适配器实现，开发者不应该直接调用
   * @type {replyCallback}
   */
  replyCallback

  /**
   * 回复函数 由karin对replyCallback封装过后的快速回复方法
   * @type {quickReplyCallback}
   */
  reply

  /**
   * bot实现
   * @type {KarinAdapter}
   */
  bot
}

/**
 * @callback replyCallback
 * @param {Array<KarinElement>} elements - 发送的消息元素 只能是数组
 * @param {number} retry_count - 重试次数
 * @returns {Promise<{ message_id?: string }>} - 返回消息ID
 */

/**
 * @callback quickReplyCallback
 * @param {string|KarinElement|Array<KarinElement>} elements - 发送的消息
 * @param {object} [options] - 回复数据
 * @param {boolean} [options.at] - 是否at用户
 * @param {boolean} [options.reply] - 是否引用回复
 * @param {number} [options.recallMsg] - 群聊是否撤回消息，0-120秒，0不撤回
 * @param {boolean} [options.button] - 是否使用按钮
 * @param {number} [options.retry_count] - 重试次数
 * @returns {Promise<{ message_id?: string }>} - 返回消息ID
 */
