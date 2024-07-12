import { logger } from 'karin/utils'

/**
 * 启动日志
 */
logger.mark('Karin 启动中...')
logger.mark('https://github.com/KarinJS/Karin')
/**
 * 设置标题
 */
process.title = 'Karin'
/**
 * 设置时区
 */
process.env.TZ = 'Asia/Shanghai'
/**
 * 设置应用模式
 */
process.env.karin_app_mode = process.argv[2]?.includes('dev') ? 'dev' : 'prod'
/**
 * 设置语言环境
 */
process.env.karin_app_lang = JSON.stringify(process.execArgv).includes('tsx@') ? 'ts' : 'js'

if (process.env.karin_app_lang === 'ts') {
  process.env.karin_app_mode = 'dev'
  logger.mark(`当前为 ${logger.green('TypeScript')} 开发模式`)
} if (process.env.npm_lifecycle_event === 'npx' && process.env.npm_lifecycle_script === 'debug') {
  process.env.karin_app_mode = 'dev'
  logger.mark(`当前为 ${logger.green('JavaScript')} 开发模式`)
}
