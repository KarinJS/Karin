/**
 * 信号监听模块
 * 处理进程信号、错误捕获和优雅退出
 */

import { logger } from './logger'

let isExiting = false

/**
 * 初始化信号监听
 * @param title - 进程标题
 */
export const initSignals = () => {
  /** 设置进程标题 */
  process.title = `karin v${process.env.KARIN_VERSION} © ${new Date().getFullYear()} - Karinjs`

  /** 捕获终止信号 */
  const signals: NodeJS.Signals[] = ['SIGHUP', 'SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGQUIT']
  signals.forEach(signal => process.once(signal, () => exit()))
  process.once('exit', exit)

  /** 捕获IPC断开 */
  process.once('disconnect', () => exit())

  /** 捕获异常错误 */
  process.on('uncaughtException', (error, origin) => logger.error(error, origin))
  process.on('unhandledRejection', (error, promise) => logger.error(error, promise))
  process.on('rejectionHandled', (error) => logger.error(error))
}

/**
 * 手动触发进程退出
 * @param exitCode - 退出码，默认为 0
 */
export const exit = (exitCode: unknown = 0) => {
  if (isExiting) return
  isExiting = true
  process.exit(exitCode as number)
}
