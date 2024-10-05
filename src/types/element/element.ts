export type ElementType = 'text' | 'at' | 'face' | 'bubble_face' | 'reply' | 'image' | 'video' | 'basketball' | 'dice' | 'rps' | 'poke' | 'music' | 'weather' | 'location' | 'share' | 'gift' | 'market_face' | 'forward' | 'contact' | 'json' | 'xml' | 'file' | 'markdown' | 'markdown_tpl' | 'keyboard' | 'node' | 'rows' | 'record' | 'long_msg' | 'raw' | 'pasmsg'

export interface Element {
  /** 元素类型 */
  type: ElementType
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
  /** At的uid */
  uid: string
  /** At的uin */
  uin?: string
  /** At的名称 */
  name?: string
}

/** 表情元素 */
export interface FaceElement extends Element {
  type: 'face'
  /** 表情ID */
  id: number
  /** 是否大表情，默认不是 */
  is_big?: boolean
  /** 未知字段 */
  result?: number
}

/** 弹射表情元素 */
export interface BubbleFaceElement extends Element {
  type: 'bubble_face'
  /** 表情ID */
  id: number
  /** 表情数量 */
  count: number
}

/** 回复元素 */
export interface ReplyElement extends Element {
  type: 'reply'
  /** 回复的消息ID */
  message_id: string
}

/** 图片元素 */
export interface ImageElement extends Element {
  type: 'image'
  /** 图片url、路径或者base64 */
  file: string
  /** 图片名称 */
  name?: string
  /** 图片MD5 */
  md5?: string
  /** 图片子类型 */
  sub_type?: string
  /** 图片宽度 */
  width?: number
  /** 图片高度 */
  height?: number
  /**
   * - show: 展示图片
   * - flash: 闪照
   * - original: 原图
   */
  file_type: 'show' | 'flash' | 'original'
}

/** 语音元素 */
export interface RecordElement extends Element {
  type: 'record'
  /** 语音文件url、路径或者base64 */
  file: string
  /** 是否为魔法语音 */
  magic: boolean
  /** 语音md5 */
  md5?: string
  /** 语音名称 */
  name?: string
}

/** 视频元素 */
export interface VideoElement extends Element {
  type: 'video'
  /** 视频文件url、路径或者base64 */
  file: string
  /** 视频md5 */
  md5?: string
  /** 视频名称 */
  name?: string
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

/** 石头剪刀布元素 */
export interface RpsElement extends Element {
  type: 'rps'
  /** 石头剪刀布ID */
  id: number
}

/** 戳一戳元素 */
export interface PokeElement extends Element {
  type: 'poke'
  /** 戳一戳ID */
  id: number
  /** 戳一戳类型 */
  poke_type: number
  /** 戳一戳强度(1-5 默认1) */
  strength: number
}

/** 自定义音乐元素 */
export interface CustomMusicElemen {
  type: 'music'
  /** 音乐平台 */
  platform: 'QQ' | 'netease' | 'custom'
  /** 跳转链接 */
  url: string
  /** 音乐音频链接 */
  audio: string
  /** 标题 */
  title: string
  /** 歌手 */
  author: string
  /** 封面 */
  pic: string,
  id: string
}

export interface MusicElement extends Element {
  type: 'music'
  /** 音乐平台 */
  platform: 'QQ' | 'netease' | 'custom'
  /** 音乐ID */
  id: string
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
  type: 'market_face'
  id: string
}

/** 转发元素 */
export interface ForwardElement extends Element {
  type: 'forward'
  /** 资源ID */
  res_id: string
  /** 序列号(可能不对?) */
  uniseq: string
  /** 摘要 */
  summary: string
  /** 描述 */
  description: string
}

/** 分享名片 */
export interface ContactElement extends Element {
  type: 'contact'
  /** 分享类型 */
  scene: 'group' | 'friend'
  /** 被推荐人的QQ号或者被推荐群的群号 */
  peer: string
}

/** JSON元素 */
export interface JsonElement extends Element {
  type: 'json'
  /** JSON序列化过的字符串 */
  data: string
}

/** XML元素 */
export interface XmlElement extends Element {
  type: 'xml'
  /** XML字符串 */
  data: string
}

/** 文件元素 */
export interface FileElement extends Element {
  type: 'file'
  /** 文件URL、路径或者base64 */
  file: string
  /** 文件名称 */
  name?: string
  /** 文件大小 */
  size?: number
  /** 文件过期时间 */
  expire_time?: number
  /** 文件ID */
  id?: string
  /** 文件URL */
  url?: string
  /** 文件大小? */
  biz?: number
  /** 文件子ID */
  sub_id?: string
  /** 文件MD5 */
  md5?: string
}

/** 原生 Markdown 元素 */
export interface RawMarkdownElement extends Element {
  type: 'markdown'
  /** 原生markdown内容 */
  content: string
  config?: {
    /** 未知的参数 */
    unknown?: number
    time: number
    token: string
  }
}

/** 模板 Markdown 元素 */
export interface TplMarkdownElement extends Element {
  type: 'markdown_tpl'
  /** 模板ID */
  custom_template_id: string
  /** 模板参数 */
  params: Array<{
    /** 模板参数键名称 */
    key: string
    /** 模板参数值 */
    values: Array<string>
  }>
}

/** Markdown 元素 */
export interface MarkdownElement extends Element {
  type: 'markdown'
  /** Markdown内容 */
  content: string
}

/**
 * 单个按钮结构 这是karin的按钮结构 与qqbot的不同
 */
export interface Button {
  /** 按钮显示文本 */
  text: string
  /** 按钮类型 不建议使用 此为预留字段 */
  type?: number
  /**
   * - 是否为回调按钮
   * @default false
   */
  callback?: boolean
  /** 跳转按钮 */
  link?: string
  /** 操作相关的数据 */
  data?: string
  /** 按钮点击后显示的文字，不传为text */
  show?: string
  /**
   * 按钮样式
   * - 0-灰色线框
   * - 1-蓝色线框
   * - 2-特殊样式按钮
   * - 3-红色文字
   * - 4-白色填充
   */
  style?: number
  /** 点击按钮后直接自动发送 data */
  enter?: boolean
  /** 指令是否带引用回复本消息 */
  reply?: boolean
  /** 是否仅群管理员可操作 */
  admin?: boolean
  /** 有权限点击的用户UID列表 群聊、私聊 */
  list?: string[]
  /** 有权限点击的用户UID列表 频道 */
  role?: string[]
  /** 客户端不支持本 action 的时候，弹出的 toast 文案 */
  tips?: string
}

/** 按钮 构建单行多个按钮 */
export interface ButtonElement {
  type: 'button'
  data: Array<Button>
}

/** 按钮组 构建多行多个按钮 */
export interface KeyBoardElement extends Element {
  type: 'keyboard'
  rows: Array<Array<Button>>
}

/** 长消息元素 */
export interface LongMsgElement extends Element {
  type: 'long_msg'
  /** 消息ID */
  id: string
}

/** 回复被动消息 键入此字段代表此条消息为被动消息 */
export interface PasmsgElement extends Element {
  type: 'pasmsg'
  id: string
}

/**
 * 原生元素
 */
export interface RawElement extends Element {
  type: 'raw'
  data: any
}

export type KarinElement = TextElement | AtElement | FaceElement | BubbleFaceElement | ReplyElement | ImageElement | VideoElement | BasketballElement | DiceElement | RpsElement | PokeElement | MusicElement | WeatherElement | LocationElement | ShareElement | GiftElement | MarketFaceElement | ForwardElement | ContactElement | JsonElement | XmlElement | FileElement | ButtonElement | KeyBoardElement | RecordElement | LongMsgElement | TplMarkdownElement | RawMarkdownElement | RawElement | PasmsgElement

/** 构建自定义转发节点 此元素仅可通过专用接口发送 不支持混合发送 */
export interface NodeElement extends Element {
  type: 'node'
  id?: string,
  user_id?: string
  nickname?: string
  content?: KarinElement | Array<KarinElement>
}
