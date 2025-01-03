import { listeners } from './listeners'
import { exec } from '@/utils/system/exec'
import { getPid } from '@/utils/system/pid'
import { axios, sleep, uptime } from '@/utils/common/index'

/** 处理基本信号 */
export const processHandler = () => {
  /** 监听挂起信号 在终端关闭时触发 */
  process.once('SIGHUP', code => processExit(code))
  /** 监听中断信号 用户按下 Ctrl + C 时触发 */
  process.once('SIGINT', code => processExit(code))
  /** 监听终止信号 程序正常退出时触发 */
  process.once('SIGTERM', code => processExit(code))
  /** 监听退出信号 windows下程序正常退出时触发 */
  process.once('SIGBREAK', code => processExit(code))
  /** 监听退出信号 与 SIGINT 类似，但会生成核心转储 */
  process.once('SIGQUIT', code => processExit(code))
  /** 监听退出信号 Node.js进程退出时触发 */
  process.once('exit', code => processExit(code))
  /** 捕获警告 */
  process.on('warning', warning => listeners.emit('warn', warning))
  /** 捕获错误 */
  process.on('uncaughtException', error => listeners.emit('error', error))
  /** 捕获未处理的Promise错误 */
  process.on('unhandledRejection', error => listeners.emit('error', error))
}

/**
 * 检查是否存在后台进程
 * @param port - 端口号
 */
export const checkProcess = async (port: number) => {
  const host = `http://127.0.0.1:${port}`
  const data = await axios({ url: `${host}/ping`, method: 'get', timeout: 500 })
  if (!data || data.status !== 200) return

  /** 端口被未知程序占用 获取对应的进程ID */
  if (data?.data?.name !== 'karin') {
    const pid = await getPid(port).catch(() => -0)
    logger.fatal(`端口 ${port} 被进程占用，进程ID：${pid}，请手动关闭对应进程或解除端口占用`)
    return
  }

  /** 判断是否为同个进程 防止无限循环启动 */
  if (data?.data?.pm2_id === process.pid) {
    return
  }

  await axios({ url: `${host}/exit`, method: 'get', timeout: 500 })
  logger.mark(logger.red('检测到后台进程 正在关闭...'))

  for (let i = 0; i < 100; i++) {
    const result = await axios({ url: `${host}/ping`, method: 'get', timeout: 100 })
    /** 请求成功继续循环 */
    if (result) {
      await sleep(50)
      continue
    }
    /** 请求异常即代表后台进程已关闭 */
    logger.mark(logger.green('后台进程已关闭'))
    return
  }

  /** 走到这里说明后台关闭失败 */
  logger.error(`后台进程关闭失败，请检查是否有进程正在占用端口${port}`)
  processExit(1)
}

/**
 * @description 处理退出事件
 * @param code 退出码
 */
export const processExit = async (code: unknown) => {
  try {
    // const { redis, level } = await import('../../main/index')
    // await Promise.allSettled([redis.save(), level.close()])

    logger.mark(`运行结束 运行时间：${uptime()} 退出码：${code ?? '未知'}`)

    /** 如果是pm2环境 */
    if (process.env.pm_id) {
      await exec(`pm2 delete ${process.env.pm_id}`)
    }
    process.exit()
  } finally {
    process.exit()
  }
}
