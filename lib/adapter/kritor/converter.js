import {
  KarinAtElement, KarinFaceElement,
  KarinGroupRecallNotice,
  KarinImageElement,
  KarinMessage,
  KarinTextElement
} from "../../bot/model.js";
import {kritor} from "./protos/compiled.js";
import {logger} from "#Karin";
import {raw} from "express";

/**
 * 抽象转换器
 */
export class Converter {
  async convert (raw) {}
}

/**
 * Kritor 消息转换器
 */
export class MessageConverter extends Converter {
  /**
   *
   * @param {kritor.common.PushMessageBody} message
   * @return {Promise<KarinMessage>}
   */
  async convert(message) {
    await super.convert(message);
    let toLog = ''
    let msg = new KarinMessage({
      message: null,
      sender: {
        id: message.sender.uin,
        nickname: message.sender.nick
      },
      group: message.contact.scene === kritor.common.Scene.GROUP ?{
        id: message.contact.peer,
        name: '' // todo fetch from cache
      } : null,
      isPrivate: message.contact.scene === kritor.common.Scene.FRIEND,
      isGroup: message.contact.scene === kritor.common.Scene.GROUP,
      isGuild: message.contact.scene === kritor.common.Scene.GUILD,
      // todo
      isMaster: false,
      logText: '',
      logFnc: '',
      at: '',
      atBot: false,
      img: [],
      file: {},
      reply_id: ''
    })
    /**
     *
     * @type {Array<KarinElement>}
     */
    let messages = []
    for (let element of message.elements) {
      switch (element.type) {
        case kritor.common.Element.ElementType.TEXT: {
          toLog += element.text.text
          messages.push(new KarinTextElement(element.text.text))
          break
        }
        case kritor.common.Element.ElementType.IMAGE: {
          toLog += `<image:${element.image.file_url}>`
          messages.push(new KarinImageElement(element.image.file_url))
          break
        }
        case kritor.common.Element.ElementType.AT: {
          toLog += `<at:${element.at.uin}>`
          messages.push(new KarinAtElement(element.at.uin, element.at.uid))
          break
        }
        case kritor.common.Element.ElementType.FACE: {
          toLog += `<face:${element.face.id}, is_big: ${element.face.is_big}>`
          messages.push(new KarinFaceElement(element.face.id, element.face.is_big))
          break
        }
        // todo 其他类型
        default: {
          logger.info(element)
        }
      }
    }
    msg.raw_message = toLog
    msg.message = messages
    return msg
  }
}

/**
 * Kritor 通知事件转换器
 */
export class NoticeConverter extends Converter {

  /**
   *
   * @param {kritor.event.NoticeEvent} raw
   * @return {Promise<KarinNotice>}
   */
  async convert(raw) {
    await super.convert(raw);
    switch (raw.type) {
      case kritor.event.NoticeEvent.NoticeType.GROUP_POKE: {
        // todo
        break
      }
      case kritor.event.NoticeEvent.NoticeType.GROUP_RECALL: {
        if (raw.group_recall) {
          let notice = new KarinGroupRecallNotice(raw.group_recall)
          notice.logText = `[群撤回:${notice.operator.nickname}(${notice.operator.id})]`
          return notice
        }
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
   * @return {Promise<void>}
   */
  async convert(raw) {
    await super.convert(raw);
  }
}

const Converters ={
  messageConverter: new MessageConverter(),
  noticeConverter: new NoticeConverter(),
  requestConverter: new RequestConverter()
};

export default Converters