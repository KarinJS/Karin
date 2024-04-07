import lodash from 'lodash'
import util from 'node:util'
import loader from '../plugins/loader.js'
import Event from './event.js'
import { Cfg, logger, common } from '#Karin'
// eslint-disable-next-line no-unused-vars
import { KarinMessage } from './type.js'

/** 消息事件 */
class Message extends Event {
  /**
   * 处理消息
   * @param {KarinMessage} e - 消息事件
   */
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
          if (!this.filterPermission(e, v)) break a

          try {
            /**
             * 插件对象
             * @param {any} App - 插件对象
             * @param {EventType.Message} App.e - 事件对象
             */
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
   * 处理消息体
   * @param {EventType.Message} e - 消息事件
   */
  dealMsg (e) {
    for (let val of e.elements) {
      switch (val.type) {
        case 'text': {
          const msg = (val.text || '').replace(/^\s*[＃井#]+\s*/, '#').replace(/^\s*[\\*※＊]+\s*/, '*').trim()
          e.msg += msg
          e.raw_message += msg
          break
        }
        case 'image':
          e.img.push(val.file)
          e.raw_message += `<image file=${val.file}> `
          break
        case 'at':
          /** atBot不计入e.at */
          if (val.uid == e.bot.account.uid) {
            e.atBot = true
          } else if (val.uin == e.bot.account.uin) {
            e.atBot = true
          } else {
            e.at = val.uid || val.uin
          }
          e.raw_message += `<at uid=${val.uid}, uin=${val.uin}> `
          break
        case 'file':
          e.file = val
          e.raw_message += `<file file=${val.file}> `
          break
        case 'reply':
          e.reply_id = val.id
          e.raw_message += `<reply id=${val.id}> `
          break
        case 'xml':
          e.msg += val.data
          e.raw_message += `<xml data=${val.data}> `
          break
        case 'json':
          e.msg += val.data
          e.raw_message += `<xml data=${val.data}> `
          break
        case 'face':
          e.raw_message += `<face id=${val.id}> `
          break
        case 'video':
          e.raw_message += `<video file=${val.file}> `
          break
        case 'flash':
          e.raw_message += `<flash file=${val.file}> `
          break
        case 'record':
          e.raw_message += `<record file=${val.file}> `
          break
        default: {
          const { type, ...data } = val
          e.raw_message += `<${type} data=${JSON.stringify(data)}> `
          break
        }
      }
    }

    /** 星铁命令前缀 */
    const srReg = /^#?(\*|星铁|星轨|穹轨|星穹|崩铁|星穹铁道|崩坏星穹铁道|铁道)+/
    if (srReg.test(e.msg)) {
      e.game = 'sr'
      e.msg = e.msg.replace(srReg, '#星铁')
    }

    /** 主人 */
    if (Cfg.master.includes(Number(e.user_id) || String(e.user_id))) e.isMaster = true

    if (e.contact.scene === 'friend') {
      e.isPrivate = true
      e.logText = `[Private:${e.sender.nick || ''}(${e.user_id})]`
      logger.info(common.logger(e.self_id, `私聊：[${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
    } else if (e.contact.scene === 'group') {
      e.isGroup = true
      e.logText = `[Group:${e.group_id}-${e.user_id}(${e.sender.nick || ''})]`
      logger.info(common.logger(e.self_id, `群消息：[${e.group_id}-${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
    } else {
      logger.info(common.logger(e.self_id, `未知消息：${JSON.stringify(e)}`))
    }
  }
}

export default new Message()
