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

  /**
   * markdown消息
   * @param {Object} data - markdown消息内容
   * @param {string} [data.content] - 原生markdown内容
   * @param {Object} [data.params] - 模板markdown参数
   * @returns {object} markdown消息
   */
  markdown (data) {
    const obj = {}
    if (typeof data === 'string') {
      obj.content = data
    } else if (data.content) {
      obj.content = data.content
    } else {
      obj.params = data.params
      obj.custom_template_id = data.custom_template_id
    }

    return {
      type: 'markdown',
      data: { data: obj }
    }
  }

  /**
   * 按钮构建
   * @param {Object[]|Object} list - 包含按钮信息的对象数组，或者单个按钮信息对象。
   * @param {string} list.text - 按钮上的文字。
   * @param {number} [list.type] - 按钮类型：0 跳转按钮，1 回调按钮，2 指令按钮，默认为 2。
   * @param {string} [list.link] - 按钮跳转链接。
   * @param {string} [list.data] - 操作相关的数据
   * @param {string} [list.show] - 按钮点击后显示的文字，不传为text。
   * @param {number} [list.style=1] - 按钮样式：0 灰色线框，1 蓝色线框。
   * @param {boolean} [list.enter] - 指令按钮可用，点击按钮后直接自动发送 data，默认 false。
   * @param {boolean} [list.reply] - 指令按钮可用，指令是否带引用回复本消息，默认 false。
   * @param {boolean} [list.admin] - 仅管理者可操作。
   * @param {number[]} [list.list] - 有权限的用户 id 的列表。
   * @param {number[]} [list.role] - 有权限的身份组 id 的列表（仅频道可用）。
   * @param {boolean} [list.tips] - 客户端不支持本 action 的时候，弹出的 toast 文案。
   * @param {number} [line=3] - 每行显示的按钮数量，默认为 3。
   * @returns {object[]} 按钮消息
   */
  button (list, line = 3) {
    let id = 0
    let index = 1
    let buttons = []
    let ret = []

    if (!Array.isArray(list)) list = [list]

    for (let i of list) {
      // 按钮类型：0 跳转按钮，1 回调按钮，2 指令按钮
      const type = i.link ? 0 : i.type

      const data = {
        id: String(id),
        render_data: {
          // 按钮上的文字
          label: i.text || i.link,
          // 按钮样式：0 灰色线框，1 蓝色线框
          style: i.style !== false ? Number(i.style) : 1,
          // 点击后按钮的上文字
          visited_label: i.show || i.text || i.link
        },
        action: {
          // 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data
          type: type === 0 ? 0 : (type || 2),
          // 操作相关的数据
          data: i.data || i.link || i.text,
          // 客户端不支持本action的时候，弹出的toast文案
          unsupport_tips: i.tips || '.',
          // 0 指定用户可操作，1 仅管理者可操作，2 所有人可操作，3 指定身份组可操作（仅频道可用）
          permission: { type: 2 }
        }
      }

      // 指令按钮可用，点击按钮后直接自动发送 data，默认 false。支持版本 8983
      if (i.enter) data.action.enter = true
      // 指令按钮可用，指令是否带引用回复本消息，默认 false。支持版本 8983
      if (i.reply) data.action.reply = true
      // 仅管理者可操作
      if (i.admin) data.action.permission.type = 1
      // 有权限的用户 id 的列表
      if (i.list) {
        i.action.permission.type = 0
        data.action.permission.specify_user_ids = i.list
      }
      // 有权限的身份组 id 的列表（仅频道可用）
      if (i.role) {
        i.action.permission.type = 3
        data.action.permission.specify_role_ids = i.role
      }

      buttons.push(data)

      if (index % line == 0 || index == list.length) {
        ret.push({ type: 'button', data: { rows: [{ buttons }] } })
        buttons = []
      }

      // 递增
      id++; index++
    }
    return ret
  }
}

export default Object.freeze(new Segment())
