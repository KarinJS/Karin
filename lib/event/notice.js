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
      logger.info(common.logger(e.self_id, `私聊通知事件：[${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
    } else if (e.contact.scene === 'group') {
      e.isGroup = true
      e.logText = `[Group:${e.group_id}-${e.user_id}(${e.sender.nick || ''})]`
      logger.info(common.logger(e.self_id, `群通知事件：[${e.group_id}-${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
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
        e.raw_message = '[notice][friend_poke]: 戳了你一下'
        break
      }
      /** 好友消息撤回 */
      case 'friend_recall': {
        e.raw_message = `[notice][friend_recall]: 撤回了一条消息 ${e.message_id}`
        break
      }
      /** 私聊文件上传 */
      case 'friend_file': {
        const { url } = e.content
        e.raw_message = `[notice][friend_file_uploaded]: 收到文件 ${url}`
        break
      }
      /** 群头像戳一戳 */
      case 'group_poke': {
        const { operator_uid, operator_uin, target_uid, target_uin } = e.content
        e.raw_message = `[notice][group_poke]: ${operator_uid || operator_uin} 戳了戳 ${target_uid || target_uin}`
        break
      }
      /** 群消息撤回 */
      case 'group_recall': {
        e.raw_message = '[notice][group_recall]: 群消息撤回'
        break
      }
      /** 群文件上传 */
      case 'group_file_uploaded': {
        e.raw_message = '[notice][group_file_uploaded]: 群文件上传'
        break
      }
      /** 群成员增加 */
      case 'group_member_increase': {
        e.raw_message = '[notice][group_member_increase]: 群成员增加'
        break
      }
      /** 群成员减少 */
      case 'group_member_decrease': {
        e.raw_message = '[notice][group_member_decrease]: 群成员减少'
        break
      }
      /** 群管理员变动 */
      case 'group_admin_change': {
        e.raw_message = '[notice][group_admin_change]: 群管理员变动'
        break
      }
      /** 群成员被禁言 */
      case 'group_member_ban': {
        e.raw_message = '[notice][group_member_ban]: 群成员被禁言'
        break
      }
      /** 群签到 */
      case 'group_sign_in': {
        e.raw_message = '[notice][group_sign_in]: 群签到'
        break
      }
      /** 群全员禁言 */
      case 'group_whole_ban': {
        e.raw_message = '[notice][group_whole_ban]: 群全员禁言'
        break
      }
      /** 群名片改变 */
      case 'group_card_changed': {
        e.raw_message = '[notice][group_card_changed]: 群名片改变'
        break
      }
      /** 群成员专属头衔改变 */
      case 'group_member_unique_title_changed': {
        e.raw_message = '[notice][group_member_unique_title_changed]: 群成员专属头衔改变'
        break
      }
      /** 群精华消息改变 */
      case 'group_essence_changed': {
        e.raw_message = '[notice][group_essence_changed]: 群精华消息改变'
        break
      }
    }
  }
}

export default new Notice()
