import fs from 'fs'
import { randomUUID } from 'crypto'
import { listener } from 'karin/core'
import { KarinMessage } from 'karin/event'
import { KarinAdapter } from 'karin/types/adapter'
import { contact, KarinElement } from 'karin/types'
import { config, common, YamlEditor, logger } from 'karin/utils'

const { enable, msgToFile, token: oldToken, ip } = config.Config.AdapterInput

/**
 * - 标准输入输出适配器
 */
export class AdapterInput implements KarinAdapter {
  token: string
  socket!: WebSocket
  account: KarinAdapter['account']
  adapter: KarinAdapter['adapter']
  version: KarinAdapter['version']
  constructor () {
    this.token = oldToken
    this.account = { uid: 'input', uin: 'input', name: 'input' }
    this.adapter = { id: 'shell', name: 'input', type: 'internal', sub_type: 'internal', start_time: Date.now(), connect: '', index: 0 }
    this.version = { name: 'input', app_name: 'input', version: '1.0.0' }
  }

  get self_id () {
    return this.account.uid
  }

  stdin () {
    if (oldToken === 'AdapterInput') {
      try {
        this.token = randomUUID()
        const yaml = new YamlEditor('./config/config/config.yaml')
        const data = yaml.get('AdapterInput')
        if (!data) {
          const yaml1 = new YamlEditor('./config/defSet/config.yaml')
          const data1 = yaml1.get('AdapterInput')
          data1.token = this.token
          yaml.set('AdapterInput', data1)
        } else {
          data.token = this.token
          yaml.set('AdapterInput', data)
        }

        yaml.save()
      } catch (e) {
        logger.error('AdapterInput token更换失败，请手动更换token')
      }
    }

    // 清空文件夹
    fs.readdirSync('./temp/input').forEach((file) => {
      fs.unlinkSync(`./temp/input/${file}`)
    })

    /** 注册bot */
    const index = listener.addBot({ bot: this, type: this.adapter.type })
    if (index) this.adapter.index = index
    return this
  }

  init () {
    process.stdin.on('data', data => this.#input(data.toString()))
    process.once('stdin.close', () => {
      process.stdin.removeAllListeners('data')
      process.stdin.once('stdin.open', () => this.init())
    })
  }

  logger (level: 'info' | 'error' | 'trace' | 'debug' | 'mark' | 'warn' | 'fatal', ...args: any[]) {
    logger.bot(level, this.account.uid || this.account.uin, ...args)
  }

  async #input (elements: string) {
    const message = {
      event: 'message' as 'message' | 'message_sent',
      event_id: `input.${Date.now()}`,
      self_id: 'input',
      user_id: 'input',
      time: Date.now(),
      message_id: `input.${Date.now()}`,
      message_seq: '',
      sender: {
        uid: 'input',
        uin: 'input',
        nick: 'input',
        role: 'member' as 'member',
      },
      elements: [{ type: 'text', text: elements }] as KarinElement[],
      contact: {
        scene: 'friend' as 'friend',
        peer: 'input',
        sub_peer: '',
      },
      group_id: '',
      raw_message: elements,
    }

    const e = new KarinMessage(message)
    e.bot = this
    e.replyCallback = async elements => {
      this.SendMessage(e.contact, elements)
      return { message_id: e.message_id }
    }

    listener.emit('message', e)
  }

  async #MsgToFile (type: 'image' | 'voice', file: Uint8Array | string): Promise<string> {
    if (!msgToFile) return ''

    // 判断是否为string 如果是则继续判断是否为url、path
    if (typeof file === 'string') {
      if (file.startsWith('http')) return file
      if (common.exists(file)) return file
    }

    const buffer = await common.buffer(file) as Uint8Array
    // 生成文件名 根据type生成不同的文件后缀
    const name = `${Date.now()}.${type === 'image' ? 'jpg' : type === 'voice' ? 'mp3' : 'file'}`
    fs.writeFileSync(`./temp/input/${name}`, buffer)
    return `[${type === 'image' ? '图片' : '语音'}: http://${ip}:${config.Server.http.port}/api/input?name=${name}&token=${this.token} ]`
  }

  async GetVersion () {
    const data = this.version
    delete (data as { name?: string }).name
    return data
  }

  async SendMessage (_contact: contact, elements: Array<KarinElement>) {
    const text = []
    for (const v of elements) {
      switch (v.type) {
        case 'at':
          text.push(`@${v.uid}`)
          break
        case 'face':
          text.push(`[表情:${v.id}]`)
          break
        case 'text':
          text.push(v.text)
          break
        case 'image':
        case 'voice':
          text.push(await this.#MsgToFile(v.type, v.file))
          break
        default:
          text.push(`[未知消息类型:${JSON.stringify(v)}]`)
      }
    }
    this.logger('info', `${logger.green('Send private input: ')}${text.join('')}`)
    return { message_id: 'input' }
  }

  getAvatarUrl () {
    return 'https://p.qlogo.cn/gh/967068507/967068507/0'
  }

  getGroupAvatar () {
    return 'https://p.qlogo.cn/gh/967068507/967068507/0'
  }

  async GetCurrentAccount () {
    return { account_uid: 'input', account_uin: 'input', account_name: 'input' }
  }

  async GetEssenceMessageList (): Promise<any> { throw new Error('Method not implemented.') }
  async DownloadForwardMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async SetEssenceMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async DeleteEssenceMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async SetFriendApplyResult (): Promise<any> { throw new Error('Method not implemented.') }
  async SetGroupApplyResult (): Promise<any> { throw new Error('Method not implemented.') }
  async SetInvitedJoinGroupResult (): Promise<any> { throw new Error('Method not implemented.') }
  async ReactMessageWithEmoji (): Promise<any> { throw new Error('Method not implemented.') }
  async UploadPrivateFile (): Promise<any> { throw new Error('Method not implemented.') }
  async UploadGroupFile (): Promise<any> { throw new Error('Method not implemented.') }
  async UploadForwardMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async sendForwardMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async SendMessageByResId (): Promise<any> { throw new Error('Method not implemented.') }
  async RecallMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async GetMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async GetHistoryMessage (): Promise<any> { throw new Error('Method not implemented.') }
  async VoteUser (): Promise<any> { throw new Error('Method not implemented.') }
  async KickMember (): Promise<any> { throw new Error('Method not implemented.') }
  async BanMember (): Promise<any> { throw new Error('Method not implemented.') }
  async SetGroupWholeBan (): Promise<any> { throw new Error('Method not implemented.') }
  async SetGroupAdmin (): Promise<any> { throw new Error('Method not implemented.') }
  async ModifyMemberCard (): Promise<any> { throw new Error('Method not implemented.') }
  async ModifyGroupName (): Promise<any> { throw new Error('Method not implemented.') }
  async LeaveGroup (): Promise<any> { throw new Error('Method not implemented.') }
  async SetGroupUniqueTitle (): Promise<any> { throw new Error('Method not implemented.') }
  async GetStrangerProfileCard (): Promise<any> { throw new Error('Method not implemented.') }
  async GetFriendList (): Promise<any> { throw new Error('Method not implemented.') }
  async GetGroupInfo (): Promise<any> { throw new Error('Method not implemented.') }
  async GetGroupList (): Promise<any> { throw new Error('Method not implemented.') }
  async GetGroupMemberInfo (): Promise<any> { throw new Error('Method not implemented.') }
  async GetGroupMemberList (): Promise<any> { throw new Error('Method not implemented.') }
  async GetGroupHonor (): Promise<any> { throw new Error('Method not implemented.') }
}

if (enable) new AdapterInput().stdin().init()
