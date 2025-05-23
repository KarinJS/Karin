import util from 'node:util'
import { lockProp } from '@/utils/system/lock'
import { segment, makeMessage, createRawMessage } from '@/utils/message'

import type { AdapterType, SendMsgResults } from '@/types/adapter'
import type {
  BaseEventOptions,
  Contact,
  EventParent,
  EventToSubEvent,
  Permission,
  Reply,
  Sender,
  SrcReply,
} from '@/types/event'

/** 事件实现基类 */
export abstract class BaseEvent<T extends EventParent> {
  #selfId: string
  #event: T
  #subEvent: EventToSubEvent[T]
  #eventId: string
  #rawEvent: unknown
  #time: number
  #contact: Contact
  #sender: Sender
  #srcReply: SrcReply
  #bot: AdapterType

  /** 快速回复 */
  public reply: Reply
  /** 存储器 由开发者自行调用 */
  public store: Map<any, any>
  /** 日志函数字符串 */
  public logFnc: string
  /** 日志用户字符串 */
  public logText: string
  /** 是否为主人 */
  public isMaster: boolean
  /** 是否为Bot管理员 */
  public isAdmin: boolean

  constructor ({
    event,
    subEvent,
    eventId,
    rawEvent,
    time,
    contact,
    sender,
    srcReply,
    bot,
  }: BaseEventOptions<T>) {
    this.#selfId = bot.selfId
    this.#event = event
    this.#subEvent = subEvent
    this.#eventId = eventId
    this.#rawEvent = rawEvent
    this.#time = time
    this.#contact = contact
    this.#sender = sender
    this.#srcReply = srcReply
    this.#bot = bot

    this.store = new Map()
    this.logFnc = ''
    this.logText = ''
    this.isMaster = false
    this.isAdmin = false

    this.reply = async (elements, options) => {
      try {
        /** 参数归一化 */
        const message = makeMessage(elements)

        const at = options?.at ?? false
        const reply = options?.reply ?? false
        const recallMsg = options?.recallMsg ?? 0

        /** 加入at */
        if (at && !this.isPrivate) {
          message.unshift(segment.at(this.userId))
        }

        /** 加入引用回复 */
        if (reply && 'message_id' in this) {
          message.unshift(segment.reply(this.message_id as string))
        }

        let result: SendMsgResults = {
          messageId: '',
          time: 0,
          messageTime: 0,
          rawData: {},
          /** @deprecated 已废弃，请使用 messageId */
          message_id: '',
        }

        /** 先发 提升速度 */
        const request = this.#srcReply(message)
        const { raw } = createRawMessage(message)
        if (this.isGroup) {
          this.selfId !== 'console' && logger.bot('info', this.selfId, `${logger.green(`Send Group ${this.contact.peer}: `)}${raw.replace(/\n/g, '\\n')}`)
        } else {
          this.selfId !== 'console' && logger.bot('info', this.selfId, `${logger.green(`Send private ${this.contact.peer}: `)}${raw.replace(/\n/g, '\\n')}`)
        }

        /** 发送消息 */
        result = util.types.isPromise(request) ? await request : request
        result.message_id = result.messageId

        /** 快速撤回 */
        if (recallMsg > 0 && result.messageId) {
          setTimeout(() => {
            this.bot.recallMsg(this.contact, result.messageId)
          }, recallMsg * 1000)
        }

        return result
      } catch (error) {
        const retryCount = options?.retryCount ?? 0
        /** 重试reply */
        if (retryCount > 0) {
          return this.reply(elements, { ...options, retryCount: retryCount - 1 })
        }

        throw error
      }
    }

    lockProp(this, 'reply')
  }

  /**
   * @description 机器人ID
   * @deprecated 即将废弃，请使用 `selfId`
   */
  public get self_id () {
    return this.#selfId
  }

  /**
   * @description 用户ID
   * @deprecated 即将废弃，请使用 `userId`
   */
  public get user_id () {
    return this.userId
  }

  /** 机器人自身ID */
  public get selfId () {
    return this.#selfId
  }

  /** 用户ID */
  public get userId () {
    return this.#sender.userId
  }

  /** 事件父类型 */
  public get event () {
    return this.#event
  }

  /** 事件子类型 */
  public get subEvent () {
    return this.#subEvent
  }

  /** 事件ID */
  public get eventId () {
    return this.#eventId
  }

  /** 原始事件 */
  public get rawEvent () {
    return this.#rawEvent
  }

  /** 事件触发时间戳 */
  public get time () {
    return this.#time
  }

  /** 事件来源信息 */
  public get contact () {
    return this.#contact
  }

  /** 事件发送者信息 */
  public get sender () {
    return this.#sender
  }

  /** 快速回复源函数 */
  public get srcReply () {
    return this.#srcReply
  }

  /** 机器人实例 */
  public get bot () {
    return this.#bot
  }

  /**
   * 是否为私聊场景
   * - 在好友场景下为 `true`
   * - 在频道私信场景下为 `true`
   */
  public get isPrivate () {
    return this.#contact.scene === 'friend'
  }

  /** 是否为好友场景 */
  public get isFriend () {
    return this.isPrivate
  }

  /** 是否为群聊场景 */
  public get isGroup () {
    return this.#contact.scene === 'group'
  }

  /** 是否为频道场景 */
  public get isGuild () {
    return this.#contact.scene === 'guild'
  }

  /** 是否为群临时会话场景 */
  public get isGroupTemp () {
    return this.#contact.scene === 'groupTemp'
  }

  /** 是否为频道私信场景 */
  public get isDirect () {
    return this.#contact.scene === 'direct'
  }

  /**
   * 传入目标权限，返回当前事件触发者是否拥有该权限
   * @param permission - 目标权限
   * @param isUpper - 是否向上检查 例如`group:admin`向上检查到`master` 默认`true`
   * @returns 是否拥有该权限
   */
  public hasPermission (permission: Permission, isUpper = true): boolean {
    if (permission === 'all') {
      return true
    }

    if (permission === 'master') {
      return this.isMaster
    }

    if (permission === 'admin') {
      if (isUpper) return this.isMaster || this.isAdmin

      return this.isAdmin
    }

    const permissionConfig: Record<string, {
      sceneCheck: () => boolean,
      roleValue: string,
      includeAdmin?: boolean
    }> = {
      'group.owner': {
        sceneCheck: () => this.isGroup,
        roleValue: 'owner',
        includeAdmin: true,
      },
      'group.admin': {
        sceneCheck: () => this.isGroup,
        roleValue: 'admin',
        includeAdmin: true,
      },
      'guild.owner': {
        sceneCheck: () => this.isGuild,
        roleValue: 'owner',
        includeAdmin: true,
      },
      'guild.admin': {
        sceneCheck: () => this.isGuild,
        roleValue: 'admin',
      },
    }

    const config = permissionConfig[permission]
    if (!config) {
      throw new Error(`不支持的权限: ${permission}`)
    }

    if (!config.sceneCheck()) return false

    // @ts-ignore
    const role = this.sender?.role || 'unknown'

    if (isUpper && config.includeAdmin) {
      return this.isMaster || this.isAdmin || role === config.roleValue
    }

    return role === config.roleValue
  }
}
