import store from '@/store'
import { OB11Message } from '@/types/onebot'

export class MessageItem {
  private readonly raw_message: OB11Message['message'][number]

  constructor(data: OB11Message['message'][number]) {
    this.raw_message = data
  }

  get structured() {
    return this.raw_message
  }

  toString() {
    if (this.structured.type === 'text') {
      return this.structured.data.text
    }
    if (this.structured.type === 'face') {
      return `[表情${this.structured.data.id}]`
    }
    if (this.structured.type === 'image') {
      return '[图片]'
    }
    if (this.structured.type === 'record') {
      return '[语音]'
    }
    if (this.structured.type === 'video') {
      return '[视频]'
    }
    if (this.structured.type === 'at') {
      return `@${this.structured.data.qq}`
    }
    if (this.structured.type === 'rps') {
      return '[猜拳]'
    }
    if (this.structured.type === 'dice') {
      return '[掷骰子]'
    }
    if (this.structured.type === 'xml') {
      return '[xml消息]'
    }
    if (this.structured.type === 'json') {
      return '[卡片消息]'
    }
    if (this.structured.type === 'reply') {
      return '[回复消息]'
    }
    if (this.structured.type === 'node') {
      return '[节点消息]'
    }
    if (this.structured.type === 'forward') {
      return '[转发消息]'
    }
    if (this.structured.type === 'contact') {
      return '[名片分享]'
    }
    if (this.structured.type === 'location') {
      return '[位置分享]'
    }
    if (this.structured.type === 'music') {
      return '[音乐分享]'
    }
    if (this.structured.type === 'share') {
      return '[分享链接]'
    }
    if (this.structured.type === 'anonymous') {
      return '[匿名消息]'
    }
    if (this.structured.type === 'poke') {
      return '[戳一戳消息]'
    }
    if (this.structured.type === 'shake') {
      return '[抖动窗口消息]'
    }
    return '[未知消息]'
  }
}

export class Message {
  private readonly raw_message: OB11Message

  public self: boolean

  constructor(data: OB11Message) {
    this.raw_message = data
    this.self = data.sender.user_id === store.getState().user.user_id
  }

  get id() {
    return this.raw_message.message_id
  }

  get structured() {
    return this.raw_message
  }

  get sender_id() {
    return this.raw_message.sender.user_id
  }

  get receiver_id() {
    return this.raw_message.self_id
  }

  get time() {
    return new Date(this.raw_message.time)
  }

  get message() {
    return this.raw_message.message.map(item => new MessageItem(item)).join('\n')
  }
}
