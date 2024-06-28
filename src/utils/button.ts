import logger from './logger'
import { KarinMessage } from 'karin/event/message'
import { pluginLoader as loader, Plugin } from 'karin/core'

export const button = async (e: KarinMessage) => {
  const button = []
  for (const v of loader.buttonIds) {
    const info = loader.PluginList[v]
    for (const v of info.button) {
      const reg = v.reg as RegExp
      if (reg.test(e.msg)) {
        try {
          let res
          let done = true
          /**
           * 标记函数 如果调用则继续执行 循环下一个按钮插件处理
           */
          const reject = () => { done = false }
          if (typeof v.fnc === 'function') {
            res = await v.fnc(e, reject)
          } else {
            const cla = new (info.file.Fnc as new () => Plugin)()
            cla.e = e
            res = await (cla[v.fnc as keyof typeof cla] as Function)(e, reject)
          }

          if (res) button.push(res)
          if (done) return res
        } catch (error) {
          logger.error(error)
        }
      }
    }
  }
  /** 理论上不会走到这里，但是还是要稳一手，不排除有所有插件都false... */
  return button
}
