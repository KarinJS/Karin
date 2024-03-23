import lodash from 'lodash'
import { logger, segment, Cfg, Bot } from '#Karin'

export default class Event {
  /**
   * 处理事件，加入自定义字段
   * @param {object} e - 包含消息信息的对象
   * @param {string} e.msg - 文本消息，多行会自动拼接
   * @param {string} e.game - 指定游戏
   * @param {string[]} e.img - 图片消息数组
   * @param {boolean} e.atBot - 是否at机器人
   * @param {boolean} e.at - 是否at，多个at 以最后的为准
   * @param {object} e.file - 接受到的文件
   * @param {string} e.reply_id - 回复消息id
   * @param {boolean} e.isPrivate - 是否私聊
   * @param {boolean} e.isGroup - 是否群聊
   * @param {boolean} e.isGuild - 是否频道
   * @param {boolean} e.isMaster - 是否主人
   * @param {string} e.logText - 日志用户字符串
   * @param {string} e.logFnc - 日志方法字符串
   */
  norm (e) {
    /** 处理后的文本 */
    e.msg = ''
    /** 判断指定游戏 */
    e.game = ''
    /** 图片数组 */
    e.img = []
    /** at */
    e.at = ''
    e.atBot = false
    /** 文件 */
    e.file = {}
    /** 引用回复消息id */
    e.reply_id = ''
    /** 是否为主人 */
    e.isMaster = false
    /** 是否为私聊 */
    e.isPrivate = false
    /** 是否为群聊 */
    e.isGroup = false
    /** 是否为频道 */
    e.isGuild = false
    /** 日志用户字符串 */
    e.logText = ''
    /** 日志方法字符串 */
    e.logFnc = ''
    /** 加入bot */
    Object.defineProperty(e, 'bot', { value: Bot.adapter[e.self_id] })
    return e
  }

  /**
 * 根据事件类型过滤事件
 * @param {Object} e - 事件对象
 * @param {Object} v - 验证对象
 * @returns {boolean} - 是否匹配事件
 */
  filtEvent (e, v) {
    /** 如果验证对象中没有event属性，则返回false */
    if (!v.event) return false

    /** 分割事件字符串为数组 */
    const event = v.event.split('.')
    /** 事件映射表 */
    const eventMap = {
      message: ['post_type', 'message_type', 'sub_type'],
      notice: ['post_type', 'notice_type', 'sub_type'],
      request: ['post_type', 'request_type', 'sub_type']
    }

    /** 构建新的事件 */
    let newEvent = event.map((i, index) => i === '*' ? '*' : e[eventMap[e.post_type][index]])

    /** 重新组合成为字符串以进行匹配 */
    newEvent = newEvent.join('.')

    /** 返回验证对象的event属性是否与新构建的事件字符串相等 */
    return v.event === newEvent
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

  /** 处理回复,捕获发送失败异常 */
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
      } catch (err) {
        if (typeof msg != 'string') {
          if (msg.type == 'image' && Buffer.isBuffer(msg?.file)) msg.file = {}
          msg = lodash.truncate(JSON.stringify(msg), { length: 300 })
        }
        logger.error(`发送消息错误:${msg}`)
        logger.error(err)
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
      if (Cfg.blackList.includes(app.apps)) return true
      /** 检查单插件是否处于功能黑名单 */
      if (Cfg.blackList.includes(`${app.apps}/${app.name}`)) return true
      return false
    }
    return false
  }
}
