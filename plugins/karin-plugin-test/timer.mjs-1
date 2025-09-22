import { karin, logger } from '@karinjs/core'

// 存储定时器引用
let timerInstance = null
let isRunning = false

// 定时器函数
function startTimer () {
  if (isRunning) {
    logger.info('[Timer Example] 定时器已在运行')
    return
  }

  isRunning = true
  logger.info('[Timer Example] 启动定时器，每5秒执行一次')

  timerInstance = setInterval(() => {
    logger.info(`[Timer Example] 定时器执行 - ${new Date().toLocaleString()}`)
  }, 5000)
}

// 停止定时器的函数
function stopTimer () {
  if (timerInstance) {
    clearInterval(timerInstance)
    timerInstance = null
    isRunning = false
    logger.info('[Timer Example] 定时器已停止')
  }
}

// 注册命令来手动控制定时器
karin.command('start-timer', (ctx) => {
  startTimer()
  ctx.reply('定时器已启动')
})

karin.command('stop-timer', (ctx) => {
  stopTimer()
  ctx.reply('定时器已停止')
})

karin.command('timer-status', (ctx) => {
  ctx.reply(`定时器状态: ${isRunning ? '运行中' : '已停止'}`)
})

// 自动启动定时器
startTimer()

// 导出清理函数，供 HMR 使用
export function cleanup () {
  logger.info('[Timer Example] HMR 触发清理')
  stopTimer()
}
