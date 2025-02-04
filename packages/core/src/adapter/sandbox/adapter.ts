import { AdapterBase } from '../base'
import { senderGroup } from '@/event/sender'
import { getAvatarUrl } from '@/service/sandbox/avatar'
import {
  addFriendHistory,
  addGroupHistory,
  buildMessageId,
  getFriend,
  getFriendList,
  getGroupList,
  getGroupMemberList
} from '@/service/sandbox/db'

import type WebSocket from 'ws'
import type { Elements } from '@/types/segment'
import type { IncomingMessage } from 'node:http'
import type { Contact, GroupSender } from '@/types/event'
import type { AdapterType, SendMsgResults } from '@/types/adapter'
import type {
  SandboxSendApi,
  SandboxSendSendFriendMsg,
  SandboxSendSendGroupMsg,
  SandboxSendSendMsg
} from '@/types/sandbox/sendApi'

/**
 * web沙盒适配器
 * @class AdapterSandbox
 */
export class AdapterSandbox extends AdapterBase implements AdapterType {
  /** 连接 */
  socket: WebSocket
  /** 请求 */
  request: IncomingMessage

  constructor (
    socket: WebSocket,

    request: IncomingMessage,
  ) {
    super()
    this.socket = socket
    this.request = request

    this.adapter.name = '@karinjs/sandbox'
    this.adapter.communication = 'webSocketServer'
    this.adapter.platform = 'other'
    this.adapter.standard = 'other'
    this.adapter.version = process.env.KARIN_VERSION
  }

  /**
   * 获取指定用户的名称、头像
   * @param userId 用户ID
   * @returns 返回用户信息
   */
  async getUserInfo (userId: string) {
    const info = await getFriend(userId)
    if (!info) {
      throw new Error('用户不存在')
    }

    const avatar = await this.getAvatarUrl(userId)
    return {
      ...info,
      avatar,
    }
  }

  get selfId () {
    return this.account.selfId
  }

  async getAvatarUrl (userId: string) {
    return getAvatarUrl('friend', userId)
  }

  async getGroupAvatarUrl (groupId: string) {
    return getAvatarUrl('group', groupId)
  }

  isFriendMsg (data: Record<string, any>): data is SandboxSendSendFriendMsg {
    return data?.contact?.scene === 'friend'
  }

  isGroupMsg (data: Record<string, any>): data is SandboxSendSendGroupMsg {
    return data?.contact?.scene === 'group'
  }

  async sendMsg (
    contact: Contact,
    elements: Array<Elements>,
  ): Promise<SendMsgResults> {
    if (contact.scene !== 'friend' && contact.scene !== 'group') {
      throw new TypeError('web沙盒目前仅支持好友和群聊')
    }

    const seq = Date.now()
    const messageId = buildMessageId('bot_send', this.selfId, contact.peer)

    let options: SandboxSendSendMsg

    if (contact.scene === 'group') {
      options = {
        contact,
        eventId: `message:${messageId}`,
        rawEvent: elements,
        messageSeq: seq,
        selfId: this.selfId,
        elements,
        messageId,
        time: seq,
        sender: {
          userId: this.selfId,
          name: this.account.name,
          nick: this.account.name,
          role: 'member',
        },
      }
    } else {
      options = {
        contact,
        eventId: `message:${messageId}`,
        rawEvent: elements,
        messageSeq: seq,
        selfId: this.selfId,
        elements,
        messageId,
        time: seq,
        sender: {
          userId: this.selfId,
          name: this.account.name,
          nick: this.account.name,
        },
      }
    }

    await this._pushWeb('sendMsg', options)

    if (this.isFriendMsg(options)) {
      addFriendHistory(options)
    } else if (this.isGroupMsg(options)) {
      addGroupHistory(options)
    }

    return {
      time: options.time,
      messageId,
      message_id: messageId,
      messageTime: options.time,
      rawData: options,
    }
  }

  /**
   * 推送事件给web
   * @param action 请求类型
   * @param param 请求参数
   */
  async _pushWeb<T extends keyof SandboxSendApi> (action: T, param: SandboxSendApi[T]) {
    const data = JSON.stringify({
      action,
      param,
    })
    this.socket.send(data)
  }

  async getFriendList () {
    return getFriendList()
  }

  async getGroupList () {
    return getGroupList()
  }

  async getGroupMemberList (id: string) {
    const list = await getGroupMemberList(id)

    return list.map(item => ({
      ...item,
      get sender (): GroupSender {
        return senderGroup(item.userId, item.role, item.nick)
      },
    }))
  }
}
