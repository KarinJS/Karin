// import fs from 'node:fs'
import { AdapterBase } from '../base'
import { createFriendMessage, createGroupMessage } from '@/event'
import { karin } from '@/karin'
import { listeners } from '@/internal/listeners'
import { randomUUID } from 'crypto'
import { type ElementTypes, segment } from '@/adapter/segment'
import type { AdapterType, SendMsgResults } from '@/adapter/adapter'
import type { Contact } from '@/adapter/contact'

// const { enable, msgToFile, token: oldToken, ip } = config.Config.AdapterInput

/**
 * 控制台交互适配器
 * @class AdapterInput
 */
export class AdapterInput extends AdapterBase implements AdapterType {
  constructor () {
    super()
    listeners.on('karin:adapter:open', () => process.stdin.on('data', data => this.createEvent(data)))
    listeners.on('karin:adapter:close', () => process.stdin.removeAllListeners('data'))

    this.account.name = 'input'
    this.account.selfId = 'input'
    this.account.avatar = 'https://p.qlogo.cn/gh/967068507/967068507/0'
    listeners.emit('karin:adapter:open')
  }

  get selfId () {
    return this.account.selfId
  }

  createEvent (data: Buffer) {
    const text = data.toString().trim()
    const seq = Math.floor(Math.random() * 1000000000)
    const time = Date.now()
    /** 如果带`group`前缀 则视为群环境 */
    if (text.startsWith('group')) {
      const contact = karin.contactGroup('967068507')
      createGroupMessage({
        bot: this,
        contact,
        elements: [segment.text(text.replace(/^group/, '').trim())],
        eventId: `input.${time}`,
        messageId: `input.${time}`,
        messageSeq: seq,
        rawEvent: { data },
        selfId: 'input',
        sender: karin.senderUnknown('3889021886'),
        time,
        srcReply: (elements) => this.sendMsg(contact, elements),
        subEvent: 'group',
        userId: '3889021886',
      })
      return
    }

    const contact = karin.contactFriend('3889021886')
    createFriendMessage({
      bot: this,
      contact,
      elements: [segment.text(text.replace(/^group/, '').trim())],
      eventId: `input.${time}`,
      messageId: `input.${time}`,
      messageSeq: seq,
      rawEvent: { data },
      selfId: 'input',
      sender: karin.senderUnknown('3889021886'),
      time,
      srcReply: (elements) => this.sendMsg(contact, elements),
      subEvent: 'friend',
      userId: '3889021886',
    })
  }

  async sendMsg (contact: Contact, elements: Array<ElementTypes>, retryCount?: number): Promise<SendMsgResults> {
    const result: SendMsgResults = {
      messageId: randomUUID(),
      messageTime: Date.now(),
      rawData: {},
    }

    if (contact.scene === 'group') {
      logger.info(`Send group message: ${JSON.stringify(elements)}`)
    } else {
      logger.info(`Send private message: ${JSON.stringify(elements)}`)
    }

    return result
  }

  // stdin () {
  //   if (oldToken === 'AdapterInput') {
  //     try {
  //       this.token = randomUUID()
  //       const yaml = new YamlEditor('./config/config/config.yaml')
  //       const data = yaml.get('AdapterInput')
  //       if (!data) {
  //         const yaml1 = new YamlEditor('./config/defSet/config.yaml')
  //         const data1 = yaml1.get('AdapterInput')
  //         data1.token = this.token
  //         yaml.set('AdapterInput', data1)
  //       } else {
  //         data.token = this.token
  //         yaml.set('AdapterInput', data)
  //       }

  //       yaml.save()
  //     } catch (e) {
  //       logger.error('AdapterInput token更换失败，请手动更换token')
  //     }
  //   }

  //   // 清空文件夹
  //   fs.readdirSync('./temp/input').forEach((file) => {
  //     fs.unlinkSync(`./temp/input/${file}`)
  //   })

  //   // 等1秒
  //   common.sleep(1000)
  //     .then(() => {
  //       /** 注册bot */
  //       const index = listener.addBot({ bot: this, type: this.adapter.type })
  //       if (index) this.adapter.index = index
  //     })
  //   return this
  // }

  // init () {
  //   process.stdin.on('data', data => this.#input(data.toString()))
  //   process.once('stdin.close', () => {
  //     process.stdin.removeAllListeners('data')
  //     process.stdin.once('stdin.open', () => this.init())
  //   })
  // }

  // logger (level: LoggerLevel, ...args: any[]) {
  //   logger.bot(level, this.account.uid || this.account.uin, ...args)
  // }

  // async #input (elements: string) {
  //   const message = {
  //     event: EventType.Message as EventType.Message,
  //     sub_event: MessageSubType.PrivateMessage as MessageSubType.PrivateMessage,
  //     event_id: `input.${Date.now()}`,
  //     self_id: 'input',
  //     user_id: 'input',
  //     time: Date.now(),
  //     message_id: `input.${Date.now()}`,
  //     message_seq: 0,
  //     sender: {
  //       uid: 'input',
  //       uin: 'input',
  //       nick: 'input',
  //       role: Role.Unknown as Role.Unknown,
  //     },
  //     elements: [{ type: 'text', text: elements }] as KarinElement[],
  //     contact: {
  //       scene: Scene.Private as Scene.Private,
  //       peer: 'input',
  //       sub_peer: null,
  //     },
  //     raw_event: { data: elements },
  //   }

  //   const e = new KarinMessage(message)
  //   e.bot = this
  //   e.replyCallback = async elements => {
  //     this.SendMessage(e.contact, elements)
  //     return { message_id: e.message_id, message_time: Date.now(), raw_data: elements }
  //   }

  //   listener.emit('adapter.message', e)
  // }

  // async #MsgToFile (type: 'image' | 'record', file: Buffer | string): Promise<string> {
  //   if (!msgToFile) return ''

  //   // 判断是否为string 如果是则继续判断是否为url、path
  //   if (typeof file === 'string') {
  //     if (file.startsWith('http')) return file
  //     if (common.exists(file)) return file
  //   }

  //   const buffer = await common.buffer(file)
  //   // 生成文件名 根据type生成不同的文件后缀
  //   const name = `${Date.now()}.${type === 'image' ? 'jpg' : type === 'record' ? 'mp3' : 'file'}`
  //   fs.writeFileSync(`./temp/input/${name}`, buffer)
  //   return `[${type === 'image' ? '图片' : '语音'}: http://${ip}:${config.Server.http.port}/api/input?name=${name}&token=${this.token} ]`
  // }

  // async GetVersion () {
  //   const data = this.version
  //   delete (data as { name?: string }).name
  //   return data
  // }

  // async SendMessage (_contact: Contact, elements: Array<KarinElement>) {
  //   const text = []
  //   for (const v of elements) {
  //     switch (v.type) {
  //       case 'at':
  //         text.push(`@${v.uid}`)
  //         break
  //       case 'face':
  //         text.push(`[表情:${v.id}]`)
  //         break
  //       case 'text':
  //         text.push(v.text)
  //         break
  //       case 'image':
  //       case 'record':
  //         text.push(await this.#MsgToFile(v.type, v.file))
  //         break
  //       default:
  //         text.push(`[未知消息类型:${JSON.stringify(v)}]`)
  //     }
  //   }
  //   this.logger('info', `${logger.green('Send private input: ')}${text.join('').replace(/\n/g, '\\n')}`)
  //   return { message_id: 'input' }
  // }

  // async getAvatarUrl () {
  //   return 'https://p.qlogo.cn/gh/967068507/967068507/0'
  // }

  // async getGroupAvatarUrl () {
  //   return 'https://p.qlogo.cn/gh/967068507/967068507/0'
  // }

  // async GetCurrentAccount () {
  //   return { account_uid: 'input', account_uin: 'input', account_name: 'input' }
  // }

  // GetEssenceMessageList (): Promise<any> { throw new Error('Method not implemented.') }
  // DownloadForwardMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // SetEssenceMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // DeleteEssenceMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // SetFriendApplyResult (): Promise<any> { throw new Error('Method not implemented.') }
  // SetGroupApplyResult (): Promise<any> { throw new Error('Method not implemented.') }
  // SetInvitedJoinGroupResult (): Promise<any> { throw new Error('Method not implemented.') }
  // ReactMessageWithEmoji (): Promise<any> { throw new Error('Method not implemented.') }
  // UploadPrivateFile (): Promise<any> { throw new Error('Method not implemented.') }
  // UploadGroupFile (): Promise<any> { throw new Error('Method not implemented.') }
  // UploadForwardMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // sendForwardMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // SendMessageByResId (): Promise<any> { throw new Error('Method not implemented.') }
  // RecallMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // GetMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // GetHistoryMessage (): Promise<any> { throw new Error('Method not implemented.') }
  // VoteUser (): Promise<any> { throw new Error('Method not implemented.') }
  // KickMember (): Promise<any> { throw new Error('Method not implemented.') }
  // BanMember (): Promise<any> { throw new Error('Method not implemented.') }
  // SetGroupWholeBan (): Promise<any> { throw new Error('Method not implemented.') }
  // SetGroupAdmin (): Promise<any> { throw new Error('Method not implemented.') }
  // ModifyMemberCard (): Promise<any> { throw new Error('Method not implemented.') }
  // ModifyGroupName (): Promise<any> { throw new Error('Method not implemented.') }
  // LeaveGroup (): Promise<any> { throw new Error('Method not implemented.') }
  // SetGroupUniqueTitle (): Promise<any> { throw new Error('Method not implemented.') }
  // GetStrangerProfileCard (): Promise<any> { throw new Error('Method not implemented.') }
  // GetFriendList (): Promise<any> { throw new Error('Method not implemented.') }
  // GetGroupInfo (): Promise<any> { throw new Error('Method not implemented.') }
  // GetGroupList (): Promise<any> { throw new Error('Method not implemented.') }
  // GetGroupMemberInfo (): Promise<any> { throw new Error('Method not implemented.') }
  // GetGroupMemberList (): Promise<any> { throw new Error('Method not implemented.') }
  // GetGroupHonor (): Promise<any> { throw new Error('Method not implemented.') }
  // DownloadFile (): Promise<any> { throw new Error('Method not implemented.') }
  // CreateFolder (): Promise<any> { throw new Error('Method not implemented.') }
  // RenameFolder (): Promise<any> { throw new Error('Method not implemented.') }
  // DeleteFolde (): Promise<any> { throw new Error('Method not implemented.') }
  // DeleteFolder (): Promise<any> { throw new Error('Method not implemented.') }
  // UploadFile (): Promise<any> { throw new Error('Method not implemented.') }
  // DeleteFile (): Promise<any> { throw new Error('Method not implemented.') }
  // GetFileSystemInfo (): Promise<any> { throw new Error('Method not implemented.') }
  // GetFileList (): Promise<any> { throw new Error('Method not implemented.') }
  // ModifyGroupRemark (): Promise<any> { throw new Error('Method not implemented.') }
  // GetRemainCountAtAll (): Promise<any> { throw new Error('Method not implemented.') }
  // GetProhibitedUserList (): Promise<any> { throw new Error('Method not implemented.') }
  // PokeMember (): Promise<any> { throw new Error('Method not implemented.') }
  // SetMessageReaded (): Promise<any> { throw new Error('Method not implemented.') }
}

export const inputAdapter = new AdapterInput()
