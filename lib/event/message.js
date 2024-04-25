import lodash from 'lodash'
import util from 'util'
import Event from './event.js'
import other from '../config/other.js'
import loader from '../plugins/loader.js'
import { stateArr } from '../plugins/plugin.js'
import { Bot, Cfg, common, logger } from '#Karin'
// eslint-disable-next-line no-unused-vars
import { KarinMessage } from '../bot/KarinMessage.js'

/** 消息事件 */
class Message extends Event {
  /**
   * 处理消息
   * @param {KarinMessage} e - 消息事件
   */
  async deal (e) {
    Bot.emit('karin:count:recv', 1)
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
    /** 处理消息 */
    this.dealMsg(e)

    /** 响应模式 */
    if (!other.mode(e)) return logger.debug('[消息拦截] 响应模式不匹配')

    /** 处理回复 */
    this.reply(e)
    /** 上下文 */
    if (this.context(e)) return

    /* eslint-disable no-labels */
    a:
    for (const app of loader.Apps) {
      /** 判断事件 */
      if (app.event && !this.filtEvent(e, app)) continue

      /** 判断权限 */
      if (!this.filterPermission(e, app)) break a

      /** 正则匹配 */
      for (const v of app.rule) {
        /** 这里的lastIndex是为了防止正则无法从头开始匹配 */
        v.reg.lastIndex = 0
        if (v.reg.test(e.msg)) {
          /** 检查白名单插件 */
          if (!other.white_list_app(e, app)) continue
          /** 检查黑名单插件 */
          if (other.black_list_app(e, app)) continue

          /** 判断子事件 */
          if (v.event && !this.filtEvent(e, v)) continue

          e.logFnc = `[${app.file.dir}][${app.name}][${v.fnc}]`

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
            Bot.emit('karin:count:fnc', e.logFnc)
            if (util.types.isPromise(res)) res = await res
            v.log(e.self_id, `${e.logFnc} ${lodash.truncate(e.msg, { length: 80 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
            if (res !== false) break a
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
    const logs = []
    for (let val of e.elements) {
      switch (val.type) {
        case 'text': {
          const msg = (val.text || '').replace(/^\s*[＃井#]+\s*/, '#').replace(/^\s*[\\*※＊]+\s*/, '*').trim()
          e.msg += msg
          /** 美观一点... */
          logs.push(msg)
          break
        }
        case 'face':
          logs.push(`[face:${val.id}]`)
          break
        case 'video':
        case 'record':
          logs.push(`[${val.type}:${val.file}]`)
          break
        case 'image':
          e.image.push(val.file)
          logs.push(`[image:${val.file}]`)
          break
        case 'file':
          e.file = val
          logs.push(`[file:${val.file}]`)
          break
        case 'at':
          /** atBot不计入e.at */
          if (val.uid && val.uid == e.bot.account.uid) {
            e.atBot = true
          } else if (val.uin == e.bot.account.uin) {
            e.atBot = true
          } else if (val.uid && val.uid === 'all') {
            e.atAll = true
          } else {
            e.at.push(val.uid || val.uin)
          }
          logs.push(`[at:${val.uid || val.uin}]`)
          break
        case 'rps':
          logs.push(`[rps:${val.id}]`)
          break
        case 'dice':
          logs.push(`[dice:${val.id}]`)
          break
        case 'shake':
          logs.push('[shake: 窗口抖动]')
          break
        case 'poke':
          logs.push(`[poke:${val.id}]`)
          break
        case 'anonymous':
          logs.push(`[anonymous:${val.id}]`)
          break
        case 'share':
          logs.push(`[share:${val.url}]`)
          break
        case 'contact':
          logs.push(`[contact:${val.id}]`)
          break
        case 'location':
          logs.push(`[location:${val.lat}-${val.lon}]`)
          break
        case 'music':
          logs.push(`[music:${JSON.stringify(val)}]`)
          break
        case 'reply':
          e.reply_id = val.message_id
          logs.push(`[reply:${val.message_id}]`)
          break
        case 'forward':
          logs.push(`[forward:${val.id}]`)
          break
        case 'node':
          logs.push(`[node:${JSON.stringify(val)}]`)
          break
        case 'xml':
          e.msg += val.data
          logs.push(`[xml:${val.data}]`)
          break
        case 'json':
          e.msg += val.data
          logs.push(`[json:${val.data}]`)
          break
        case 'markdown': {
          if (val.content) {
            logs.push(`[markdown:${val.markdown}]`)
          } else {
            let content = { id: val.custom_template_id }
            for (let v of val.params) content[v.key] = v.values[0]
            logs.push(`[markdown:${JSON.stringify(content)}]`)
          }
          break
        }
        case 'rows': {
          const rows = []
          for (let v of val.rows) rows.push(v.log)
          logs.push(`[rows:${JSON.stringify(rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${val.log}]`)
          break
        default:
          logs.push(`[未知:${JSON.stringify(val)}]`)
      }
    }
    e.raw_message = logs.join('')

    /** 前缀处理 */
    other.ailas(e)

    /** 星铁命令前缀 */
    const srReg = /^#?(\*|星铁|星轨|穹轨|星穹|崩铁|星穹铁道|崩坏星穹铁道|铁道)+/
    if (srReg.test(e.msg)) {
      e.game = 'sr'
      e.msg = e.msg.replace(srReg, '#星铁')
    }

    /** 主人 */
    if (Cfg.master.includes(Number(e.user_id) || String(e.user_id))) e.isMaster = true
    /** 管理员 */
    if (Cfg.admin.includes(Number(e.user_id) || String(e.user_id))) e.isAdmin = true

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

  /**
   * 处理上下文
   * @param {EventType.Message} e - 消息事件
   * @returns {boolean} 是否有上下文
   */
  context (e) {
    let key = e.isGroup ? `${e.group_id}.${e.user_id}` : e.user_id
    const App = stateArr[key]
    if (App) {
      const { plugin, fnc } = App
      e.logFnc = `[${plugin.name}][${fnc}]`
      /** 计算插件处理时间 */
      let start = Date.now()
      plugin.e = e
      let res = plugin[fnc] && plugin[fnc](e)
      if (util.types.isPromise(res)) {
        res.then(() => {
          logger.mark(common.logger(e.self_id, `${e.logFnc} 上下文处理完成 ${Date.now() - start}ms`))
          return res
        }).catch((error) => {
          logger.error(`${e.logFnc}`)
          logger.error(error.stack)
        })
      } else {
        logger.mark(common.logger(e.self_id, `${e.logFnc} 上下文处理完成 ${Date.now() - start}ms`))
      }
      return true
    }
    return false
  }
}

export default new Message()
