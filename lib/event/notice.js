import lodash from 'lodash'
import util from 'node:util'
import Event from './event.js'
import loader from '../plugins/loader.js'
import { common, logger, Cfg } from '#Karin'

/** 通知、请求事件 */
class Notice extends Event {
  /**
 * 处理事件，加入自定义字段
 * @param {KarinNotice} e - 包含消息信息的对象
 */
  async deal (e) {
    /** 加入通用字段 确保所有事件的e都带有这些参数 */
    e = this.norm(e)
    /** 处理回复 */
    this.reply(e)

    /** 主人 */
    if (Cfg.master.includes(Number(e.user_id) || String(e.user_id))) e.isMaster = true

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
        /** 检查功能黑名单 */
        if (this.blacklistAPP(app)) break a

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
            logger.info(common.logger(e.self_id, `${e.logFnc} ${lodash.truncate(e.msg, { length: 80 })} 处理完成 ${Date.now() - start}ms`))
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

export default new Notice()
