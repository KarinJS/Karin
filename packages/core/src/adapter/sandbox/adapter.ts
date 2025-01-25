import fs from 'node:fs'
import path from 'node:path'
import { AdapterBase } from '../base'
import { sandboxDataPath } from '@/root'
import { senderGroup } from '@/event/sender'

import type WebSocket from 'ws'
import type { Level } from 'level'
import type { Contact, GroupSender } from '@/types/event'
import type { Elements } from '@/types/segment'
import type { IncomingMessage } from 'node:http'
import type { SandboxSendApi } from '@/types/sandbox/sendApi'
import type { prefix as Prefix } from '@/server/api/sandbox/index'
import type { SandboxMsgRecord } from '@/types/sandbox/db'
import type { AdapterType, SendMsgResults } from '@/types/adapter'
import { createMsgSeq } from './create'

/**
 * web沙盒适配器
 * @class AdapterSandbox
 */
export class AdapterSandbox extends AdapterBase implements AdapterType {
  /** 前缀 */
  prefix: typeof Prefix

  /** 默认用户头像 */
  readonly DEFAULT_USER_AVATAR = 'https://q1.qlogo.cn/g?b=qq&nk=1812868335&s=0'
  /** 默认群头像 */
  readonly DEFAULT_GROUP_AVATAR = 'https://p.qlogo.cn/gh/967068507/967068507/0'
  /** 连接 */
  socket: WebSocket
  /** 请求 */
  request: IncomingMessage
  /** level */
  level: Level

  constructor (
    socket: WebSocket,
    request: IncomingMessage,
    level: Level,
    prefix: typeof Prefix,
  ) {
    super()
    this.socket = socket
    this.request = request
    this.level = level
    this.prefix = prefix

    this.adapter.name = '@karinjs/sandbox'
    this.adapter.communication = 'webSocketServer'
    this.adapter.platform = 'qq'
    this.adapter.standard = 'other'
    this.adapter.version = process.env.KARIN_VERSION
  }

  /**
   * 创建消息记录
   * @param options 消息选项
   * @returns 返回消息
   */
  async createMsgRecord (
    type: 'friend' | 'group',
    seq: number,
    targetId: string,
    elements: Elements[],
    messageId: string,
    time: number,
  ) {
    const key = type === 'friend' ? this.prefix.friendMsg : this.prefix.groupMsg
    await this.level.put(`${key}${messageId}`, JSON.stringify({
      type,
      seq,
      targetId,
      elements,
      messageId,
      time,
      status: 'normal',
    }))
  }

  /**
   * 获取指定消息记录
   * @param messageId 消息id
   * @returns 返回消息记录
   */
  async getMsgRecord (messageId: string): Promise<SandboxMsgRecord> {
    const data = await this.level.get(messageId)
    return typeof data === 'string' ? JSON.parse(data) : data
  }

  /**
   * 修改消息状态
   * @param messageId 消息id
   * @param status 状态
   */
  async updateMsgStatus (messageId: string, status: 'normal' | 'recall') {
    const data = await this.getMsgRecord(messageId)
    data.status = status
    const key = data.type === 'friend' ? this.prefix.friendMsg : this.prefix.groupMsg
    await this.level.put(`${key}${messageId}`, JSON.stringify(data))
  }

  /**
   * 获取指定用户的名称、头像
   * @param userId 用户ID
   * @returns 返回用户信息
   */
  async getUserInfo (userId: string) {
    const name = await this.level.get(`${this.prefix.friend}${userId}`)
    if (!name) {
      throw new Error('用户不存在')
    }

    const avatar = await this.getAvatarUrl(userId)
    return {
      userId,
      name,
      avatar,
    }
  }

  get selfId () {
    return this.account.selfId
  }

  async getAvatarUrl (userId: string) {
    const file = `${this.prefix.friendAvatar}${userId}${this.prefix.avatarExt}`
    if (fs.existsSync(path.join(sandboxDataPath, file))) {
      return `/sandbox/data/${file}`
    }

    return this.DEFAULT_USER_AVATAR
  }

  async getGroupAvatarUrl (groupId: string) {
    const file = `${this.prefix.groupAvatar}${groupId}${this.prefix.avatarExt}`
    if (fs.existsSync(path.join(sandboxDataPath, file))) {
      return `/sandbox/data/${file}`
    }

    return this.DEFAULT_GROUP_AVATAR
  }

  async sendMsg (
    contact: Contact,
    elements: Array<Elements>,
  ): Promise<SendMsgResults> {
    if (contact.scene !== 'friend' && contact.scene !== 'group') {
      throw new TypeError('web沙盒目前仅支持好友和群聊')
    }

    const { seq, messageId, time } = await createMsgSeq(this, contact.scene, contact.peer)

    let options: SandboxSendApi['sendMsg']
    if (contact.scene === 'group') {
      options = {
        seq,
        selfId: this.selfId,
        type: 'group',
        groupId: contact.peer,
        groupName: contact.name,
        elements,
        messageId,
        time,
        sender: {
          id: this.selfId,
          name: this.account.name,
          role: 'owner',
        },
      }
    } else {
      options = {
        seq,
        selfId: this.selfId,
        type: 'friend',
        elements,
        messageId,
        time,
        sender: {
          id: this.selfId,
          name: this.account.name,
        },
      }
    }

    await this._pushWeb('sendMsg', options)
    await this.createMsgRecord(
      options.type,
      options.seq,
      options.type === 'friend' ? options.sender.id : options.groupId,
      options.elements,
      options.messageId,
      options.time
    )

    return {
      time,
      messageId,
      message_id: messageId,
      messageTime: time,
      rawData: { seq, messageId, time },
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
    const list = []

    /** 获取包含`sandbox:nickname:`前缀的key */
    const keys = this.level.keys()
    for await (const key of keys) {
      if (key.startsWith(this.prefix.friend)) {
        const userId = key.replace(this.prefix.friend, '')
        const nick = await this.level.get(key)
        const avatar = await this.getAvatarUrl(userId)
        list.push({
          userId,
          nick,
          avatar,
        })
      }
    }

    return list
  }

  async getGroupList () {
    const list = []

    const keys = this.level.keys()
    for await (const key of keys) {
      if (key.startsWith(this.prefix.group)) {
        const groupId = key.replace(this.prefix.group, '')
        const name = await this.level.get(key)
        const avatar = await this.getGroupAvatarUrl(groupId)
        list.push({
          groupId,
          name,
          avatar,
        })
      }
    }

    return list
  }

  async getGroupMemberList (id: string) {
    const list = []

    const keys = this.level.keys()
    for await (const key of keys) {
      if (key.startsWith(this.prefix.groupMember)) {
        const [, groupId, userId] = key.split(':')
        if (groupId === id) {
          const { name, role } = JSON.parse(await this.level.get(key))
          const avatar = await this.getAvatarUrl(userId)
          list.push({
            userId,
            name,
            avatar,
            role,
            get sender (): GroupSender {
              return senderGroup(userId, role, name)
            },
          })
        }
      }
    }

    return list
  }
}
