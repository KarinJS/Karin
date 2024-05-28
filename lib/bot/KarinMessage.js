import { KarinEvent } from './KarinEvent.js'

/**
 * @class KarinMessage
 */
export class KarinMessage extends KarinEvent {
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
  *   image?: Array<string>,
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
    image = [],
    at = [],
    atBot = false,
    atAll = false,
    file = {},
    reply_id = ''
  }) {
    super({ event: 'message', self_id, user_id, group_id, time, contact, sender, sub_type: contact.scene })
    this.message_id = message_id
    this.message_seq = message_seq
    this.raw_message = raw_message
    this.elements = elements
    this.msg = msg
    this.game = game
    this.image = image
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
   * @type {string} 消息序列号
   */
  message_seq

  /**
   * 适合人类阅读的消息体
   * @type {string} 适合人类阅读的消息体
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
  image

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
