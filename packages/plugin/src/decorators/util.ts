import { randomUUID } from 'node:crypto'

/** 处理函数类型 */
export type FNC<T> = (e: T, next: () => void) => unknown | Promise<unknown>

/** 格式化reg */
export const formatReg = (reg: string | RegExp): RegExp => {
  return reg instanceof RegExp ? reg : new RegExp(reg)
}

/**
 * 创建插件唯一ID
 * @returns 唯一ID
 */
export const createID = () => {
  return randomUUID()
}

/**
 * 创建日志方法
 * @param enable 是否启用
 * @param isBot 是否为bot
 */
export const createLogger = <T extends boolean> (
  enable?: boolean,
  isBot?: T
): T extends true ? (id: string, log: string) => void : (log: string) => void => {
  if (isBot) {
    const fnc = enable === false
      ? (id: string, log: string) => logger.bot('debug', id, log)
      : (id: string, log: string) => logger.bot('mark', id, log)
    return fnc as any
  }

  return enable === false
    ? (log: string) => logger.debug(log)
    : (log: string) => logger.mark(log)
}
