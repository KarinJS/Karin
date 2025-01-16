import { listeners } from './listeners'
import { exec } from '@/utils/system/exec'
import { getPid } from '@/utils/system/pid'
import { axios, sleep, uptime } from '@/utils/common/index'

let exitStatus = false

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
  /** 捕获警告 */
  process.on('warning', warning => listeners.emit('warn', warning))
  /** 捕获错误 */
  process.on('uncaughtException', (error, origin) => {
    listeners.emit('error', error, origin)
  })
  /** 捕获未处理的Promise错误 */
  process.on('unhandledRejection', (error, promise) => {
    listeners.emit('error', error, promise)
  })
  /** 捕获Promise错误 */
  process.on('rejectionHandled', error => {
    listeners.emit('error', error)
  })

  listeners.on('error', (...args: [unknown]) => {
    logger.error(...args)
  })

  /** 如果是pm2环境 设置运行器为pm2 */
  if (process.env.pm_id) process.env.RUNTIME = 'pm2'
}

/**
 * 检查是否存在后台进程
 * @param port - 端口号
 */
export const checkProcess = async (port: number) => {
  const host = `http://127.0.0.1:${port}/v1`
  const data = await axios({
    url: `${host}/ping`,
    method: 'get',
    timeout: 300,
    headers: { Authorization: `Bearer ${process.env.HTTP_AUTH_KEY}` },
  })

  if (!data || data.status !== 200) return

  /** 端口被未知程序占用 获取对应的进程ID */
  if (data?.data?.ping !== 'pong') {
    const pid = await getPid(port).catch(() => -0)
    logger.fatal(`端口 ${port} 被进程占用，进程ID：${pid}，请手动关闭对应进程或解除端口占用`)
    return
  }

  /** 判断是否为同个进程 防止无限循环启动 */
  if (data?.data?.pm2_id === process.pid) {
    return
  }

  logger.error('检测到后台进程 正在关闭...')
  const result = await axios({ url: `${host}/exit`, method: 'get', timeout: 500, headers: { Authorization: `Bearer ${process.env.HTTP_AUTH_KEY}` } })
  if (typeof result === 'undefined') {
    logger.fatal(logger.red(`当前存在多开Bot占用 ${port}端口，请更换端口或者关闭对应Bot`))
    processExit(1)
  }

  for (let i = 0; i < 100; i++) {
    const result = await axios({ url: `${host}/ping`, method: 'get', timeout: 100, headers: { Authorization: `Bearer ${process.env.HTTP_AUTH_KEY}` } })
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
  logger.error(logger.red(`后台进程关闭失败，请检查是否有进程正在占用端口 ${port} `))
  processExit(1)
}

/**
 * @description 处理退出事件
 * @param code 退出码
 */
export const processExit = async (code: unknown) => {
  try {
    if (exitStatus) return
    exitStatus = true

    const { redis, level } = await import('@/service/db')
    await Promise.allSettled([redis.save(), level.close()])

    logger.mark(`运行结束 运行时间：${uptime()} 退出码：${code ?? '未知'}`)

    /** 如果是pm2环境 */
    if (process.env.pm_id) {
      await exec(`pm2 delete ${process.env.pm_id}`)
    }
  } finally {
    /** exit还会再触发一次事件  */
    setTimeout(() => {
      exitStatus = true
    }, 200)
    process.exit()
  }
}
