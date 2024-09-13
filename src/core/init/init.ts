import { logger } from 'karin/utils/core/logger'

/**
 * 启动日志
 */
logger.mark('Karin 启动中...')
logger.mark(`当前版本: ${process.env.karin_app_version}`)
logger.mark('https://github.com/KarinJS/Karin')
/**
 * 设置标题
 */
process.title = 'Karin'
/**
 * 设置时区
 */
process.env.TZ = 'Asia/Shanghai'

const init = () => {
  if (!process.env.karin_app_lang) process.env.karin_app_lang = 'js'
  if (!process.env.karin_app_mode) process.env.karin_app_mode = 'prod'
  if (!process.env.karin_app_runner) process.env.karin_app_runner = 'node'
  if (!process.env.karin_app_start_count) process.env.karin_app_start_count = '0'

  /** 正常启动 */
  if (process.env.karin_app_runner === 'node' && process.env.karin_app_lang === 'js' && process.env.karin_app_mode === 'prod') {
    logger.debug('当前为 JavaScript 生产模式')
    return
  }

  /** pm2 */
  if (process.env.karin_app_runner === 'pm2') {
    logger.info('当前为 PM2 模式')
    return
  }

  /** js开发模式 */
  if (process.env.karin_app_lang === 'js' && process.env.karin_app_mode === 'dev') {
    logger.info('当前为 JavaScript 开发模式')
    return
  }

  /** ts开发模式 */
  if (process.env.karin_app_lang === 'ts' && process.env.karin_app_mode === 'dev') {
    logger.info('当前为 TypeScript 开发模式')
    return
  }

  logger.error('未知的启动模式')
}

init()
