import type { logger as Logger } from '@karinjs/logger'

export type LoggerType = typeof Logger | Console
export let logger: LoggerType = console

/**
 * 注入自定义 logger 实例
 * @param customLogger - 自定义 logger
 */
export const injectLogger = (customLogger: LoggerType): void => {
  logger = customLogger
}
