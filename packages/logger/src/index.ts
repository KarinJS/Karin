import fs from 'node:fs'
import chalk from 'chalk'
import log4js from 'log4js'

import type { Level, Configuration, Logger as Log4jsLogger } from 'log4js'

/** 全局声明，使TypeScript识别全局logger变量 */
declare global {
  var logger: Logger
}

/**
 * @description 所有日志等级
 * @description 请使用`LogMethodNames`类型来获取日志方法名称
 */
export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off'

/** 日志方法名称 */
export type LogMethodNames = Exclude<LoggerLevel, 'off'>

/** 仅包含日志方法的Logger类型 */
export type LogMethodsOnly = Pick<Logger, LogMethodNames>

/** 带前缀的日志方法 */
export interface Prefix<T extends readonly any[]> {
  trace: (...args: [...T, ...any[]]) => void
  debug: (...args: [...T, ...any[]]) => void
  info: (...args: [...T, ...any[]]) => void
  warn: (...args: [...T, ...any[]]) => void
  error: (...args: [...T, ...any[]]) => void
  fatal: (...args: [...T, ...any[]]) => void
  mark: (...args: [...T, ...any[]]) => void
  log: (...args: [...T, ...any[]]) => void
  level: Level | string
}

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

  /**
   * @description 创建带固定前缀的Logger
   * @param prefix - 前缀字符串
   * @example
   * ```ts
   * // 接受任何参数
   * const log = logger.prefix('test')
   *
   * // 所有方法接受一个数字和任何参数
   * const log = logger.prefix<[number]>('test')
   * log.trace(1, 'trace message')
   * log.info(3, 'info message')
   *
   * // 接受字符串、数字和任何参数
   * const log = logger.prefix<[number, string]>('test')
   * log.trace('log', 1, 'trace message')
   * log.info('log', 3, 'info message')
   * ```
   */
  prefix: <T extends readonly any[] = any[]>(prefix: string) => Prefix<T>

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

/**
 * 创建日志记录器
 * @param isSaveFile - 是否保存到文件
 */
const initLogger = (isSaveFile: boolean = false): Configuration => {
  const level = process.env.LOG_LEVEL as LoggerLevel || 'info'
  const daysToKeep = Number(process.env.LOG_DAYS_TO_KEEP) || 30
  // const maxFileSize = Number(process.env.LOG_MAX_LOG_SIZE) || 0

  const config: Configuration = {
    appenders: {
      console: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: `%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] ${process.env.RUNTIME === 'tsx' ? '[%f{3}:%l] ' : ''}%m`,
        },
      },
    },
    categories: {
      default: {
        appenders: ['console'],
        level,
        enableCallStack: process.env.RUNTIME === 'tsx',
      },
    },
    levels: {
      handler: { value: 15000, colour: 'cyan' },
    },
  }

  if (!isSaveFile) {
    return config
  }

  /** 碎片化: 将日志分片，达到指定大小后自动切割 日志较多的情况下不建议与整体化同时开启 */
  // if (maxFileSize > 0) {
  //   config.categories.default.appenders.unshift('fragments')
  //   config.appenders.fragments = {
  //     type: 'file',
  //     filename: '@karinjs/logs/app.log',
  //     pattern: 'MM-dd.log',
  //     keepFileExt: true,
  //     alwaysIncludePattern: true,
  //     daysToKeep: daysToKeep || 14,
  //     maxLogSize: (maxFileSize || 30) * 1024 * 1024,
  //     /** 最大文件数 */
  //     numBackups: 9999999,
  //     /** 日志输出格式 */
  //     layout: {
  //       type: 'pattern',
  //       pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
  //     },
  //   }
  // }

  config.appenders.overall = {
    /** 输出到文件 */
    type: 'dateFile',
    /** 日志文件名 */
    filename: '@karinjs/logs/logger',
    /** 日期后缀 */
    pattern: 'yyyy-MM-dd.log',
    /** 日期后缀 */
    keepFileExt: true,
    /** 日志文件名中包含日期模式 */
    alwaysIncludePattern: true,
    /** 日志文件保留天数 */
    numBackups: daysToKeep || 14,
    /** 日期后缀分隔符 */
    fileNameSep: '.',
    /** 压缩 */
    // compress: true,
    /** 日志输出格式 */
    layout: {
      type: 'pattern',
      pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
    },
  }

  config.appenders.errorFile = {
    /** 输出到文件 */
    type: 'dateFile',
    /** 日志文件名 */
    filename: '@karinjs/logs/error/logger',
    /** 日期后缀 */
    pattern: 'yyyy-MM-dd.log',
    /** 日期后缀 */
    alwaysIncludePattern: true,
    /** 日志文件保留天数 */
    numBackups: daysToKeep || 14,
    /** 压缩 */
    // compress: true,
    /** 保留文件扩展名 */
    keepFileExt: true,
    /** 日期后缀分隔符 */
    fileNameSep: '.',
    /** 日志输出格式 */
    layout: {
      type: 'pattern',
      pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
    },
  }

  config.appenders.errors = {
    /** 错误日志过滤器 */
    type: 'logLevelFilter',
    /** 目标appender */
    appender: 'errorFile',
    /** 只记录错误级别及以上的日志 */
    level: 'error',
  }

  config.categories.default.appenders.push('overall', 'errors')

  return config
}

/**
 * 为logger添加自定义颜色
 * @param Logger - 日志记录器
 * @param color - 自定义颜色，可选
 */
const addColor = (Logger: log4js.Logger, color?: string) => {
  const logger = Logger as unknown as Logger
  logger.chalk = chalk
  logger.red = chalk.red
  logger.green = chalk.green
  logger.yellow = chalk.yellow
  logger.blue = chalk.blue
  logger.magenta = chalk.magenta
  logger.cyan = chalk.cyan
  logger.white = chalk.white
  logger.gray = chalk.gray
  logger.violet = chalk.hex('#868ECC')
  logger.fnc = chalk.hex(color || '#FFFF00')
  logger.bot = (level, id, ...args) => {
    switch (level) {
      case 'trace':
        return logger.trace(logger.violet(`[Bot:${id}]`), ...args)
      case 'debug':
        return logger.debug(logger.violet(`[Bot:${id}]`), ...args)
      case 'mark':
        return logger.mark(logger.violet(`[Bot:${id}]`), ...args)
      case 'info':
        return logger.info(logger.violet(`[Bot:${id}]`), ...args)
      case 'warn':
        return logger.warn(logger.violet(`[Bot:${id}]`), ...args)
      case 'error':
        return logger.error(logger.violet(`[Bot:${id}]`), ...args)
      case 'fatal':
        return logger.fatal(logger.violet(`[Bot:${id}]`), ...args)
      default:
        return logger.info(logger.violet(`[Bot:${id}]`), ...args)
    }
  }

  logger.prefix = (prefix) => {
    const result: Prefix<any[]> = {
      trace: (...args) => logger.trace(prefix, ...args),
      debug: (...args) => logger.debug(prefix, ...args),
      info: (...args) => logger.info(prefix, ...args),
      warn: (...args) => logger.warn(prefix, ...args),
      error: (...args) => logger.error(prefix, ...args),
      fatal: (...args) => logger.fatal(prefix, ...args),
      mark: (...args) => logger.mark(prefix, ...args),
      log: (...args) => logger.info(prefix, ...args),
      level: logger.level,
    }

    // 给level加上get/set
    Object.defineProperty(result, 'level', {
      get: () => logger.level,
      set: (value) => {
        logger.level = value
      },
    })

    return result
  }
  return logger
}

/**
 * 创建日志记录器
 * @param dir - 日志文件夹，可选，默认不输出到文件
 * @param color - 自定义颜色，可选
 * @returns 日志记录器
 */
const createLogger = (dir?: string, color?: string): Logger => {
  if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  if (global.logger) {
    log4js.configure(initLogger(true))
    return global.logger
  }

  log4js.configure(initLogger(true))
  const logger = addColor(log4js.getLogger('default'), color)
  global.logger = logger
  const log = logger.prefix('test')
  log.info(123, 'abc', '123')
  return logger
}

/**
 * @public
 * @description 日志管理器
 */
export const logger: Logger = createLogger()

/**
 * @public
 * @description 重新配置日志记录器
 * @param dir - 日志文件夹
 * @param color - 自定义颜色
 * @returns 更新后的日志记录器
 */
export const configureLogger = (dir: string, color?: string): Logger => {
  return createLogger(dir, color)
}
