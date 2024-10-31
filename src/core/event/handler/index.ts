import { Event } from '../joint'

/**
 * 打印handler日志
 * @param args 日志参数
 */
export const log = (...args: string[]) => logger.handler(`${logger.violet('[消息拦截]')}${args.join('')}`)

/**
 * 传入一个event对象，检查是否存在对应的bot方法，不存在则添加
 * @param event
 */
export const checkBotMethod = (event: Event) => {
  if (event.bot) return event
  // TODO: 未完成
  return event
}
