import { review } from './review'
import { EventBaseHandler } from './base'
import { pluginLoader } from 'karin/core'
import { logger, config } from 'karin/utils'
import { KarinNoticeType, NoticeSubType } from 'karin/types'

/**
 * 通知事件
 */
export class NoticeHandler extends EventBaseHandler {
  e: KarinNoticeType
  constructor (e: KarinNoticeType) {
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
      logger.bot('info', this.e.self_id, `${logger.green('私聊通知: ')}[${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'group') {
      this.e.isGroup = true
      this.e.logText = `[Group:${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      this.GroupMsgPrint = review.GroupMsgPrint(this.e)
      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${logger.green('群通知: ')}[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'guild') {
      this.e.isGuild = true
      this.e.logText = `[Guild:${this.e.contact.peer}-${this.e.contact.sub_peer}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      logger.bot('info', this.e.self_id, `${logger.green('频道通知: ')}[${this.e.contact.peer}-${this.e.contact.sub_peer}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知来源通知事件：${JSON.stringify(this.e)}`)
    }

    this.raw_message()
    this.reply()
  }

  /**
   * 处理事件
   */
  async deal () {
    for (const info of pluginLoader.accept) {
      /** 判断事件 */
      if (!this.filtEvent(info.event)) continue

      /** 检查黑白名单插件 */
      if (!review.PluginEnable(info, this.config)) continue

      /** 日志方法字符串 */
      this.e.logFnc = `[${info.name}][accept]`
      const logFnc = logger.fnc(this.e.logFnc)

      /** 计算插件处理时间 */
      const start = Date.now()
      try {
        const res = await info.fn(this.e)

        this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
        if (res !== false) break
      } catch (error: any) {
        logger.error(`${logFnc}`)
        logger.error(error.stack || error.message || JSON.stringify(error))
        break
      }
    }
  }

  /**
   * 构建原始消息
   */
  raw_message () {
    switch (this.e.sub_event) {
      /** 好友头像戳一戳 */
      case NoticeSubType.PrivatePoke: {
        this.e.raw_message = '[好友戳一戳]: 戳了你一下'
        break
      }
      /** 好友消息撤回 */
      case NoticeSubType.PrivateRecall: {
        this.e.raw_message = `[好友消息撤回]: ${this.e.content.message_id}`
        break
      }
      /** 私聊文件上传 */
      case NoticeSubType.PrivateFileUploaded: {
        const content = this.e.content
        const { file_url } = content
        this.e.raw_message = `[私聊文件上传]: ${file_url}`
        break
      }
      /** 群头像戳一戳 */
      case NoticeSubType.GroupPoke: {
        const { operator_uid, operator_uin, target_uid, target_uin } = this.e.content
        this.e.raw_message = `[群戳一戳]: ${operator_uid || operator_uin} 戳了戳 ${target_uid || target_uin}`
        break
      }
      /** 群消息撤回 */
      case NoticeSubType.GroupRecall: {
        const { operator_uid, operator_uin, message_id } = this.e.content
        this.e.raw_message = `[群消息撤回]: ${operator_uid || operator_uin} 撤回了一条消息 ${message_id}`
        break
      }
      /** 群文件上传 */
      case NoticeSubType.GroupFileUploaded: {
        const { file_url, operator_uid, operator_uin } = this.e.content
        this.e.raw_message = `[群文件上传]: ${operator_uid || operator_uin} 上传了 ${file_url}`
        break
      }
      /** 群成员增加 */
      case NoticeSubType.GroupMemberIncrease: {
        const { operator_uid, operator_uin, target_uid, target_uin, type } = this.e.content
        this.e.raw_message = `[群成员新增]: ${operator_uid || operator_uin} ${type === 'invite' ? '邀请' : '同意'}  ${target_uid || target_uin} 加入群聊`
        break
      }
      /** 群成员减少 */
      case NoticeSubType.GroupMemberDecrease: {
        switch (this.e.content.type) {
          case 'leave': {
            const { target_uid, target_uin } = this.e.content
            this.e.raw_message = `[群成员减少]: ${target_uid || target_uin} 主动退出群聊`
            break
          }
          // 群成员被踢
          case 'kick': {
            const { operator_uid, operator_uin, target_uid, target_uin } = this.e.content
            this.e.raw_message = `[群成员减少]: ${operator_uid || operator_uin} 将 ${target_uid || target_uin} 踢出群聊`
            break
          }
          // bot被踢
          case 'kick_me': {
            const { operator_uid, operator_uin } = this.e.content
            this.e.raw_message = `[群成员减少]: 机器人被移除群聊，操作人：${operator_uid || operator_uin}`
            break
          }
        }
        break
      }
      /** 群管理员变动 */
      case NoticeSubType.GroupAdminChanged: {
        const { target_uid, target_uin, is_admin } = this.e.content
        this.e.raw_message = `[群管理员变动]: ${target_uid || target_uin} 被${is_admin ? '设置' : '取消'}群管理员`
        break
      }
      /** 群成员被禁言 */
      case NoticeSubType.GroupMemberBan: {
        const { operator_uid, operator_uin, target_uid, target_uin, type } = this.e.content
        this.e.raw_message = `[群成员禁言]: ${operator_uid || operator_uin} ${type === 'ban' ? '禁言' : '解禁'}了 ${target_uid || target_uin}`
        break
      }
      /** 群签到 */
      case NoticeSubType.GroupSignIn: {
        const { target_uid, target_uin } = this.e.content
        this.e.raw_message = `[群签到]: ${target_uid || target_uin}`
        break
      }
      /** 群全员禁言 */
      case NoticeSubType.GroupWholeBan: {
        const { operator_uid, operator_uin, is_ban } = this.e.content
        this.e.raw_message = `[群全员禁言]: ${operator_uid || operator_uin} ${is_ban ? '开启全员禁言' : '解除全员禁言'}`
        break
      }
      /** 群名片改变 */
      case NoticeSubType.GroupCardChanged: {
        const { operator_uid, operator_uin, target_uid, target_uin, new_card } = this.e.content
        this.e.raw_message = `[群名片改变]: ${operator_uid || operator_uin} 修改了 ${target_uid || target_uin} 的名片为 ${new_card}`
        break
      }
      /** 群成员专属头衔改变 */
      case NoticeSubType.GroupMemberUniqueTitleChanged: {
        const { target_uid, target_uin, title } = this.e.content
        this.e.raw_message = `[群头衔更改]: ${target_uid || target_uin} 的专属头衔改变为 ${title}`
        break
      }
      /** 群精华消息改变 */
      case NoticeSubType.GroupEssenceChanged: {
        const { operator_uid, operator_uin, target_uid, target_uin, message_id, is_set } = this.e.content
        this.e.raw_message = `[群精华消息]: ${operator_uid || operator_uin} ${is_set ? `将${target_uid || target_uin}的消息${message_id}设置为精华消息` : `取消了${target_uid || target_uin}精华消息 ${message_id}`}`
        break
      }
      /** 群表情回应 */
      case NoticeSubType.GroupMessageReaction: {
        const { message_id, face_id } = this.e.content
        this.e.raw_message = `[群表情回应]: ${this.e.user_id} 给消息 ${message_id} 回应了一个${face_id}的表情`
        break
      }
      default: {
        (this.e as any).raw_message = `[未知事件]: ${JSON.stringify(this.e)}`
      }
    }
  }
}
