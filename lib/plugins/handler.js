import { logger } from '#Karin'
import lodash from 'lodash'
import util from 'util'

let events = {}
let Handler = {
  add ({ name, dir, App, Class }) {
    for (const cfg of Class.handler) {
      const { key = '', fnc = '', priority = 2000 } = cfg
      if (!key) return logger.error(`[Handler][Add]: [${name}] 缺少 key`)
      if (!fnc) return logger.error(`[Handler][Add]: [${name}] 缺少 fnc`)
      logger.mark(`[Handler][Reg]: [${name}][${key}]`)
      if (!Array.isArray(events[key])) events[key] = []
      events[key].push({ file: { name, dir }, App, key, fnc, priority })
      events[key] = lodash.orderBy(events[key], ['priority'], ['asc'])
    }
  },
  del ({ dir, name, key = '' }) {
    if (!key) {
      for (let key in events) {
        Handler.del({ dir, name, key })
      }
      return
    }
    if (!events[key]) return
    events[key] = events[key].filter(v => v.file.dir !== dir || v.file.name !== name)
    events[key] = lodash.orderBy(events[key], ['priority'], ['asc'])
  },
  async call (key, e, args, allHandler = false) {
    let ret
    for (let v of events[key]) {
      const App = new v.App()
      App.e = e
      let done = true
      let reject = (msg = '') => {
        if (msg) {
          logger.mark(`[Handler][Reject]: [${v.name}][${key}] ${msg}`)
        }
        done = false
      }
      ret = App[v.fnc] && App[v.fnc](e, args, reject)
      if (util.types.isPromise(ret)) {
        ret = await ret
      }
      if (done && !allHandler) {
        logger.mark(`[Handler][Done]: [${v.name}][${key}]`)
        return ret
      }
    }
    return ret
  },
  has (key) {
    return !!events[key]
  }
}
export default Handler
