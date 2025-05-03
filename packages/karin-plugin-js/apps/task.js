import { karin, logger } from 'node-karin'

/**
 * 定时任务模板
 * 参数1: 任务名称
 * 参数2: cron表达式
 * 参数3: 任务方法
 */
export const Task = karin.task('每分钟的趣味问候', '0 */1 * * * *', () => {
  const funnyMessages = [
    '你好呀，又见面了！',
    '又过去一分钟，我还在坚持工作~',
    '嘿，看看谁又按时报到了！',
    '时间过得真快，我都数不清这是第几次见你了',
    '叮咚！您的每分钟提醒服务已送达',
    '工作ing...别担心，我不会偷懒的',
    '滴答滴答，时钟在走，我在陪你',
    '我是最勤劳的任务，从不缺勤！',
  ]
  const randomIndex = Math.floor(Math.random() * funnyMessages.length)
  logger.info(`🎉 ${funnyMessages[randomIndex]} 🎉`)
}, { log: false })
