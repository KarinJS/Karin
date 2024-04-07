
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
     */
    constructor (event, self_id, user_id, group_id, time, contact, sender) {
        this.self_id = self_id
        this.user_id = user_id
        this.group_id = group_id
        this.time = time
        this.event = event
        this.contact = contact
        this.sender = sender
    }

    /**
     * 机器人id
     * @type {string}
     */
    self_id;

    /**
     * 用户id
     * @type {string}
     */
    user_id;

    /**
     * 群id
     * @type {string}
     */
    group_id;

    /**
     * 事件类型
     * @type {'message'|'notice'|'request'}
     */
    event;

    /**
     * 消息时间戳
     * @type {number}
     */
    time;

    /**
     * 联系人信息
     * @type {Object}
     */
    contact;

    /**
     * 发送者信息
     * @type {Object}
     */
    sender;

    /**
     * 是否为主人
     * @type {boolean}
     */
    isMaster;

    /**
     * 是否为私聊
     * @type {boolean}
     */
    isPrivate;

    /**
     * 是否为群聊
     * @type {boolean}
     */
    isGroup;

    /**
     * 是否为频道
     * @type {boolean}
     */
    isGuild;

    /**
     * 是否为群临时会话
     * @type {boolean}
     */
    isGroupTemp;

    /**
     * 日志函数字符串
     * @type {string}
     */
    logFnc;

    /**
     * 日志用户字符串
     * @type {string}
     */
    logText;

    /**
     * 回复函数
     * @type {replyCallback}
     */
    reply;

    /**
     * 打印带bot前缀info等级日志
     * @type {logCallback}
     */
    log;

    /**
     * 获取头像url
     * @type {getAvatarCallback}
     */
    getAvatar;

    /**
     * 获取群头像
     * @type {getGroupAvatarCallback}
     */
    getGroupAvatar;
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
    super('message', self_id, user_id, group_id, time, contact, sender)
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
     * 消息序列号
     * @type {string}
     */
    message_seq;

    /**
     * 适合人类阅读的消息体
     * @type {string}
     */
    raw_message;

    /**
     * 消息体元素
     * @type {Array<KarinElement>}
     */
    elements;

    /**
     * 框架处理后的文本
     * @type {string}
     */
    msg;

    /**
     * 游戏类型
     * @type {string}
     */
    game;

    /**
     * 图片数组
     * @type {Array<string>}
     */
    img;

    /**
     * at
     * @type {string}
     */
    at;

    /**
     * atBot
     * @type {boolean}
     */
    atBot;

    /**
     * atAll
     * @type {boolean}
     */
    atAll;

    /**
     * 文件元素
     * @type {object}
     */
    file;

    /**
     * 引用消息id
     * @type {string}
     */
    reply_id;
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

export { KarinEvent, KarinMessage }
