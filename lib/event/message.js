import lodash from 'lodash'
import util from 'util'
import Event from './event.js'
import Review from './review.js'
import loader from '../plugins/loader.js'
import { Bot, Cfg, logger } from '#Karin'
import { stateArr } from '../plugins/plugin.js'

/** 消息事件 */
export default class Message extends Event {
  constructor (e) {
    super(e)
    Bot.emit('karin:count:recv', 1)
    /** 处理消息 保证日志的打印 */
    this.dealMsg()
    /** 事件处理 */
    if (this.review()) return

    /** 响应模式 */
    if (this.e.group_id && this.config.mode && !Review.mode(this.e, this.config)) {
      logger.debug('[消息拦截] 响应模式不匹配')
      return
    }
    /** 处理回复 */
    this.reply()
    /** 处理消息 */
    this.deal()
  }

  /**
   * 处理消息
   */
  async deal () {
    /** 上下文 */
    if (await this.context(this.e)) return

    /* eslint-disable no-labels */
    a:
    for (const app of loader.Apps) {
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
          if (!Review.PluginEnable(app, this.config)) continue

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
            Bot.emit('karin:count:fnc', this.e.logFnc)
            if (util.types.isPromise(res)) res = await res
            this.GroupMsgPrint && v.log(this.e.self_id, `${logFnc} ${lodash.truncate(this.e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
            if (res !== false) break a
          } catch (error) {
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
          // eslint-disable-next-line eqeqeq
          if (val.uid && val.uid == this.e.bot.account.uid) {
            this.e.atBot = true
            // eslint-disable-next-line eqeqeq
          } else if (val.uin == this.e.bot.account.uin) {
            this.e.atBot = true
          } else if (val.uid && val.uid === 'all') {
            this.e.atAll = true
          } else {
            this.e.at.push(val.uid || val.uin)
          }
          logs.push(`[at:${val.uid || val.uin}]`)
          break
        case 'rps':
          logs.push(`[rps:${val.id}]`)
          break
        case 'dice':
          logs.push(`[dice:${val.id}]`)
          break
        case 'shake':
          logs.push('[shake: 窗口抖动]')
          break
        case 'poke':
          logs.push(`[poke:${val.id}]`)
          break
        case 'anonymous':
          logs.push(`[anonymous:${val.id}]`)
          break
        case 'share':
          logs.push(`[share:${val.url}]`)
          break
        case 'contact':
          logs.push(`[contact:${val.id}]`)
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
          logs.push(`[forward:${val.id}]`)
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
            const content = { id: val.custom_template_id }
            for (const v of val.params) content[v.key] = v.values[0]
            logs.push(`[markdown:${JSON.stringify(content)}]`)
          }
          break
        }
        case 'rows': {
          const rows = []
          for (const v of val.rows) rows.push(v.log)
          logs.push(`[rows:${JSON.stringify(rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${val.log}]`)
          break
        default:
          logs.push(`[未知:${JSON.stringify(val)}]`)
      }
    }
    this.e.raw_message = logs.join('')

    /** 前缀处理 */
    this.e.group_id && Review.alias(this.e, this.config)

    /** 主人 */
    if (Cfg.master.includes(Number(this.e.user_id) || String(this.e.user_id))) {
      this.e.isMaster = true
      this.e.isAdmin = true
    } else if (Cfg.admin.includes(Number(this.e.user_id) || String(this.e.user_id))) {
      /** 管理员 */
      this.e.isAdmin = true
    }

    this.GroupMsgPrint = false
    if (this.e.contact.scene === 'friend') {
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
   * @returns {Promise<boolean>} 是否有上下文
   */
  async context () {
    const key = this.e.isGroup ? `${this.e.group_id}.${this.e.user_id}` : this.e.user_id
    const App = stateArr[key]
    if (App) {
      const { plugin, fnc } = App
      /** 计算插件处理时间 */
      const start = Date.now()
      let res
      if (fnc instanceof Function) {
        this.e.logFnc = `[${plugin.name}][function]`
        plugin.e = this.e
        res = fnc(this.e)
      } else {
        this.e.logFnc = `[${plugin.name}][${fnc}]`
        plugin.e = this.e
        res = plugin[fnc] && plugin[fnc](this.e)
      }
      if (util.types.isPromise(res)) res = await res
      logger.bot('mark', this.e.self_id, `${this.e.logFnc} 上下文处理完成 ${Date.now() - start}ms`)
      return true
    }
    return false
  }
}
