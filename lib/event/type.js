/**
 * @class EventType.Message
 */
class EventType {
  /**
  * 构造一个消息
  * @param {string} self_id - 机器人id
  * @param {string} user_id - 用户id
  * @param {string} [group_id] - 群id
  * @param {number} time - 消息时间戳
  * @param {string} message_id - 消息id
  * @param {string} message_seq - 消息序列号
  * @param {string} raw_message - 适合人类阅读的消息体
  * @param {Object} contact - 联系人信息
  * @param {'group'|'friend'|'guild'|'nearby'|'stranger'|'stranger_from_group'} contact.scene - 场景
  * @param {string} contact.peer - 群聊/私聊/频道号
  * @param {string} [contact.sub_peer] - 群临时会话/子频道号
  * @param {Object} sender - 发送者信息
  * @param {string} sender.uid - 发送者uid
  * @param {string} sender.uin - 发送者uin
  * @param {string} [sender.nick] - 发送者昵称
  * @param {Array<Element>} elements - 消息体元素
  * @param {string} msg - 框架处理后的文本
  * @param {string} game - 游戏类型
  * @param {Array<string>} img - 图片数组
  * @param {string} at - at
  * @param {boolean} atBot - atBot
  * @param {boolean} atAll - atAll
  * @param {object} file - 文件元素
  * @param {string} reply_id - 引用消息id
  * @param {boolean} isMaster - 是否为主人
  * @param {boolean} isPrivate - 是否为私聊
  * @param {boolean} isGroup - 是否为群聊
  * @param {boolean} isGuild - 是否为频道
  * @param {boolean} isGroupTemp - 是否为群临时会话
  * @param {string} logFnc - 日志函数字符串
  * @param {string} logText - 日志用户字符串
  * @param {replyCallback} reply - 回复函数
  * @param {logCallback} log - 打印带bot前缀info等级日志
  * @param {getAvatarCallback} getAvatar - 获取头像url
  * @param {getGroupAvatarCallback} getGroupAvatar - 获取群头像
  */
  constructor (self_id, user_id, group_id, time, message_id, message_seq, raw_message, contact, sender, elements, msg, game, img, at, atBot, atAll, file, reply_id, isMaster, isPrivate, isGroup, isGuild, isGroupTemp, logFnc, logText, reply, log, getAvatar, getGroupAvatar) {
    /**
     * 机器人id
     * @type {string}
     */
    this.self_id = self_id
    /**
     * 用户id
     * @type {string}
     */
    this.user_id = user_id
    /**
     * 群id
     * @type {string}
     */
    this.group_id = group_id
    /**
     * 事件类型
     * @type {'message'}
     */
    this.event = 'message'
    /**
     * 消息时间戳
     * @type {number}
     */
    this.time = time
    /**
     * 消息id
     * @type {string}
     */
    this.message_id = message_id
    /**
     * 消息序列号
     * @type {string}
     */
    this.message_seq = message_seq
    /**
     * 适合人类阅读的消息体
     * @type {string}
     */
    this.raw_message = raw_message
    /**
     * 联系人信息
     * @type {Object}
     */
    this.contact = contact
    /**
     * 发送者信息
     * @type {Object}
     */
    this.sender = sender
    /**
     * 消息体元素
     * @type {Array<Element>}
     */
    this.elements = elements
    /**
     * 框架处理后的文本
     * @type {string}
     */
    this.msg = msg
    /**
     * 游戏类型
     * @type {string}
     */
    this.game = game
    /**
     * 图片数组
     * @type {Array<string>}
     */
    this.img = img
    /**
     * at
     * @type {string}
     */
    this.at = at
    /**
     * atBot
     * @type {boolean}
     */
    this.atBot = atBot
    /**
     * atAll
     * @type {boolean}
     */
    this.atAll = atAll
    /**
     * 文件元素
     * @type {object}
     */
    this.file = file
    /**
     * 引用消息id
     * @type {string}
     */
    this.reply_id = reply_id
    /**
     * 是否为主人
     * @type {boolean}
     */
    this.isMaster = isMaster
    /**
     * 是否为私聊
     * @type {boolean}
     */
    this.isPrivate = isPrivate
    /**
     * 是否为群聊
     * @type {boolean}
     */
    this.isGroup = isGroup
    /**
     * 是否为频道
     * @type {boolean}
     */
    this.isGuild = isGuild
    /**
     * 是否为群临时会话
     * @type {boolean}
     */
    this.isGroupTemp = isGroupTemp
    /**
     * 日志函数字符串
     * @type {string}
     */
    this.logFnc = logFnc
    /**
     * 日志用户字符串
     * @type {string}
     */
    this.logText = logText
    /**
     * 回复函数
     * @type {replyCallback}
     */
    this.reply = reply
    /**
     * 打印带bot前缀info等级日志
     * @type {logCallback}
     */
    this.log = log
    /**
     * 获取头像url
     * @type {getAvatarCallback}
     */
    this.getAvatar = getAvatar
    /**
     * 获取群头像
     * @type {getGroupAvatarCallback}
     */
    this.getGroupAvatar = getGroupAvatar
  }
}

/**
 * @callback replyCallback
 * @param {string|Element} msg - 发送的消息
 * @param {object} [data] - 回复数据
 * @param {boolean} [data.at] - 是否at用户
 * @param {boolean} [data.reply] - 是否引用回复
 * @param {number} [data.recallMsg] - 群聊是否撤回消息，0-120秒，0不撤回
 * @param {boolean} [data.button] - 是否使用按钮
 * @returns {{ message_id?: string }}
 */

/**
 * @callback logCallback
 * @param {...string} args - 打印的日志信息
 */

/**
 * @callback getAvatarCallback
 * @param {string} uid - 用户id，默认为发送者uid
 * @param {number} [size] - 头像大小，默认`0`
 * @returns {string} - 头像的url地址
 */

/**
 * @callback getGroupAvatarCallback
 * @param {string} group_id - 群号
 * @param {number} [size] - 头像大小，默认`0`
 * @returns {string} - 群头像的url地址
 */

export { EventType }
