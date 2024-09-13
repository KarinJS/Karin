import { listener } from 'karin/core'
import { AdapterOneBot11 } from './index'
import { EventType, KarinMessage, KarinNotice, KarinRequest, MessageSubType, NoticeSubType, OB11EventAll, OB11MessageEvent, OB11MetaEvent, OB11NoticeEvent, OB11RequestEvent, RequestSubType, Role, Scene } from 'karin/types'

export class OB11Event {
  adapter: AdapterOneBot11
  constructor (adapter: AdapterOneBot11) {
    this.adapter = adapter
  }

  /**
   * 处理事件
   * - @param data ob11相关标准数据
   */
  event (data: OB11EventAll) {
    switch (data.post_type) {
      case 'meta_event':
        this.metaEvent(data)
        return
      case 'message':
      case 'message_sent':
        this.messageEvent(data)
        return
      case 'notice':
        this.noticeEvent(data)
        return
      case 'request':
        this.requestEvent(data)
        return
      default:
        this.adapter.logger('info', `未知事件：${JSON.stringify(data)}`)
    }
  }

  /**
   * 元事件
   */
  metaEvent (data: OB11MetaEvent) {
    if (data.meta_event_type === 'heartbeat') {
      this.adapter.logger('trace', `[心跳]：${JSON.stringify(data.status)}`)
    } else {
      const typeMap = {
        enable: 'OneBot启用',
        disable: 'OneBot停用',
        connect: 'WebSocket连接成功',
      }
      const sub_type = data.sub_type
      this.adapter.logger('debug', `[生命周期]：${typeMap[sub_type]}`)
    }
  }

  /**
   * 消息事件
   */
  messageEvent (data: OB11MessageEvent) {
    const message = {
      event: EventType.Message as EventType.Message,
      event_id: data.message_id + '',
      sub_event: data.sub_type === 'friend' ? MessageSubType.PrivateMessage : MessageSubType.GroupMessage,
      raw_event: data,
      self_id: data.self_id + '',
      user_id: data.sender.user_id + '',
      time: data.time,
      message_id: data.message_id + '',
      message_seq: data.message_id as unknown as number,
      sender: {
        ...data.sender,
        uid: data.sender.user_id + '',
        uin: data.sender.user_id + '',
        nick: data.sender.nickname || '',
        role: ('role' in data.sender ? data.sender.role as Role || Role.Unknown : Role.Unknown),
      },
      elements: this.adapter.AdapterConvertKarin(data.message),
      contact: {
        scene: data.message_type === 'private' ? Scene.Private : Scene.Group,
        peer: data.message_type === 'private' ? data.sender.user_id : data.group_id,
        sub_peer: '',
      },
      group_id: data.message_type === 'group' ? data.group_id : '',
      raw_message: '',
    }

    const e = new KarinMessage(message)
    e.bot = this.adapter
    /**
     * 快速回复 开发者不应该使用这个方法，应该使用由karin封装过后的reply方法
     */
    e.replyCallback = async elements => await this.adapter.SendMessage(e.contact, elements)

    listener.emit('adapter.message', e)
  }

  /**
   * 通知事件
   */
  noticeEvent (data: OB11NoticeEvent) {
    const time = data.time
    const self_id = data.self_id + ''
    let notice = {} as KarinNotice

    /** 别问为啥any... 我是any糕手~ */
    const user_id = ((data as any).user_id || (data as any).operator_id) + ''
    const event_id = `notice.${time}`
    const sender = {
      uid: user_id,
      uin: user_id,
      nick: '',
      role: Role.Unknown,
    }

    const contact = {
      scene: 'group_id' in data ? Scene.Group : Scene.Private,
      peer: 'group_id' in data ? data.group_id : data.user_id,
      sub_peer: '',
    }

    switch (data.notice_type) {
      // 群文件上传
      case 'group_upload': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          operator_uid: data.user_id + '',
          operator_uin: data.user_id + '',
          file_id: data.file.id,
          file_sub_id: 0,
          file_name: data.file.name,
          file_size: data.file.size,
          expire_time: 0,
          file_url: '',
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          content,
          sender,
          contact,
          group_id,
          sub_event: NoticeSubType.GroupFileUploaded,
        }
        notice = new KarinNotice(options)
        break
      }
      // 群管理员变动
      case 'group_admin': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          target_uid: data.user_id + '',
          target_uin: data.user_id + '',
          is_admin: data.sub_type === 'set',
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupAdminChanged,
        }
        notice = new KarinNotice(options)
        break
      }
      // 群成员减少
      case 'group_decrease': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          operator_uid: (data.operator_id + '') || '',
          operator_uin: (data.operator_id + '') || '',
          target_uid: data.user_id || '',
          target_uin: data.user_id || '',
          type: data.sub_type,
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupMemberDecrease,
        }
        notice = new KarinNotice(options)
        break
      }
      // 群成员增加
      case 'group_increase': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          operator_uid: (data.operator_id || '') + '',
          operator_uin: (data.operator_id || '') + '',
          target_uid: (data.user_id || '') + '',
          target_uin: (data.user_id || '') + '',
          type: data.sub_type,
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupMemberIncrease,
        }
        notice = new KarinNotice(options)
        break
      }
      // 群禁言事件
      case 'group_ban': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          operator_uid: (data.operator_id + '') || '',
          operator_uin: (data.operator_id + '') || '',
          target_uid: data.user_id || '',
          target_uin: data.user_id || '',
          duration: data.duration,
          type: data.sub_type,
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupMemberBan,
        }
        notice = new KarinNotice(options)
        break
      }
      case 'friend_add':
        // todo kritor没有这个事件
        this.adapter.logger('info', `[好友添加]：${JSON.stringify(data)}`)
        break
      case 'group_recall': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          operator_uid: (data.operator_id + '') || '',
          operator_uin: (data.operator_id + '') || '',
          target_uid: data.user_id || '',
          target_uin: data.user_id || '',
          message_id: data.message_id,
          tip_text: '撤回了一条消息',
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupRecall,
        }
        notice = new KarinNotice(options)
        break
      }
      case 'friend_recall': {
        const content = {
          operator_uid: data.user_id || '',
          operator_uin: data.user_id || '',
          message_id: data.message_id,
          tip_text: '撤回了一条消息',
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: NoticeSubType.PrivateRecall,
        }
        notice = new KarinNotice(options)
        break
      }
      case 'notify':
        switch (data.sub_type) {
          case 'poke': {
            const group_id = 'group_id' in data ? data.group_id + '' : ''
            const content = {
              group_id,
              operator_uid: data.user_id + '',
              operator_uin: data.user_id + '',
              target_uid: data.target_id + '',
              target_uin: data.target_id + '',
              action: '戳了戳',
              suffix: '',
              action_image: '',
            }

            const options = {
              raw_event: data,
              time,
              self_id,
              user_id,
              event_id,
              sender,
              contact,
              content,
              group_id,
              sub_event: data.group_id ? NoticeSubType.GroupPoke : NoticeSubType.PrivatePoke,
            }
            notice = new KarinNotice(options)
            break
          }
          case 'lucky_king':
            // todo kritor没有这个事件
            this.adapter.logger('info', `[运气王]：${JSON.stringify(data)}`)
            break
          case 'honor':
            // todo kritor没有这个事件
            this.adapter.logger('info', `[群荣誉变更]：${JSON.stringify(data)}`)
            break
          default:
            return this.adapter.logger('error', '未知通知事件：', JSON.stringify(data))
        }
        break
      case 'group_msg_emoji_like': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          message_id: data.message_id,
          face_id: data.likes[0].emoji_id,
          is_set: true,
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupMessageReaction,
        }
        notice = new KarinNotice(options)
        break
      }
      // Language表情动态上报
      case 'reaction': {
        const group_id = data.group_id + ''
        const content = {
          group_id,
          message_id: data.message_id,
          face_id: Number(data.code),
          is_set: data.sub_type === 'add',
        }

        const options = {
          raw_event: data,
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          group_id,
          sub_event: NoticeSubType.GroupMessageReaction,
        }
        notice = new KarinNotice(options)
        break
      }
      default: {
        return this.adapter.logger('error', '未知通知事件：', JSON.stringify(data))
      }
    }

    notice.bot = this.adapter
    /**
     * 快速回复 开发者不应该使用这个方法，应该使用由karin封装过后的reply方法
     */
    notice.replyCallback = async elements => await this.adapter.SendMessage(notice.contact, elements)

    listener.emit('adapter.notice', notice)
  }

  /** 请求事件 */
  requestEvent (data: OB11RequestEvent) {
    switch (data.request_type) {
      case 'friend': {
        const request = new KarinRequest({
          raw_event: data,
          event_id: `request.${data.time}`,
          self_id: data.self_id + '',
          user_id: data.user_id + '',
          time: data.time,
          contact: {
            scene: Scene.Private,
            peer: data.user_id + '',
            sub_peer: '',
          },
          sender: {
            uid: data.user_id + '',
            uin: data.user_id + '',
            nick: '',
            role: Role.Unknown,
          },
          sub_event: RequestSubType.PrivateApply,
          content: {
            applier_uid: data.user_id + '',
            applier_uin: data.user_id + '',
            message: data.comment,
          },
        })

        request.bot = this.adapter
        /**
         * 快速回复 开发者不应该使用这个方法，应该使用由karin封装过后的reply方法
         */
        request.replyCallback = async elements => await this.adapter.SendMessage(request.contact, elements)

        listener.emit('adapter.request', request)
        return
      }
      case 'group': {
        const request = new KarinRequest({
          raw_event: data,
          event_id: `request.${data.time}`,
          self_id: data.self_id + '',
          user_id: data.user_id + '',
          time: data.time,
          contact: {
            scene: Scene.Group,
            peer: data.group_id + '',
            sub_peer: '',
          },
          sender: {
            uid: data.user_id + '',
            uin: data.user_id + '',
            nick: '',
            role: Role.Unknown,
          },
          sub_event: data.sub_type === 'add' ? RequestSubType.GroupApply : RequestSubType.InvitedGroup,
          content: {
            group_id: data.group_id + '',
            applier_uid: data.user_id + '',
            applier_uin: data.user_id + '',
            inviter_uid: data.user_id + '',
            inviter_uin: data.user_id + '',
            message: data.comment,
          },
        })

        request.bot = this.adapter
        /**
         * 快速回复 开发者不应该使用这个方法，应该使用由karin封装过后的reply方法
         */
        request.replyCallback = async elements => await this.adapter.SendMessage(request.contact, elements)

        listener.emit('adapter.request', request)
        return
      }
      default: {
        this.adapter.logger('info', `未知请求事件：${JSON.stringify(data)}`)
      }
    }
  }
}
