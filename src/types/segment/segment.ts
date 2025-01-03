import { KarinButton } from './button'

/**
 * @description 消息段类型
 * - `text`: 文本
 * - `image`: 图片
 * - `at`: @
 * - `face`: 表情
 * - `reply`: 引用回复
 * - `video`: 视频
 * - `record`: 语音
 * - `music`: 音乐
 * - `json`: JSON
 * - `xml`: XML
 * - `markdown`: Markdown
 * - `markdownTpl`: Markdown模板
 * - `pasmsg`: 被动消息
 * - `keyboard`: 多维按钮
 * - `button`: 单行按钮
 * - `longMsg`: 长消息
 * - `raw`: 原始消息
 * - `basketball`: 篮球
 * - `dice`: 骰子
 * - `rps`: 猜拳
 * - `bubbleFace`: 气泡表情
 * - `weather`: 天气
 * - `location`: 位置
 * - `share`: 分享
 * - `gift`: 礼物
 * - `marketFace`: 商城表情
 * - `contact`: 联系人
 */
export type messageType = 'text'
  | 'image'
  | 'at'
  | 'face'
  | 'reply'
  | 'video'
  | 'record'
  | 'music'
  | 'json'
  | 'xml'
  | 'markdown'
  | 'markdownTpl'
  | 'pasmsg'
  | 'keyboard'
  | 'button'
  | 'longMsg'
  | 'raw'
  | 'basketball'
  | 'dice'
  | 'rps'
  | 'bubbleFace'
  | 'weather'
  | 'location'
  | 'share'
  | 'gift'
  | 'marketFace'
  | 'contact'
  | 'node'

interface Element {
  /** 消息段类型 */
  type: messageType
}

/** 文本元素 */
export interface TextElement extends Element {
  type: 'text'
  /** 文本内容 */
  text: string
}

/** At元素 */
export interface AtElement extends Element {
  type: 'at'
  /** 目标id atall=all at在线成员=online */
  targetId: string
  /** At的名称 */
  name?: string
}

/** 表情元素 */
export interface FaceElement extends Element {
  type: 'face'
  /** 表情ID */
  id: number
  /** 是否大表情，默认不是 */
  isBig?: boolean
}

/** 回复元素 */
export interface ReplyElement extends Element {
  type: 'reply'
  /** 回复的消息ID */
  messageId: string
}

/** 图片元素 */
export interface ImageElement extends Element {
  type: 'image'
  /** 图片url、路径或者base64 */
  file: string
  /** fid */
  fid?: string
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
   * show: 展示图片
   * flash: 闪照
   * original: 原图
   */
  fileType?: 'show' | 'flash' | 'original'
}

/** 视频元素 */
export interface VideoElement extends Element {
  type: 'video'
  /** 视频url、路径或者base64 */
  file: string
  /** fid */
  fid?: string
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
export interface RecordElement extends Element {
  type: 'record'
  /** 语音文件url、路径或者base64 */
  file: string
  /** fid */
  fid?: string
  /** 是否为魔法语音 */
  magic: boolean
  /** 语音md5 */
  md5?: string
  /** 语音名称 */
  name?: string
}

// 音乐元素有2种类型，一种是自定义音乐，一种是QQ音乐、网易云音乐、咪咕音乐、酷狗音乐、酷我音乐 通过泛型来区分
/**
 * 支持的音乐平台
 * - `custom`: 自定义音乐
 * - `qq`: QQ音乐
 * - `163`: 网易云音乐
 * - `migu`: 咪咕音乐
 * - `kugou`: 酷狗音乐
 * - `kuwo`: 酷我音乐
 */
export type MusicPlatform = 'custom' | 'qq' | '163' | 'migu' | 'kugou' | 'kuwo'

/** 常规音乐 */
export interface ReadyMusicElement extends Element {
  type: 'music'
  /** 音乐平台 */
  platform: 'qq' | '163' | 'migu' | 'kugou' | 'kuwo'
  /** 歌曲ID */
  id: string
}

/** 自定义音乐元素 */
export interface CustomMusicElement extends Element {
  type: 'music'
  /** 音乐平台 */
  platform: 'custom'
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

/** 音乐元素 */
export type MusicElement = CustomMusicElement | ReadyMusicElement

/** JSON元素 */
export interface JsonElement extends Element {
  type: 'json'
  /** JSON内容 未反序 */
  data: string
}

/** XML元素 */
export interface XmlElement extends Element {
  type: 'xml'
  /** XML内容 未反序 */
  data: string
}

/** Markdown元素 */
export interface MarkdownElement extends Element {
  type: 'markdown'
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
export interface MarkdownTplElement extends Element {
  type: 'markdownTpl'
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
export interface PasmsgElement extends Element {
  type: 'pasmsg'
  /** 事件id来源 */
  source: 'msg' | 'event'
  /** 被动事件ID */
  id: string
}

/** 多行按钮 */
export interface KeyboardElement extends Element {
  type: 'keyboard'
  /** 按钮行数组 */
  rows: KarinButton[][]
}

/** 单行按钮 */
export interface ButtonElement extends Element {
  type: 'button'
  /** 按钮数组 */
  data: KarinButton[]
}

/** 长消息元素 */
export interface LongMsgElement extends Element {
  type: 'longMsg'
  /** 消息ID */
  id: string
}

/** 原始元素 */
export interface RawElement extends Element {
  type: 'raw'
  /** 原始数据 */
  data: any
}

/** 篮球元素 */
export interface BasketballElement extends Element {
  type: 'basketball'
  /** 篮球ID */
  id: number
}

/** 骰子元素 */
export interface DiceElement extends Element {
  type: 'dice'
  /** 骰子ID */
  id: number
}

/** 猜拳元素 */
export interface RpsElement extends Element {
  type: 'rps'
  /** 猜拳ID */
  id: number
}

/** 弹射表情元素 */
export interface BubbleFaceElement extends Element {
  type: 'bubbleFace'
  /** 表情ID */
  id: number
  /** 表情数量 */
  count: number
}

/** 天气元素 */
export interface WeatherElement extends Element {
  type: 'weather'
  /** 城市名称 */
  city: string
  /** 城市代码 */
  code: string
}

/** 位置元素 */
export interface LocationElement extends Element {
  type: 'location'
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
export interface ShareElement extends Element {
  type: 'share'
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
export interface GiftElement extends Element {
  type: 'gift'
  /** QQ 号 */
  qq: number
  /** 礼物ID */
  id: number
}

/** 商城表情元素 */
export interface MarketFaceElement extends Element {
  type: 'marketFace'
  /** 表情ID */
  id: string
}

/** 分享名片元素 */
export interface ContactElement extends Element {
  type: 'contact'
  /** 分享类型 */
  scene: 'group' | 'friend'
  /** 被推荐人的QQ号或者被推荐群的群号 */
  peer: string
}

/**
 * 全部消息段元素
 */
export type Elements = TextElement
  | AtElement
  | FaceElement
  | ReplyElement
  | ImageElement
  | VideoElement
  | RecordElement
  | MusicElement
  | JsonElement
  | XmlElement
  | MarkdownElement
  | MarkdownTplElement
  | PasmsgElement
  | KeyboardElement
  | ButtonElement
  | LongMsgElement
  | RawElement
  | BasketballElement
  | DiceElement
  | RpsElement
  | BubbleFaceElement
  | WeatherElement
  | LocationElement
  | ShareElement
  | GiftElement
  | MarketFaceElement
  | ContactElement

/**
 * 发送消息段类型
 */
export type SendMessage = string | Elements | Array<string | Elements>
