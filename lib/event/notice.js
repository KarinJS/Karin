import util from 'util'
import lodash from 'lodash'
import Event from './event.js'
import Review from './review.js'
import { Cfg, logger } from '#Karin'
import loader from '../plugins/loader.js'

/**
 * 通知事件
 */
export default class Notice extends Event {
  constructor (e) {
    super(e)
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
    if (Cfg.master.includes(Number(this.e.user_id) || String(this.e.user_id))) this.e.isMaster = true
    /** 管理员 */
    if (Cfg.admin.includes(Number(this.e.user_id) || String(this.e.user_id))) this.e.isAdmin = true
    this.GroupMsgPrint = false
    if (this.e.contact.scene === 'friend') {
      this.e.isPrivate = true
      this.e.logText = `[Private:${this.e.sender.nick || ''}(${this.e.user_id})]`
      logger.bot('info', this.e.self_id, `${logger.green('私聊通知: ')}[${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else if (this.e.contact.scene === 'group') {
      this.e.isGroup = true
      this.e.logText = `[Group:${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})]`
      this.GroupMsgPrint = Review.GroupMsgPrint(this.e)
      this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${logger.green('群通知: ')}[${this.e.group_id}-${this.e.user_id}(${this.e.sender.nick || ''})] ${this.e.raw_message}`)
    } else {
      logger.bot('info', this.e.self_id, `未知来源通知事件：${JSON.stringify(this.e)}`)
    }
    /* eslint-disable no-labels */
    a:
    for (const app of loader.Apps) {
      /** 判断事件 */
      if (app.event && !this.filtEvent(this.e, app.event)) continue

      /** accept hook */
      if (app.accept) {
        /** 检查黑白名单插件 */
        if (!Review.PluginEnable(app, this.config)) continue

        /** 日志方法字符串 */
        this.e.logFnc = `[${app.file.dir}][${app.name}][accept]`
        const logFnc = logger.fnc(`[${app.name}][accept]`)

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
            this.GroupMsgPrint && logger.bot('info', this.e.self_id, `${logFnc} ${lodash.truncate(this.e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
            break a
          }
        } catch (error) {
          logger.error(`${logFnc}`)
          logger.error(error.message || error.stack || JSON.stringify(error))
          break a
        }
      }
    }
  }

  /**
   * 构建原始消息
   */
  raw_message () {
    switch (this.e.sub_event) {
      /** 好友头像戳一戳 */
      case 'friend_poke': {
        this.e.raw_message = '[好友戳一戳]: 戳了你一下'
        break
      }
      /** 好友消息撤回 */
      case 'friend_recall': {
        this.e.raw_message = `[好友消息撤回]: ${this.e.message_id}`
        break
      }
      /** 私聊文件上传 */
      case 'friend_file': {
        const { url } = this.e.content
        this.e.raw_message = `[私聊文件上传]: ${url}`
        break
      }
      /** 群头像戳一戳 */
      case 'group_poke': {
        const { operator_uid, operator_uin, target_uid, target_uin } = this.e.content
        this.e.raw_message = `[群戳一戳]: ${operator_uid || operator_uin} 戳了戳 ${target_uid || target_uin}`
        break
      }
      /** 群消息撤回 */
      case 'group_recall': {
        const { operator_uid, operator_uin, message_id } = this.e.content
        this.e.raw_message = `[群消息撤回]: ${operator_uid || operator_uin} 撤回了一条消息 ${message_id}`
        break
      }
      /** 群文件上传 */
      case 'group_file_uploaded': {
        const { url, operator_uid, operator_uin } = this.e.content
        this.e.raw_message = `[群文件上传]: ${operator_uid || operator_uin} 上传了 ${url}`
        break
      }
      /** 群成员增加 */
      case 'group_member_increase': {
        // 这里可能不准确...没测试
        // eslint-disable-next-line no-unused-vars
        const { operator_uid, operator_uin, target_uid, target_uin } = this.e.content
        this.e.raw_message = `[群成员新增]: ${target_uid || target_uin} 加入群聊`
        break
      }
      /** 群成员减少 */
      case 'group_member_decrease': {
        switch (this.e.content.type) {
          // 主动退群
          case 0: {
            const { target_uid, target_uin } = this.e.content
            this.e.raw_message = `[群成员减少]: ${target_uid || target_uin} 退出群聊`
            break
          }
          // 群成员被踢
          case 1: {
            const { operator_uid, operator_uin, target_uid, target_uin } = this.e.content
            this.e.raw_message = `[群成员减少]: ${operator_uid || operator_uin} 将 ${target_uid || target_uin} 踢出群聊`
            break
          }
          // bot被踢
          case 2: {
            const { operator_uid, operator_uin } = this.e.content
            this.e.raw_message = `[群成员减少]: 机器人被移除群聊，操作人：${operator_uid || operator_uin}`
            break
          }
        }
        break
      }
      /** 群管理员变动 */
      case 'group_admin_change': {
        const { target_uid, target_uin, is_admin } = this.e.content
        this.e.raw_message = `[群管理员变动]: ${target_uid || target_uin} 被${is_admin ? '设置' : '取消'}群管理员`
        break
      }
      /** 群成员被禁言 */
      case 'group_member_ban': {
        const { operator_uid, operator_uin, target_uid, target_uin, type } = this.e.content
        this.e.raw_message = `[群成员禁言]: ${operator_uid || operator_uin} ${type === 1 ? '禁言' : '解禁'}了 ${target_uid || target_uin}`
        break
      }
      /** 群签到 */
      case 'group_sign_in': {
        const { target_uid, target_uin } = this.e.content
        this.e.raw_message = `[群签到]: ${target_uid || target_uin}`
        break
      }
      /** 群全员禁言 */
      case 'group_whole_ban': {
        const { operator_uid, operator_uin, is_ban } = this.e.content
        this.e.raw_message = `[群全员禁言]: ${operator_uid || operator_uin} ${is_ban ? '开启全员禁言' : '解除全员禁言'}`
        break
      }
      /** 群名片改变 */
      case 'group_card_changed': {
        const { operator_uid, operator_uin, target_uid, target_uin, new_card } = this.e.content
        this.e.raw_message = `[群名片改变]: ${operator_uid || operator_uin} 修改了 ${target_uid || target_uin} 的名片为 ${new_card}`
        break
      }
      /** 群成员专属头衔改变 */
      case 'group_member_unique_title_changed': {
        const { target, title } = this.e.content
        this.e.raw_message = `[群头衔更改]: ${target} 的专属头衔改变为 ${title}`
        break
      }
      /** 群精华消息改变 */
      case 'group_essence_changed': {
        const { operator_uid, operator_uin, target_uid, target_uin, message_id, is_set } = this.e.content
        this.e.raw_message = `[群精华消息]: ${operator_uid || operator_uin} ${is_set ? `将${target_uid || target_uin}的消息${message_id}设置为精华消息` : `取消了${target_uid || target_uin}精华消息 ${message_id}`}`
        break
      }
    }
  }
}
