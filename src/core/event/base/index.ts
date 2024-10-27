import { Scene } from '@/adapter/contact'
import { segment } from '@/adapter/segment'
import { SendMsgResults } from '@/adapter/adapter'
import { BaseEventHandle, BaseEventOptions } from '../types'

/** 事件实现基类 */
export class BaseEvent implements BaseEventHandle {
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
      const request: SendMsgResults = {
        messageId: '',
        messageTime: 0,
        rawData: undefined,
      }

      /** 参数归一化 */
      if (!Array.isArray(elements)) elements = [elements]
      elements = elements.map((element) => typeof element === 'string' ? segment.text(element) : element)

      const at = options?.at ?? false
      const reply = options?.reply ?? false
      const recallMsg = options?.recallMsg ?? 0
      // const retryCount = options?.retryCount ?? 0

      /** 加入at */
      if (at && this.contact.scene !== Scene.DIRECT && this.contact.scene !== Scene.FRIEND) {
        elements.unshift(segment.at(this.userId))
      }

      /** 加入引用回复 */
      if (reply && 'message_id' in this) {
        elements.unshift(segment.reply(this.message_id as string))
      }

      /** 快速撤回 */
      if (recallMsg > 0 && request.messageId) {
        setTimeout(() => {
          this.bot.recallMsg(this.contact, request.messageId)
        }, recallMsg * 1000)
      }

      return request
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
    return this.#contact.scene === Scene.FRIEND || this.#contact.scene === Scene.DIRECT
  }

  get isGroup () {
    return this.#contact.scene === Scene.GROUP
  }

  get isGuild () {
    return this.#contact.scene === Scene.GUILD
  }

  get isGroupTemp () {
    return this.#contact.scene === Scene.GROUP_TEMP
  }

  get isDirect () {
    return this.#contact.scene === Scene.DIRECT
  }
}
