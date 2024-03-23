class Segment {
  /**
   * 纯文本
   * @param {string} text - 文本内容
   * @returns {object} 纯文本消息
   */
  text (text) {
    return {
      type: 'text',
      data: { text }
    }
  }

  /**
   * QQ 表情
   * @param {string} id - QQ 表情 ID
   * @returns {object} QQ 表情消息
   */
  face (id) {
    return {
      type: 'face',
      data: { id }
    }
  }

  /**
   * 图片
   * @param {string} file - 图片文件名或URL
   * @param {string} [type] - 图片类型，flash 表示闪照，无此参数表示普通图片
   * @returns {object} 图片消息
   */
  image (file, type) {
    let message = { file }
    if (type) message.type = type
    return {
      type: 'image',
      data: message
    }
  }

  /**
   * 语音
   * @param {string} file - 语音文件名或URL
   * @param {boolean} [magic] - 是否变声，默认为false
   * @returns {object} 语音消息
   */
  record (file, magic = false) {
    return {
      type: 'record',
      data: { file, magic }
    }
  }

  /**
   * 短视频
   * @param {string} file - 视频文件名或URL
   * @returns {object} 短视频消息
   */
  video (file) {
    return {
      type: 'video',
      data: { file }
    }
  }

  /**
   * @某人
   * @param {string} qq - QQ号或'all'
   * @returns {object} @某人消息
   */
  at (qq) {
    qq = String(qq)
    return {
      type: 'at',
      data: { qq }
    }
  }

  /**
   * 猜拳魔法表情
   * @returns {object} 猜拳魔法表情消息
   */
  rps () {
    return {
      type: 'rps',
      data: {}
    }
  }

  /**
   * 掷骰子魔法表情
   * @returns {object} 掷骰子魔法表情消息
   */
  dice () {
    return {
      type: 'dice',
      data: {}
    }
  }

  /**
   * 窗口抖动（戳一戳）
   * @returns {object} 戳一戳消息
   */
  shake () {
    return {
      type: 'shake',
      data: {}
    }
  }

  /**
   * 戳一戳
   * @param {string} type - 类型 见https://github.com/mamoe/mirai/blob/f5eefae7ecee84d18a66afce3f89b89fe1584b78/mirai-core/src/commonMain/kotlin/net.mamoe.mirai/message/data/HummerMessage.kt#L49
   * @param {string} id - ID
   * @param {string} [name] - 表情名
   * @returns {object} 戳一戳消息
   */
  poke (type, id, name) {
    return {
      type: 'poke',
      data: { type, id, name }
    }
  }

  /**
   * 匿名发消息
   * @param {number} [ignore] - 可选，表示无法匿名时是否继续发送
   * @returns {object} 匿名发消息
   */
  anonymous (ignore) {
    return {
      type: 'anonymous',
      data: { ignore }
    }
  }

  /**
     * 链接分享
     * @param {string} url - URL
     * @param {string} title - 标题
     * @param {string} [content] - 内容描述
     * @param {string} [image] - 图片 URL
     * @returns {object} 链接分享消息
     */
  share (url, title, content, image) {
    return {
      type: 'share',
      data: { url, title, content, image }
    }
  }

  /**
   * 推荐好友或群
   * @param {string} type - 类型，'qq' 表示推荐好友，'group' 表示推荐群
   * @param {string} id - 被推荐人的 QQ 号或被推荐群的群号
   * @returns {object} 推荐消息
   */
  contact (type, id) {
    return {
      type: 'contact',
      data: { type, id }
    }
  }

  /**
   * 位置
   * @param {string} lat - 纬度
   * @param {string} lon - 经度
   * @param {string} [title] - 标题
   * @param {string} [content] - 内容描述
   * @returns {object} 位置消息
   */
  location (lat, lon, title, content) {
    let message = { lat, lon }
    if (title) message.title = title
    if (content) message.content = content
    return {
      type: 'location',
      data: message
    }
  }

  /**
   * 音乐分享
   * @param {string} type - 音乐类型，'qq', '163', 'xm'
   * @param {string} id - 歌曲 ID
   * @returns {object} 音乐分享消息
   */
  music (type, id) {
    return {
      type: 'music',
      data: { type, id }
    }
  }

  /**
   * 自定义音乐分享
   * @param {string} url - 点击后跳转目标 URL
   * @param {string} audio - 音乐 URL
   * @param {string} title - 标题
   * @param {string} [content] - 内容描述
   * @param {string} [image] - 图片 URL
   * @returns {object} 自定义音乐分享消息
   */
  customMusic (url, audio, title, content, image) {
    let message = { url, audio, title }
    if (content) message.content = content
    if (image) message.image = image
    return {
      type: 'music',
      data: message
    }
  }

  /**
   * 回复
   * @param {string} id - 回复时引用的消息 ID
   * @returns {object} 回复消息
   */
  reply (id) {
    return {
      type: 'reply',
      data: { id: String(id) }
    }
  }

  /**
     * 合并转发节点 发已有消息id使用
     * @param {string} id - 转发的消息 ID
     * @returns {object} 合并转发节点消息
     */
  forward (id) {
    return {
      type: 'node',
      data: { id: String(id) }
    }
  }

  /**
   * 合并转发自定义节点
   * @param {string} user_id - 发送者 QQ 号
   * @param {string} nickname - 发送者昵称
   * @param {object[]|string} content - 消息内容，可以是消息对象数组或字符串
   * @returns {object} 合并转发自定义节点消息
   */
  node (user_id, nickname, content) {
    return {
      type: 'node',
      data: { user_id, nickname, content }
    }
  }

  /**
   * XML 消息
   * @param {string} data - XML 内容
   * @returns {object} XML 消息
   */
  xml (data) {
    data = typeof data === 'string' ? data : JSON.stringify(data)
    return {
      type: 'xml',
      data: { data }
    }
  }

  /**
   * JSON 消息
   * @param {string} data - JSON 内容
   * @returns {object} JSON 消息
   */
  json (data) {
    data = typeof data === 'string' ? data : JSON.stringify(data)
    return {
      type: 'json',
      data: { data }
    }
  }
}

export default Object.freeze(new Segment())
