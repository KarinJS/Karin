import { karin, logger } from 'node-karin'

/**
 * 定时任务模板
 * 参数1: 任务名称
 * 参数2: cron表达式
 * 参数3: 任务方法
 */
export const Task = karin.task('1分钟打印1次hello', '0 */1 * * * *', () => {
  logger.info('hello')
}, { log: false })
