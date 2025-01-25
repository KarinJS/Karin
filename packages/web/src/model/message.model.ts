import store from '@/store'
import type { SandboxEvent } from '@/types/sandbox'
import type { Elements } from '@/types/segment'

export class MessageItem {
  private readonly raw_message: Elements

  constructor (data: Elements) {
    this.raw_message = data
  }

  get structured () {
    return this.raw_message
  }

  toString () {
    if (this.structured.type === 'text') {
      return this.structured.text
    }
    if (this.structured.type === 'face') {
      return `[表情${this.structured.id}]`
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
      return `@${this.structured.targetId}`
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
    if (this.structured.type === 'pasmsg') {
      return '[被动消息]'
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
    return '[未知消息]'
  }
}

/** 发送消息类 */
export class Message {
  private readonly raw_message: SandboxEvent

  public self: boolean

  constructor (data: SandboxEvent) {
    this.raw_message = data
    this.self = data.sender.id === store.getState().user.userId
  }

  get id () {
    return this.raw_message.messageId
  }

  get structured () {
    return this.raw_message
  }

  get sender_id () {
    return this.raw_message.sender.id
  }

  get receiver_id () {
    return this.raw_message.selfId
  }

  get time () {
    return new Date(this.raw_message.time)
  }

  get message () {
    return this.raw_message.elements.map(item => new MessageItem(item)).join('\n')
  }
}
