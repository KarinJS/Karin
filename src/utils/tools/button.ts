import logger from '../core/logger'
import { KarinMessageType } from 'karin/types'
import { pluginLoader as loader } from 'karin/core'

export const button = async (msg: string, e?: KarinMessageType) => {
  const button = []
  for (const info of loader.button) {
    const reg = info.reg
    if (reg.test(msg)) {
      try {
        let done = true
        /**
         * 标记函数 如果调用则继续执行 循环下一个按钮插件处理
         */
        const reject = () => { done = false }
        const res = await info.fn(reject, e)

        if (res) button.push(res)
        if (done) return res
      } catch (error) {
        logger.error(error)
      }
    }
  }
  /** 理论上不会走到这里，但是还是要稳一手，不排除有所有插件都false... */
  return button
}
