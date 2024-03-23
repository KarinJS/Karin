import lodash from 'lodash'
import util from 'node:util'
import Event from './event.js'
import loader from '../plugins/loader.js'
import { common, logger } from '#Karin'

/** 通知事件 */
class Notice extends Event {
  /** 处理通知事件 */
  async deal (e) {
    /** 加入通用字段 确保所有事件的e都带有这些参数 */
    e = this.norm(e)
    /** 处理回复 */
    this.reply(e)

    /* eslint-disable no-labels */
    a:
    for (const app of loader.priority) {
      /** accept hook */
      if (app.accept) {
        /** 检查功能黑名单 */
        if (this.blacklistAPP(app)) break a

        /** 判断事件 */
        if (app.event && !this.filtEvent(e, app)) continue

        /** 日志方法字符串 */
        e.logFnc = `[${app.name.replace('apps/', '')}][accept]`

        if (app.log !== false) {
          logger.mark(common.logger(e.self_id, `${e.logFnc}${e.logText} ${lodash.truncate(e.msg, { length: 80 })}`))
        }

        /** 判断权限 */
        if (!this.filtPermission(e, app)) break a

        try {
          /** 实例化 */
          const App = new app.App()
          App.e = e
          let res = App.accept && App.accept(e)

          /** 计算插件处理时间 */
          let start = Date.now()

          if (util.types.isPromise(res)) res = await res

          if (res !== false) {
            if (app.log !== false) {
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

export default new Notice()
