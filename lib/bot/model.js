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
  constructor(obj = {}) {
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
 * @typedef {'text' | 'image' | 'at' | 'file' | 'reply' | 'xml' | 'json' | String} KarinElementType
 */


export class KarinElement {
  /**
   * @type {KarinElementType}
   */
  type

  /**
   * @type {Object|string}
   */
  data

}

export class KarinTextElement extends KarinElement {
  constructor(text) {
    super()
    this.data = {
      text
    }
  }

  type = 'text'
  /**
   * @type {{
   *  text: String
   * }}
   */
  data
}

export class KarinFaceElement extends KarinElement {
  constructor(id, is_big) {
    super()
    this.data = {
      id,
      is_big
    }
  }

  type = 'face'
  /**
   * @type {{
   *  id: Number,
   *  is_big: boolean?
   * }}
   */
  data
}

export class KarinImageElement extends KarinElement {
  constructor(url) {
    super();
    this.data = {
      url
    }
  }

  type = 'image'
  /**
   * @type {{
   *   url: String
   * }}
   */
  data
}

export class KarinAtElement extends KarinElement {
  constructor(uin, uid) {
    super();
    this.data = {
      qq: uin,
      uin,
      uid
    }
  }

  type = 'at'
  /**
   * @type {{
   *   qq: Number|String
   *   uin: Number|String
   *   uid: String
   * }}
   */
  data
}

export class KarinReplyElement extends KarinElement {
  constructor(replyId) {
    super();
    this.data = {
      reply_id: replyId
    }
  }

  type = 'reply'
  /**
   * @type {{
   *   reply_id: Number|String
   * }}
   */
  data
}

export class KarinFileElement extends KarinElement {
  constructor(file = {}) {
    super();
    this.data = file
  }

  type = 'file'
  /**
   * @type {{
   *   url: Number|String
   *   name: String?
   *   size: Number?
   *   expire_time: Number?
   *   id: String?
   *   biz: Number?
   *   sub_id: String?
   * }}
   */
  data
}

export class KarinXmlElement extends KarinElement {
  constructor(xml) {
    super();
    this.data = {
      data: xml
    }
  }

  type = 'xml'
  /**
   * @type {{
   *   data: String
   * }}
   */
  data
}

export class KarinJsonElement extends KarinElement {
  constructor(json) {
    super();
    this.data = {
      data: json
    }
  }

  type = 'json'
  /**
   * @type {{
   *   data: String
   * }}
   */
  data
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
  constructor(content) {
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

