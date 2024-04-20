import {
  // eslint-disable-next-line no-unused-vars
  KarinElement,
  KarinFileElement,
  KarinAtElement,
  KarinFaceElement,
  KarinImageElement,
  KarinTextElement,
  KarinReplyElement,
  KarinFriendPokeNotice,
  KarinFriendRecallNotice,
  KarinFriendFileUploadedNotice,
  KarinGroupPokeNotice,
  KarinGoupCardChangedNotice,
  KarinGroupUniqueTitleChangedNotice,
  KarinGroupEssenceMessageNotice,
  KarinGroupRecallNotice,
  KarinGroupMemberIncreasedNotice,
  KarinGroupMemberDecreasedNotice,
  KarinGroupAdminChangedNotice,
  KarinGroupMemberBanNotice,
  KarinGroupSignInNotice,
  KarinGroupWholeBanNotice,
  KarinGroupFileUploadedNotice,
  KarinFriendApplyRequest,
  KarinGroupApplyRequest,
  KarinInvitedJoinGroupRequest,
  KarinBubbleFaceElement,
  KarinRecordElement,
  KarinBasketballElement,
  KarinvideoElement,
  KarinDiceElement,
  KarinRpsElement,
  KarinPokeElement,
  KarinMusicElement,
  KarinWeatherElement,
  KarinLocationElement,
  KarinShareElement,
  GiftElement,
  KarinForwardElement,
  KarinXmlElement,
  KarinJsonElement
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
        /** 文本消息 */
        case kritor.common.Element.ElementType.TEXT: {
          elements.push(new KarinTextElement(i.text.text))
          break
        }
        /** 艾特消息 */
        case kritor.common.Element.ElementType.AT: {
          elements.push(new KarinAtElement(i.at.uid, i.at.uin))
          break
        }
        /** 表情消息 */
        case kritor.common.Element.ElementType.FACE: {
          elements.push(new KarinFaceElement(i.face.id, i.face.is_big))
          break
        }
        /** 图片消息 */
        case kritor.common.Element.ElementType.IMAGE: {
          const { file_url, ...args } = i.image
          elements.push(new KarinImageElement(i.image.file_url, ...args))
          break
        }
        /** 弹射表情 */
        case kritor.common.Element.ElementType.BUBBLE_FACE: {
          elements.push(new KarinBubbleFaceElement(i.bubble_face.id, i.bubble_face.count))
          break
        }
        /** 回复消息 */
        case kritor.common.Element.ElementType.REPLY: {
          elements.push(new KarinReplyElement(i.reply.message_id))
          break
        }
        /** 语音消息 */
        case kritor.common.Element.ElementType.VOICE: {
          const { file_url, ...args } = i.voice
          elements.push(new KarinRecordElement(file_url, ...args))
          break
        }
        /** 视频消息 */
        case kritor.common.Element.ElementType.VIDEO: {
          const { file_url, ...args } = i.video
          elements.push(new KarinvideoElement(file_url, ...args))
          break
        }
        /** 篮球消息 */
        case kritor.common.Element.ElementType.BASKETBALL: {
          elements.push(new KarinBasketballElement(i.basketball.id))
          break
        }
        /** 骰子消息 */
        case kritor.common.Element.ElementType.DICE: {
          elements.push(new KarinDiceElement(i.dice.id))
          break
        }
        case kritor.common.Element.ElementType.RPS: {
          elements.push(new KarinRpsElement(i.rps.id))
          break
        }
        /** 戳一戳消息 */
        case kritor.common.Element.ElementType.POKE: {
          const { id = 1, type = 1, strength = 1 } = i.poke
          elements.push(new KarinPokeElement(type, id, strength))
          break
        }
        /** 音乐消息 */
        case kritor.common.Element.ElementType.MUSIC: {
          const { platform, id = '', custom = '' } = i.music
          elements.push(new KarinMusicElement(platform, id || custom))
          break
        }
        /** 天气消息 */
        case kritor.common.Element.ElementType.WEATHER: {
          const { city, code } = i.weather
          elements.push(new KarinWeatherElement(city, code))
          break
        }
        /** 位置消息 */
        case kritor.common.Element.ElementType.LOCATION: {
          const { title = '', address = '', lat, lon } = i.location
          elements.push(new KarinLocationElement(lat, lon, title, address))
          break
        }
        /** 链接分享 */
        case kritor.common.Element.ElementType.SHARE: {
          const { url, title, content, image } = i.share
          elements.push(new KarinShareElement(url, title, content, image))
          break
        }
        /** 礼物消息 只收不发 */
        case kritor.common.Element.ElementType.GIFT: {
          const { qq, id } = i.gift
          elements.push(new GiftElement(qq, id))
          break
        }
        /** 转发消息 */
        case kritor.common.Element.ElementType.FORWARD: {
          const { res_id, uniseq = '', summary = '', description = '' } = i.forward
          elements.push(new KarinForwardElement(res_id, uniseq, summary, description))
          break
        }
        /** 文件消息 只收不发 */
        case kritor.common.Element.ElementType.FILE: {
          elements.push(new KarinFileElement(i.file.file_url))
          break
        }
        /** JSON消息 */
        case kritor.common.Element.ElementType.JSON: {
          elements.push(new KarinJsonElement(i.json.json))
          break
        }
        /** XML消息 */
        case kritor.common.Element.ElementType.XML: {
          elements.push(new KarinXmlElement(i.xml.xml))
          break
        }
        // 这都啥玩意啊...
        case kritor.common.Element.ElementType.MARKET_FACE:
        case kritor.common.Element.ElementType.CONTACT:
        case kritor.common.Element.ElementType.MARKDOWN:
        case kritor.common.Element.ElementType.KEYBOARD:
        default: {
          let { ...args } = i
          args = JSON.stringify(args)
          logger.warn(`未知消息类型 ${i.type} ${args}`)
          elements.push(new KarinTextElement(args))
        }
      }
    }

    // user_id与peer统一使用uid
    const e = new KarinMessage({
      self_id,
      user_id: sender.uid,
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
      case kritor.event.NoticeEvent.NoticeType.PRIVATE_POKE: {
        e = new KarinFriendPokeNotice({ self_id, time: data.time, content: data.private_poke })
        e.raw_message = `<friend_poke operator_uid=${e.sender.operator_uin} operator_uid=${e.sender.operator_uid || '""'}>`
        break
      }
      /** 好友消息撤回 */
      case kritor.event.NoticeEvent.NoticeType.PRIVATE_RECALL: {
        e = new KarinFriendRecallNotice({ self_id, time: data.time, content: data.private_recall })
        e.raw_message = `<friend_recall operator_uid=${e.sender.operator_uin} operator_uid=${e.sender.operator_uid || '""'} message_id=${e.message_id}> tip_text=${e.contact.tip_text}`
        break
      }
      /** 私聊文件上传 */
      case kritor.event.NoticeEvent.NoticeType.PRIVATE_FILE_UPLOADED: {
        e = new KarinFriendFileUploadedNotice({ self_id, time: data.time, content: data.private_file_uploaded })
        e.raw_message = [
          '<friend_file_uploaded',
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'file_id=' + e.content.file_id,
          'file_sub_id=' + e.content.file_sub_id,
          'file_name=' + e.content.file_name,
          'file_size=' + e.content.file_size,
          'expire_time=' + e.content.expire_time,
          'url=' + e.url,
          '>'
        ].join(' ')
        break
      }
      /** 群头像戳一戳 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_POKE: {
        e = new KarinGroupPokeNotice({ self_id, time: data.time, content: data.group_poke })
        e.raw_message = [
          '<group_poke',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'action=' + e.content.action,
          'suffix=' + e.content.suffix,
          'action_image=' + e.content.action_image,
          '>'
        ].join(' ')
        break
      }
      /** 群名片改变 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_CARD_CHANGED: {
        e = new KarinGoupCardChangedNotice({ self_id, time: data.time, content: data.group_card_changed })
        e.raw_message = [
          '<group_card_changed',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'new_card=' + e.content.new_card,
          '>'
        ].join(' ')
        break
      }

      /** 群成员专属头衔改变 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_UNIQUE_TITLE_CHANGED: {
        e = new KarinGroupUniqueTitleChangedNotice({ self_id, time: data.time, content: data.group_member_unique_title_changed })
        e.raw_message = [
          '<group_member_unique_title_changed',
          'group_id=' + e.group_id,
          'target=' + e.content.target,
          'title=' + e.content.title,
          '>'
        ].join(' ')
        break
      }
      /** 群精华消息改变 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_ESSENCE_CHANGED: {
        e = new KarinGroupEssenceMessageNotice({ self_id, time: data.time, content: data.group_essence_changed })
        e.raw_message = [
          '<group_essence_changed',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'message_id=' + e.content.message_id,
          'sub_type=' + e.content.sub_type,
          '>'
        ].join(' ')
        break
      }
      /** 群消息撤回 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_RECALL: {
        e = new KarinGroupRecallNotice({ self_id, time: data.time, content: data.group_recall })
        e.raw_message = [
          '<group_recall',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'message_id=' + e.content.message_id,
          'message_seq=' + e.content.message_seq,
          'tip_text=' + e.content.tip_text,
          '>'
        ].join(' ')
        break
      }
      /** 群成员增加 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_INCREASE: {
        e = new KarinGroupMemberIncreasedNotice({ self_id, time: data.time, content: data.group_member_increase })
        e.raw_message = [
          '<group_member_increase',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'type=' + e.content.type,
          '>'
        ].join(' ')
        break
      }
      /** 群成员减少 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_DECREASE: {
        e = new KarinGroupMemberDecreasedNotice({ self_id, time: data.time, content: data.group_member_decrease })
        e.raw_message = [
          '<group_member_decrease',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'type=' + e.content.new_card,
          '>'
        ].join(' ')
        break
      }
      /** 群管理员变动 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_ADMIN_CHANGED: {
        e = new KarinGroupAdminChangedNotice({ self_id, time: data.time, content: data.group_admin_changed })
        e.raw_message = [
          '<group_admin_change',
          'group_id=' + e.group_id,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'is_admin=' + e.content.is_admin,
          '>'
        ].join(' ')
        break
      }
      /** 群成员被禁言 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_BAN: {
        e = new KarinGroupMemberBanNotice({ self_id, time: data.time, content: data.group_member_ban })
        e.raw_message = [
          '<group_member_ban',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'duration=' + e.content.duration,
          'type=' + e.content.type,
          '>'
        ].join(' ')
        break
      }
      /** 群签到 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_SIGN_IN: {
        e = new KarinGroupSignInNotice({ self_id, time: data.time, content: data.group_sign_in })
        e.raw_message = [
          '<group_sign_in',
          'group_id=' + e.group_id,
          'target_uid=' + e.sender.target_uid,
          'target_uin=' + e.sender.target_uin,
          'action=' + e.content.action,
          'rank_image=' + e.content.rank_image,
          '>'
        ].join(' ')
        break
      }
      /** 群全员禁言 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_WHOLE_BAN: {
        e = new KarinGroupWholeBanNotice({ self_id, time: data.time, content: data.group_whole_ban })
        e.raw_message = [
          '<group_whole_ban',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'is_ban=' + e.content.is_ban,
          '>'
        ].join(' ')
        break
      }
      /** 群文件上传 */
      case kritor.event.NoticeEvent.NoticeType.GROUP_FILE_UPLOADED: {
        e = new KarinGroupFileUploadedNotice({ self_id, time: data.time, content: data.group_file_uploaded })
        e.raw_message = [
          '<group_file_uploaded',
          'group_id=' + e.group_id,
          'operator_uid=' + e.sender.operator_uin,
          'operator_uid=' + e.sender.operator_uid,
          'file_id=' + e.content.file_id,
          'file_sub_id=' + e.content.file_sub_id,
          'file_name=' + e.content.file_name,
          'file_size=' + e.content.file_size,
          'expire_time=' + e.content.expire_time,
          'url=' + e.url,
          '>'
        ].join(' ')
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
   * @param {kritor.event.RequestEvent} raw
   * @return {KarinRequest|null}
   */
  convert (data, self_id) {
    super.convert(data, self_id)
    let e = {}
    switch (data.type) {
      case kritor.event.RequestEvent.RequestType.FRIEND_APPLY: {
        e = new KarinFriendApplyRequest({ self_id, time: data.time, content: data.friend_apply })
        e.raw_message = [
          '<friend_apply',
          'applier_uid=' + e.content.applier_uid,
          'applier_uin=' + e.content.applier_uin,
          'message=' + e.content.message,
          '>'
        ].join(' ')
        break
      }
      case kritor.event.RequestEvent.RequestType.GROUP_APPLY: {
        e = new KarinGroupApplyRequest({ self_id, time: data.time, content: data.group_apply })
        e.raw_message = [
          '<group_apply',
          'group_id=' + e.group_id,
          'applier_uid=' + e.content.applier_uid,
          'applier_uin=' + e.content.applier_uin,
          'inviter_uid=' + e.content.inviter_uid,
          'inviter_uin=' + e.content.inviter_uin,
          'reason=' + e.content.reason,
          '>'
        ].join(' ')
        break
      }
      case kritor.event.RequestEvent.RequestType.GROUP_JOIN: {
        e = new KarinInvitedJoinGroupRequest({ self_id, time: data.time, content: data.invited_group })
        e.raw_message = [
          '<invited_group',
          'group_id=' + e.group_id,
          'inviter_uid=' + e.content.inviter_uid,
          'inviter_uin=' + e.content.inviter_uin,
          '>'
        ].join(' ')
        break
      }
    }
    delete e.reply
    return e
  }
}

const Converters = {
  messageConverter: new MessageConverter(),
  noticeConverter: new NoticeConverter(),
  requestConverter: new RequestConverter()
}

export default Converters
