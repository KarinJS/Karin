import { KarinButton } from '@/utils/button/types'

/** 元素类型枚举 */
export const enum ElementTypeEnum {
  /** 文本元素 */
  TEXT = 'text',
  /** 图片元素 */
  IMAGE = 'image',
  /** At元素 */
  AT = 'at',
  /** 表情元素 */
  FACE = 'face',
  /** 回复元素 */
  REPLY = 'reply',
  /** 视频元素 */
  VIDEO = 'video',
  /** 语音元素 */
  RECORD = 'record',
  /** 音乐元素 */
  MUSIC = 'music',
  /** JSON元素 */
  JSON = 'json',
  /** XML元素 */
  XML = 'xml',

  /** Markdown元素 */
  MARKDOWN = 'markdown',
  /** Markdown模板元素 */
  MARKDOWN_TPL = 'markdownTpl',
  /** 被动事件元素 */
  PASMSG = 'pasmsg',
  /** 多行按钮 */
  KEYBOARD = 'keyboard',
  /** 单行按钮 */
  BUTTON = 'button',

  /** 长元素 */
  LONG_MSG = 'longMsg',
  /** 原始元素 */
  RAW = 'raw',

  /** 篮球元素 */
  BASKETBALL = 'basketball',
  /** 骰子元素 */
  DICE = 'dice',
  /** 猜拳元素 */
  RPS = 'rps',
  /** 弹射表情元素 */
  BUBBLE_FACE = 'bubbleFace',

  /** 天气元素 */
  WEATHER = 'weather',
  /** 位置元素 */
  LOCATION = 'location',
  /** 分享元素 */
  SHARE = 'share',
  /** 礼物元素 */
  GIFT = 'gift',
  /** 商城表情元素 */
  MARKET_FACE = 'marketFace',
  /** 分享名片元素 */
  CONTACT = 'contact',
}

interface Element {
  /** 元素类型 */
  type: ElementTypeEnum
}

/** 文本元素 */
export interface TextElementType extends Element {
  type: ElementTypeEnum.TEXT
  /** 文本内容 */
  text: string
}

/** At元素 */
export interface AtElementType extends Element {
  type: ElementTypeEnum.AT
  /** 目标id atall=all at在线成员=online */
  targetId: string
  /** At的名称 */
  name?: string
}

/** 表情元素 */
export interface FaceElementType extends Element {
  type: ElementTypeEnum.FACE
  /** 表情ID */
  id: number
  /** 是否大表情，默认不是 */
  isBig?: boolean
}

/** 回复元素 */
export interface ReplyElementType extends Element {
  type: ElementTypeEnum.REPLY
  /** 回复的消息ID */
  messageId: string
}

/** 图片元素 */
export interface ImageElementType extends Element {
  type: ElementTypeEnum.IMAGE
  /** 图片url、路径或者base64 */
  file: string
  /** 图片名称 */
  name?: string
  /** 图片外显名称 */
  summary?: string
  /** 图片MD5 */
  md5?: string
  /** 图片宽度 */
  width?: number
  /** 图片高度 */
  height?: number
  /** 图片子类型 */
  subType?: string
  /**
   * - show: 展示图片
   * - flash: 闪照
   * - original: 原图
   */
  fileType: 'show' | 'flash' | 'original'
}

/** 视频元素 */
export interface VideoElementType extends Element {
  type: ElementTypeEnum.VIDEO
  /** 视频url、路径或者base64 */
  file: string
  /** 视频名称 */
  name?: string
  /** 视频MD5 */
  md5?: string
  /** 视频宽度 */
  width?: number
  /** 视频高度 */
  height?: number
}

/** 语音元素 */
export interface RecordElementType extends Element {
  type: ElementTypeEnum.RECORD
  /** 语音文件url、路径或者base64 */
  file: string
  /** 是否为魔法语音 */
  magic: boolean
  /** 语音md5 */
  md5?: string
  /** 语音名称 */
  name?: string
}

/** 支持的音乐平台 */
// export type MusicPlatform = 'custom' | 'qq' | '163' | 'migu' | 'kugou' | 'kuwo'
export const enum MusicPlatform {
  /** 自定义音乐 */
  CUSTOM = 'custom',
  /** QQ音乐 */
  QQ = 'qq',
  /** 网易云音乐 */
  NETEASE = '163',
  /** 咪咕音乐 */
  MIGU = 'migu',
  /** 酷狗音乐 */
  KUGOU = 'kugou',
  /** 酷我音乐 */
  KUWO = 'kuwo',
}

// 音乐元素有2种类型，一种是自定义音乐，一种是QQ音乐、网易云音乐、咪咕音乐、酷狗音乐、酷我音乐 通过泛型来区分

/** 自定义音乐元素 */
interface MusicElementCustom<T extends MusicPlatform.CUSTOM> extends Element {
  type: ElementTypeEnum.MUSIC
  /** 音乐平台 */
  platform: T
  /** 跳转链接 */
  url: string
  /** 音乐音频链接 */
  audio: string
  /** 标题 */
  title: string
  /** 歌手 */
  author: string
  /** 封面 */
  pic: string
}

interface MusicElementReady<T extends Exclude<MusicPlatform, MusicPlatform.CUSTOM>> extends Element {
  type: ElementTypeEnum.MUSIC
  /** 音乐平台 */
  platform: T
  /** 歌曲ID */
  id: string
}

/** 常规音乐 */
type MusicElementReadyType = MusicElementReady<Exclude<MusicPlatform, MusicPlatform.CUSTOM>>
/** 自定义音乐 */
type MusicElementCustomType = MusicElementCustom<MusicPlatform.CUSTOM>

/** 音乐元素 */
export type MusicElement = MusicElementReadyType | MusicElementCustomType

/** JSON元素 */
export interface JsonElementType extends Element {
  type: ElementTypeEnum.JSON
  /** JSON内容 未反序 */
  data: string
}

/** XML元素 */
export interface XmlElementType extends Element {
  type: ElementTypeEnum.XML
  /** XML内容 未反序 */
  data: string
}

/** Markdown元素 */
export interface MarkdownElementType extends Element {
  type: ElementTypeEnum.MARKDOWN
  /** Markdown内容 */
  markdown: string
  config?: {
    /** 未知的参数 */
    unknown?: number
    time: number
    token: string
  }
}

/** Markdown模板元素 */
export interface MarkdownTplElementType extends Element {
  type: ElementTypeEnum.MARKDOWN_TPL
  /** 模板ID */
  templateId: string
  /** 模板参数 */
  params: Array<{
    /** 模板参数键名称 */
    key: string
    /** 模板参数值 */
    values: Array<string>
  }>
}

/** 被动事件元素 */
export interface PasmsgElementType extends Element {
  type: ElementTypeEnum.PASMSG
  /** 被动事件ID */
  id: string
}

/** 多行按钮 */
export interface KeyboardElementType extends Element {
  type: ElementTypeEnum.KEYBOARD
  /** 按钮行数组 */
  rows: Array<Array<KarinButton>>
}

/** 单行按钮 */
export interface ButtonElementType extends Element {
  type: ElementTypeEnum.BUTTON
  /** 按钮数组 */
  data: Array<KarinButton>
}

/** 长消息元素 */
export interface LongMsgElementType extends Element {
  type: ElementTypeEnum.LONG_MSG
  /** 消息ID */
  id: string
}

/** 原始元素 */
export interface RawElementType extends Element {
  type: ElementTypeEnum.RAW
  /** 原始数据 */
  data: any
}

/** 篮球元素 */
export interface BasketballElementType extends Element {
  type: ElementTypeEnum.BASKETBALL
  /** 篮球ID */
  id: number
}

/** 骰子元素 */
export interface DiceElementType extends Element {
  type: ElementTypeEnum.DICE
  /** 骰子ID */
  id: number
}

/** 猜拳元素 */
export interface RpsElementType extends Element {
  type: ElementTypeEnum.RPS
  /** 猜拳ID */
  id: number
}

/** 弹射表情元素 */
export interface BubbleFaceElementType extends Element {
  type: ElementTypeEnum.BUBBLE_FACE
  /** 表情ID */
  id: number
  /** 表情数量 */
  count: number
}

/** 天气元素 */
export interface WeatherElementType extends Element {
  type: ElementTypeEnum.WEATHER
  /** 城市名称 */
  city: string
  /** 城市代码 */
  code: string
}

/** 位置元素 */
export interface LocationElementType extends Element {
  type: ElementTypeEnum.LOCATION
  /** 纬度 */
  lat: number
  /** 经度 */
  lon: number
  /** 标题 */
  title: string
  /** 地址 */
  address: string
}

/** 分享元素 */
export interface ShareElementType extends Element {
  type: ElementTypeEnum.SHARE
  /** 分享链接 */
  url: string
  /** 分享标题 */
  title: string
  /** 分享内容 */
  content: string
  /** 分享图片 */
  image: string
}

/** 礼物元素 */
export interface GiftElementType extends Element {
  type: ElementTypeEnum.GIFT
  /** QQ 号 */
  qq: number
  /** 礼物ID */
  id: number
}

/** 商城表情元素 */
export interface MarketFaceElementType extends Element {
  type: ElementTypeEnum.MARKET_FACE
  /** 表情ID */
  id: string
}

/** 分享名片元素 */
export interface ContactElementType extends Element {
  type: ElementTypeEnum.CONTACT
  /** 分享类型 */
  scene: 'group' | 'friend'
  /** 被推荐人的QQ号或者被推荐群的群号 */
  peer: string
}

export type ElementTypes =
  | TextElementType
  | AtElementType
  | FaceElementType
  | ReplyElementType
  | ImageElementType
  | VideoElementType
  | RecordElementType
  | MusicElement
  | JsonElementType
  | XmlElementType
  | MarkdownElementType
  | MarkdownTplElementType
  | PasmsgElementType
  | KeyboardElementType
  | ButtonElementType
  | LongMsgElementType
  | RawElementType
  | BasketballElementType
  | DiceElementType
  | RpsElementType
  | BubbleFaceElementType
  | WeatherElementType
  | LocationElementType
  | ShareElementType
  | GiftElementType
  | MarketFaceElementType
  | ContactElementType

const enum NodeTypeEnum {
  /** 节点 */
  NODE = 'node',
}

interface NodeType {
  type: NodeTypeEnum.NODE
}

/** 常规合并转发节点 */
export interface NodeElementReadyType extends NodeType {
  /** 节点ID */
  resId: string
  /** @deprecated 即将废弃 请使用 `resId` */
  res_id: string
}

/** 自定义节点 */
export interface NodeElementCustomType extends NodeType {
  /** 目标ID */
  userId: string
  /** 目标名称 */
  nickname: string
  /** 转发的元素节点 */
  message: Array<ElementTypes>
}

/** 节点元素 */
export type NodeElementType = NodeElementReadyType | NodeElementCustomType

/** 快速构建消息元素实例 */
class ElementBuilder {
  /**
   * 构建文本元素
   * @param text - 文本内容
   */
  text (text: string): TextElementType {
    return { type: ElementTypeEnum.TEXT, text }
  }

  /**
   * 构建At元素
   * @param targetId - 目标id atall=all at在线成员=online
   * @param name - At的名称
   */
  at (targetId: string, name?: string): AtElementType {
    return { type: ElementTypeEnum.AT, targetId, name }
  }

  /**
   * 构建表情元素
   * @param id - 表情ID
   * @param isBig - 是否大表情，默认不是
   */
  face (id: number, isBig?: boolean): FaceElementType {
    return { type: ElementTypeEnum.FACE, id: Number(id), isBig }
  }

  /**
   * 构建回复元素
   * @param messageId - 回复的消息ID
   */
  reply (messageId: string): ReplyElementType {
    return { type: ElementTypeEnum.REPLY, messageId: String(messageId) }
  }

  /**
   * 构建图片元素
   * @param file - 图片url、路径或者base64
   * @param fileType - 图片类型
   * @param options - 其他可选参数
   */
  image (file: string, fileType: 'show' | 'flash' | 'original', options: Partial<Omit<ImageElementType, 'type' | 'file' | 'fileType'>> = {}): ImageElementType {
    return {
      type: ElementTypeEnum.IMAGE,
      file,
      fileType,
      height: options?.height,
      width: options?.width,
      md5: options?.md5,
      name: options?.name,
      subType: options?.subType,
    }
  }

  /**
   * 构建视频元素
   * @param file - 视频url、路径或者base64
   * @param options - 其他可选参数
   */
  video (file: string, options?: Partial<Omit<VideoElementType, 'type' | 'file'>>): VideoElementType {
    return {
      type: ElementTypeEnum.VIDEO,
      file,
      height: options?.height,
      width: options?.width,
      md5: options?.md5,
      name: options?.name,
    }
  }

  /**
   * 构建语音元素
   * @param file - 语音文件url、路径或者base64
   * @param magic - 是否为魔法语音
   * @param options - 其他可选参数
   */
  record (file: string, magic: boolean, options?: Partial<Omit<RecordElementType, 'type' | 'file' | 'magic'>>): RecordElementType {
    return {
      type: ElementTypeEnum.RECORD,
      file,
      magic,
      md5: options?.md5,
      name: options?.name,
    }
  }

  /**
   * 构建常规音乐元素
   * @param id - 歌曲ID
   * @param platform - 音乐平台
   */
  music (id: MusicElementReadyType['id'], platform: MusicElementReadyType['platform']): MusicElementReadyType

  /**
   * 构建自定义音乐元素
   * @param options - 自定义音乐选项
   */
  music (options: MusicElementCustomType): MusicElementCustomType
  /**
   * 构建音乐元素
   * @param idOrOptions - 歌曲ID或自定义音乐选项
   * @param platform - 音乐平台
   */
  music (
    idOrOptions: string | MusicElementCustomType,
    platform?: MusicElementReadyType['platform']
  ): MusicElementReadyType | MusicElementCustomType {
    if (typeof idOrOptions === 'string') {
      /** 常规 */
      return { type: ElementTypeEnum.MUSIC, platform: platform!, id: idOrOptions }
    } else {
      /** 自定义 */
      return { ...idOrOptions, type: ElementTypeEnum.MUSIC, platform: MusicPlatform.CUSTOM }
    }
  }

  /**
   * 构建JSON元素
   * @param data - JSON内容
   */
  json (data: string): JsonElementType {
    return { type: ElementTypeEnum.JSON, data }
  }

  /**
   * 构建XML元素
   * @param data - XML内容
   */
  xml (data: string): XmlElementType {
    return { type: ElementTypeEnum.XML, data }
  }

  /**
   * 构建Markdown元素
   * @param markdown - Markdown内容
   * @param config - 配置参数
   */
  markdown (markdown: string, config?: MarkdownElementType['config']): MarkdownElementType {
    return { type: ElementTypeEnum.MARKDOWN, markdown, config }
  }

  /**
   * 构建Markdown模板元素
   * @param templateId - 模板ID
   * @param params - 模板参数
   */
  markdownTpl (templateId: string, params: MarkdownTplElementType['params']): MarkdownTplElementType {
    return { type: ElementTypeEnum.MARKDOWN_TPL, templateId, params }
  }

  /**
   * 构建被动事件元素
   * @param id - 被动事件ID
   */
  pasmsg (id: string): PasmsgElementType {
    return { type: ElementTypeEnum.PASMSG, id }
  }

  /**
   * 构建多行按钮元素
   * @param data - 按钮行数组
   */
  keyboard (data: Array<Array<KarinButton>>): KeyboardElementType {
    /** 每一个元素为一行按钮 每一行按钮存在多个 */
    const rows: Array<Array<KarinButton>> = []
    if (!Array.isArray(data)) data = [data]

    for (const i of data) {
      /** 如果还是数组 说明是单行多个按钮 */
      if (Array.isArray(i)) {
        const button: Array<KarinButton> = []
        for (const v of i) button.push(v)
        rows.push(button)
      } else {
        /** 单行 单个按钮 */
        rows.push([i])
      }
    }
    return { type: ElementTypeEnum.KEYBOARD, rows }
  }

  /**
   * 构建单行按钮元素
   * @param data - 按钮数组
   */
  button (data: Array<KarinButton>): ButtonElementType {
    return { type: ElementTypeEnum.BUTTON, data: Array.isArray(data) ? data : [data] }
  }

  /**
   * 构建长消息元素
   * @param id - 消息ID
   */
  longMsg (id: string): LongMsgElementType {
    return { type: ElementTypeEnum.LONG_MSG, id }
  }

  /**
   * 构建原始元素
   * @param data - 原始数据
   */
  raw (data: any): RawElementType {
    return { type: ElementTypeEnum.RAW, data }
  }

  /**
   * 构建篮球元素
   * @param id - 篮球ID
   */
  basketball (id: number): BasketballElementType {
    return { type: ElementTypeEnum.BASKETBALL, id: Number(id) }
  }

  /**
   * 构建骰子元素
   * @param id - 骰子ID
   */
  dice (id: number): DiceElementType {
    return { type: ElementTypeEnum.DICE, id: Number(id) }
  }

  /**
   * 构建猜拳元素
   * @param id - 猜拳ID
   */
  rps (id: number): RpsElementType {
    return { type: ElementTypeEnum.RPS, id: Number(id) }
  }

  /**
   * 构建弹射表情元素
   * @param id - 表情ID
   * @param count - 表情数量
   */
  bubbleFace (id: number, count: number): BubbleFaceElementType {
    return { type: ElementTypeEnum.BUBBLE_FACE, id: Number(id), count: Number(count) }
  }

  /**
   * 构建天气元素
   * @param city - 城市名称
   * @param code - 城市代码
   */
  weather (city: string, code: string): WeatherElementType {
    return { type: ElementTypeEnum.WEATHER, city, code }
  }

  /**
   * 构建位置元素
   * @param lat - 纬度
   * @param lon - 经度
   * @param title - 标题
   * @param address - 地址
   */
  location (lat: number, lon: number, title: string, address: string): LocationElementType {
    return { type: ElementTypeEnum.LOCATION, lat, lon, title, address }
  }

  /**
   * 构建分享元素
   * @param url - 分享链接
   * @param title - 分享标题
   * @param content - 分享内容
   * @param image - 分享图片
   */
  share (url: string, title: string, content: string, image: string): ShareElementType {
    return { type: ElementTypeEnum.SHARE, url, title, content, image }
  }

  /**
   * 构建礼物元素
   * @param qq - QQ号
   * @param id - 礼物ID
   */
  gift (qq: number, id: number): GiftElementType {
    return { type: ElementTypeEnum.GIFT, qq, id }
  }

  /**
   * 构建商城表情元素
   * @param id - 表情ID
   */
  marketFace (id: string): MarketFaceElementType {
    return { type: ElementTypeEnum.MARKET_FACE, id }
  }

  /**
   * 构建分享名片元素
   * @param scene - 分享类型
   * @param peer - 被推荐人的QQ号或者被推荐群的群号
   */
  contact (scene: 'group' | 'friend', peer: string): ContactElementType {
    return { type: ElementTypeEnum.CONTACT, scene, peer }
  }

  /**
   * 构建常规转发节点元素
   * @param resId resId - 资源ID
   */
  node (resId: NodeElementReadyType['resId']): NodeElementReadyType
  /**
   * 构建自定义转发节点元素
   * @param userId - 目标ID
   * @param nickname - 目标名称
   * @param message - 转发的消息元素结构
   */
  node (
    userId: NodeElementCustomType['userId'],
    nickname: NodeElementCustomType['nickname'],
    message: NodeElementCustomType['message']
  ): NodeElementCustomType
  /**
   * 构建转发节点元素
   * @param resIdOrUserId - 资源ID或目标ID
   * @param nickname - 目标名称
   * @param message - 转发的消息元素结构
   */
  node (
    resIdOrUserId: NodeElementCustomType['userId'] | NodeElementReadyType['resId'],
    nickname?: NodeElementCustomType['nickname'],
    message?: NodeElementCustomType['message']
  ): NodeElementType {
    if (resIdOrUserId && nickname && message) {
      /** 自定义 */
      return { type: NodeTypeEnum.NODE, userId: resIdOrUserId, nickname, message }
    } else {
      /** 常规 */
      return { type: NodeTypeEnum.NODE, resId: resIdOrUserId, res_id: resIdOrUserId }
    }
  }
}

/** 消息元素构建 */
export const segment = new ElementBuilder()
