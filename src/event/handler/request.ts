import { review } from './review'
import { EventBaseHandler } from './base'
import { karin, pluginLoader } from 'karin/core'
import { logger, config } from 'karin/utils'
import { KarinRequestType, RequestSubType } from 'karin/types'

/**
 * 请求事件
 */
export class RequestHandler extends EventBaseHandler {
  e: KarinRequestType
  constructor (e: KarinRequestType) {
    super(e)
    this.e = e
    this.init()

    if (this.e.group_id) {
      if (!this.getCd()) return
      if (!this.getGroupEnable()) return
      if (!this.getUserEnable()) return
    } else {
      if (!this.private()) return
    }

    /** 处理消息 */
    this.deal()
  }

  init () {
    this.raw_message()
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

    this.reply()
    karin.emit('request', this.e)
  }

  /**
   * 处理事件
   */
  async deal () {
    for (const info of pluginLoader.accept) {
      /** 判断事件 */
      if (!this.filtEvent(info.event)) continue
      /** 判断适配器 */
      if (!this.filterAdapter(info)) continue
      /** 检查黑白名单插件 */
      if (!review.PluginEnable(info, this.config)) continue

      /** 日志方法字符串 */
      this.e.logFnc = `[${info.name}][accept]`
      const logFnc = logger.fnc(this.e.logFnc + `[${this.e.event}.${this.e.sub_event}]`)

      this.GroupMsgPrint && info.log(this.e.self_id, `${logFnc + this.e.logText} 开始处理`)

      /** 计算插件处理时间 */
      const start = Date.now()

      try {
        const res = await info.fn(this.e)
        this.GroupMsgPrint && info.log(this.e.self_id, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
        if (res !== false) break
      } catch (error: any) {
        logger.error(`${logFnc}`)
        logger.error(error.stack || error.message || JSON.stringify(error))
        break
      }
    }
    logger.debug(`[事件处理][${this.e.self_id}][${this.e.user_id}][${this.e.event_id}] 未匹配到任何插件`)
  }

  /**
   * 构建原始消息
   */
  raw_message () {
    switch (this.e.sub_event) {
      /** 好友申请 */
      case RequestSubType.PrivateApply: {
        const { applier_uid: applierUid, applier_uin: applierUin, message } = this.e.content
        this.e.raw_message = `[好友申请]: ${applierUid || applierUin} 申请理由: ${message}`
        break
      }
      /** 群申请 */
      case RequestSubType.GroupApply: {
        const { group_id: groupId, applier_uid: applierUid, applier_uin: applierUin, inviter_uid: inviterUid, inviter_uin: inviterUin, reason } = this.e.content
        this.e.raw_message = `[群申请]: ${groupId} 申请人: ${applierUid || applierUin} 邀请人: ${inviterUid || inviterUin} 理由: ${reason}`
        break
      }
      /** 邀请入群 */
      case RequestSubType.InvitedGroup: {
        const { group_id: groupId, inviter_uid: inviterUid, inviter_uin: inviterUin } = this.e.content
        this.e.raw_message = `[邀请入群]: ${groupId} 邀请人: ${inviterUid || inviterUin}`
        break
      }
      default: {
        (this.e as any).raw_message = `[未知事件]: ${JSON.stringify(this.e)}`
      }
    }
  }
}
