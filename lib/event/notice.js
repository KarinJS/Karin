import { Cfg, common, logger } from '#Karin'
import lodash from 'lodash'
import util from 'util'
import other from '../config/other.js'
import loader from '../plugins/loader.js'
import Event from './event.js'

/** 通知事件 */
class Notice extends Event {
  /**
 * 处理事件，加入自定义字段
 * @param {KarinNotice} e - 包含消息信息的对象
 */
  async deal (e) {
    /** cd */
    if (other.cd(e)) return logger.debug('[消息拦截] 正在冷却中')
    /** 检查白名单用户 */
    if (!other.white_list_user(e)) return logger.debug('[消息拦截] 非白名单用户')
    /** 检查黑名单用户 */
    if (other.black_list_user(e)) return logger.debug('[消息拦截] 黑名单用户')
    /** 群聊则检查群聊黑白名单 */
    if (e.group_id) {
      if (!other.white_list_group(e)) return logger.debug('[消息拦截] 非白名单群聊')
      if (other.black_list_group(e)) return logger.debug('[消息拦截] 黑名单群聊')
    }

    /** 加入通用字段 */
    this.norm(e)
    /** 处理回复 */
    this.reply(e)
    /** raw */
    this.raw_message(e)

    /** 主人 */
    if (Cfg.master.includes(Number(e.user_id) || String(e.user_id))) e.isMaster = true
    /** 管理员 */
    if (Cfg.admin.includes(Number(e.user_id) || String(e.user_id))) e.isAdmin = true

    if (e.contact.scene === 'friend') {
      e.isPrivate = true
      e.logText = `[Private:${e.sender.nick || ''}(${e.user_id})]`
      logger.info(common.logger(e.self_id, `${logger.green('私聊通知: ')}[${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
    } else if (e.contact.scene === 'group') {
      e.isGroup = true
      e.logText = `[Group:${e.group_id}-${e.user_id}(${e.sender.nick || ''})]`
      logger.info(common.logger(e.self_id, `${logger.green('群通知: ')}[${e.group_id}-${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
    } else {
      logger.info(common.logger(e.self_id, `未知来源通知事件：${JSON.stringify(e)}`))
    }
    /* eslint-disable no-labels */
    a:
    for (const app of loader.Apps) {
      /** 判断事件 */
      if (app.event && !this.filtEvent(e, app)) continue

      /** accept hook */
      if (app.accept) {
        /** 检查白名单插件 */
        if (!other.white_list_app(e, app)) continue
        /** 检查黑名单插件 */
        if (other.black_list_app(e, app)) continue

        /** 日志方法字符串 */
        e.logFnc = `[${app.file.dir}][${app.name}][accept]`

        /** 判断权限 */
        if (!this.filterPermission(e, app)) break a

        try {
          /** 实例化 */
          const App = new app.App()
          App.e = e
          let res = App.accept && App.accept(e)

          /** 计算插件处理时间 */
          let start = Date.now()

          if (util.types.isPromise(res)) res = await res

          if (res !== false) {
            logger.info(common.logger(e.self_id, `${e.logFnc} ${lodash.truncate(e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`))
            break a
          }
        } catch (error) {
          logger.error(`${e.logFnc}`)
          logger.error(error.stack)
          break a
        }
      }
    }
  }

  raw_message (e) {
    switch (e.sub_type) {
      /** 好友头像戳一戳 */
      case 'friend_poke': {
        e.raw_message = '[好友戳一戳]: 戳了你一下'
        break
      }
      /** 好友消息撤回 */
      case 'friend_recall': {
        e.raw_message = `[好友消息撤回]: ${e.message_id}`
        break
      }
      /** 私聊文件上传 */
      case 'friend_file': {
        const { url } = e.content
        e.raw_message = `[私聊文件上传]: ${url}`
        break
      }
      /** 群头像戳一戳 */
      case 'group_poke': {
        const { operator_uid, operator_uin, target_uid, target_uin } = e.content
        e.raw_message = `[群戳一戳]: ${operator_uid || operator_uin} 戳了戳 ${target_uid || target_uin}`
        break
      }
      /** 群消息撤回 */
      case 'group_recall': {
        const { operator_uid, operator_uin, message_id } = e.content
        e.raw_message = `[群消息撤回]: ${operator_uid || operator_uin} 撤回了一条消息 ${message_id}`
        break
      }
      /** 群文件上传 */
      case 'group_file_uploaded': {
        const { url, operator_uid, operator_uin } = e.content
        e.raw_message = `[群文件上传]: ${operator_uid || operator_uin} 上传了 ${url}`
        break
      }
      /** 群成员增加 */
      case 'group_member_increase': {
        // 这里可能不准确...没测试
        // eslint-disable-next-line no-unused-vars
        const { operator_uid, operator_uin, target_uid, target_uin } = e.content
        e.raw_message = `[群成员新增]: ${target_uid || target_uin} 加入群聊`
        break
      }
      /** 群成员减少 */
      case 'group_member_decrease': {
        switch (e.content.type) {
          // 主动退群
          case 0: {
            const { target_uid, target_uin } = e.content
            e.raw_message = `[群成员减少]: ${target_uid || target_uin} 退出群聊`
            break
          }
          // 群成员被踢
          case 1: {
            const { operator_uid, operator_uin, target_uid, target_uin } = e.content
            e.raw_message = `[群成员减少]: ${operator_uid || operator_uin} 将 ${target_uid || target_uin} 踢出群聊`
            break
          }
          // bot被踢
          case 2: {
            const { operator_uid, operator_uin } = e.content
            e.raw_message = `[群成员减少]: 机器人被移除群聊，操作人：${operator_uid || operator_uin}`
            break
          }
        }
        break
      }
      /** 群管理员变动 */
      case 'group_admin_change': {
        const { target_uid, target_uin, is_admin } = e.content
        e.raw_message = `[群管理员变动]: ${target_uid || target_uin} 被${is_admin ? '设置' : '取消'}群管理员`
        break
      }
      /** 群成员被禁言 */
      case 'group_member_ban': {
        const { operator_uid, operator_uin, target_uid, target_uin, type } = e.content
        e.raw_message = `[群成员禁言]: ${operator_uid || operator_uin} ${type === 1 ? '禁言' : '解禁'}了 ${target_uid || target_uin}`
        break
      }
      /** 群签到 */
      case 'group_sign_in': {
        const { target_uid, target_uin } = e.content
        e.raw_message = `[群签到]: ${target_uid || target_uin}`
        break
      }
      /** 群全员禁言 */
      case 'group_whole_ban': {
        const { operator_uid, operator_uin, is_ban } = e.content
        e.raw_message = `[群全员禁言]: ${operator_uid || operator_uin} ${is_ban ? '开启全员禁言' : '解除全员禁言'}`
        break
      }
      /** 群名片改变 */
      case 'group_card_changed': {
        const { operator_uid, operator_uin, target_uid, target_uin, new_card } = e.content
        e.raw_message = `[群名片改变]: ${operator_uid || operator_uin} 修改了 ${target_uid || target_uin} 的名片为 ${new_card}`
        break
      }
      /** 群成员专属头衔改变 */
      case 'group_member_unique_title_changed': {
        const { target, title } = e.content
        e.raw_message = `[群头衔更改]: ${target} 的专属头衔改变为 ${title}`
        break
      }
      /** 群精华消息改变 */
      case 'group_essence_changed': {
        const { operator_uid, operator_uin, target_uid, target_uin, message_id, is_set } = e.content
        e.raw_message = `[群精华消息]: ${operator_uid || operator_uin} ${is_set ? `将${target_uid || target_uin}的消息${message_id}设置为精华消息` : `取消了${target_uid || target_uin}精华消息 ${message_id}`}`
        break
      }
    }
  }
}

export default new Notice()
