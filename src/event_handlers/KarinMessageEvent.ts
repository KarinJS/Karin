import util from 'util'
import lodash from 'lodash'
import Review from './review'
import Config from '../core/Config'
import logger from '../core/Logger'
import loader from '../plugins/loader'
import Listener from '../core/Listener'
import { stateArr } from '../core/Plugin'
import KarinBaseEvent from './KarinBaseEvent'
import { KarinMessage } from './../event/KarinMessage'

/** 消息事件 */
export default class Message extends KarinBaseEvent {
  e!: KarinMessage
  /**
   * - 是否打印群消息日志
   */
  GroupMsgPrint: boolean = false
  constructor(e: KarinMessage) {
    super(e)
    Listener.emit('karin:count:recv', 1)
    /** 处理消息 保证日志的打印 */
    this.dealMsg()
    /** 事件处理 */
    if (this.review()) return

    /** 响应模式 */
    if (this.e.group_id && 'mode' in this.config && this.config.mode && !Review.mode(this.e, this.config)) {
      logger.debug('[消息拦截] 响应模式不匹配')
      return
    }
    this.GroupMsgPrint = false
    /** 处理回复 */
    this.reply()
    /** 处理消息 */
    this.deal()
  }

  /**
   * 处理消息
   */
  async deal() {
    /** 上下文 */
    if (await this.context()) return

    /* eslint-disable no-labels */
    a: for (const app of loader.Apps) {
      /** 判断事件 */
      if (app.event && !this.filtEvent(app.event)) continue

      /** 判断权限 */
      if (!this.filterPermission(app.permission)) break a

      /** 正则匹配 */
      for (const v of app.rule) {
        /** 这里的lastIndex是为了防止正则无法从头开始匹配 */
        v.reg.lastIndex = 0
        if (v.reg.test(this.e.msg)) {
          /** 检查黑白名单插件 */
          if ('GroupCD' in this.config && !Review.PluginEnable(app, this.config)) continue

          /** 判断子事件 */
          if (v.event && !this.filtEvent(v.event)) continue

          this.e.logFnc = `[${app.file.dir}][${app.name}][${v.fnc}]`
          const logFnc = logger.fnc(`[${app.name}][${v.fnc}]`)
          this.GroupMsgPrint && v.log(this.e.self_id, `${logFnc}${this.e.logText} ${lodash.truncate(this.e.msg, { length: 80 })}`)

          /** 判断权限 */
          if (!this.filterPermission(v.permission)) break a

          try {
            /**
             * 插件对象
             * @param {any} App - 插件对象
             * @param {EventType.Message} App.e - 事件对象
             */
            const App = new app.App()
            App.e = this.e
            let res = App[v.fnc] && App[v.fnc](this.e)

            /** 计算插件处理时间 */
            const start = Date.now()
            Listener.emit('karin:count:fnc', this.e.logFnc)
            if (util.types.isPromise(res)) res = await res
            this.GroupMsgPrint && v.log(this.e.self_id, `${logFnc} ${lodash.truncate(this.e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
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
  dealMsg() {
    const logs = []
    for (const val of this.e.elements) {
      switch (val.type) {
        case 'text': {
          const msg = (val.text || '')
            .replace(/^\s*[＃井#]+\s*/, '#')
            .replace(/^\s*[\\*※＊]+\s*/, '*')
            .trim()
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
          // eslint-disable-next-line eqeqeq
          if (val.uid && val.uid == this.e.bot.account.uid) {
            this.e.atBot = true
            // eslint-disable-next-line eqeqeq
          } else if (val.uin == this.e.bot.account.uin) {
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
        case 'node':
          logs.push(`[node:${JSON.stringify(val)}]`)
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
          if (val.content) {
            logs.push(`[markdown:${val.markdown}]`)
          } else {
            const content: { [key: string]: string } = { id: val.custom_template_id }
            for (const v of val.params) content[v.key] = v.values[0]
            logs.push(`[markdown:${JSON.stringify(content)}]`)
          }
          break
        }
        case 'rows': {
          const rows = []
          for (const v of val.rows) rows.push(JSON.stringify(v.data))
          logs.push(`[rows:${JSON.stringify(rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${JSON.stringify(val.data)}]`)
          break
        default:
          logs.push(`[未知:${JSON.stringify(val)}]`)
      }
    }
    this.e.raw_message = logs.join('')

    /** 前缀处理 */
    this.e.group_id && 'GroupCD' in this.config && Review.alias(this.e, this.config)

    /** 主人 这里强制是因为yaml在自动保存QQ号的时候会强制化为数字 */
    const masterId = (Number(this.e.user_id) || String(this.e.user_id)) as string
    if (Config.master.includes(masterId)) {
      this.e.isMaster = true
      this.e.isAdmin = true
    } else if (Config.admin.includes(masterId)) {
      /** 管理员 */
      this.e.isAdmin = true
    }

    this.GroupMsgPrint = false
    if (this.e.contact.scene === 'private') {
      this.e.isPrivate = true
      this.e.logText = `[Private:${this.e.sender.nick || ''}(${this.e.user_id})]`
      logger.bot('info', this.e.self_id, `私聊：[${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'group') {
      this.e.isGroup = true
      this.e.logText = `[Group:${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      this.GroupMsgPrint = Review.GroupMsgPrint(this.e)
      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `群消息：[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知消息：${JSON.stringify(this.e)}`)
    }
  }

  /**
   * 处理上下文
   */
  async context(): Promise<boolean> {
    const key = this.e.isGroup ? `${this.e.group_id}.${this.e.user_id}` : this.e.user_id
    const App = stateArr[key]
    if (App) {
      const { plugin, fnc } = App
      this.e.logFnc = `[${plugin.name}][${fnc}]`
      /** 计算插件处理时间 */
      const start = Date.now()
      plugin.e = this.e
      const result = fnc in plugin && plugin[fnc as keyof typeof plugin](this.e)
      if (util.types.isPromise(result)) await result
      logger.bot('mark', this.e.self_id, `${this.e.logFnc} 上下文处理完成 ${Date.now() - start}ms`)
      return true
    }
    return false
  }
}
