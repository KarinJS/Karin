import { cache } from '@/plugin/system/cache'
import type { Event } from '@/types/event'
import type { ButtonElement, KeyboardElement } from '@/types/segment'

/**
 * 调用按钮处理器
 * @param msg 传e.msg就行
 * @param e 消息事件 可不传
 * @param arg 自定义参数 可不传
 * @returns 返回按钮元素
 */
export const buttonHandle = async (reg: string, args?: { e?: Event, [key: string]: any }) => {
  const button: Array<ButtonElement | KeyboardElement> = []
  for (const info of cache.button) {
    const regExp = info.reg
    if (regExp.test(reg)) {
      try {
        let isnext = false
        /** 如果调用则继续执行 循环下一个按钮插件处理 */
        const next = () => { isnext = true }
        const list = await info.fnc(next, args)

        if (list) {
          if (Array.isArray(list)) {
            button.push(...list)
          } else {
            button.push(list)
          }
        }

        if (!isnext) return button
      } catch (error) {
        logger.error(`[Button][Error] ${info.pkg.name}:`)
        logger.error(error)
      }
    }
  }

  /** 理论上不会走到这里，但是还是要稳一手，不排除有所有插件都false... */
  return button
}
