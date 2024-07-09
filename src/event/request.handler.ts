import { review } from './review.handler'
import EventHandler from './event.handler'
import { logger, config } from 'karin/utils'
import { KarinRequestType, RequestSubType } from 'karin/types'
import { ExtendedPlugin, pluginLoader } from 'karin/core'

/**
 * 请求事件
 */
export default class RequestHandler extends EventHandler {
  e: KarinRequestType
  constructor (e: KarinRequestType) {
    super(e)
    this.e = e
    /** 事件处理 */
    if (this.review()) return
    /** 处理回复 */
    this.reply()
    /** raw */
    this.raw_message()
    /** 处理消息 */
    this.deal()
  }

  /**
   * 处理事件
   */
  async deal () {
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
      logger.bot('info', this.e.self_id, `${logger.green('私聊请求: ')}[${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'group') {
      this.e.isGroup = true
      this.e.logText = `[Group:${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      this.GroupMsgPrint = review.GroupMsgPrint(this.e)
      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${logger.green('群请求: ')}[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知来源请求事件：${JSON.stringify(this.e)}`)
    }

    /* eslint-disable no-labels */
    a:
    for (const index of pluginLoader.acceptIds) {
      const app = pluginLoader.PluginList[index]
      /** 判断事件 */
      if (!this.filtEvent(app.event)) continue

      /** 检查黑白名单插件 */
      if ('GroupCD' in this.config && !review.PluginEnable(app, this.config)) continue

      /** 日志方法字符串 */
      this.e.logFnc = `[${app.file.dir}][${app.name}][accept]`
      const logFnc = logger.fnc(`[${app.name}][accept]`)

      /** 计算插件处理时间 */
      const start = Date.now()

      let res

      try {
        if (typeof app.accept === 'function') {
          res = await app.accept(this.e)
        } else {
          const cla = new (app.file.Fnc as unknown as new () => ExtendedPlugin)()
          if (!cla.accept || typeof cla.accept !== 'function') continue
          (cla.e) = this.e
          res = await cla.accept(this.e)
        }

        if (res !== false) {
          this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
          break a
        }
      } catch (error: any) {
        logger.error(`${logFnc}`)
        logger.error(error.stack || error.message || JSON.stringify(error))
        break a
      }
    }
  }

  /**
   * 构建原始消息
   */
  raw_message () {
    switch (this.e.sub_event) {
      /** 好友申请 */
      case RequestSubType.PrivateApply: {
        const { applier_uid, applier_uin, message } = this.e.content
        this.e.raw_message = `[好友申请]: ${applier_uid || applier_uin} 申请理由: ${message}`
        break
      }
      /** 群申请 */
      case RequestSubType.GroupApply: {
        const { group_id, applier_uid, applier_uin, inviter_uid, inviter_uin, reason } = this.e.content
        this.e.raw_message = `[群申请]: ${group_id} 申请人: ${applier_uid || applier_uin} 邀请人: ${inviter_uid || inviter_uin} 理由: ${reason}`
        break
      }
      /** 邀请入群 */
      case RequestSubType.InvitedGroup: {
        const { group_id, inviter_uid, inviter_uin } = this.e.content
        this.e.raw_message = `[邀请入群]: ${group_id} 邀请人: ${inviter_uid || inviter_uin}`
        break
      }
      default: {
        (this.e as any).raw_message = `[未知事件]: ${JSON.stringify(this.e)}`
      }
    }
  }
}
