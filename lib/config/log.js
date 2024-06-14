import chalk from 'chalk'
import log4js from 'log4js'
import fs from 'fs'
import cfg from './config.js'

const logsDir = './logs'
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

const { log_level: level, log_days_Keep: daysToKeep } = cfg.Config

let enableCallStack = false
let pattern = '%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] %m'

/** 开发者模式 */
if (process.argv[2]?.includes('dev')) {
  enableCallStack = true
  pattern = '%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] [%f{3}:%l] %m'
  process.env.KarinDev = true
} else {
  process.env.KarinDev = false
}

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern,
      },
    },
    out: {
      /** 输出到文件 */
      type: 'file',
      filename: 'logs/logger',
      pattern: 'yyyy-MM-dd.log',
      /** 日期后缀 */
      keepFileExt: true,
      /** 日志文件名中包含日期模式 */
      alwaysIncludePattern: true,
      /** 日志文件保留天数 */
      daysToKeep,
      /** 日志输出格式 */
      layout: {
        type: 'pattern',
        pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
      },
    },
  },
  categories: {
    default: { appenders: ['out', 'console'], level, enableCallStack },
  },
})

/**
 * @description 日志模块
 * @type {log4js.Logger & {
 *  bot: logger,
 *  chalk: import('chalk').default,
 *  red: (text: string) => string,
 *  green: (text: string) => string,
 *  yellow: (text: string) => string,
 *  blue: (text: string) => string,
 *  magenta: (text: string) => string,
 *  cyan: (text: string) => string,
 *  white: (text: string) => string,
 *  gray: (text: string) => string,
 *  violet: (text: string) => string,
 *  fnc: (text: string) => string
 * }}
 */
const logger = log4js.getLogger('default')
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
logger.fnc = chalk.hex(cfg.Config.log_color || '#FFFF00')
logger.bot = (level, id, ...args) => logger[level](logger.violet(`[Bot:${id}] `) + args.join(' '))

export default Object.freeze(logger)

/**
 * bot专用日志
 * @typedef {(level: 'trace'|'debug'|'mark'|'info'|'warn'|'error'|'fatal', id: string, ...args: any[]) => void} logger
 */
