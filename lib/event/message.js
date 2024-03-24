import lodash from 'lodash'
import util from 'node:util'
import loader from '../plugins/loader.js'
import Event from './event.js'
import { Cfg, logger } from '#Karin'

/** 消息事件 */
class Message extends Event {
  /** 处理消息事件 */
  async deal (e) {
    /** 加入通用字段 确保所有事件的e都带有这些参数 */
    e = this.norm(e)
    /** 处理消息 */
    this.dealMsg(e)
    /** 处理回复 */
    this.reply(e)

    /* eslint-disable no-labels */
    a:
    for (const app of loader.priority) {
      /** 判断事件 */
      if (app.event && !this.filtEvent(e, app)) continue

      /** 正则匹配 */
      for (const v of app.rule) {
        const regExp = new RegExp(v.reg)
        if (regExp.test(e.msg)) {
          /** 检查功能黑名单 */
          if (this.blacklistAPP(app)) break a

          /** 判断子事件 */
          if (v.event && !this.filtEvent(e, v)) continue

          e.logFnc = `[${app.plugin}][${v.fnc}]`

          v.log(e.self_id, `${e.logFnc}${e.logText} ${lodash.truncate(e.msg, { length: 80 })}`)

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
              v.log(e.self_id, `${e.logFnc} ${lodash.truncate(e.msg, { length: 80 })} 处理完成 ${Date.now() - start}ms`)
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

  /**
   * 处理消息，加入自定义字段
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
  dealMsg (e) {
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
        case 'reply':
          e.reply_id = val.data.id
          break
        case 'xml':
        case 'json':
          e.msg += val.data.data
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
}

export default new Message()
