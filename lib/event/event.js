import lodash from 'lodash'
import { logger, segment, Cfg, Bot, common } from '#Karin'
// eslint-disable-next-line no-unused-vars
import { EventType } from './type.js'

export default class Event {
  /**
   * 处理事件，加入自定义字段
   * @param {EventType} e - 包含消息信息的对象
   */
  norm (e) {
    e.msg = ''
    e.game = ''
    e.img = []
    e.at = ''
    e.atBot = false
    e.file = {}
    e.reply_id = ''
    e.isMaster = false
    e.isPrivate = false
    e.isGroup = false
    e.isGuild = false
    e.logText = ''
    e.logFnc = ''
    e.raw_message = ''

    Object.defineProperty(e, 'user_id', {
      get: () => e.sender.uin || e.sender.uid
    })

    if (e.contact.scene === 'group') {
      Object.defineProperty(e, 'group_id', {
        get: () => e.contact.peer
      })
    }

    /** 加入bot */
    Object.defineProperty(e, 'bot', {
      value: Bot.adapter[e.self_id]
    })
    return e
  }

  /**
 * 根据事件类型过滤事件
 * @param {Object} e - 事件对象
 * @param {Object} v - 验证对象
 * @returns {boolean} - 是否匹配事件
 */
  filtEvent (e, v) {
    /** 事件映射表 */
    const eventMap = {
      message: () => `message.${e.contact.scene}`,
      notice: ['event', 'notice_type'],
      request: ['event', 'request_type']
    }

    const evnetType = eventMap[e.event]()
    return evnetType.includes(v.event)
  }

  /** 判断权限 */
  filtPermission (e, v) {
    if (v.permission == 'all' || !v.permission) return true

    if (v.permission == 'master') {
      if (!e.isMaster) {
        e.reply('暂无权限，只有主人才能操作')
        return false
      }
      return true
    }

    if (e.isGroup) {
      const list = {
        owner: {
          role: 'owner',
          name: '群主'
        },
        admin: {
          role: 'admin',
          name: '管理员'
        }

      }

      const role = list[v.permission]
      if (role && e.sender.role !== role.role) {
        e.reply(`暂无权限，只有${role.name}才能操作`)
        return false
      }
    }

    return true
  }

  /**
   * 处理回复,捕获发送失败异常
   * @param {EventType.Message} e - 事件对象
   */
  reply (e) {
    e.replyNew = e.reply

    /**
     * @param {string|object|Array} msg - 发送的消息
     * @param {object} data - 回复数据
     * @param {boolean} data.at - 是否at用户
     * @param {boolean} data.reply - 是否引用回复
     * @param {number} data.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
     * @param {boolean} data.button - 是否使用按钮
     */
    e.reply = async (msg = '', data = {}) => {
      if (!msg) throw new Error('回复消息不能为空')

      /** 将msg格式化为oneBot11格式 什么?你问我12呢? = =我怎么知道??? */
      if (!Array.isArray(msg)) {
        msg = typeof msg == 'string' ? [segment.text(msg)] : [msg]
      }

      let { reply = false, recallMsg = 0, at = '', button = false } = data
      logger.debug(button) // 后续处理
      /** 加入at */
      if (at && e.isGroup) msg.unshift(segment.at(e.user_id))
      /** 加入引用回复 */
      if (reply && e.message_id) msg.unshift(segment.reply(e.message_id))

      let msgRes
      try {
        msgRes = await e.replyNew(msg)
        logger.debug(common.logger(e.self_id, `回复消息结果:${JSON.stringify(msg, null, 2)}`))
      } catch (err) {
        /** 捕获发送失败异常 */
        msg.forEach((val, index) => {
          if (val.type === 'image' && !val.data.file.startsWith('http')) msg[index].data.file = 'base64://...'
        })
        msg = lodash.truncate(JSON.stringify(msg), { length: 300 })
        logger.error(common.logger(e.self_id, `回复消息失败:${msg}`))
        logger.error(common.logger(e.self_id), err)
      }

      /** 快速撤回 */
      if (recallMsg > 0 && msgRes?.message_id) {
        setTimeout(() => e.delete_msg(msgRes.message_id), recallMsg * 1000)
      }

      return msgRes
    }
    Object.freeze(e.reply)
  }

  /** 黑名单功能 */
  blacklistAPP (app) {
    /** 检查功能黑名单是否为空 不为空则执行检查 */
    if (!lodash.isEmpty(Cfg.blackList)) {
      /** 检查插件包是否处于功能黑名单 */
      if (Cfg.blackList.includes(app.apps)) {
        logger.debug(logger.red(`[功能黑名单] 插件包 [${app.apps}] 处于功能黑名单`))
        return true
      }
      /** 检查单插件是否处于功能黑名单 */
      if (Cfg.blackList.includes(`${app.apps}/${app.name}`)) {
        logger.debug(logger.red(`[功能黑名单] 插件 [${app.apps}/${app.name}] 处于功能黑名单`))
        return true
      }
      return false
    }
    return false
  }
}
