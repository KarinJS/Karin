import chalk from 'chalk'

/** 所有日志等级 */
export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off'

/** 日志方法名称 */
export type LogMethodNames = Exclude<LoggerLevel, 'off'>

/** 仅包含日志方法的Logger类型 */
export type LogMethodsOnly = Pick<Logger, LogMethodNames>

/**
 * @description 日志接口
 */
export interface Logger {
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

  /**
   * @description 构建自定义前缀函数
   * @param prefix - 前缀
   * @returns 返回一个函数
   */
  prefix: (prefix: string) => (level: LogMethodNames, ...args: any[]) => void

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

  /** @description 获取、设置日志等级 */
  level: LoggerLevel

  /** @description 获取当前配置 */
  readonly config: LoggerConfig

  /**
   * @description 设置新的配置
   * @param config - 日志配置
   */
  configure (config: Partial<LoggerConfig>): void

  /** @description 关闭并清理资源 */
  close (): void
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
  /** @description 日志前缀 @default '' */
  prefix: string

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
  prefix: '',
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

/**
 * @description 日志级别优先级
 */
export const LoggerLevelPriority: Record<LoggerLevel, number> = {
  trace: 111,
  debug: 222,
  info: 333,
  warn: 444,
  error: 555,
  fatal: 666,
  mark: 777,
  off: 888,
}

/**
 * @description 日志输出接口
 */
export interface LogWriter {
  /**
   * @description 输出日志
   * @param level - 日志级别
   * @param message - 日志消息
   */
  write (level: LoggerLevel, message: string): void

  /**
   * @description 关闭输出
   */
  close?(): void
}
