export class KarinMessage {
  /**
   *
   * @param {{
   *   msg: string,
   *   group: {
   *     id: Number|String,
   *     name: String?
   *   }?,
   *   sender: {
   *     id: Number|String,
   *     nickname: String?
   *   }?,
   *   img: Array<string>,
   *   message: Array<KarinElement>,
   *   atBot: boolean,
   *   at: boolean,
   *   file: object,
   *   reply_id: string,
   *   isPrivate: boolean,
   *   isGroup: boolean,
   *   isGuild: boolean,
   *   isMaster: boolean,
   *   logText: string,
   *   logFnc: string,
   *   raw_message: string,
   *   self_id: String|Number?
   * }} obj
   */
  constructor (obj = {}) {
    this.msg = obj.msg || ''
    this.group = obj.group
    this.sender = obj.sender
    this.img = obj.img || []
    this.message = obj.message || []
    this.atBot = obj.atBot || false
    this.at = obj.at || false
    this.file = obj.file || {}
    this.reply_id = obj.reply_id || ''
    this.isPrivate = obj.isPrivate || false
    this.isGroup = obj.isGroup || false
    this.isGuild = obj.isGuild || false
    this.isMaster = obj.isMaster || false
    this.logText = obj.logText || ''
    this.logFnc = obj.logFnc || ''
    this.raw_message = obj.raw_message || ''
    this.self_id = obj.self_id
  }

  /**
   *
   * @type {Array<KarinElement>}
   */
  message

  /**
   * @type {{
   *   id: Number|String,
   *   nickname: String?
   * }}
   */
  sender

  /**
   * @type {{
   *   id: Number|String,
   *   name: String?
   * }}
   */
  group

  /**
   *
   * @type {Array<String>}
   */
  img

  /**
   *
   * @type {string}
   */
  msg

  /**
   * @type {boolean}
   */
  atBot

  /**
   * @type {boolean}
   */
  at
  /**
   * @type {object}
   */
  file

  /**
   * @type {string}
   */
  reply_id

  /**
   * @type {boolean}
   */
  isPrivate

  /**
   * @type {boolean}
   */
  isGroup

  /**
   * @type {boolean}
   */
  isGuild

  /**
   * @type {boolean}
   */
  isMaster

  /**
   * @type {string}
   */
  logText

  /**
   * @type {string}
   */
  logFnc

  /**
   * @type {string}
   */
  raw_message
}

/**
 * 消息类型.待补充
 * @typedef {'text' | 'image' | 'at' | 'file' | 'face' | 'reply' | 'xml' | 'json' | String} KarinElementType
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
}

export class KarinNotice {
  /**
   * @type {string}
   */
  notice_type

  /**
   * @type {string|Object}
   */
  content

  /**
   * @type {string}
   */
  logText
}

export class KarinGroupRecallNotice extends KarinNotice {
  notice_type = 'group_recall'

  /**
   * @param {{
   *   group_id: Number,
   *   message_id: String,
   *   tip_text: String,
   *   operator_uid: String,
   *   operator_uin: Number,
   *   target_uid: String,
   *   target_uin: Number,
   *   message_seq: Number
   * }} content
   */
  constructor (content) {
    super()
    this.content = content
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
