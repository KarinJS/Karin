import { config } from './config'
import crypto from 'node:crypto'
import { emitter } from '@karinjs/events'
import {
  AdapterBase,
  segment,
  createFriendMessage,
  createGroupMessage,
  createDirectMessage,
  createGuildMessage,
  createGroupTempMessage,
  contactFriend,
  contactGroup,
  contactDirect,
  contactGuild,
  contactGroupTemp,
  senderFriend,
  senderGroup,
  senderDirect,
  senderGuild,
  senderGroupTemp,
} from '@karinjs/adapter'
import {
  createTempFileUrl,
  generateSalt,
  createDefaultConfig,
  cleanTempFolder,
  MessageFormatter,
  CommandHandler,
} from './utils'

import type { } from '@karinjs/logger'
import type { } from '@karinjs/envs'
import type { Contact, Elements, AdapterType, SendMsgResults } from '@karinjs/adapter'

/**
 * 控制台交互适配器 - 单例模式
 * @class AdapterConsole
 */
export class AdapterConsole extends AdapterBase implements AdapterType {
  #id: string
  /** 文件名的盐 */
  #salt: string
  #commandHandler: CommandHandler
  #messageFormatter: MessageFormatter
  config: typeof config
  private static instance: AdapterConsole | null = null

  private constructor () {
    super()

    const avatar = 'https://p.qlogo.cn/gh/967068507/967068507/0'
    this.#id = 'console'
    this.#salt = ''
    this.#commandHandler = new CommandHandler()
    this.#messageFormatter = new MessageFormatter((data, ext) => this.getUrl(data, ext))

    this.adapter.name = '@karinjs/console'
    this.adapter.communication = 'other'
    this.adapter.platform = 'other'
    this.adapter.standard = 'other'
    this.adapter.version = process.env.KARIN_VERSION
    this.account.name = this.#id
    this.account.selfId = this.#id
    this.account.avatar = avatar

    this.config = config
  }

  /**
   * 初始化适配器
   */
  async init () {
    this.config.createConfig('config.json', createDefaultConfig())
    const cfg = this.cfg
    this.#salt = generateSalt(cfg.salt)
    cleanTempFolder(this.config.dir.temp)

    emitter
      .on('process:stdin:resume', () => process.stdin.on('data', data => this.createEvent(data)))
      .on('process:stdin:close', () => process.stdin.removeAllListeners('data'))
      .emit('process:stdin:resume')
  }

  /**
   * 获取单例实例
   */
  static getInstance (): AdapterConsole {
    if (!AdapterConsole.instance) {
      AdapterConsole.instance = new AdapterConsole()
    }
    return AdapterConsole.instance
  }

  get selfId () {
    return this.account.selfId
  }

  get cfg () {
    return this.config.getConfigSync('config.json', { ex: 0 })
  }

  async createEvent (data: Buffer) {
    const text = data.toString().trim()

    // 处理特殊命令
    if (this.#commandHandler.handleLogCommand(text)) return
    if (this.#commandHandler.handleProcessCommand(text)) return

    // 处理消息
    if (this.#commandHandler.isGroupCommand(text)) {
      this.#createGroupEvent(text, data)
    } else if (this.#commandHandler.isDirectCommand(text)) {
      this.#createDirectEvent(text, data)
    } else if (this.#commandHandler.isGuildCommand(text)) {
      this.#createGuildEvent(text, data)
    } else if (this.#commandHandler.isGroupTempCommand(text)) {
      this.#createGroupTempEvent(text, data)
    } else {
      this.#createFriendEvent(text, data)
    }
  }

  /**
   * 创建群消息事件
   */
  #createGroupEvent (text: string, rawData: Buffer) {
    const messageText = this.#commandHandler.removePrefix(text, 'group')
    const time = Date.now()
    const seq = Math.floor(Math.random() * 1000000000)
    const contact = contactGroup('10010')

    createGroupMessage({
      bot: this,
      contact,
      elements: [segment.text(messageText)],
      eventId: `${this.#id}${time}`,
      messageId: `${this.#id}${time}`,
      messageSeq: seq,
      rawEvent: { data: rawData },
      sender: senderGroup(this.#id, 'member'),
      time,
      srcReply: elements => this.sendMsg(contact, elements),
    })
  }

  /**
   * 创建好友消息事件
   */
  #createFriendEvent (text: string, rawData: Buffer) {
    const time = Date.now()
    const seq = Math.floor(Math.random() * 1000000000)
    const contact = contactFriend(this.#id)

    createFriendMessage({
      bot: this,
      contact,
      elements: [segment.text(text)],
      eventId: `${this.#id}.${time}`,
      messageId: `${this.#id}.${time}`,
      messageSeq: seq,
      rawEvent: { data: rawData },
      sender: senderFriend(this.#id, ''),
      time,
      srcReply: elements => this.sendMsg(contact, elements),
    })
  }

  /**
   * 创建频道私信消息事件
   */
  #createDirectEvent (text: string, rawData: Buffer) {
    const messageText = this.#commandHandler.removePrefix(text, 'direct')
    const time = Date.now()
    const seq = Math.floor(Math.random() * 1000000000)
    const contact = contactDirect('20001', '30001')

    createDirectMessage({
      bot: this,
      contact,
      elements: [segment.text(messageText)],
      eventId: `${this.#id}.${time}`,
      messageId: `${this.#id}.${time}`,
      messageSeq: seq,
      rawEvent: { data: rawData },
      sender: senderDirect(this.#id, ''),
      time,
      srcGuildId: '20001',
      srcReply: elements => this.sendMsg(contact, elements),
    })
  }

  /**
   * 创建频道消息事件
   */
  #createGuildEvent (text: string, rawData: Buffer) {
    const messageText = this.#commandHandler.removePrefix(text, 'guild')
    const time = Date.now()
    const seq = Math.floor(Math.random() * 1000000000)
    const contact = contactGuild('20001', '30001')

    createGuildMessage({
      bot: this,
      contact,
      elements: [segment.text(messageText)],
      eventId: `${this.#id}.${time}`,
      messageId: `${this.#id}.${time}`,
      messageSeq: seq,
      rawEvent: { data: rawData },
      sender: senderGuild(this.#id, 'member', '', 'unknown', 0),
      time,
      srcReply: elements => this.sendMsg(contact, elements),
    })
  }

  /**
   * 创建群临时消息事件
   */
  #createGroupTempEvent (text: string, rawData: Buffer) {
    const messageText = this.#commandHandler.removePrefix(text, 'groupTemp')
    const time = Date.now()
    const seq = Math.floor(Math.random() * 1000000000)
    const contact = contactGroupTemp('10010', this.#id)

    createGroupTempMessage({
      bot: this,
      contact,
      elements: [segment.text(messageText)],
      eventId: `${this.#id}.${time}`,
      messageId: `${this.#id}.${time}`,
      messageSeq: seq,
      rawEvent: { data: rawData },
      sender: senderGroupTemp(this.#id, ''),
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
    const messageId = crypto.randomUUID()

    // 格式化消息
    const msg = await this.#messageFormatter.format(elements)

    // 打印日志
    let prefix: string
    switch (contact.scene) {
      case 'group':
        prefix = logger.green('Send group message: ')
        break
      case 'direct':
        prefix = logger.green('Send direct message: ')
        break
      case 'guild':
        prefix = logger.green('Send guild message: ')
        break
      case 'groupTemp':
        prefix = logger.green('Send groupTemp message: ')
        break
      default:
        prefix = logger.green('Send private message: ')
    }
    logger.info(prefix + msg.join(''))

    return {
      message_id: messageId,
      messageId,
      time,
      messageTime: time,
      rawData: {},
    }
  }

  async getUrl (data: string | Buffer, ext: string) {
    return createTempFileUrl(
      this.cfg,
      this.config.dir.temp,
      data,
      this.#salt,
      ext
    )
  }

  async getAvatarUrl (userId: string, _?: 0 | 40 | 100 | 140) {
    if (userId === this.#id) {
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

  async setMsgReaction (contact: Contact, messageId: string, faceId: number, isSet: boolean) {
    logger.info(`[setMsgReaction] ${contact} ${messageId} ${faceId} ${isSet}`)
  }

  async uploadFile (contact: Contact, file: string, name: string, folder?: string) {
    logger.info(`[uploadFile] ${contact} ${file} ${name} ${folder}`)
  }
}
