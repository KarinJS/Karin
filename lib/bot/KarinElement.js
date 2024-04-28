/**
 * ~~消息类型.待补充~~ 已基本实现大部分消息类型
 * @typedef {'text' | 'image' | 'at' | 'file' | 'face' | 'reply' | 'xml' | 'json' | 'unknown' | 'location' | 'voice' | 'video' | 'contact' | 'poke' |'music' | String} KarinElementType
 * @typedef {}
 */

export class KarinElement {
  /**
   * @type {KarinElementType}
   */
  type
}

/**
 * @extends KarinElement
 */
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

/**
 * @extends KarinElement
 */
export class KarinFaceElement extends KarinElement {
  /**
   * 构建一个表情元素
   * @param {number} id - 表情id
   * @param {boolean?} is_big - 是否为大表情
   */
  constructor (id, is_big = false) {
    super()
    this.type = 'face'
    /**
     * @type {Number} id
     */
    this.id = id
    /**
     * @type {boolean} is_big
     */
    this.is_big = is_big
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

/**
 * @extends KarinElement
 */
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

/**
 * @extends KarinElement
 */
export class KarinRecordElement extends KarinElement {
  /**
   * 构建一个语音元素
   * @param {string} file - 语音文件
   * @param {any} [args]
   */
  constructor (file, ...args) {
    super()
    this.type = 'voice'
    /**
     * @type {string}
     */
    this.file = file
    if (args) Object.assign(this, ...args)
  }

  /**
   * @type {string}
   */
  file
}

/**
 * @extends KarinElement
 */
export class KarinvideoElement extends KarinElement {
  /**
   * 构建一个视频元素
   * @param {string} file - 视频文件
   * @param {any} [args]
   */
  constructor (file, ...args) {
    super()
    this.type = 'video'
    /**
     * @type {string}
     */
    this.file = file
    if (args) Object.assign(this, ...args)
  }

  /**
   * @type {string}
   */
  file
}

/**
 * @extends KarinElement
 */
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
    this.uid = String(uid)
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

/**
 * @extends KarinElement
 */
export class KarinPokeElement extends KarinElement {
  /**
   * 构建一个戳一戳元素
   * @param {number} poke - 戳一戳类型
   * @param {number} id - 戳一戳对象id
   * @param {number} strength - 戳一戳强度
   */
  constructor (poke, id, strength = 1) {
    super()
    this.type = 'poke'
    /**
     * @type {number}
     */
    this.poke = poke
    /**
     * @type {number}
     */
    this.id = id
    /**
     * @type {number}
     */
    this.strength = strength
  }

  /**
   * @type {number}
   */
  poke

  /**
   * @type {number}
   */
  id
  /**
   * @type {number}
   */
  strength
}

/**
 * @extends KarinElement
 */
export class KarinContactElement extends KarinElement {
  /**
   * 构建一个联系人元素
   * @param {string} platform - 类型，'qq' 表示推荐好友，'group' 表示推荐群
   * @param {string} id - 被推荐人的 QQ 号或被推荐群的群号
   */
  constructor (platform, id) {
    super()
    this.type = 'contact'
    /**
     * @type {string} 类型，'qq' 表示推荐好友，'group' 表示推荐群
    */
    this.platform = platform
    /**
     * @type {string} 被推荐人的 QQ 号或被推荐群的群号
    */
    this.id = id
  }

  /**
   * @type {string} 类型，'qq' 表示推荐好友，'group' 表示推荐群
   */
  platform

  /**
   * @type {string} 被推荐人的 QQ 号或被推荐群的群号
   */
  id
}

/**
 * @extends KarinElement
 */
export class KarinLocationElement extends KarinElement {
  /**
   * 构建一个位置元素
   * @param {number} lat - 纬度
   * @param {number} lon - 经度
   * @param {string} title - 位置名称
   * @param {string} content - 位置描述
   */
  constructor (lat, lon, title, content) {
    super()
    this.type = 'location'
    /**
     * @type {number} 纬度
    */
    this.lat = lat
    /**
     * @type {number} 经度
    */
    this.lon = lon
    /**
     * @type {string} 位置名称
    */
    this.title = title
    /**
     * @type {string} 位置描述
    */
    this.content = content
  }

  /**
   * @type {number} 纬度
   */
  lat

  /**
   * @type {number} 经度
   */
  lon

  /**
   * @type {string} 位置名称
   */
  title

  /**
   * @type {string} 位置描述
   */
  content
}

/**
 * @extends KarinElement
 */
export class KarinMusicElement extends KarinElement {
  /**
   * 构建一个音乐元素
   * @param {'qq' | '163' | 'xm'} platform - 平台
   * @param {string} id - 音乐id
   */
  constructor (platform, id) {
    super()
    this.type = 'music'
    /**
     * @type {string} 平台
    */
    this.platform = platform
    /**
     * @type {string} 音乐id
    */
    this.id = id
  }

  /**
   * @type {string} 平台
   */
  platform

  /**
   * @type {string} 音乐id
   */
  id
}

/**
 * @extends KarinElement
 */
export class KarinCustomMusicElement extends KarinElement {
  /**
   * 构建自定义音乐分享
   * @param {string} url - 点击后跳转目标 URL
   * @param {string} audio - 音乐 URL
   * @param {string} title - 标题
   * @param {string} [content] - 内容描述
   * @param {string} [image] - 图片 URL
   * @returns {<{type: string, url: string, audio: string, title: string, content: string, image: string}>} 自定义音乐分享消息
   */
  constructor (url, audio, title, content, image) {
    super()
    this.type = 'music'
    /**
     * @type {string} 点击后跳转目标 URL
    */
    this.url = url
    /**
     * @type {string} 音乐 URL
    */
    this.audio = audio
    /**
     * @type {string} 标题
    */
    this.title = title
    /**
     * @type {string} 内容描述
    */
    this.content = content
    /**
     * @type {string} 图片 URL
    */
    this.image = image
  }

  /**
   * @type {string} 点击后跳转目标 URL
   */
  url

  /**
   * @type {string} 音乐 URL
   */
  audio

  /**
   * @type {string} 标题
   */
  title

  /**
   * @type {string} 内容描述
   */
  content

  /**
   * @type {string} 图片 URL
   */
  image
}

/**
 * @extends KarinElement
 */
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
    this.message_id = String(message_id)
  }

  /**
   * @type {String} message_id
   */
  message_id
}

/**
 * @extends KarinElement
 */
export class KarinForwardElement extends KarinElement {
  /**
   * 构建一个转发元素
   * @param {String} id - 转发的消息id
   */
  constructor (id, ...args) {
    super()
    this.type = 'forward'
    /**
     * @type {String} id
    */
    this.id = id
    if (args) Object.assign(this, ...args)
  }

  /**
   * @type {String} id
   */
  id
}

/**
 * @extends KarinElement
 */
export class KarinNodeElement extends KarinElement {
  /**
   * 构建一个node元素
   * @param {string} user_id - 用户id
   * @param {string} nickname - 用户昵称
   * @param {KarinElement[]} content - 内容
   * @returns {KarinNodeElement}
   */
  constructor (user_id, nickname, content) {
    super()
    this.type = 'node'
    /**
     * @type {string} user_id
    */
    this.user_id = user_id
    /**
     * @type {string} nickname
    */
    this.nickname = nickname
    /**
     * @type {string} content
    */
    this.content = content
  }

  /**
   * @type {string} user_id
   */
  user_id

  /**
   * @type {string} nickname
   */
  nickname

  /**
   * @type {string} content
   */
  content
}

/**
 * @extends KarinElement
 */
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

/**
 * @extends KarinElement
 */
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

/**
 * @extends KarinElement
 */
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

/**
 * @extends KarinElement
 */
export class KarinBubbleFaceElement extends KarinElement {
  /**
   * 构建一个气泡表情元素
   * @param {number} id - 表情id
   * @param {number} count - 表情数量
   */
  constructor (id, count) {
    super()
    this.type = 'bubble_face'
    /**
     * @type {number} id
    */
    this.id = id
    /**
     * @type {number} count
    */
    this.count = count
  }

  /**
   * @type {number} id
   */
  id

  /**
   * @type {number} count
   */
  count
}

/**
 * @extends KarinElement
 */
export class KarinBasketballElement extends KarinElement {
  /**
   * 构建一个篮球元素
   * @param {number} id - 篮球id
   */
  constructor (id) {
    super()
    this.type = 'basketball'
    /**
     * @type {number} id
    */
    this.id = id
  }

  /**
   * @type {number} id
   */
  id
}

/**
 * @extends KarinElement
 */
export class KarinDiceElement extends KarinElement {
  /**
   * 构建一个骰子元素
   * @param {number} id - 骰子id
   */
  constructor (id) {
    super()
    this.type = 'dice'
    /**
     * @type {number} id
    */
    this.id = id
  }

  /**
   * @type {number} id
   */
  id
}

/**
 * @extends KarinElement
 */
export class KarinRpsElement extends KarinElement {
  /**
   * 构建一个猜拳元素
   * @param {number} id - 猜拳id
   */
  constructor (id) {
    super()
    this.type = 'rps'
    /**
     * @type {number} id
    */
    this.id = id
  }

  /**
   * @type {number} id
   */
  id
}

/**
 * @extends KarinElement
 */
export class KarinWeatherElement extends KarinElement {
  /**
   * 构建一个天气元素
   * @param {string} city - 城市名
   * @param {string} code - 城市代码
   */
  constructor (city, code) {
    super()
    this.type = 'weather'
    /**
     * @type {string} city
    */
    this.city = city
    /**
     * @type {string} code
    */
    this.code = code
  }

  /**
   * @type {string} city
   */
  city

  /**
   * @type {string} code
   */
  code
}

/**
 * @extends KarinElement
 */
export class KarinShareElement extends KarinElement {
  /**
   * 构建一个链接分享
   * @param {string} url - 链接
   * @param {string} title - 标题
   * @param {string} content - 内容
   * @param {string} image - 图片
   * @returns {KarinShareElement}
   */
  constructor (url, title, content, image) {
    super()
    this.type = 'share'
    /**
     * @type {string} url
    */
    this.url = url
    /**
     * @type {string} title
    */
    this.title = title
    /**
     * @type {string} content
    */
    this.content = content
    /**
     * @type {string} image
    */
    this.image = image
  }

  /**
   * @type {string} url
   */
  url

  /**
   * @type {string} title
   */
  title

  /**
   * @type {string} content
   */
  content

  /**
   * @type {string} image
   */
  image
}

/**
 * @extends KarinElement
 */
export class GiftElement extends KarinElement {
  /**
   * 不支持发送
   * 构建一个礼物元素
   * @param {number} qq - 发送者qq
   * @param {number} id - 礼物id
   */
  constructor (qq, id) {
    super()
    this.type = 'gift'
    /**
     * @type {number} id
    */
    this.id = id
    /**
     * @type {number} qq
    */
    this.qq = qq
  }

  /**
   * @type {number} id
   */
  id

  /**
   * @type {number} qq
   */
  qq
}

/**
 * Contact
 * @class KarinContact
 */
export class KarinContact {
  /**
   * new
   * @param {'private' | 'group'} scene
   * @param {string} peer
   * @param {string?} sub_peer
   */
  constructor (scene, peer, sub_peer) {
    this.scene = scene
    this.peer = peer
    this.sub_peer = sub_peer
  }

  /**
   * @type {'private' | 'group'}
   */
  scene

  /**
   * @type {string}
   */
  peer

  /**
   * @type {string | undefined}
   */
  sub_peer

  /**
   * group
   * @param {string|number} peer
   * @return {KarinContact}
   */
  static group (peer) {
    return new KarinContact('group', peer + '')
  }

  /**
   * private
   * @param {string|number} peer
   * @param {string?} sub_peer
   * @return {KarinContact}
   */
  static private (peer, sub_peer) {
    return new KarinContact('private', peer + '', sub_peer ? sub_peer + '' : undefined)
  }
}
