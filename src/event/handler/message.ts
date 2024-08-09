import lodash from 'lodash'
import { review } from './review'
import { EventBaseHandler } from './base'
import { logger, config } from 'karin/utils'
import { KarinMessageType, NewMessagePlugin } from 'karin/types'
import { listener, stateArr, pluginLoader } from 'karin/core'

/**
 * 消息事件
 */
export class MessageHandler extends EventBaseHandler {
  e: KarinMessageType
  /**
   * - 是否打印群消息日志
   */
  GroupMsgPrint: boolean = true
  constructor (e: KarinMessageType) {
    super(e)
    this.e = e
    listener.emit('karin:count:recv', 1)
    /** 处理消息 保证日志的打印 */
    this.dealMsg()
    /** 事件处理 */
    if (this.review()) return

    /** 响应模式 */
    if (this.e.group_id && 'mode' in this.config && this.config.mode && !review.mode(this.e, this.config)) {
      logger.debug('[消息拦截] 响应模式不匹配')
      return
    }
    /** 处理回复 */
    this.reply()
    /** 处理私聊 */
    if (!this.private()) return
    /** 处理消息 */
    this.deal()
  }

  /**
   * 处理消息
   */
  async deal () {
    /** 上下文 */
    if (await this.context()) return

    /* eslint-disable no-labels */
    a: for (const index of pluginLoader.ruleIds) {
      const app = pluginLoader.PluginList[index]
      /** 判断事件 */
      if (app.event && !this.filtEvent(app.event)) continue

      /** 正则匹配 */
      for (const v of app.rule) {
        const reg = v.reg as RegExp
        if (reg.test(this.e.msg)) {
          /** 检查黑白名单插件 */
          if ('GroupCD' in this.config && !review.PluginEnable(app, this.config)) continue

          /** 判断子事件 */
          if (v.event && !this.filtEvent(v.event)) continue

          const fncName = app.file.type === 'function' ? 'default' : v.fnc
          this.e.logFnc = `[${app.file.dir}][${app.name}][${fncName}]`
          const logFnc = logger.fnc(`[${app.name}][${fncName}]`)
          this.GroupMsgPrint && typeof v.log === 'function' && v.log(this.e.self_id, `${logFnc}${this.e.logText} ${lodash.truncate(this.e.msg, { length: 80 })}`)

          /** 判断权限 */
          if (!this.filterPermission(v.permission)) break a

          /** 计算插件处理时间 */
          const start = Date.now()
          listener.emit('karin:count:fnc', this.e.logFnc)

          try {
            let res
            if (app.file.type === 'function' && typeof v.fnc === 'function') {
              res = await v.fnc(this.e)
            } else {
              const cla = new (app.file.Fnc as NewMessagePlugin)(this.e)
              cla.e = this.e
              res = await (cla[v.fnc as keyof typeof cla] as Function)(this.e) as Promise<boolean>
            }

            this.GroupMsgPrint && typeof v.log === 'function' && v.log(this.e.self_id, `${logFnc} ${lodash.truncate(this.e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
            if (res !== false) break a
          } catch (error: any) {
            logger.error(`${this.e.logFnc}`)
            logger.error(error.stack || error.message || JSON.stringify(error))
            break a
          }
        }
      }
    }
  }

  /**
   * 处理消息体
   */
  dealMsg () {
    const logs = []
    for (const val of this.e.elements) {
      switch (val.type) {
        case 'text': {
          const msg = (val.text || '').replace(/^\s*[＃井#]+\s*/, '#').replace(/^\s*[\\*※＊]+\s*/, '*').trim()
          this.e.msg += msg
          /** 美观一点... */
          logs.push(msg)
          break
        }
        case 'face':
          logs.push(`[face:${val.id}]`)
          break
        case 'video':
        case 'record':
          logs.push(`[${val.type}:${val.file}]`)
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

    /** 前缀处理 */
    this.e.group_id && 'GroupCD' in this.config && review.alias(this.e, this.config)

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
      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `群消息：[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知消息：${JSON.stringify(this.e)}`)
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
