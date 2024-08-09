import {
  TextElement,
  AtElement,
  ImageElement,
  FaceElement,
  BubbleFaceElement,
  ReplyElement,
  VideoElement,
  BasketballElement,
  DiceElement,
  RpsElement,
  PokeElement,
  MusicElement,
  WeatherElement,
  LocationElement,
  ShareElement,
  GiftElement,
  MarketFaceElement,
  ForwardElement,
  ContactElement,
  JsonElement,
  XmlElement,
  FileElement,
  ButtonElement,
  CustomMusicElemen,
  TplMarkdownElement,
  RawMarkdownElement,
  NodeElement,
  KarinElement,
  LongMsgElement,
  RecordElement,
  KeyBoardElement,
  Button,
} from 'karin/types'

export const segment = new (class Segment {
  /**
   * 纯文本
   * @param text - 文本内容
   * @returns {TextElement} 纯文本元素
   */
  text (text: string): TextElement {
    return {
      type: 'text',
      text: text + '',
    }
  }

  /**
   * 提及
   * 提供一个uid即可
   * @param uid - uid
   * @param uin - uin
   * @param name - 名称
   * @returns {AtElement} 提及元素
   */
  at (uid: string, uin?: string, name?: string): AtElement {
    return {
      type: 'at',
      uid: uid + '',
      uin: (uin || '') + '',
      name,
    }
  }

  /**
   * 表情
   * @param id - 表情ID
   * @param is_big - 是否大表情，默认不是
   * @returns {FaceElement} 表情元素
   */
  face (id: number, is_big: boolean = false): FaceElement {
    return {
      type: 'face',
      id: Number(id),
      is_big,
    }
  }

  /**
   * 弹射表情
   * @param id - 表情ID
   * @param count - 数量
   * @returns {BubbleFaceElement} 弹射表情元素
   */
  bubble_face (id: number, count = 1): BubbleFaceElement {
    return {
      type: 'bubble_face',
      id: Number(id),
      count: Number(count),
    }
  }

  /**
   * 引用回复
   * @param message_id - 消息ID
   * @returns {ReplyElement} 引用回复元素
   */
  reply (message_id: string): ReplyElement {
    return {
      type: 'reply',
      message_id: message_id + '',
    }
  }

  /**
   * 图片
   * - 一般情况提供一个file参数即可，其他参数一般为收到的消息中的参数
   * @param file - 图片URL或路径、Base64
   * @param options - 图片类型、名称、MD5、子类型、宽度、高度
   * @returns {ImageElement} 图片元素
   */
  image (
    file: string,
    options: {
      /**
       * - 图片类型，show: 展示图片，flash: 闪照，original: 原图
       */
      file_type?: 'show' | 'flash' | 'original'
      /**
       * - 图片名称
       */
      name?: string
      /**
       * - 图片MD5
       */
      md5?: string
      /**
       * - 图片子类型
       */
      sub_type?: string
      /**
       * - 图片宽度
       */
      width?: number
      /**
       * - 图片高度
       */
      height?: number
    } = {}
  ): ImageElement {
    const file_type = options.file_type || 'original'
    const name = options.name || ''
    const md5 = options.md5 || ''
    const sub_type = options.sub_type || ''
    const width = options.width || 0
    const height = options.height || 0
    return {
      type: 'image',
      file,
      file_type,
      name,
      md5,
      sub_type,
      width,
      height,
    }
  }

  /**
   * 语音
   * @param file - 语音URL或路径、Base64
   * @param magic - 是否魔法语音，默认为 false
   * @param md5 - 语音md5
   * @param name - 语音名称
   */
  record (file: string, magic = false, md5 = '', name = ''): RecordElement {
    return {
      type: 'record',
      file,
      magic,
      md5,
      name,
    }
  }

  /**
   * 语音 即将废弃 请使用segment.record
   * @param file - 语音URL或路径、Base64
   * @param magic - 是否魔法语音，默认为 false
   * @param md5 - 语音md5
   * @param name - 语音名称
   */
  voice (file: string, magic = false, md5 = '', name = ''): RecordElement {
    return {
      type: 'record',
      file,
      magic,
      md5,
      name,
    }
  }

  /**
   * 视频
   * @param file - 视频URL或路径、Base64
   * @param md5  - 视频md5
   * @param name - 视频名称
   * @returns {VideoElement} 视频元素
   */
  video (file: string, md5 = '', name = ''): VideoElement {
    return {
      type: 'video',
      file,
      md5,
      name,
    }
  }

  /**
   * 篮球
   * @param id - 篮球ID
   * @returns {BasketballElement} 篮球元素
   */
  basketball (id: number): BasketballElement {
    return {
      type: 'basketball',
      id,
    }
  }

  /**
   * 骰子
   * @param id - 骰子ID
   * @returns {DiceElement} 骰子元素
   */
  dice (id: number): DiceElement {
    return {
      type: 'dice',
      id,
    }
  }

  /**
   * 石头剪刀布
   * @param id - 石头剪刀布ID
   * @returns {RpsElement} 石头剪刀布元素
   */
  rps (id: number): RpsElement {
    return {
      type: 'rps',
      id,
    }
  }

  /**
   * 戳一戳
   * @param id - 戳一戳ID
   * @param poke_type - 戳一戳类型
   * @param strength - 戳一戳强度(1-5 默认1)
   * @returns {PokeElement} 戳一戳元素
   */
  poke (id: number, poke_type: number, strength: number = 1): PokeElement {
    return {
      type: 'poke',
      id,
      poke_type,
      strength,
    }
  }

  /**
   * 自定义音乐
   * @param url - 跳转链接
   * @param audio - 音乐音频链接
   * @param title - 标题
   * @param author - 歌手
   * @param pic - 封面
   * @returns {CustomMusicElemen} 自定义音乐元素
   */
  customMusic (url: string, audio: string, title: string, author: string, pic: string, id: string): CustomMusicElemen {
    return {
      type: 'music',
      platform: 'custom',
      url,
      audio,
      title,
      author,
      pic,
      id,
    }
  }

  /**
   * 音乐
   * @param platform - 音乐平台
   * @param id - 音乐ID
   * @returns {MusicElement} 音乐元素
   */
  music (platform: 'QQ' | 'netease' | 'custom', id: string): MusicElement {
    return {
      type: 'music',
      platform,
      id,
    }
  }

  /**
   * 天气
   * @param city - 城市名称
   * @param code - 城市代码
   * @returns {WeatherElement} 天气元素
   */
  weather (city: string, code: string): WeatherElement {
    return {
      type: 'weather',
      city,
      code,
    }
  }

  /**
   * 位置
   * @param lat - 纬度
   * @param lon - 经度
   * @param title - 标题
   * @param address - 地址
   * @returns {LocationElement} 位置元素
   */
  location (lat: number, lon: number, title: string, address: string): LocationElement {
    return {
      type: 'location',
      lat,
      lon,
      title,
      address,
    }
  }

  /**
   * 分享
   * @param url - 分享链接
   * @param title - 分享标题
   * @param content - 分享内容
   * @param image - 分享图片
   * @returns {ShareElement} 分享元素
   */
  share (url: string, title: string, content: string, image: string): ShareElement {
    return {
      type: 'share',
      url,
      title,
      content,
      image,
    }
  }

  /**
   * 礼物
   * @param qq - QQ 号
   * @param id - 礼物ID
   * @returns {GiftElement} 礼物元素
   */
  gift (qq: number, id: number): GiftElement {
    return {
      type: 'gift',
      qq,
      id,
    }
  }

  /**
   * 商城表情
   * @param id - 表情ID
   * @returns {MarketFaceElement} 商城表情元素
   */
  marketFace (id: string): MarketFaceElement {
    return {
      type: 'market_face',
      id,
    }
  }

  /**
   * 转发
   * @param res_id - 资源ID
   * @param uniseq - 序列号(可能不对?)
   * @param summary - 摘要
   * @param description - 描述
   * @returns {ForwardElement} 转发元素
   */
  forward (res_id: string, uniseq?: string, summary?: string, description?: string): ForwardElement {
    return {
      type: 'forward',
      res_id,
      uniseq: uniseq || '',
      summary: summary || '',
      description: description || '',
    }
  }

  /**
   * 分享名片
   * @param scene - 分享类型
   * @param peer - 被推荐人的QQ号或者被推荐群的群号
   * @returns {ContactElement} 分享名片元素
   */
  contact (scene: 'group' | 'friend', peer: string): ContactElement {
    return {
      type: 'contact',
      scene,
      peer,
    }
  }

  /**
   * JSON
   * @param data - JSON序列化过的字符串
   * @returns {JsonElement} JSON元素
   */
  json (data: string): JsonElement {
    return {
      type: 'json',
      data,
    }
  }

  /**
   * XML
   * @param data - XML字符串
   * @returns {XmlElement} XML元素
   */
  xml (data: string): XmlElement {
    return {
      type: 'xml',
      data,
    }
  }

  /**
   * 文件
   */
  file (options: {
    /**
     * - 文件URL
     */
    url: string
    /**
     * - 文件名称
     */
    name?: string
    /**
     * - 文件大小
     */
    size?: number
    /**
     * - 文件过期时间
     */
    expire_time?: number
    /**
     * - 文件ID
     */
    id?: string
    /**
     * - 未知
     */
    biz?: number
    /**
     * - 文件子ID
     */
    sub_id?: string
    /**
     * - 文件MD5
     */
    md5?: string
  }): FileElement {
    return {
      type: 'file',
      file: options.url,
      name: options.name || '',
      size: options.size || 0,
      expire_time: options.expire_time || 0,
      id: options.id || '',
      url: options.url,
      biz: options.biz || 0,
      sub_id: options.sub_id || '',
      md5: options.md5 || '',
    }
  }

  /**
   * 长消息
   * @param id - ID
   */
  long_msg (id: string): LongMsgElement {
    return {
      type: 'long_msg',
      id,
    }
  }

  /**
   * Markdown
   * @param content - 原生markdown内容
   * @param config - 未知的参数
   */
  markdown (
    content: RawMarkdownElement['content'],
    config?: RawMarkdownElement['config']
  ): RawMarkdownElement {
    return {
      type: 'markdown',
      content,
      config,
    }
  }

  /**
   * 构建模板Markdown
   * @param custom_template_id - 模板ID
   * @param params - 模板markdown参数
   */
  markdown_tpl (
    /**
     * - 模板ID
     */
    custom_template_id: TplMarkdownElement['custom_template_id'],
    /**
     * - 模板markdown参数
     */
    params: TplMarkdownElement['params']
  ): TplMarkdownElement {
    return {
      type: 'markdown_tpl',
      custom_template_id,
      params,
    }
  }

  /**
   * 按钮 构建单行单个(obj)、多个按钮(obj[])
   * @param data - 按钮数据
   * @returns {ButtonElement} 按钮元素
   */
  button (data: Button | Array<Button>): {
    type: ButtonElement['type'],
    data: Array<Button>
  } {
    return {
      type: 'button',
      data: Array.isArray(data) ? data : [data],
    }
  }

  /**
   * 多维按钮
   * @param data - 按钮数据
   */
  keyboard (data: Array<Button> | Array<Array<Button>>): KeyBoardElement {
    /** 每一个元素为一行按钮 每一行按钮存在多个 */
    const rows: Array<Array<Button>> = []
    if (!Array.isArray(data)) data = [data]

    for (const i of data) {
      /** 如果还是数组 说明是单行多个按钮 */
      if (Array.isArray(i)) {
        const button: Array<Button> = []
        for (const v of i) button.push(v)
        rows.push(button)
      } else {
        /** 单行 单个按钮 */
        rows.push([i])
      }
    }
    return { type: 'keyboard', rows }
  }

  /**
   * 转发自定义节点
   * @param user_id - 用户ID
   * @param nickname - 用户昵称
   * @param content - 节点内容
   */
  node (user_id: string, nickname: string, content: KarinElement | Array<KarinElement>): NodeElement {
    return {
      type: 'node',
      user_id,
      nickname,
      content,
    }
  }
})()
