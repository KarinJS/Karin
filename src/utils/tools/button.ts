import logger from '../core/logger'
import { ButtonElement, KarinMessageType, KeyBoardElement } from 'karin/types'
import { pluginLoader as loader } from 'karin/core'

/**
 * 按钮处理器类
 * @param msg 传e.msg就行
 * @param e 消息事件 可不传
 * @param arg 自定义参数 可不传
 * @returns 返回按钮元素
 */
export const button = async (msg: string, e?: KarinMessageType, ...arg: any[]) => {
  const button: Array<ButtonElement | KeyBoardElement> = []
  for (const info of loader.button) {
    const reg = info.reg
    if (reg.test(msg)) {
      try {
        let isnext = false
        /** 如果调用则继续执行 循环下一个按钮插件处理 */
        const next = () => { isnext = true }
        const list = await info.fn(next, e, arg)

        if (list) {
          if (Array.isArray(list)) {
            button.push(...list)
          } else {
            button.push(list)
          }
        }

        if (!isnext) return button
      } catch (error) {
        logger.error(`[Button][Error]: [${info.name}]:`)
        logger.error(error)
      }
    }
  }
  /** 理论上不会走到这里，但是还是要稳一手，不排除有所有插件都false... */
  return button
}
