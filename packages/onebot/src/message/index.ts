/**
 * OneBot消息段类型
 * - text: 纯文本
 * - face: QQ表情
 * - image: 图片
 * - record: 语音
 * - video: 视频
 * - at: `@某人`
 * - rps: 猜拳魔法表情
 * - dice: 掷骰子魔法表情
 * - shake: 窗口抖动（戳一戳）
 * - poke: 戳一戳
 * - anonymous: 匿名发消息
 * - share: 链接分享
 * - contact: 推荐好友/群
 * - location: 位置
 * - music: 音乐分享
 * - reply: 回复
 * - forward: 合并转发`(适用于forward_id)`
 * - node: 合并转发
 * - xml: XML消息段
 * - json: JSON消息段
 * - file: 文件消息段
 *
 * GoCQ拓展:
 * - redbag: 红包`(收)`
 * - gift: 礼物`(发 仅群聊)`
 *
 * 社区拓展:
 * - markdown: markdown消息段
 */
export enum OneBotMessageType {
  /** 纯文本 */
  Text = 'text',
  /** QQ表情 */
  Face = 'face',
  /** 图片 */
  Image = 'image',
  /** 语音 */
  Record = 'record',
  /** 视频 */
  Video = 'video',
  /** @某人 */
  At = 'at',
  /** 猜拳魔法表情 */
  Rps = 'rps',
  /** 掷骰子魔法表情 */
  Dice = 'dice',
  /** 窗口抖动（戳一戳） */
  Shake = 'shake',
  /** 戳一戳 */
  Poke = 'poke',
  /** 匿名发消息 */
  Anonymous = 'anonymous',
  /** 链接分享 */
  Share = 'share',
  /** 推荐好友/群 */
  Contact = 'contact',
  /** 位置 */
  Location = 'location',
  /** 音乐分享 */
  Music = 'music',
  /** 回复 */
  Reply = 'reply',
  /** 合并转发 */
  Forward = 'forward',
  /** 合并转发节点 */
  Node = 'node',
  /** XML消息段 */
  Xml = 'xml',
  /** JSON消息段 */
  Json = 'json',
  /** 文件消息段 */
  File = 'file',
  /** GoCQ拓展: 红包`(收)` */
  Redbag = 'redbag',
  /**
   * GoCQ拓展: 礼物`(发)`
   * - 范围: 仅群聊
   * - 参考: {@link https://docs.go-cqhttp.org/cqcode/#礼物}
   */
  Gift = 'gift',
  /** 社区拓展: markdown消息段 */
  Markdown = 'markdown',
}

export interface MessageBaseType {
  type: OneBotMessageType
}

/** 纯文本 */
export interface TextMessage extends MessageBaseType {
  type: OneBotMessageType.Text
  data: {
    text: string
  }
}

/** QQ表情 */
export interface FaceMessage extends MessageBaseType {
  type: OneBotMessageType.Face
  data: {
    id: string
  }
}

/** 图片消息段 */
export interface ImageMessage extends MessageBaseType {
  type: OneBotMessageType.Image
  data: {
    file: string
    /** 图片类型 `flash` 表示闪照, `show` 表示秀图 默认普通图片 */
    type?: 'flash' | 'show'
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
    /** 拓展: 图片摘要 */
    summary?: string
    /** 拓展: 图片宽度 */
    width?: number
    /** 拓展: 图片高度 */
    height?: number
    /** 拓展: 图片ID */
    fid?: string
    /** 拓展: md5 */
    md5?: string
    /** 拓展: 图片大小 */
    size?: number
  }
}

/** 语音消息段 */
export interface RecordMessage extends MessageBaseType {
  type: OneBotMessageType.Record
  data: {
    file: string
    magic?: 0 | 1
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/** 短视频消息段 */
export interface VideoMessage extends MessageBaseType {
  type: OneBotMessageType.Video
  data: {
    file: string
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/** @某人消息段 */
export interface AtMessage extends MessageBaseType {
  type: OneBotMessageType.At
  data: {
    qq: string | 'all',
    name?: string
  }
}

/** 猜拳魔法表情消息段 */
export interface RpsMessage extends MessageBaseType {
  type: OneBotMessageType.Rps
  data: {}
}

/** 掷骰子魔法表情消息段 */
export interface DiceMessage extends MessageBaseType {
  type: OneBotMessageType.Dice
  data: {}
}

/** 窗口抖动（戳一戳）消息段 */
export interface ShakeMessage extends MessageBaseType {
  type: OneBotMessageType.Shake
  data: {}
}

/** 戳一戳消息段 */
export interface PokeMessage extends MessageBaseType {
  type: OneBotMessageType.Poke
  data: {
    type: string
    id: string
    name?: string
  }
}

/** 匿名发消息消息段 */
export interface AnonymousMessage extends MessageBaseType {
  type: OneBotMessageType.Anonymous
  data: {
    ignore?: 0 | 1
  }
}

/** 链接分享消息段 */
export interface ShareMessage extends MessageBaseType {
  type: OneBotMessageType.Share
  data: {
    url: string
    title: string
    content?: string
    image?: string
  }
}

/** 推荐好友/群消息段 */
export interface ContactMessage extends MessageBaseType {
  type: OneBotMessageType.Contact
  data: {
    type: 'qq' | 'group'
    id: string
  }
}

/** 位置消息段 */
export interface LocationMessage extends MessageBaseType {
  type: OneBotMessageType.Location
  data: {
    lat: string
    lon: string
    title?: string
    content?: string
  }
}

/** 音乐分享消息段 */
export interface MusicMessage extends MessageBaseType {
  type: OneBotMessageType.Music
  data: {
    type: 'qq' | '163' | 'xm'
    id: string
  } | {
    type: 'custom',
    url: string,
    audio: string,
    title: string,
    content?: string,
    image?: string
  }
}

/** 回复消息段 */
export interface ReplyMessage extends MessageBaseType {
  type: OneBotMessageType.Reply
  data: {
    id: string
  }
}

/** 合并转发消息段 */
export interface ForwardMessage extends MessageBaseType {
  type: OneBotMessageType.Forward
  data: {
    id: string
  }
}

/** XML消息段 */
export interface XmlMessage extends MessageBaseType {
  type: OneBotMessageType.Xml
  data: {
    data: string
  }
}

/** JSON消息段 */
export interface JsonMessage extends MessageBaseType {
  type: OneBotMessageType.Json
  data: {
    data: string
  }
}

/** 合并转发节点: `发` */
export interface NodeIDMessage extends MessageBaseType {
  type: OneBotMessageType.Node
  data: {
    id: string
  }
}

/** 合并转发自定义节点 */
export interface NodeCustomMessage extends MessageBaseType {
  type: OneBotMessageType.Node
  data: {
    user_id: string,
    nickname: string,
    content: OneBotMessage[]
    /** napcat拓展: 消息列表的外显 */
    prompt?: string
    /** napcat拓展: 小卡片底下文本: 查看1条转发消息 */
    summary?: string
    /** napcat拓展: 小卡片标题 */
    source?: string
  }
}

/** 合并转发消息段 */
export type NodeMessage = NodeIDMessage | NodeCustomMessage

/** 文件消息段 `收` */
export interface FileMessage<T = any> extends MessageBaseType {
  type: OneBotMessageType.File
  data: T
}

/** OneBot11消息段 */
export type OneBotMessage =
  | TextMessage
  | FaceMessage
  | ImageMessage
  | RecordMessage
  | VideoMessage
  | AtMessage
  | RpsMessage
  | DiceMessage
  | ShakeMessage
  | PokeMessage
  | AnonymousMessage
  | ShareMessage
  | ContactMessage
  | LocationMessage
  | MusicMessage
  | ReplyMessage
  | ForwardMessage
  | XmlMessage
  | JsonMessage
  | FileMessage
  | NodeMessage
