/* eslint-disable no-unused-vars */
/**
 * - OneBot11消息类型枚举
 */
export const enum OB11SegmentType {
  Text = 'text',
  Face = 'face',
  Image = 'image',
  Record = 'record',
  Video = 'video',
  At = 'at',
  Rps = 'rps',
  Dice = 'dice',
  Shake = 'shake',
  Poke = 'poke',
  Anonymous = 'anonymous',
  Share = 'share',
  Contact = 'contact',
  Location = 'location',
  Music = 'music',
  MusicCustom = 'music_custom',
  Reply = 'reply',
  Forward = 'forward',
  Node = 'node',
  NodeCustom = 'node_custom',
  Xml = 'xml',
  Json = 'json',
  File = 'file'
}

export interface Segment {
  type: OB11SegmentType
}

/**
 * - 纯文本
 */
export interface TextSegment extends Segment {
  type: OB11SegmentType.Text
  data: {
    text: string
  }
}

/**
 * - QQ表情
 */
export interface FaceSegment extends Segment {
  type: OB11SegmentType.Face
  data: {
    id: string
  }
}

/**
 * - 图片消息段
 */
export interface ImageSegment extends Segment {
  type: OB11SegmentType.Image
  data: {
    file: string
    type?: 'flash'
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/**
 * - 语音消息段
 */
export interface RecordSegment extends Segment {
  type: OB11SegmentType.Record
  data: {
    file: string
    magic?: 0 | 1
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/**
 * - 短视频消息段
 */
export interface VideoSegment extends Segment {
  type: OB11SegmentType.Video
  data: {
    file: string
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/**
 * - @某人消息段
 */
export interface AtSegment extends Segment {
  type: OB11SegmentType.At
  data: {
    qq: string | 'all'
  }
}

/**
 * - 猜拳魔法表情消息段
 */
export interface RpsSegment extends Segment {
  type: OB11SegmentType.Rps
  data: {}
}

/**
 * - 掷骰子魔法表情消息段
 */
export interface DiceSegment extends Segment {
  type: OB11SegmentType.Dice
  data: {}
}

/**
 * - 窗口抖动（戳一戳）消息段
 */
export interface ShakeSegment extends Segment {
  type: OB11SegmentType.Shake
  data: {}
}

/**
 * - 戳一戳消息段
 */
export interface PokeSegment extends Segment {
  type: OB11SegmentType.Poke
  data: {
    type: string
    id: string
    name?: string
  }
}

/**
 * - 匿名发消息消息段
 */
export interface AnonymousSegment extends Segment {
  type: OB11SegmentType.Anonymous
  data: {
    ignore?: 0 | 1
  }
}

/**
 * - 链接分享消息段
 */
export interface ShareSegment extends Segment {
  type: OB11SegmentType.Share
  data: {
    url: string
    title: string
    content?: string
    image?: string
  }
}

/**
 * - 推荐好友/群消息段
 */
export interface ContactSegment extends Segment {
  type: OB11SegmentType.Contact
  data: {
    type: 'qq' | 'group'
    id: string
  }
}

/**
 * - 位置消息段
 */
export interface LocationSegment extends Segment {
  type: OB11SegmentType.Location
  data: {
    lat: string
    lon: string
    title?: string
    content?: string
  }
}

/**
 * - 音乐分享消息段
 */
export interface MusicSegment extends Segment {
  type: OB11SegmentType.Music
  data: {
    type: 'qq' | '163' | 'xm'
    id: string
  }
}

/**
 * - 音乐自定义分享消息段
 */
export interface CustomMusicSegment extends Segment {
  type: OB11SegmentType.MusicCustom
  data: {
    type: 'custom'
    url: string
    audio: string
    title: string
    content?: string
    image?: string
  }
}

/**
 * - 回复消息段
 */
export interface ReplySegment extends Segment {
  type: OB11SegmentType.Reply
  data: {
    id: string
  }
}

export interface FileSegment extends Segment {
  type: OB11SegmentType.File
  data: {
    file: string
  }
}

/**
 * - 合并转发消息段
 */
export interface ForwardSegment extends Segment {
  type: OB11SegmentType.Forward
  data: {
    id: string
  }
}

/**
 * - 合并转发节点消息段
 */
export interface NodeSegment extends Segment {
  type: OB11SegmentType.Node
  data: {
    id: string
  }
}

/**
 * - XML消息段
 */
export interface XmlSegment extends Segment {
  type: OB11SegmentType.Xml
  data: {
    data: string
  }
}

/**
 * - JSON消息段
 */
export interface JsonSegment extends Segment {
  type: OB11SegmentType.Json
  data: {
    data: string
  }
}

/**
 * - OneBot11消息段
 */
export type OB11SegmentBase = TextSegment | FaceSegment | ImageSegment | RecordSegment | VideoSegment | AtSegment | RpsSegment | DiceSegment | ShakeSegment | PokeSegment | AnonymousSegment | ShareSegment | ContactSegment | LocationSegment | MusicSegment | CustomMusicSegment | ReplySegment | ForwardSegment | NodeSegment | XmlSegment | JsonSegment

/**
 * - 合并转发自定义节点消息段
 */
export interface CustomNodeSegment extends Segment {
  type: OB11SegmentType.NodeCustom
  data: {
    user_id: string
    nickname: string
    content: OB11SegmentBase[]
  }
}

/**
 * - OneBot11消息段
 */
export type OB11Segment = OB11SegmentBase | CustomNodeSegment
