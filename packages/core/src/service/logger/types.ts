import chalk from 'chalk'
import type { Logger as Log4jsLogger } from 'log4js'

/**
 * @description 所有日志等级
 * @description 请使用`LogMethodNames`类型来获取日志方法名称
 */
export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off'

/** 日志方法名称 */
export type LogMethodNames = Exclude<LoggerLevel, 'off'>

/** 仅包含日志方法的Logger类型 */
export type LogMethodsOnly = Pick<Logger, LogMethodNames>

/**
 * @description 日志接口
 */
export interface Logger extends Log4jsLogger {
  /** @description chalk模块 */
  chalk: typeof chalk
  /** @description 将文本设置为红色 */
  red: typeof chalk.red
  /** @description 将文本设置为绿色 */
  green: typeof chalk.green
  /** @description 将文本设置为黄色 */
  yellow: typeof chalk.yellow
  /** @description 将文本设置为蓝色 */
  blue: typeof chalk.blue
  /** @description 将文本设置为品红色 */
  magenta: typeof chalk.magenta
  /** @description 将文本设置为青色 */
  cyan: typeof chalk.cyan
  /** @description 将文本设置为白色 */
  white: typeof chalk.white
  /** @description 将文本设置为灰色 */
  gray: typeof chalk.gray
  /** @description 将文本设置为紫色 */
  violet: ReturnType<typeof chalk.hex>
  /** @description 将文本设置为触发函数的颜色 */
  fnc: ReturnType<typeof chalk.hex>

  /**
   * @description 打印Bot前缀日志
   * @param level - 日志等级
   * @param id - Bot ID
   * @param args - 日志内容
   */
  bot: (level: LogMethodNames, id: string, ...args: any[]) => void

  /** @description 打印追踪日志 */
  trace (...args: any[]): void

  /** @description 打印调试日志 */
  debug (...args: any[]): void

  /** @description 打印信息日志 */
  info (...args: any[]): void

  /** @description 打印警告日志 */
  warn (...args: any[]): void

  /** @description 打印错误日志 */
  error (...args: any[]): void

  /** @description 打印致命日志 */
  fatal (...args: any[]): void

  /** @description 打印标记日志 */
  mark (...args: any[]): void

  /** @description 关闭日志 */
  off (): void

  /** @description 打印日志 跟`info`日志相同 */
  log (...args: any[]): void
}

/**
 * @description 文件日志配置
 */
export interface FileLogConfig {
  /** @description 是否启用文件日志 @default false */
  enabled: boolean

  /** @description 日志文件目录 @default 'logs' */
  dir: string

  /** @description 文件日志级别(默认与控制台相同) */
  level?: LoggerLevel

  /** @description 日志文件保留天数 @default 14 */
  daysToKeep: number

  /**
   * @description 是否启用整体化模式(按日期每天一个日志文件)
   * @default true
   */
  enableWholeMode: boolean

  /**
   * @description 是否启用碎片化模式(按大小分片)
   * @default false
   */
  enableFragmentMode: boolean

  /** @description 碎片化模式下，单个日志文件的最大大小(MB) @default 10 */
  maxFileSize: number

  /** @description 是否单独保存错误和致命日志 @default true */
  separateErrorLog: boolean
}

/**
 * @description 日志配置
 */
export interface LoggerConfig {
  /** @description 日志级别 @default 'info' */
  level: LoggerLevel

  /** @description `logger.fnc`自定义颜色 @default '#FFFF00' */
  color?: string

  /** @description 文件日志配置 */
  file: FileLogConfig
}

/**
 * @description 默认配置
 */
export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  level: 'info',
  file: {
    enabled: false,
    dir: 'logs',
    daysToKeep: 14,
    enableWholeMode: true,
    enableFragmentMode: false,
    maxFileSize: 10,
    separateErrorLog: true,
  },
}
