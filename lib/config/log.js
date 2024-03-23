import chalk from 'chalk'
import log4js from 'log4js'
import fs from 'node:fs'
import cfg from './config.js'

let logsDir = './logs'
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

log4js.configure({
  appenders: {
    console: {
      type: 'console', // 输出到控制台
      layout: {
        type: 'pattern',
        pattern: '%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] %m'
      }
    },
    out: {
      type: 'file', // 输出到文件
      filename: 'logs/logger', // 文件名
      pattern: 'yyyy-MM-dd.log', // 日期模式
      keepFileExt: true, // 日期后缀
      compress: true, // gzip 压缩
      alwaysIncludePattern: true, // 指定日志文件名中始终包含日期模式
      layout: {
        type: 'pattern', // 输出格式
        pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m' // 输出格式
      }
    },
    // 另外保存一份错误日志
    errorFile: {
      type: 'file',
      filename: 'logs/error',
      pattern: 'yyyy-MM-dd.log',
      keepFileExt: true,
      compress: true,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m'
      }
    }
  },
  categories: {
    default: { appenders: ['out', 'console'], level: cfg.Config.log_level },
    error: { appenders: ['errorFile', 'console'], level: 'error' }
  }
})

let Logger = log4js.getLogger()
Logger.red = chalk.red
Logger.green = chalk.green
Logger.yellow = chalk.yellow
Logger.blue = chalk.blue
Logger.magenta = chalk.magenta
Logger.cyan = chalk.cyan
Logger.white = chalk.white
Logger.gray = chalk.gray
Logger.chalk = chalk
Logger.violet = chalk.hex('#868ECC')

const logger = Logger

export default Object.freeze(logger)
