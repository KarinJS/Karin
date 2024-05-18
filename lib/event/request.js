import util from 'util'
import lodash from 'lodash'
import Event from './event.js'
import Review from './review.js'
import { Cfg, logger } from '#Karin'
import loader from '../plugins/loader.js'

/**
 * 请求事件
 */
export default class Request extends Event {
  constructor (e) {
    super(e)
    /** 事件处理 */
    if (this.review()) return
    /** 处理回复 */
    this.reply()
    /** 处理消息 */
    this.deal()
  }

  /**
   * 处理事件
   */
  async deal () {
    /** 主人 */
    if (Cfg.master.includes(Number(this.e.user_id) || String(this.e.user_id))) this.e.isMaster = true
    /** 管理员 */
    if (Cfg.admin.includes(Number(this.e.user_id) || String(this.e.user_id))) this.e.isAdmin = true
    this.GroupMsgPrint = false
    if (this.e.contact.scene === 'friend') {
      this.e.isPrivate = true
      this.e.logText = `[Private:${this.e.sender.nick || ''}(${this.e.user_id})]`
      logger.bot('info', this.e.self_id, `私聊请求事件：[${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'group') {
      this.e.isGroup = true
      this.e.logText = `[Group:${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      this.GroupMsgPrint = Review.GroupMsgPrint(this.e)
      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `群请求事件：[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知来源请求事件：${JSON.stringify(this.e)}`)
    }
    /* eslint-disable no-labels */
    a:
    for (const app of loader.Apps) {
      /** 判断事件 */
      if (app.event && !this.filtEvent(app.event)) continue

      /** accept hook */
      if (app.accept) {
        /** 检查黑白名单插件 */
        if (!Review.PluginEnable(app, this.config)) continue

        /** 日志方法字符串 */
        this.e.logFnc = `[${app.file.dir}][${app.name}][accept]`

        /** 判断权限 */
        if (!this.filterPermission(app.filterPermission)) break a

        try {
          /** 实例化 */
          const App = new app.App()
          App.e = this.e
          let res = App.accept && App.accept(this.e)

          /** 计算插件处理时间 */
          let start = Date.now()

          if (util.types.isPromise(res)) res = await res

          if (res !== false) {
            this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${this.e.logFnc} ${lodash.truncate(this.e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
            break a
          }
        } catch (error) {
          logger.error(`${this.e.logFnc}`)
          logger.error(error.stack)
          break a
        }
      }
    }
  }
}
