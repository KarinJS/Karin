import AdapterKritor from './index'
import * as grpc from '@grpc/grpc-js'
import { listener } from 'karin/core'
import { KarinElement } from 'karin/types'
import { kritor, proto } from 'kritor-proto'
import { common, config, logger, segment } from 'karin/utils'
import * as protoLoader from '@grpc/proto-loader'
import { EventType, KarinMessage, KarinNotice, MessageSubType, NoticeSubType, Role, Scene } from 'karin/types'

export class KritorGrpc {
  /**
   * - proto 文件路径
   */
  dir: string
  #server: grpc.Server
  BotMap: Map<string, any>
  constructor () {
    this.dir = proto
    this.#server = new grpc.Server()
    this.BotMap = new Map()
  }

  /**
   * 获取 proto 文件
   * @param filename 文件名
   */
  getProto (filename: string): any {
    filename = `${this.dir}/${filename}`
    const dirs = [this.dir]
    const definition = protoLoader.loadSync(filename, {
      includeDirs: dirs,
      keepCase: true,
      longs: String,
      // enums: String,
      defaults: true,
      oneofs: true,
    })
    return grpc.loadPackageDefinition(definition)
  }

  /**
   * 初始化 gRPC 服务器
   */
  init () {
    try {
      const authenticationProtoGrpcType = this.getProto('auth/authentication.proto')
      const coreProtoGrpcType = this.getProto('core/core.proto')
      const customizationGrpcType = this.getProto('developer/customization.proto')
      const developerGrpcType = this.getProto('developer/developer.proto')
      const QsignGrpcType = this.getProto('developer/qsign.proto')
      const eventProtoGrpcType = this.getProto('event/event.proto')
      const GroupFileGrpcType = this.getProto('file/group_file.proto')
      const friendGrpcType = this.getProto('friend/friend.proto')
      const groupGrpcType = this.getProto('group/group.proto')
      const guildGrpcType = this.getProto('guild/guild.proto')
      const messageProtoGrpcType = this.getProto('message/message.proto')
      const reverseProtoGrpcType = this.getProto('reverse/reverse.proto')
      const webGrpcType = this.getProto('web/web.proto')

      const authenticationServer = {
        RegisterPassiveListener: (grpc: grpc.ServerReadableStream<kritor.event.EventStructure, kritor.event.RequestPushEvent>) => {
          const metadata = grpc.metadata.getMap()
          const { 'kritor-self-uid': uid, 'kritor-self-uin': uin } = metadata
          /** 监听上报事件 */
          grpc.on('data', (data: kritor.event.EventStructure) => {
            const str = data.toString()
            logger.bot('debug', (uin as string), '上报事件：', str)
            const bot = listener.getBot(uid as string)
            if (!bot) {
              logger.bot('warn', (uin as string), '未注册Bot，忽略事件: ', str)
              return
            }

            const self_id = uid as string

            switch (data.type) {
              /** 消息事件 */
              case kritor.event.EventType.EVENT_TYPE_MESSAGE: {
                const kritorData = data.message as kritor.common.PushMessageBody
                const sender = kritorData.sender as kritor.common.Sender
                const contact = kritorData.contact as kritor.common.Contact
                const { role, scene } = this.KarinSceneContact(contact, sender)

                const e = new KarinMessage({
                  event: EventType.Message,
                  raw_event: data,
                  event_id: kritorData.message_id + '',
                  self_id,
                  user_id: sender.uid + '',
                  time: kritorData.time as number,
                  sub_event: scene === Scene.Group ? MessageSubType.GroupMessage : MessageSubType.PrivateMessage,
                  message_id: kritorData.message_id + '',
                  message_seq: Number(kritorData.message_seq),
                  sender: {
                    ...sender,
                    uid: sender.uid + '',
                    uin: sender.uin + '',
                    nick: sender.nick || '',
                    role,
                  },
                  elements: this.AdapterConvertKarin(kritorData.elements as Array<kritor.common.Element>),
                  contact: {
                    scene,
                    peer: contact.peer + '',
                    sub_peer: contact.sub_peer + '',
                  },
                  group_id: scene === 'group' ? contact.peer + '' : '',
                })

                e.bot = bot
                e.replyCallback = (elements: Array<KarinElement>) => {
                  return bot.SendMessage(contact as any, elements)
                }

                listener.emit('message', e)
                return
              }
              /** 请求事件 */
              case kritor.event.EventType.EVENT_TYPE_REQUEST: {
                if (data) return logger.error('暂未完成')
                // const notice = Converters.noticeConverter.convert(data.notice, uin || uid)
                listener.emit('notice', data)
                break
              }
              /** 通知事件 */
              case kritor.event.EventType.EVENT_TYPE_NOTICE: {
                let e = {} as KarinNotice
                const kritorData = data.message as kritor.event.NoticeEvent
                const time = Number(kritorData.time)

                switch (kritorData.type) {
                  /** 好友头像戳一戳 */
                  case kritor.event.NoticeEvent.NoticeType.PRIVATE_POKE: {
                    const data = kritorData.private_poke as kritor.event.PrivatePokeNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin

                    const contact = {
                      scene: Scene.Private,
                      peer: uid,
                      sub_peer: '',
                    }

                    const content = {
                      group_id: contact.peer + '',
                      operator_uid: uid,
                      operator_uin: data.operator_uin + '',
                      target_uid: uid + '',
                      target_uin: uin + '',
                      action: '戳了戳',
                      suffix: data.suffix,
                      action_image: data.action_image,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      sub_event: NoticeSubType.PrivatePoke,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 好友消息撤回 */
                  case kritor.event.NoticeEvent.NoticeType.PRIVATE_RECALL: {
                    const data = kritorData.private_recall as kritor.event.PrivateRecallNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin

                    const contact = {
                      scene: Scene.Private,
                      peer: uid,
                      sub_peer: '',
                    }

                    const content = {
                      operator_uid: uid || '',
                      operator_uin: uin + '' || '',
                      message_id: data.message_id,
                      tip_text: '撤回了一条消息',
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      sub_event: NoticeSubType.PrivateRecall,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 私聊文件上传 */
                  case kritor.event.NoticeEvent.NoticeType.PRIVATE_FILE_UPLOADED: {
                    const data = kritorData.private_file_uploaded as kritor.event.PrivateFileUploadedNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin

                    const contact = {
                      scene: Scene.Private,
                      peer: uid,
                      sub_peer: '',
                    }

                    const content = {
                      group_id: '',
                      operator_uid: uid + '',
                      operator_uin: uin + '' + '',
                      file_id: data.file_id,
                      file_sub_id: Number(data.file_sub_id),
                      file_name: data.file_name,
                      file_size: Number(data.file_size),
                      expire_time: Number(data.expire_time),
                      file_url: data.file_url,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      sub_event: NoticeSubType.PrivateFileUploaded,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群头像戳一戳 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_POKE: {
                    const data = kritorData.group_poke as kritor.event.GroupPokeNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id: data.group_id + '',
                      operator_uid: data.operator_uid + '',
                      operator_uin: data.operator_uin + '',
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      action: '戳了戳',
                      suffix: data.suffix,
                      action_image: data.action_image,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id: data.group_id + '',
                      sub_event: NoticeSubType.GroupPoke,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群名片改变 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_CARD_CHANGED: {
                    const data = kritorData.group_card_changed as kritor.event.GroupCardChangedNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      operator_uid: data.operator_uid + '',
                      operator_uin: data.operator_uin + '',
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      new_card: data.new_card,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupCardChanged,
                    }
                    e = new KarinNotice(options)
                    break
                  }

                  /** 群成员专属头衔改变 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_UNIQUE_TITLE_CHANGED: {
                    const data = kritorData.group_member_unique_title_changed as kritor.event.GroupUniqueTitleChangedNotice
                    const uid = data.target_uid
                    const uin = data.target_uin
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      title: data.title,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupMemberUniqueTitleChanged,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群精华消息改变 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_ESSENCE_CHANGED: {
                    const data = kritorData.group_essence_changed as kritor.event.GroupEssenceMessageNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      operator_uid: data.operator_uid + '',
                      operator_uin: data.operator_uin + '',
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      message_id: data.message_id + '',
                      is_set: data.is_set,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupEssenceChanged,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群消息撤回 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_RECALL: {
                    const data = kritorData.group_recall as kritor.event.GroupRecallNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      operator_uid: data.operator_uid + '',
                      operator_uin: data.operator_uin + '',
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      message_id: data.message_id + '',
                      tip_text: data.tip_text,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupRecall,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群成员增加 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_INCREASE: {
                    const data = kritorData.group_member_increase as kritor.event.GroupMemberIncreasedNotice
                    const uid = data.operator_uid
                    const uin = data.operator_uin
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const typeMap = {
                      [kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType.INVITE]: 'invite',
                      [kritor.event.GroupMemberIncreasedNotice.GroupMemberIncreasedType.APPROVE]: 'approve',
                    }

                    const content = {
                      group_id,
                      operator_uid: data.operator_uid + '',
                      operator_uin: data.operator_uin + '',
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      type: typeMap[data.type] as 'invite' | 'approve',
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupMemberIncrease,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群成员减少 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_DECREASE: {
                    const data = kritorData.group_member_decrease as kritor.event.GroupMemberDecreasedNotice
                    const uid = String(data.operator_uid)
                    const uin = String(data.operator_uin)
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const typeMap = {
                      [kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType.LEAVE]: 'leave',
                      [kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType.KICK]: 'kick',
                      [kritor.event.GroupMemberDecreasedNotice.GroupMemberDecreasedType.KICK_ME]: 'kick_me',
                    }

                    const content = {
                      group_id,
                      operator_uid: data.operator_uid + '',
                      operator_uin: data.operator_uin + '',
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      type: typeMap[data.type] as 'leave' | 'kick' | 'kick_me',
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupMemberDecrease,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群管理员变动 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_ADMIN_CHANGED: {
                    const data = kritorData.group_admin_changed as kritor.event.GroupAdminChangedNotice
                    const uid = String(data.target_uid)
                    const uin = String(data.target_uid)
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      is_admin: data.is_admin,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupAdminChanged,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群成员被禁言 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_MEMBER_BAN: {
                    const data = kritorData.group_member_ban as kritor.event.GroupMemberBanNotice
                    const uid = String(data.operator_uid)
                    const uin = String(data.operator_uid)
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const typeMap = {
                      [kritor.event.GroupMemberBanNotice.GroupMemberBanType.BAN]: 'ban',
                      [kritor.event.GroupMemberBanNotice.GroupMemberBanType.LIFT_BAN]: 'lift_ban',
                    }

                    const content = {
                      group_id,
                      operator_uid: uid,
                      operator_uin: uin,
                      target_uid: data.target_uid + '',
                      target_uin: data.target_uin + '',
                      duration: data.duration,
                      type: typeMap[data.type] as 'ban' | 'lift_ban',
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupMemberBan,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群签到 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_SIGN_IN: {
                    const data = kritorData.group_sign_in as kritor.event.GroupSignInNotice
                    const uid = String(data.target_uid)
                    const uin = String(data.target_uid)
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      target_uid: uid,
                      target_uin: uin,
                      action: data.action,
                      rank_image: data.rank_image,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupSignIn,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群全员禁言 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_WHOLE_BAN: {
                    const data = kritorData.group_whole_ban as kritor.event.GroupWholeBanNotice
                    const uid = String(data.operator_uid)
                    const uin = String(data.operator_uid)
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      operator_uid: uid,
                      operator_uin: uin,
                      is_ban: data.is_ban,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupWholeBan,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                  /** 群文件上传 */
                  case kritor.event.NoticeEvent.NoticeType.GROUP_FILE_UPLOADED: {
                    const data = kritorData.group_file_uploaded as kritor.event.GroupFileUploadedNotice
                    const uid = String(data.operator_uid)
                    const uin = String(data.operator_uid)
                    const group_id = data.group_id + ''

                    const contact = {
                      scene: Scene.Group,
                      peer: group_id,
                      sub_peer: '',
                    }

                    const content = {
                      group_id,
                      operator_uid: uid,
                      operator_uin: uin,
                      file_id: data.file_id,
                      file_name: data.file_name,
                      file_size: Number(data.file_size),
                      file_sub_id: Number(data.file_sub_id),
                      expire_time: Number(data.expire_time),
                      file_url: data.file_url,
                    }

                    const options = {
                      raw_event: data,
                      self_id,
                      time,
                      user_id: uid,
                      event_id: kritorData.notice_id,
                      contact,
                      content,
                      sender: {
                        uid: uid + '',
                        uin: uin + '',
                        nick: '',
                        role: Role.Unknown,
                      },
                      group_id,
                      sub_event: NoticeSubType.GroupFileUploaded,
                    }
                    e = new KarinNotice(options)
                    break
                  }
                }

                e.bot = bot
                e.replyCallback = (elements: Array<KarinElement>) => {
                  return bot.SendMessage(e.contact as any, elements)
                }

                listener.emit('request', e)
                return
              }
              /** 元事件 */
              case kritor.event.EventType.EVENT_TYPE_CORE_EVENT: {
                logger.info('核心事件: ' + JSON.stringify(data.toJSON()))
              }
            }
          })
        },
        ReverseStream: (grpc: grpc.ServerDuplexStream<kritor.event.EventStructure, kritor.event.RequestPushEvent>) => {
          const metadata = grpc.metadata.getMap()
          const { 'kritor-self-uid': uid, 'kritor-self-uin': uin } = metadata
          logger.debug('gRPC ', metadata)

          const bot = new AdapterKritor(grpc, uid as string, uin + '')
          this.BotMap.set(uid as string, bot)
          /** 注册bot */
          const index = listener.addBot({ type: bot.adapter.type, bot })
          if (index) bot.adapter.index = index
        },
      }

      this.#server.addService(coreProtoGrpcType.kritor.core.CoreService.service, authenticationServer)
      this.#server.addService(authenticationProtoGrpcType.kritor.authentication.AuthenticationService.service, authenticationServer)
      this.#server.addService(eventProtoGrpcType.kritor.event.EventService.service, authenticationServer)
      this.#server.addService(reverseProtoGrpcType.kritor.reverse.ReverseService.service, authenticationServer)
      this.#server.addService(messageProtoGrpcType.kritor.message.MessageService.service, authenticationServer)
      this.#server.addService(friendGrpcType.kritor.friend.FriendService.service, authenticationServer)
      this.#server.addService(groupGrpcType.kritor.group.GroupService.service, authenticationServer)
      this.#server.addService(guildGrpcType.kritor.guild.GuildService.service, authenticationServer)
      this.#server.addService(GroupFileGrpcType.kritor.file.GroupFileService.service, authenticationServer)
      this.#server.addService(customizationGrpcType.kritor.customization.CustomizationService.service, authenticationServer)
      this.#server.addService(developerGrpcType.kritor.developer.DeveloperService.service, authenticationServer)
      this.#server.addService(QsignGrpcType.kritor.developer.QsignService.service, authenticationServer)
      this.#server.addService(webGrpcType.kritor.web.WebService.service, authenticationServer)

      this.#server.bindAsync(config.Server.grpc.host, grpc.ServerCredentials.createInsecure(), (err) => {
        if (err) {
          logger.error('grpc服务器启动失败：', err)
        } else {
          logger.info('[服务器][启动成功][grpc]: ', logger.green(`http://${config.Server.grpc.host}`))
        }
      })

      listener.once('restart.grpc', () => {
        logger.mark('[服务器][重启][grpc] 正在重启grpc服务器...')
        this.#restart()
      })

      /** 关闭 gRPC 服务器 */
      listener.once('exit_grpc', () => this.#server.forceShutdown())
    } catch (error) {
      logger.error('初始化grpc服务器失败: ', error)
    }
  }

  /**
   * 重启 gRPC 服务器
   */
  async #restart () {
    this.#server.forceShutdown()
    /** 延迟1秒 */
    await common.sleep(1000)
    this.init()
  }

  /**
   *  scene contact转换器
   */
  KarinSceneContact (contact: kritor.common.IContact, sender: kritor.common.ISender) {
    /** scene映射表 */
    const sceneMap = {
      [kritor.common.Scene.GROUP]: Scene.Group,
      [kritor.common.Scene.FRIEND]: Scene.Private,
      [kritor.common.Scene.GUILD]: Scene.Guild,
      [kritor.common.Scene.NEARBY]: Scene.Nearby,
      [kritor.common.Scene.STRANGER]: Scene.Stranger,
      [kritor.common.Scene.STRANGER_FROM_GROUP]: Scene.StrangerFromGroup,
    }

    const roleMap = {
      [kritor.common.Role.OWNER]: Role.Owner,
      [kritor.common.Role.ADMIN]: Role.Admin,
      [kritor.common.Role.MEMBER]: Role.Member,
      [kritor.common.Role.UNKNOWN]: Role.Unknown,
    }

    /*
    0=群聊 1=私聊 2=频道 5=附近的人 6=陌生人 10=群临时会话
    0=group 1=friend 2=guild 5=nearby 6=stranger 10=stranger_from_group
    */
    const scene = sceneMap[contact.scene as kritor.common.Scene]
    const role = roleMap?.[sender.role as kritor.common.Role] || Role.Unknown

    return { scene, role }
  }

  /**
   * kritor 转 karin
   * @param data 消息数据
   */
  AdapterConvertKarin (data: Array<kritor.common.Element>): Array<KarinElement> {
    const elements: Array<KarinElement> = []
    for (const i of data) {
      switch (i.type) {
        /** 文本消息 */
        case kritor.common.Element.ElementType.TEXT: {
          const text = (i.text as kritor.common.ITextElement).text as string
          elements.push(segment.text(text))
          break
        }
        /** 艾特消息 */
        case kritor.common.Element.ElementType.AT: {
          const uid = (i.at as kritor.common.IAtElement).uid as string
          const uin = String((i.at as kritor.common.IAtElement).uin)
          elements.push(segment.at(uid, uin))
          break
        }
        /** 表情消息 */
        case kritor.common.Element.ElementType.FACE: {
          const face = (i.face as kritor.common.IFaceElement).id as number
          const is_big = (i.face as kritor.common.IFaceElement).is_big as boolean
          elements.push(segment.face(face, is_big))
          break
        }
        /** 图片消息 */
        case kritor.common.Element.ElementType.IMAGE: {
          const file_url = (i.image as kritor.common.IImageElement).file_url as string
          const typeMap = {
            [kritor.common.ImageElement.ImageType.COMMON]: 'show',
            [kritor.common.ImageElement.ImageType.ORIGIN]: 'original',
            [kritor.common.ImageElement.ImageType.FLASH]: 'flash',
          }
          const options = {
            file_type: typeMap[(i.image as kritor.common.ImageElement).file_type as kritor.common.ImageElement.ImageType] as 'show' | 'flash' | 'original',
            name: (i.image as kritor.common.IImageElement).file_name || '',
            md5: (i.image as kritor.common.IImageElement).file_md5 || '',
            sub_type: String((i.image as kritor.common.IImageElement).sub_type),
            width: undefined,
            height: undefined,
          }
          elements.push(segment.image(file_url, options))
          break
        }
        /** 弹射表情 */
        case kritor.common.Element.ElementType.BUBBLE_FACE: {
          const id = (i.bubble_face as kritor.common.IBubbleFaceElement).id as number
          const count = (i.bubble_face as kritor.common.IBubbleFaceElement).count as number
          elements.push(segment.bubble_face(id, count))
          break
        }
        /** 回复消息 */
        case kritor.common.Element.ElementType.REPLY: {
          const message_id = (i.reply as kritor.common.IReplyElement).message_id as string
          elements.push(segment.reply(message_id))
          break
        }
        /** 语音消息 */
        case kritor.common.Element.ElementType.VOICE: {
          const file = (i.voice as kritor.common.IVoiceElement).file_url as string
          const magic = (i.voice as kritor.common.IVoiceElement).magic as boolean
          const md5 = (i.voice as kritor.common.IVoiceElement).file_md5 as string
          const name = (i.voice as kritor.common.IVoiceElement).file_name as string
          elements.push(segment.record(file, magic, md5, name))
          break
        }
        /** 视频消息 */
        case kritor.common.Element.ElementType.VIDEO: {
          const file = (i.video as kritor.common.IVideoElement).file_url as string
          const md5 = (i.video as kritor.common.IVideoElement).file_md5 as string
          const name = (i.video as kritor.common.IVideoElement).file_name as string
          elements.push(segment.video(file, md5, name))
          break
        }
        /** 篮球消息 */
        case kritor.common.Element.ElementType.BASKETBALL: {
          const id = (i.basketball as kritor.common.IBasketballElement).id as number
          elements.push(segment.basketball(id))
          break
        }
        /** 骰子消息 */
        case kritor.common.Element.ElementType.DICE: {
          const id = (i.dice as kritor.common.IDiceElement).id as number
          elements.push(segment.dice(id))
          break
        }
        case kritor.common.Element.ElementType.RPS: {
          const id = (i.rps as kritor.common.IRpsElement).id as number
          elements.push(segment.rps(id))
          break
        }
        /** 戳一戳消息 */
        case kritor.common.Element.ElementType.POKE: {
          const id = (i.poke as kritor.common.IPokeElement).id as number
          const poke_type = (i.poke as kritor.common.IPokeElement).poke_type as number
          const strength = (i.poke as kritor.common.IPokeElement).strength as number
          elements.push(segment.poke(id, poke_type, strength))
          break
        }
        /** 音乐消息 */
        case kritor.common.Element.ElementType.MUSIC: {
          const id = (i.music as kritor.common.IMusicElement).id as string
          const custom = (i.music as kritor.common.IMusicElement).custom as kritor.common.ICustomMusicData
          const { url, audio, title, author, pic } = custom
          elements.push(segment.customMusic(url as string, audio as string, title as string, author as string, pic as string, id))
          break
        }
        /** 天气消息 */
        case kritor.common.Element.ElementType.WEATHER: {
          const city = (i.weather as kritor.common.IWeatherElement).city as string
          const code = (i.weather as kritor.common.IWeatherElement).code as string
          elements.push(segment.weather(city, code))
          break
        }
        /** 位置消息 */
        case kritor.common.Element.ElementType.LOCATION: {
          const lat = (i.location as kritor.common.ILocationElement).lat as number
          const lon = (i.location as kritor.common.ILocationElement).lon as number
          const title = (i.location as kritor.common.ILocationElement).title as string
          const address = (i.location as kritor.common.ILocationElement).address as string
          elements.push(segment.location(lat, lon, title, address))
          break
        }
        /** 链接分享 */
        case kritor.common.Element.ElementType.SHARE: {
          const url = (i.share as kritor.common.IShareElement).url as string
          const title = (i.share as kritor.common.IShareElement).title as string
          const content = (i.share as kritor.common.IShareElement).content as string
          const image = (i.share as kritor.common.IShareElement).image as string
          elements.push(segment.share(url, title, content, image))
          break
        }
        /** 礼物消息 只收不发 */
        case kritor.common.Element.ElementType.GIFT: {
          const qq = Number((i.gift as kritor.common.IGiftElement).qq)
          const id = Number((i.gift as kritor.common.IGiftElement).id)
          elements.push(segment.gift(qq, id))
          break
        }
        /** 转发消息 */
        case kritor.common.Element.ElementType.FORWARD: {
          const res_id = (i.forward as kritor.common.IForwardElement).res_id as string
          const uniseq = (i.forward as kritor.common.IForwardElement).uniseq as string
          const summary = (i.forward as kritor.common.IForwardElement).summary as string
          const description = (i.forward as kritor.common.IForwardElement).description as string
          elements.push(segment.forward(res_id, uniseq, summary, description))
          break
        }
        /** 文件消息 收不到 文件为通知事件 不走这里 */
        case kritor.common.Element.ElementType.FILE: {
          // const file_url = (i.file as kritor.common.IFileElement).file_url as string
          // elements.push(new KarinFileElement(i.file.file_url))
          break
        }
        /** JSON消息 */
        case kritor.common.Element.ElementType.JSON: {
          const json = (i.json as kritor.common.IJsonElement).json as string
          elements.push(segment.json(json))
          break
        }
        /** XML消息 */
        case kritor.common.Element.ElementType.XML: {
          const xml = (i.xml as kritor.common.IXmlElement).xml as string
          elements.push(segment.xml(xml))
          break
        }
        // 这都啥玩意啊...
        case kritor.common.Element.ElementType.MARKET_FACE:
        case kritor.common.Element.ElementType.CONTACT:
        case kritor.common.Element.ElementType.MARKDOWN:
        case kritor.common.Element.ElementType.KEYBOARD:
        default: {
          let { ...args } = i
          args = JSON.stringify(args) as any
          logger.warn(`未知消息类型 ${i.type} ${args}`)
          elements.push(segment.text(args as any))
        }
      }
    }

    return elements
  }
}
