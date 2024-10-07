import { review } from './review'
import { EventBaseHandler } from './base'
import { logger, config } from 'karin/utils'
import { karin, pluginLoader } from 'karin/core'
import { KarinNoticeType, NoticeSubType } from 'karin/types'

/** 通知事件 */
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

    this.reply()
    karin.emit('notice', this.e)
  }

  /** 处理事件 */
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

  /** 构建原始消息 */
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
        const { file_url: fileUrl } = content
        this.e.raw_message = `[私聊文件上传]: ${fileUrl}`
        break
      }
      /** 群头像戳一戳 */
      case NoticeSubType.GroupPoke: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, target_uid: targetUid, target_uin: targetUin } = this.e.content
        this.e.raw_message = `[群戳一戳]: ${operatorUid || operatorUin} 戳了戳 ${targetUid || targetUin}`
        break
      }
      /** 群消息撤回 */
      case NoticeSubType.GroupRecall: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, message_id: messageId } = this.e.content
        this.e.raw_message = `[群消息撤回]: ${operatorUid || operatorUin} 撤回了一条消息 ${messageId}`
        break
      }
      /** 群文件上传 */
      case NoticeSubType.GroupFileUploaded: {
        const { file_url: fileUrl, operator_uid: operatorUid, operator_uin: operatorUin } = this.e.content
        this.e.raw_message = `[群文件上传]: ${operatorUid || operatorUin} 上传了 ${fileUrl}`
        break
      }
      /** 群成员增加 */
      case NoticeSubType.GroupMemberIncrease: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, target_uid: targetUid, target_uin: targetUin, type } = this.e.content
        this.e.raw_message = `[群成员新增]: ${operatorUid || operatorUin} ${type === 'invite' ? '邀请' : '同意'} ${targetUid || targetUin} 加入群聊`
        break
      }
      /** 群成员减少 */
      case NoticeSubType.GroupMemberDecrease: {
        switch (this.e.content.type) {
          case 'leave': {
            const { target_uid: targetUid, target_uin: targetUin } = this.e.content
            this.e.raw_message = `[群成员减少]: ${targetUid || targetUin} 主动退出群聊`
            break
          }
          // 群成员被踢
          case 'kick': {
            const { operator_uid: operatorUid, operator_uin: operatorUin, target_uid: targetUid, target_uin: targetUin } = this.e.content
            this.e.raw_message = `[群成员减少]: ${operatorUid || operatorUin} 将 ${targetUid || targetUin} 踢出群聊`
            break
          }
          // bot被踢
          case 'kick_me': {
            const { operator_uid: operatorUid, operator_uin: operatorUin } = this.e.content
            this.e.raw_message = `[群成员减少]: 机器人被移除群聊，操作人：${operatorUid || operatorUin}`
            break
          }
        }
        break
      }
      /** 群管理员变动 */
      case NoticeSubType.GroupAdminChanged: {
        const { target_uid: targetUid, target_uin: targetUin, is_admin: isAdmin } = this.e.content
        this.e.raw_message = `[群管理员变动]: ${targetUid || targetUin} 被${isAdmin ? '设置' : '取消'}群管理员`
        break
      }
      /** 群成员被禁言 */
      case NoticeSubType.GroupMemberBan: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, target_uid: targetUid, target_uin: targetUin, type } = this.e.content
        this.e.raw_message = `[群成员禁言]: ${operatorUid || operatorUin} ${type === 'ban' ? '禁言' : '解禁'}了 ${targetUid || targetUin}`
        break
      }
      /** 群签到 */
      case NoticeSubType.GroupSignIn: {
        const { target_uid: targetUid, target_uin: targetUin } = this.e.content
        this.e.raw_message = `[群签到]: ${targetUid || targetUin}`
        break
      }
      /** 群全员禁言 */
      case NoticeSubType.GroupWholeBan: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, is_ban: isBan } = this.e.content
        this.e.raw_message = `[群全员禁言]: ${operatorUid || operatorUin} ${isBan ? '开启全员禁言' : '解除全员禁言'}`
        break
      }
      /** 群名片改变 */
      case NoticeSubType.GroupCardChanged: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, target_uid: targetUid, target_uin: targetUin, new_card: newCard } = this.e.content
        this.e.raw_message = `[群名片改变]: ${operatorUid || operatorUin} 修改了 ${targetUid || targetUin} 的名片为 ${newCard}`
        break
      }
      /** 群成员专属头衔改变 */
      case NoticeSubType.GroupMemberUniqueTitleChanged: {
        const { target_uid: targetUid, target_uin: targetUin, title } = this.e.content
        this.e.raw_message = `[群头衔更改]: ${targetUid || targetUin} 的专属头衔改变为 ${title}`
        break
      }
      /** 群精华消息改变 */
      case NoticeSubType.GroupEssenceChanged: {
        const { operator_uid: operatorUid, operator_uin: operatorUin, target_uid: targetUid, target_uin: targetUin, message_id: messageId, is_set: isSet } = this.e.content
        this.e.raw_message = `[群精华消息]: ${operatorUid || operatorUin} ${isSet ? `将${targetUid || targetUin}的消息${messageId}设置为精华消息` : `取消了${targetUid || targetUin}精华消息 ${messageId}`}`
        break
      }
      /** 群表情回应 */
      case NoticeSubType.GroupMessageReaction: {
        const { message_id: messageId, face_id: faceId } = this.e.content
        this.e.raw_message = `[群表情回应]: ${this.e.user_id} 给消息 ${messageId} 回应了一个${faceId}的表情`
        break
      }
      /** 好友新增 */
      case NoticeSubType.FriendIncrease: {
        const { target_uid: targetUid, target_uin: targetUin } = this.e.content
        this.e.raw_message = `[新增好友]: ${targetUid || targetUin}`
        break
      }
      default: {
        (this.e as any).raw_message = `[未知事件]: ${JSON.stringify(this.e)}`
      }
    }
  }
}
