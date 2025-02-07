import { processExit } from './exit'
import { listeners } from '@/core/internal/listeners'

/** 处理基本信号 */
export const processHandler = () => {
  /** 监听挂起信号 在终端关闭时触发 */
  process.once('SIGHUP', code => processExit(code))
  /** 监听中断信号 用户按下 Ctrl + C 时触发 */
  process.once('SIGINT', code => processExit(code))
  /** 监听终止信号 程序正常退出时触发 */
  process.once('SIGTERM', code => processExit(code))
  /** 监听退出信号 windows下程序正常退出时触发 */
  process.once('SIGBREAK', code => processExit(code))
  /** 监听退出信号 与 SIGINT 类似，但会生成核心转储 */
  process.once('SIGQUIT', code => processExit(code))
  /** 捕获警告 */
  process.on('warning', warning => listeners.emit('warn', warning))
  /** 捕获错误 */
  process.on('uncaughtException', (error, origin) => {
    listeners.emit('error', error, origin)
  })
  /** 捕获未处理的Promise错误 */
  process.on('unhandledRejection', (error, promise) => {
    listeners.emit('error', error, promise)
  })
  /** 捕获Promise错误 */
  process.on('rejectionHandled', error => {
    listeners.emit('error', error)
  })

  listeners.on('error', (...args: [unknown]) => {
    logger.error(...args)
  })

  /** 如果是pm2环境 设置运行器为pm2 */
  if (process.env.pm_id) process.env.RUNTIME = 'pm2'
}
