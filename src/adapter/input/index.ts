// import fs from 'node:fs'
import { AdapterBase } from '../base'
import { createFriendMessage, createGroupMessage } from '@/event'
import { karin } from '@/karin'
import { listeners } from '@/internal/listeners'
import { randomUUID } from 'crypto'
import { type ElementTypes, segment } from '@/adapter/segment'
import type { AdapterType, SendMsgResults } from '@/adapter/adapter'
import type { Contact } from '@/adapter/contact'

// const { enable, msgToFile, token: oldToken, ip } = config.Config.AdapterInput

/**
 * 控制台交互适配器
 * @class AdapterInput
 */
export class AdapterInput extends AdapterBase implements AdapterType {
  constructor () {
    super()
    listeners.on('karin:adapter:open', () => process.stdin.on('data', data => this.createEvent(data)))
    listeners.on('karin:adapter:close', () => process.stdin.removeAllListeners('data'))

    this.adapter.name = '@karinjs/input'
    this.adapter.communication = 'internal'
    this.adapter.platform = 'shell'
    this.adapter.version = '1.0.0'
    this.adapter.standard = 'karin'
    this.account.name = 'input'
    this.account.uid = 'input'
    this.account.uin = 'input'
    this.account.selfId = 'input'
    this.account.avatar = 'https://p.qlogo.cn/gh/967068507/967068507/0'
    listeners.emit('karin:adapter:open')
  }

  get selfId () {
    return this.account.selfId
  }

  createEvent (data: Buffer) {
    const text = data.toString().trim()
    const seq = Math.floor(Math.random() * 1000000000)
    const time = Date.now()
    /** 如果带`group`前缀 则视为群环境 */
    if (text.startsWith('group')) {
      const contact = karin.contactGroup('10010')
      createGroupMessage({
        bot: this,
        contact,
        elements: [segment.text(text.replace(/^group/, '').trim())],
        eventId: `input.${time}`,
        messageId: `input.${time}`,
        messageSeq: seq,
        rawEvent: { data },
        selfId: 'input',
        sender: karin.groupSender('input', '神秘的群成员'),
        time,
        srcReply: (elements) => this.sendMsg(contact, elements),
        userId: 'input',
      })
      return
    }

    const contact = karin.contactFriend('input')
    createFriendMessage({
      bot: this,
      contact,
      elements: [segment.text(text.replace(/^group/, '').trim())],
      eventId: `input.${time}`,
      messageId: `input.${time}`,
      messageSeq: seq,
      rawEvent: { data },
      selfId: 'input',
      sender: karin.friendSender('input', '未知的好友'),
      time,
      srcReply: (elements) => this.sendMsg(contact, elements),
      userId: 'input',
    })
  }

  async sendMsg (contact: Contact, elements: Array<ElementTypes>, retryCount?: number): Promise<SendMsgResults> {
    const messageId = randomUUID()
    const result: SendMsgResults = {
      message_id: messageId,
      messageId,
      messageTime: Date.now(),
      rawData: {},
    }

    if (contact.scene === 'group') {
      logger.info(`Send group message: ${JSON.stringify(elements)}`)
    } else {
      logger.info(`Send private message: ${JSON.stringify(elements)}`)
    }

    return result
  }
}
