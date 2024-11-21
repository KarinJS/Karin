import { segment } from '@/adapter/segment'
import { cache } from '@/plugin/cache/cache'
import { BaseEventHandle, BaseEventOptions } from '../../types/types'

/** 事件实现基类 */
export abstract class BaseEvent implements BaseEventHandle {
  #selfId: BaseEventHandle['selfId']
  #event: BaseEventHandle['event']
  #subEvent: BaseEventHandle['subEvent']
  #eventId: BaseEventHandle['eventId']
  #rawEvent: BaseEventHandle['rawEvent']
  #time: BaseEventHandle['time']
  #contact: BaseEventHandle['contact']
  #sender: BaseEventHandle['sender']
  #srcReply: BaseEventHandle['srcReply']
  #bot: BaseEventHandle['bot']

  public reply: BaseEventHandle['reply']
  public store: BaseEventHandle['store']
  public logFnc: BaseEventHandle['logFnc']
  public logText: BaseEventHandle['logText']
  public isMaster: BaseEventHandle['isMaster']
  public isAdmin: BaseEventHandle['isAdmin']

  constructor ({
    selfId,
    event,
    subEvent,
    eventId,
    rawEvent,
    time,
    contact,
    sender,
    srcReply,
    bot,
  }: BaseEventOptions) {
    this.#selfId = selfId
    this.#selfId = selfId
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
      /** 参数归一化 */
      if (!Array.isArray(elements)) elements = [elements]
      const message = elements.map((element) => typeof element === 'string' ? segment.text(element) : element)

      const at = options?.at ?? false
      const reply = options?.reply ?? false
      const recallMsg = options?.recallMsg ?? 0
      // const retryCount = options?.retryCount ?? 0

      /** 加入at */
      if (at && !(this.contact.scene === 'direct' || this.contact.scene === 'friend')) {
        message.unshift(segment.at(this.userId))
      }

      /** 加入引用回复 */
      if (reply && 'message_id' in this) {
        message.unshift(segment.reply(this.message_id as string))
      }

      let result: any = {
        messageId: '',
        messageTime: 0,
        rawData: {},
        /** @deprecated 已废弃，请使用 messageId */
        message_id: '',
        /** @deprecated 已废弃，请使用 messageTime */
        message_time: 0,
        /** @deprecated 已废弃，请使用 rawData */
        raw_data: undefined,
      }

      /** 先调用中间件 */
      for (const info of cache.middleware.replyMsg) {
        try {
          let next = false
          let exit = false
          const nextFn = () => { next = true }
          const exitFn = () => { exit = true }

          await info.fnc(this as any, message, nextFn, exitFn)

          if (exit) {
            logger.debug(`[消息中间件][${info.info.name}][${info.file.basename}] 主动操作退出`)
            return result
          }

          if (!next) break
          if (!next) break
        } catch (error) {
          logger.error('[消息中间件] 调用失败，已跳过')
          throw error
        }
      }

      /** 发送消息 */
      result = await this.bot.sendMsg(this.contact, message)
      result.message_id = result.messageId
      result.message_time = result.messageTime
      result.raw_data = result.rawData

      /** 快速撤回 */
      if (recallMsg > 0 && result.messageId) {
        setTimeout(() => {
          this.bot.recallMsg(this.contact, result.messageId)
        }, recallMsg * 1000)
      }

      return result
    }
  }

  /**
   * @description 机器人ID
   * @deprecated 即将废弃，请使用 `selfId`
   */
  get self_id () {
    return this.#selfId
  }

  /**
   * @description 用户ID
   * @deprecated 即将废弃，请使用 `userId`
   */
  get user_id () {
    return this.userId
  }

  get selfId () {
    return this.#selfId
  }

  get userId () {
    return this.#sender.userId
  }

  get event () {
    return this.#event
  }

  get subEvent () {
    return this.#subEvent
  }

  get eventId () {
    return this.#eventId
  }

  get rawEvent () {
    return this.#rawEvent
  }

  get time () {
    return this.#time
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get srcReply () {
    return this.#srcReply
  }

  get bot () {
    return this.#bot
  }

  get isPrivate () {
    return this.#contact.scene === 'friend' || this.#contact.scene === 'direct'
  }

  get isGroup () {
    return this.#contact.scene === 'group'
  }

  get isGuild () {
    return this.#contact.scene === 'guild'
  }

  get isGroupTemp () {
    return this.#contact.scene === 'groupTemp'
  }

  get isDirect () {
    return this.#contact.scene === 'direct'
  }
}
