import fs from 'node:fs'
import path from 'node:path'
import { AdapterBase } from '../base'
import { listeners } from '@/core/internal/listeners'
import { buffer } from '@/utils/fs/data'
import { consolePath } from '@/root'
import { registerBot } from '@/service'
import { segment } from '@/utils/message'
import { adapter as adapterConfig } from '@/utils/config'
import { createFriendMessage, createGroupMessage } from '@/event/create'
import { contactFriend, contactGroup, senderFriend, senderGroup } from '@/event'

import type { Contact, Elements, LogMethodNames, AdapterType, SendMsgResults } from '@/types'

let index = 0
const botID = 'console'

/**
 * 控制台交互适配器
 * @class AdapterConsole
 */
class AdapterConsole extends AdapterBase implements AdapterType {
  constructor () {
    super()
    listeners.on('karin:adapter:open', () =>
      process.stdin.on('data', data => this.createEvent(data))
    )
    listeners.on('karin:adapter:close', () => process.stdin.removeAllListeners('data'))

    this.adapter.name = '@karinjs/console'
    this.adapter.communication = 'other'
    this.adapter.platform = 'other'
    this.adapter.standard = 'other'
    this.adapter.version = process.env.KARIN_VERSION
    this.account.name = botID
    this.account.uid = botID
    this.account.uin = botID
    this.account.selfId = botID
    this.account.avatar = 'https://p.qlogo.cn/gh/967068507/967068507/0'
    listeners.emit('karin:adapter:open')
  }

  get selfId () {
    return this.account.selfId
  }

  async createEvent (data: Buffer) {
    const text = data.toString().trim()
    const seq = Math.floor(Math.random() * 1000000000)
    const time = Date.now()

    /** 如果是日志等级更新命令 */
    if (text.startsWith('log')) {
      const level = text.replace(/^log/, '').trim() as LogMethodNames
      if (level) {
        const list = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
        if (list.includes(level)) {
          const { updateLevel } = await import('@/utils/config/admin')
          updateLevel(level)
          logger.info(`日志等级已更新为: ${level}`)
          return
        }
      }
    }

    if (text === 'rs' || text === 'restart') {
      process.send!(JSON.stringify({ type: 'restart' }))
      return
    }

    if (text === 'stop') {
      process.send!(JSON.stringify({ type: 'stop' }))
      return
    }

    /** 如果带`group`前缀 则视为群环境 */
    if (text.startsWith('group')) {
      const contact = contactGroup('10010')
      createGroupMessage({
        bot: this,
        contact,
        elements: [segment.text(text.replace(/^group/, '').trim())],
        eventId: `${botID}${time}`,
        messageId: `${botID}${time}`,
        messageSeq: seq,
        rawEvent: { data },
        sender: senderGroup(botID, 'member'),
        time,
        srcReply: elements => this.sendMsg(contact, elements),
      })
      return
    }

    const contact = contactFriend(botID)
    createFriendMessage({
      bot: this,
      contact,
      elements: [segment.text(text.replace(/^group/, '').trim())],
      eventId: `${botID}.${time}`,
      messageId: `${botID}.${time}`,
      messageSeq: seq,
      rawEvent: { data },
      sender: senderFriend(botID, ''),
      time,
      srcReply: elements => this.sendMsg(contact, elements),
    })
  }

  async sendMsg (
    contact: Contact,
    elements: Array<Elements>,
    _?: number
  ): Promise<SendMsgResults> {
    const time = Date.now()
    const messageId = (++index).toString()
    const result: SendMsgResults = {
      message_id: messageId,
      messageId,
      time,
      messageTime: time,
      rawData: {},
    }

    const msg: string[] = []

    for (const v of elements) {
      if (v.type === 'at') {
        msg.push(`[at:${v.targetId}]`)
        continue
      }

      if (v.type === 'text') {
        msg.push(v.text)
        continue
      }

      if (v.type === 'image' || v.type === 'record' || v.type === 'video') {
        let ext = '.png'
        if (v.type === 'video') ext = '.mp4'
        if (v.type === 'record') ext = '.mp3'
        const url = v.file.startsWith('http') ? v.file : await this.getUrl(v.file, ext)
        msg.push(`[${v.type}: ${logger.blue(url)} ]`)
        continue
      }

      msg.push(JSON.stringify(v))
    }

    if (contact.scene === 'group') {
      msg.unshift(logger.green('Send group message: '))
      logger.info(msg.join(''))
    } else {
      msg.unshift(logger.green('Send private message: '))
      logger.info(msg.join(''))
    }

    return result
  }

  async getUrl (data: string | Buffer, ext: string) {
    const cfg = adapterConfig()
    const name = (++index).toString()
    const file = path.join(consolePath, `${name}${ext}`)
    await fs.promises.writeFile(file, await buffer(data))

    if (cfg.console.isLocal) {
      return `http://127.0.0.1:${process.env.HTTP_PORT}/api/v1/console/${name}${ext}`
    }

    if (cfg.console.host) {
      return `${cfg.console.host}/api/v1/console/${name}${ext}?token=${cfg.console.token}`
    }

    return `http://127.0.0.1:${process.env.HTTP_PORT}/api/v1/console/${name}${ext}?token=${cfg.console.token}`
  }

  async getAvatarUrl (userId: string, _?: 0 | 40 | 100 | 140) {
    if (userId === botID) {
      return process.env.ADAPTER_CONSOLE_AVATAR || 'https://p.qlogo.cn/gh/967068507/967068507/0'
    }
    return ''
  }

  async getGroupAvatarUrl (_: string, __?: 0 | 40 | 100 | 140, ___?: number) {
    return 'https://p.qlogo.cn/gh/967068507/967068507/0'
  }

  async recallMsg (_: Contact, messageId: string) {
    logger.info(`[recallMsg] ${messageId}`)
  }

  async sendLike (targetId: string, count: number) {
    logger.info(`[sendLike] ${targetId} ${count}`)
  }

  async groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string) {
    logger.info(`[groupKickMember] ${groupId} ${targetId} ${rejectAddRequest} ${kickReason}`)
  }

  async setGroupMute (groupId: string, targetId: string, duration: number) {
    logger.info(`[setGroupMute] ${groupId} ${targetId} ${duration}`)
  }

  async setGroupAllMute (groupId: string, isBan: boolean) {
    logger.info(`[setGroupAllMute] ${groupId} ${isBan}`)
  }

  async setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean) {
    logger.info(`[setGroupAdmin] ${groupId} ${targetId} ${isAdmin}`)
  }

  async setGroupMemberCard (groupId: string, targetId: string, card: string) {
    logger.info(`[setGroupMemberCard] ${groupId} ${targetId} ${card}`)
  }

  async setGroupName (groupId: string, groupName: string) {
    logger.info(`[setGroupName] ${groupId} ${groupName}`)
  }

  async setGroupQuit (groupId: string, isDismiss: boolean) {
    logger.info(`[setGroupQuit] ${groupId} ${isDismiss}`)
  }

  async setGroupMemberTitle (groupId: string, targetId: string, title: string) {
    logger.info(`[setGroupMemberTitle] ${groupId} ${targetId} ${title}`)
  }

  async getFriendList (refresh?: boolean) {
    logger.info(`[getFriendList] ${refresh}`)
    return []
  }

  async getGroupList (refresh?: boolean) {
    logger.info(`[getGroupList] ${refresh}`)
    return []
  }

  async getGroupMemberList (groupId: string, refresh?: boolean) {
    logger.info(`[getGroupMemberList] ${groupId} ${refresh}`)
    return []
  }

  async getGroupHonor (groupId: string) {
    logger.info(`[getGroupHonor] ${groupId}`)
    return []
  }

  async setFriendApplyResult (requestId: string, isApprove: boolean, remark?: string) {
    logger.info(`[setFriendApplyResult] ${requestId} ${isApprove} ${remark}`)
  }

  async setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string) {
    logger.info(`[setGroupApplyResult] ${requestId} ${isApprove} ${denyReason}`)
  }

  async setInvitedJoinGroupResult (requestId: string, isApprove: boolean) {
    logger.info(`[setInvitedJoinGroupResult] ${requestId} ${isApprove}`)
  }

  async setMsgReaction (contact: Contact, messageId: string, faceId: number | string, isSet: boolean) {
    logger.info(`[setMsgReaction] ${contact} ${messageId} ${faceId} ${isSet}`)
  }

  async uploadFile (contact: Contact, file: string, name: string, folder?: string) {
    logger.info(`[uploadFile] ${contact} ${file} ${name} ${folder}`)
  }
}

const adapter = new AdapterConsole()
registerBot('other', adapter)
