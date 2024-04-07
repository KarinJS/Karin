import {
  // eslint-disable-next-line no-unused-vars
  KarinElement, KarinFileElement,
  KarinAtElement,
  KarinFaceElement,
  KarinGroupRecallNotice,
  KarinImageElement,
  KarinTextElement
} from '../../bot/model.js'
import { logger, Bot, kritor } from '#Karin'
import { KarinMessage } from '../../event/type.js'

// import { raw } from 'express'

/**
 * 抽象转换器
 */
export class Converter {
  convert (raw) {
  }

  /**
 *  todo 补充类型
 * @param elements
 * @return {*[]}
 */
  elements (elements) {
    const _elements = []
    const ElementType = kritor.common.Element.ElementType
    for (let i of elements) {
      switch (i.type) {
        case 'text': {
          const { TEXT: type } = ElementType
          const { text } = i
          _elements.push(new kritor.common.TextElement({ type, text: { text } }))
          break
        }
        case 'image': {
          const { IMAGE: type } = ElementType
          const { file } = i
          _elements.push(new kritor.common.ImageElement({ type, image: { file } }))
          break
        }
        case 'at': {
          const { AT: type } = ElementType
          const { uid, uin = '' } = i
          _elements.push(new kritor.common.AtElement({ type, at: { uid, uin } }))
          break
        }
        case 'face': {
          const { FACE: type } = ElementType
          const { id, is_big = false } = i
          _elements.push(new kritor.common.FaceElement({ type, face: { id, is_big } }))
          break
        }
        case 'reply': {
          const { REPLY: type } = ElementType
          const { id } = i
          _elements.push(new kritor.common.ReplyElement({ type, reply: { id } }))
          break
        }
        case 'VOICE': {
          const { VOICE: type } = ElementType
          const { file } = i
          _elements.push(new kritor.common.VoiceElement({ type, voice: { file } }))
          break
        }
      }
    }

    return _elements
  }
}

/**
 * Kritor 消息转换器
 */
export class MessageConverter extends Converter {
  /**
   *
   * @param {kritor.common.PushMessageBody} message
   * @return {KarinMessage}
   */
  convert (message) {
    let { self_id } = message
    let time = message.time
    let message_id = message.message_id
    let message_seq = message.message_seq
    let contact = message.contact
    let sender = message.sender
    /** scene映射表 */
    const sceneMap = {
      [kritor.common.Scene.GROUP]: 'group',
      [kritor.common.Scene.FRIEND]: 'friend',
      [kritor.common.Scene.GUILD]: 'guild',
      [kritor.common.Scene.NEARBY]: 'nearby',
      [kritor.common.Scene.STRANGER]: 'stranger',
      [kritor.common.Scene.STRANGER_FROM_GROUP]: 'stranger_from_group'
    }
    /*
    0=群聊 1=私聊 2=频道 5=附近的人 6=陌生人 10=群临时会话
    0=group 1=friend 2=guild 5=nearby 6=stranger 10=stranger_from_group
    */
    const scene = sceneMap[contact.scene]

    /**
     *
     * @type {Array<KarinElement>}
     */
    const elements = []

    for (let i of message.elements) {
      switch (i.type) {
        case kritor.common.Element.ElementType.TEXT: {
          elements.push(new KarinTextElement(i.text.text))
          break
        }
        case kritor.common.Element.ElementType.IMAGE: {
          elements.push(new KarinImageElement(i.image.file_url))
          break
        }
        case kritor.common.Element.ElementType.AT: {
          elements.push(new KarinAtElement(i.at.uid, i.at.uin))
          break
        }
        case kritor.common.Element.ElementType.FACE: {
          elements.push(new KarinFaceElement(i.face.id, i.face.is_big))
          break
        }
        // todo 其他类型
        default: {
          logger.info(i)
        }
      }
    }

    const e = new KarinMessage(self_id, sender.uid, contact.peer, time, message_id, message_seq, '', {
      scene,
      peer: contact.peer,
      sub_peer: contact.sub_peer
    }, sender, elements, '', '', [], '', false, false, false, false)

    /**
     * 快速回复
     * @param {Array<KarinElement>} elements
     * @returns {Promise<String>}
     */
    e.reply = (elements) => {
      const contact = e.contact
      const _elements = this.elements(elements)
      return Bot.adapter[e.self_id].SendMessage(contact, _elements)
    }
    return e
  }
}

/**
 * Kritor 通知事件转换器
 */
export class NoticeConverter extends Converter {
  /**
   *
   * @param {kritor.event.NoticeEvent} raw
   * @return {KarinNotice}
   */
  convert (raw) {
    super.convert(raw)
    let selfId = raw.self_id
    switch (raw.type) {
      case kritor.event.NoticeEvent.NoticeType.GROUP_POKE: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.GROUP_RECALL: {
        const e = new KarinGroupRecallNotice(selfId, raw.group_recall, raw.time)
        e.logText = `[群撤回:${raw.group_recall.group_id}] operator: ${raw.group_recall.operator_uin}, target: ${raw.group_recall.target_uin}, message_id: ${raw.group_recall.message_id}`
        e.raw_message = `<group_recall operator_uin=${e.sender.operator_uin} target_uin=${e.sender.target_uin}>`
        /**
         * 快速回复
         * @param {Array<KarinElement>} elements
         * @returns {Promise<String>}
         */
        e.reply = (elements) => {
          const contact = e.contact
          const _elements = this.elements(elements)
          return Bot.adapter[selfId].SendMessage(contact, _elements)
        }
        return e
      }
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_BANNED: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_INCREASE: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_DECREASE: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.GROUP_WHOLE_BAN: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.FRIEND_POKE: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.FRIEND_RECALL: {
        // todo
        break
      }
    }
  }
}

/**
 * Kritor 请求事件转换器
 */
export class RequestConverter extends Converter {
  /**
   *
   * @param {kritor.event.RequestsEvent} raw
   * @return {KarinRequest|null}
   */
  convert (raw) {
    super.convert(raw)
    return null
  }
}

const Converters = {
  messageConverter: new MessageConverter(),
  noticeConverter: new NoticeConverter(),
  requestConverter: new RequestConverter()
}

export default Converters
