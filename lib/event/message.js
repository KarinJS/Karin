import lodash from 'lodash'
import util from 'node:util'
import loader from '../plugins/loader.js'
import { Bot, Cfg, common, logger, segment } from '#Karin'

/** 消息事件 */
class Message {
  /** 处理消息事件 */
  async deal (e) {
    /** 加入bot 或许后续考虑兼容内置icqq？ */
    Object.defineProperty(e, 'bot', { value: Bot.adapter[e.self_id] })
    /** 处理消息 */
    this.dealMsg(e)
    /** 处理回复 */
    this.reply(e)

    /* eslint-disable no-labels */
    a:
    for (const app of loader.priority) {
      /** 正则匹配 */
      if (app.rule) {
        for (const v of app.rule) {
          const regExp = new RegExp(v.reg)
          if (regExp.test(e.msg)) {
            /** 使用lodash检查功能黑名单是否为空 不为空则执行检查 */
            if (!lodash.isEmpty(Cfg.blackList)) {
              /** 检查插件包是否处于功能黑名单 */
              if (Cfg.blackList.includes(app.apps)) break a
              /** 检查单插件是否处于功能黑名单 */
              if (Cfg.blackList.includes(`${app.apps}/${app.name}`)) break a
            }

            /** 判断事件 */
            if (v.event && !this.filtEvent(e, v)) continue

            e.logFnc = `[${app.name}][${v.fnc}]`

            if (v.log !== false) {
              logger.mark(common.logger(e.self_id, `${e.logFnc}${e.logText} ${lodash.truncate(e.msg, { length: 80 })}`))
            }

            /** 判断权限 */
            if (!this.filtPermission(e, v)) break a

            try {
              /** 实例化 */
              const App = new app.App()
              App.e = e
              let res = App[v.fnc] && App[v.fnc](e)

              /** 计算插件处理时间 */
              let start = Date.now()

              if (util.types.isPromise(res)) res = await res

              if (res !== false) {
                if (v.log !== false) {
                  logger.info(common.logger(e.self_id, `${e.logFnc} ${lodash.truncate(e.msg, { length: 80 })} 处理完成 ${Date.now() - start}ms`))
                }
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
    }
  }

  /** 过滤事件 */
  filtEvent (e, v) {
    // 如果v中没有event属性，则返回false
    if (!v.event) return false
    // 将v.event按"."分割成数组
    let event = v.event.split('.')
    // 事件映射表，根据post_type确定需要比较的属性
    let eventMap = {
      message: ['post_type', 'message_type', 'sub_type'],
      notice: ['post_type', 'notice_type', 'sub_type'],
      request: ['post_type', 'request_type', 'sub_type']
    }
    let newEvent = []
    // 遍历分割后的事件数组
    event.forEach((val, index) => {
      // 如果事件为通配符"*"，则直接添加到新事件数组中
      if (val === '*') {
        newEvent.push(val)
        // 如果事件映射表中存在当前事件的post_type对应的属性
      } else if (eventMap[e.post_type]) {
        // 添加映射表中对应属性的值到新事件数组中
        newEvent.push(e[eventMap[e.post_type][index]])
      }
    })
    // 将新事件数组转换成字符串形式
    newEvent = newEvent.join('.')
    // 返回v.event是否等于新事件字符串
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

  /**
   * 处理消息，加入自定义字段
   * @param e.msg 文本消息，多行会自动拼接
   * @param e.game 判断指定游戏
   * @param e.img 图片消息数组
   * @param e.atBot 是否at机器人
   * @param e.at 是否at，多个at 以最后的为准
   * @param e.file 接受到的文件
   * @param e.isPrivate 是否私聊
   * @param e.isGroup 是否群聊
   * @param e.isGuild 是否频道
   * @param e.isMaster 是否主人
   * @param e.logText 日志用户字符串
   * @param e.logFnc  日志方法字符串

   */
  dealMsg (e) {
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

    for (let val of e.message) {
      switch (val.type) {
        case 'text':
          e.msg += (val.data.text || '').replace(/^\s*[＃井#]+\s*/, '#').replace(/^\s*[\\*※＊]+\s*/, '*').trim()
          break
        case 'image':
          e.img.push(val.data.url)
          break
        case 'at':
          /** atBot不计入e.at */
          if (val.data.qq == e.bot.id) {
            e.atBot = true
          } else {
            e.at = val.data.qq || val.data.id
          }
          break
        case 'file':
          e.file = val.data
          break
      }
    }

    if (e.message_type === 'private' || e.notice_type === 'friend') {
      e.isPrivate = true
      e.logText = `[私聊:${e.sender.nickname || ''}(${e.user_id})]`
    } else if (e.message_type === 'group' || e.notice_type === 'group') {
      e.isGroup = true
      e.logText = `[群聊:${e.group_id}-${e.user_id}(${e.sender.card || e.sender.nickname || ''})]`
    }

    if (Cfg.master.includes(Number(e.user_id) || String(e.user_id))) e.isMaster = true

    /** 星铁命令前缀 */
    const srReg = /^#?(\*|星铁|星轨|穹轨|星穹|崩铁|星穹铁道|崩坏星穹铁道|铁道)+/
    if (srReg.test(e.msg)) {
      e.game = 'sr'
      e.msg = e.msg.replace(srReg, '#星铁')
    }
  }

  /** 处理回复,捕获发送失败异常 */
  reply (e) {
    e.replyNew = e.reply

    /**
     * @param msg 发送的消息
     * @param quote 是否引用回复
     * @param data.recallMsg 群聊是否撤回消息，0-120秒，0不撤回
     * @param data.at 是否at用户
     */
    e.reply = async (msg = '', quote = false, data = {}) => {
      if (!msg) throw new Error('回复消息不能为空')

      /** 将msg格式化为oneBot11格式 什么?你问我12呢? = =我怎么知道??? */
      if (!Array.isArray(msg)) {
        msg = typeof msg == 'string' ? [segment.text(msg)] : [msg]
      }

      let { recallMsg = 0, at = '' } = data

      /** 加入at */
      if (at && e.isGroup) msg.unshift(segment.at(at))

      let msgRes
      try {
        msgRes = await e.replyNew(msg, quote)
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
  }
}

export default new Message()
