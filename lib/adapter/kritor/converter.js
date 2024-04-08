import {
  // eslint-disable-next-line no-unused-vars
  KarinElement,
  KarinFileElement,
  KarinAtElement,
  KarinFaceElement,
  KarinImageElement,
  KarinTextElement,
  KarinReplyElement,
  KarinGroupRecallNotice,
  KarinFriendPokeNotice,
  KarinFriendRecallNotice
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
}

/**
 * Kritor 消息转换器
 */
export class MessageConverter extends Converter {
  /**
   *
   * @param {kritor.common.PushMessageBody} data
   * @param {string} self_id 机器人自身的id
   * @return {KarinMessage}
   */
  convert (data, self_id) {
    let time = data.time
    let message_id = data.message_id
    let message_seq = data.message_seq
    let contact = data.contact
    let sender = data.sender
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

    for (let i of data.elements) {
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
        case kritor.common.Element.ElementType.FILE: {
          elements.push(new KarinFileElement(i.file.file_url))
          break
        }
        case kritor.common.Element.ElementType.REPLY: {
          elements.push(new KarinReplyElement(i.reply.message_id))
          break
        }
        // todo 其他类型
        default: {
          logger.info(i)
        }
      }
    }

    // user_id与peer统一使用uin
    const e = new KarinMessage({
      self_id,
      user_id: sender.uin,
      group_id: contact.peer || '',
      time,
      message_id,
      message_seq,
      sender,
      elements,
      contact: {
        scene,
        peer: contact.peer,
        sub_peer: contact.sub_peer
      }
    })

    /**
     * 快速回复
     * @param {Array<KarinElement>} elements
     * @returns {Promise<String>}
     */
    e.reply = (elements) => Bot.adapter[self_id].SendMessage(e.contact, elements)
    return e
  }
}

/**
 * Kritor 通知事件转换器
 */
export class NoticeConverter extends Converter {
  /**
   *
   * @param {kritor.event.NoticeEvent} data
   * @param {string} self_id 机器人自身的id
   * @return {KarinNotice}
   */
  convert (data, self_id) {
    super.convert(data, self_id)
    let e = {}
    switch (data.type) {
      /** 好友头像戳一戳 */
      case kritor.event.NoticeEvent.NoticeType.FRIEND_POKE: {
        e = new KarinFriendPokeNotice({ self_id, time: data.time, content: data.friend_poke })
        e.raw_message = `<friend_poke operator_uid=${e.sender.operator_uin} operator_uid=${e.sender.operator_uid || '""'}>`
        break
      }
      /** 好友消息撤回 */
      case kritor.event.NoticeEvent.NoticeType.FRIEND_RECALL: {
        e = new KarinFriendRecallNotice({ self_id, time: data.time, content: data.friend_poke })
        e.raw_message = `<friend_recall operator_uid=${e.sender.operator_uin} operator_uid=${e.sender.operator_uid || '""'} message_id=${e.message_id}> tip_text=${e.contact.tip_text}`
        break
      }
      /** 私聊文件上传 */
      case kritor.event.NoticeEvent.NoticeType.FRIEND_FILE_COME: {
        // todo
        break
      }
      /** 群头像戳一戳 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_POKE: {
        // todo
        break
      }
      /** 群名片改变 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_CARD_CHANGED: {
        // todo
        break
      }
      /** 群成员专属头衔改变 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_UNIQUE_TITLE_CHANGED: {
        // todo
        break
      }
      /** 群精华消息改变 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_ESSENCE_CHANGED: {
        // todo
        break
      }
      /** 群消息撤回 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_RECALL: {
        e = new KarinGroupRecallNotice({ self_id, time: data.time, content: data.group_recall })
        e.raw_message = `<group_recall operator_uin=${e.sender.operator_uin} operator_uid=${e.sender.operator_uid} target_uin=${e.sender.target_uin} target_uid=${e.sender.target_uid} message_id=${e.message_id}>`
        break
      }
      /** 群成员增加 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_INCREASE: {
        // todo
        break
      }
      /** 群成员减少 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_DECREASE: {
        // todo
        break
      }
      /** 群管理员变动 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_ADMIN_CHANGED: {
        // todo
        break
      }
      /** 群成员被禁言 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_BANNED: {
        // todo
        break
      }
      /** 群签到 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_SIGN: {
        // todo
        break
      }
      /** 群全员禁言 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_WHOLE_BAN: {
        // todo
        break
      }
      /** 群文件上传 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_FILE_COME: {
        // todo
        break
      }
    }
    /**
     * 快速回复
     * @param {Array<KarinElement>} elements
     * @returns {Promise<String>}
     */
    e.reply = (elements) => Bot.adapter[self_id].SendMessage(e.contact, elements)
    return e
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
