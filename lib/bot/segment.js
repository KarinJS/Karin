class Segment {
  /**
   * 纯文本
   * @param {string} text - 文本内容
   * @returns {<{type: string, text: string}>} 纯文本消息
   */
  text (text) {
    return { type: 'text', text }
  }

  /**
   * 表情
   * @param {number} id - QQ 表情 ID
   * @returns {<{type: string, id: number}>} QQ 表情消息
   */
  face (id) {
    return { type: 'face', id }
  }

  /**
   * 图片
   * @param {string} file - 图片文件名或URL
   * @param {string} [type] - 图片类型，flash 表示闪照，无此参数表示普通图片
   * @returns {<{type: string, file: string}>} 图片消息
   */
  image (file) {
    return { type: 'image', file }
  }

  /**
   * 语音
   * @param {string} file - 语音文件名或URL
   * @param {boolean} [magic] - 是否魔法语音，默认为 false
   * @returns {<{type: string, file: string, magic: boolean}>} 语音消息
   */
  record (file, magic = false) {
    return { type: 'record', file, magic }
  }

  /**
   * 短视频
   * @param {string} file - 视频文件名或URL
   * @returns {<{type: string, file: string}>} 短视频消息
   */
  video (file) {
    return { type: 'video', file }
  }

  /**
   * @某人
   * @param {string} uid - uid或'all'
   * @param {string} uin - uin
   * @returns {<{type: string, uid: string, uin: string}>} @某人消息
   */
  at (uid, uin) {
    return { type: 'at', uid, uin }
  }

  /**
   * 猜拳魔法表情
   * @returns {<{type: string, id:number}>} 猜拳魔法表情消息
   */
  rps (id) {
    return { type: 'rps', id }
  }

  /**
   * 掷骰子魔法表情
   * @returns {<{type: string, id:number}>} 掷骰子魔法表情消息
   */
  dice (id) {
    return { type: 'dice', id }
  }

  /**
   * 窗口抖动（戳一戳）
   * @returns {<{type: string, id:number}>} 戳一戳消息
   */
  shake (id) {
    return { type: 'shake', id }
  }

  /**
   * 戳一戳
   * @param {number} poke - 类型 见https://github.com/mamoe/mirai/blob/f5eefae7ecee84d18a66afce3f89b89fe1584b78/mirai-core/src/commonMain/kotlin/net.mamoe.mirai/message/data/HummerMessage.kt#L49
   * @param {number} id - ID
   * @param {number} strength - 强度
   * @returns {<{type: string, poke: string, id: string, name: string}>} 戳一戳消息
   */
  poke (poke, id, strength = 1) {
    return { type: 'poke', poke, id, strength }
  }

  /**
   * 匿名发消息
   * @param {number} [ignore] - 可选，表示无法匿名时是否继续发送
   * @returns {<{type: string, ignore: number}>} 匿名发消息
   */
  anonymous (ignore) {
    return { type: 'anonymous', ignore }
  }

  /**
     * 链接分享
     * @param {string} url - URL
     * @param {string} title - 标题
     * @param {string} [content] - 内容描述
     * @param {string} [image] - 图片 URL
     * @returns {{type: string, url: string, title: string, content: string, image: string}>} 链接分享消息
     */
  share (url, title, content, image) {
    return { type: 'share', url, title, content, image }
  }

  /**
   * 推荐好友或群
   * @param {string} platform - 类型，'qq' 表示推荐好友，'group' 表示推荐群
   * @param {string} id - 被推荐人的 QQ 号或被推荐群的群号
   * @returns {{type: string, platform: string, id: string}>} 推荐消息
   */
  contact (platform, id) {
    return { type: 'contact', platform, id }
  }

  /**
   * 位置
   * @param {string} lat - 纬度
   * @param {string} lon - 经度
   * @param {string} [title] - 标题
   * @param {string} [content] - 内容描述
   * @returns {<{type: string, lat: string, lon: string, title: string, content: string}>} 位置消息
   */
  location (lat, lon, title, content) {
    return { type: 'location', lat, lon, title, content }
  }

  /**
   * 音乐分享
   * @param {string} platform - 音乐类型，'qq', '163', 'xm'
   * @param {string} id - 歌曲 ID
   * @returns {<{type: string, platform: string, id: string}>} 音乐分享消息
   */
  music (platform, id) {
    return { type: 'music', platform, id }
  }

  /**
   * 自定义音乐分享
   * @param {string} url - 点击后跳转目标 URL
   * @param {string} audio - 音乐 URL
   * @param {string} title - 标题
   * @param {string} [content] - 内容描述
   * @param {string} [image] - 图片 URL
   * @returns {<{type: string, url: string, audio: string, title: string, content: string, image: string}>} 自定义音乐分享消息
   */
  customMusic (url, audio, title, content, image) {
    return { type: 'music', url, audio, title, content, image }
  }

  /**
   * 回复
   * @param {string} id - 回复时引用的消息 ID
   * @returns {<{type: string, message_id: string}>} 回复消息
   */
  reply (id) {
    return { type: 'reply', message_id: String(id) }
  }

  /**
     * 合并转发节点 发已有消息id使用
     * @param {string} id - 转发的消息 ID
     * @returns {<{type: string, id: string}>} 合并转发节点消息
     */
  forward (id) {
    return { type: 'forward', id: String(id) }
  }

  /**
   * 合并转发自定义节点
   * @param {string} user_id - 发送者 QQ 号
   * @param {string} nickname - 发送者昵称
   * @param {object[]} content - 消息内容，可以是消息对象数组或字符串
   * @returns {<{type: string, user_id: string, nickname: string, content: object[]}>} 合并转发自定义节点消息
   */
  node (user_id, nickname, content) {
    return { type: 'node', user_id, nickname, content }
  }

  /**
   * XML 消息
   * @param {string} data - XML 内容
   * @param {string} id
   * @returns {<{type: string, data: string, id: string}>} XML 消息
   */
  xml (data, id) {
    return { type: 'xml', data, id }
  }

  /**
   * JSON 消息
   * @param {string} data - JSON 内容
   * @returns {<{type: string, data: string}>} JSON 消息
   */
  json (data) {
    data = typeof data === 'string' ? data : JSON.stringify(data)
    return { type: 'json', data }
  }

  /**
   * markdown消息
   * @param {Object} data - markdown消息内容
   * @param {string} [data.content] - 原生markdown内容
   * @param {Object} [data.params] - 模板markdown参数
   * @returns {<{type: string, content?: string, custom_template_id?: string, params?:{key:string,values:string[]}[]}>} markdown消息
   */
  markdown (data) {
    if (typeof data === 'string') {
      return { type: 'markdown', content: data }
    } else if (data.content) {
      return { type: 'markdown', content: data.content }
    } else {
      return {
        type: 'markdown',
        custom_template_id: data.custom_template_id,
        params: data.params
      }
    }
  }

  /**
   * 构建官方按钮消息段
   * @param {any} data 在原有的segmene.button上支持二维数组
   * @returns {<{type: 'rows', data: any}>} 官方按钮消息段
   */
  rows (data) {
    let rows = []
    if (!Array.isArray(data)) data = [data]
    for (let i of data) {
      rows.push(this.button(i))
      continue
    }
    return { type: 'rows', rows }
  }

  /**
   * 按钮构建
   * @param {{
   * text: string,
   * type?: number,
   * link?: string,
   * data?: string,
   * show?: string,
   * style?: number,
   * enter?: boolean,
   * reply?: boolean,
   * admin?: boolean,
   * list?: string[],
   * role?: string[],
   * tips?: string
   * }[]} data - 包含按钮信息的对象数组，或者单个按钮信息对象。
   * @param {string} data.text - 按钮上的文字。
   * @param {number} [data.type] - 按钮类型：0 跳转按钮，1 回调按钮，2 指令按钮，默认为 2。
   * @param {string} [data.link] - 按钮跳转链接。
   * @param {string} [data.data] - 操作相关的数据
   * @param {string} [data.show] - 按钮点击后显示的文字，不传为text。
   * @param {number} [data.style] - 按钮样式：0 灰色线框，1 蓝色线框。
   * @param {boolean} [data.enter] - 指令按钮可用，点击按钮后直接自动发送 data，默认 false。
   * @param {boolean} [data.reply] - 指令按钮可用，指令是否带引用回复本消息，默认 false。
   * @param {boolean} [data.admin] - 仅管理者可操作。
   * @param {string[]} [data.list] - 有权限的用户 id 的列表。
   * @param {string[]} [data.role] - 有权限的身份组 id 的列表（仅频道可用）。
   * @param {boolean} [data.tips] - 客户端不支持本 action 的时候，弹出的 toast 文案。
   * @returns {<{type: 'button', buttons: {id: string, render_data: {label: string, style: number, visited_label: string}, action: {type: number, data: string, unsupport_tips: string, permission: {type: number, specify_user_ids?: string[], specify_role_ids?: string[]}}}>}} 按钮消息
   */
  button (data) {
    let id = 0
    const buttons = []
    if (!Array.isArray(data)) data = [data]
    for (let i of data) {
      // 按钮类型：0 跳转按钮，1 回调按钮，2 指令按钮
      const type = i.link ?? i.type ?? 2

      const data = {
        id: String(id),
        render_data: {
          // 按钮上的文字
          label: i.text || i.link,
          // 按钮样式：0 灰色线框，1 蓝色线框
          style: i.style ?? 0,
          // 点击后按钮的上显示的文字
          visited_label: i.show || i.text || i.link
        },
        action: {
          // 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data
          type,
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

      // 递增
      id++
    }
    return { type: 'button', buttons }
  }
}

export default Object.freeze(new Segment())
