import chalk from 'chalk'
import log4js from 'log4js'
import type { LogLevel, Configuration, Logger as Log4jsLogger } from 'log4js'

// ════ 类型 ════

export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark' | 'off'
export type LogMethodNames = Exclude<LoggerLevel, 'off'>

export interface Logger extends Log4jsLogger {
  chalk: typeof chalk
  red: typeof chalk.red
  green: typeof chalk.green
  yellow: typeof chalk.yellow
  blue: typeof chalk.blue
  magenta: typeof chalk.magenta
  cyan: typeof chalk.cyan
  white: typeof chalk.white
  gray: typeof chalk.gray
  violet: ReturnType<typeof chalk.hex>
  fnc: ReturnType<typeof chalk.hex>
  bot: (level: LogMethodNames, id: string, ...args: unknown[]) => void
}

export interface LoggerOptions {
  level?: LoggerLevel
  color?: string
  daysToKeep?: number
  logDir?: string
}

// ════ 内部 ════

function buildConfig (opt: {
  level: string
  daysToKeep: number
  logDir: string
}): Configuration {
  const level = opt.level as LogLevel

  const config: Configuration = {
    appenders: {
      console: {
        type: 'console',
        layout: { type: 'pattern', pattern: '%[[karin][%d{hh:mm:ss.SSS}][%4.4p]%] %m' },
      },
      overall: {
        type: 'dateFile',
        filename: `${opt.logDir}/logger`,
        pattern: 'yyyy-MM-dd.log',
        keepFileExt: true,
        alwaysIncludePattern: true,
        numBackups: opt.daysToKeep,
        fileNameSep: '.',
        layout: { type: 'pattern', pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m' },
      },
      errorFile: {
        type: 'dateFile',
        filename: `${opt.logDir}/error/logger`,
        pattern: 'yyyy-MM-dd.log',
        keepFileExt: true,
        alwaysIncludePattern: true,
        numBackups: opt.daysToKeep,
        fileNameSep: '.',
        layout: { type: 'pattern', pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m' },
      },
      errors: {
        type: 'logLevelFilter',
        appender: 'errorFile',
        level: 'error',
      },
    },
    categories: {
      default: { appenders: ['console', 'overall', 'errors'], level },
    },
  }

  return config
}

function attachColors (base: Log4jsLogger, color?: string): Logger {
  const log = base as unknown as Logger
  log.chalk = chalk
  log.red = chalk.red
  log.green = chalk.green
  log.yellow = chalk.yellow
  log.blue = chalk.blue
  log.magenta = chalk.magenta
  log.cyan = chalk.cyan
  log.white = chalk.white
  log.gray = chalk.gray
  log.violet = chalk.hex('#868ECC')
  log.fnc = chalk.hex(color ?? '#FFFF00')
  log.bot = (level, id, ...args) => {
    const tag = log.violet(`[Bot:${id}]`)
    switch (level) {
      case 'trace': log.trace(tag, ...args); break
      case 'debug': log.debug(tag, ...args); break
      case 'info': log.info(tag, ...args); break
      case 'warn': log.warn(tag, ...args); break
      case 'error': log.error(tag, ...args); break
      case 'fatal': log.fatal(tag, ...args); break
      case 'mark': log.mark(tag, ...args); break
      default: log.info(tag, ...args)
    }
  }
  return log
}

// ════ 公共 API ════

let instance: Logger | null = null

export function createLogger (opts?: LoggerOptions): Logger {
  const level = opts?.level ?? 'info'
  const daysToKeep = opts?.daysToKeep ?? 7
  const logDir = opts?.logDir ?? 'logs'

  log4js.configure(buildConfig({ level, daysToKeep, logDir }))
  instance = attachColors(log4js.getLogger('default'), opts?.color)
  return instance
}

export function getLogger (): Logger {
  if (!instance) return createLogger()
  return instance
}

/** 便捷单例（import { logger } from '@karin/logger'） */
export const logger: Logger = createLogger()
