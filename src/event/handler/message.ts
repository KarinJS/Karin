import lodash from 'lodash'
import { review } from './review'
import { EventBaseHandler } from './base'
import { logger, config } from 'karin/utils'
import { listener, stateArr, pluginLoader } from 'karin/core'
import { KarinMessageType, PluginCommandInfoType } from 'karin/types'

/**
 * 消息事件
 */
export class MessageHandler extends EventBaseHandler {
  e: KarinMessageType
  constructor (e: KarinMessageType) {
    super(e)
    this.e = e
    const cd = this.getCd()
    this.init()
    if (!cd) return
    // todo: emit event

    if (this.e.group_id) {
      if (!this.getMode()) return
      if (!this.getGroupEnable()) return
      if (!this.getUserEnable()) return
    } else {
      if (!this.private()) return
    }

    /** 处理消息 */
    this.deal()
  }

  /**
   * 先对消息事件进行初始化
   */
  init () {
    listener.emit('karin:count:recv', 1)
    const logs = []
    for (const val of this.e.elements) {
      switch (val.type) {
        case 'text': {
          const msg = (val.text || '').replace(/^\s*[＃井#]+\s*/, '#').trim()
          this.e.msg += msg
          logs.push(msg)
          break
        }
        case 'face':
          logs.push(`[face:${val.id}]`)
          break
        case 'video':
          logs.push(`[video:${val.file}]`)
          break
        case 'record':
          this.e.record = val.file
          logs.push(`[record:${val.file}]`)
          break
        case 'image':
          this.e.image.push(val.file)
          logs.push(`[image:${val.file}]`)
          break
        case 'file':
          this.e.file = val
          logs.push(`[file:${val.file}]`)
          break
        case 'at':
          /** atBot不计入e.at */
          if (val.uid && val.uid === this.e.bot.account.uid) {
            this.e.atBot = true
          } else if (val.uin === this.e.bot.account.uin) {
            this.e.atBot = true
          } else if (val.uid && val.uid === 'all') {
            this.e.atAll = true
          } else {
            const id = (val.uid || val.uin) as string
            this.e.at.push(id)
          }
          logs.push(`[at:${val.uid || val.uin}]`)
          break
        case 'rps':
          logs.push(`[rps:${val.id}]`)
          break
        case 'dice':
          logs.push(`[dice:${val.id}]`)
          break
        case 'poke':
          logs.push(`[poke:${val.id}]`)
          break
        case 'share':
          logs.push(`[share:${val.url}]`)
          break
        case 'contact':
          logs.push(`[contact:${val.peer}]`)
          break
        case 'location':
          logs.push(`[location:${val.lat}-${val.lon}]`)
          break
        case 'music':
          logs.push(`[music:${JSON.stringify(val)}]`)
          break
        case 'reply':
          this.e.reply_id = val.message_id
          logs.push(`[reply:${val.message_id}]`)
          break
        case 'forward':
          logs.push(`[forward:${val.res_id}]`)
          break
        case 'xml':
          this.e.msg += val.data
          logs.push(`[xml:${val.data}]`)
          break
        case 'json':
          this.e.msg += val.data
          logs.push(`[json:${JSON.stringify(val.data)}]`)
          break
        case 'markdown': {
          logs.push(`[markdown:${val.content}]`)
          break
        }
        case 'markdown_tpl': {
          const params = val.params
          if (!params) break
          const content: {
            [key: string]: string
          } = { id: val.custom_template_id }
          for (const v of params) content[v.key] = v.values[0]
          logs.push(`[markdown_tpl:${JSON.stringify(content)}]`)
          break
        }
        case 'keyboard': {
          logs.push(`[rows:${JSON.stringify(val.rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${JSON.stringify(val.data)}]`)
          break
        case 'long_msg':
          logs.push(`[long_msg:${val.id}]`)
          break
        default:
          logs.push(`[未知:${JSON.stringify(val)}]`)
      }
    }

    this.e.raw_message = logs.join('')

    /** 主人 */
    if (config.master.includes(String(this.e.user_id))) {
      this.e.isMaster = true
      this.e.isAdmin = true
    } else if (config.admin.includes(String(this.e.user_id))) {
      /** 管理员 */
      this.e.isAdmin = true
    }

    if (this.e.contact.scene === 'friend') {
      this.e.isPrivate = true
      this.e.logText = `[Private:${this.e.sender.nick || ''}(${this.e.user_id})]`
      logger.bot('info', this.e.self_id, `私聊：[${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'group') {
      this.e.isGroup = true
      this.e.logText = `[Group:${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      this.GroupMsgPrint = review.GroupMsgPrint(this.e)
      /** 前缀处理 */
      this.e.group_id && review.alias(this.e, this.config)

      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `群消息：[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'guild') {
      this.e.isGuild = true
      this.e.logText = `[Guild:${this.e.contact.peer}-${this.e.contact.sub_peer}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      logger.bot('info', this.e.self_id, `频道消息：[${this.e.contact.peer}-${this.e.contact.sub_peer}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知消息：${JSON.stringify(this.e)}`)
    }

    logs.length = 0
    this.reply()
  }

  /**
   * 响应模式检查 返回false表示未通过
   */
  getMode () {
    if (review.mode(this.e, this.config)) return true
    logger.debug(`[消息拦截][${this.e.group_id}][${this.e.user_id}] 响应模式不匹配`)
    return false
  }

  /**
   * 打印
   */
  print () {

  }

  /**
   * 处理消息
   */
  async deal () {
    /** 上下文 */
    if (await this.context()) return

    const app = this.e.group_id
      ? (info: PluginCommandInfoType) => review.PluginEnable(info, this.config)
      : () => true

    for (const info of pluginLoader.command) {
      /** 判断事件 */
      if (!this.filtEvent(info.event)) continue

      const reg = info.reg
      if (reg.test(this.e.msg)) {
        /** 检查黑白名单插件 */
        if (!app(info)) continue

        /** 判断子事件 */
        if (!this.filtEvent(info.event)) continue

        this.e.logFnc = `[${info.name}][${info.fnname}]`
        const logFnc = logger.fnc(this.e.logFnc)
        this.GroupMsgPrint && info.log(this.e.self_id, `${logFnc}${this.e.logText} ${lodash.truncate(this.e.msg, { length: 80 })}`)

        /** 判断权限 */
        if (!this.filterPermission(info.perm)) continue

        /** 计算插件处理时间 */
        const start = Date.now()
        listener.emit('karin:count:fnc', this.e.logFnc)

        try {
          let res
          if (info.type === 'function') {
            res = await info.fn(this.e)
          } else {
            const Fnc = info.data as any
            const app = new Fnc()
            app.e = this.e
            res = await info.fn.call(app, this.e)
          }

          this.GroupMsgPrint && info.log(this.e.self_id, `${logFnc} ${lodash.truncate(this.e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
          if (res !== false) continue
          return
        } catch (error: any) {
          logger.error(`${this.e.logFnc}`)
          logger.error(error.stack || error.message || JSON.stringify(error))
          return
        }
      }
    }
  }

  /**
   * 处理上下文
   */
  async context (): Promise<boolean> {
    const key = this.e.isGroup ? `${this.e.group_id}.${this.e.user_id}` : this.e.user_id
    const App = stateArr[key]
    if (App) {
      switch (App.type) {
        case 'ctx': {
          listener.emit(`ctx:${key}`, this.e)
          delete stateArr[key]
          return true
        }
        case 'class': {
          const { fnc, name } = App
          this.e.logFnc = `[${fnc.name}][${name}]`
          /** 计算插件处理时间 */
          const start = Date.now()
          fnc.e = this.e
          await (fnc[name as keyof typeof fnc] as Function)()
          logger.bot('mark', this.e.self_id, `${this.e.logFnc} 上下文处理完成 ${Date.now() - start}ms`)
          return true
        }
        case 'fnc': {
          const { fnc } = App
          this.e.logFnc = `[${fnc.name}]`
          /** 计算插件处理时间 */
          const start = Date.now()
          await fnc(this.e)
          logger.bot('mark', this.e.self_id, `${this.e.logFnc} 上下文处理完成 ${Date.now() - start}ms`)
          delete stateArr[key]
          return true
        }
      }
    }
    return false
  }
}
