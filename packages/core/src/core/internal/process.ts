import axios from 'axios'
import { listeners } from './listeners'
import { exec } from '@/utils/system/exec'
import { sleep, uptime } from '@/utils/common/index'

let exitStatus = false

/**
 * 日志添加前缀
 * @param msg - 日志内容
 * @returns 日志内容
 */
const tips = (msg: string) => `[process] ${msg}`

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
  const host = `http://127.0.0.1:${port}/api/v1`

  /** 1. 检查api是否正常 */
  const ping = await request(host, '/ping', 'get', 300)
  if (!ping || !ping.success) {
    logger.debug(logger.green('没有检测到后台进程~'))
    return
  }

  /** 2. 发送关闭后台进程 */
  logger.error(logger.yellow(tips('检测到后台进程 正在关闭...')))
  const exit = await request(host, '/exit', 'post', 500)
  if (!exit || !exit.success) {
    logger.fatal(logger.red(tips('后台进程关闭失败，如多开Bot请更换端口')))
    process.exit(1)
  }

  /** 3. 等待后台进程关闭 */
  for (let i = 0; i < 100; i++) {
    const ping = await request(host, '/ping', 'get', 300)
    if (ping && ping.success) {
      await sleep(50)
      continue
    }

    logger.mark(logger.green(tips('后台进程已关闭')))
    return
  }

  /** 4. 后台进程关闭失败 */
  logger.error(logger.red(tips(`后台进程关闭失败，请检查是否有进程正在占用端口 ${port} `)))
  process.exit(1)
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

    logger.mark(tips(`运行结束 运行时间：${uptime()} 退出码：${code ?? '未知'}`))

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

/**
 * 发送请求
 * @param url - 请求地址
 * @param path - 请求路径
 * @param method - 请求方法
 * @param timeout - 请求超时时间
 */
const request = async (
  url: string,
  path: string,
  method: 'get' | 'post',
  timeout: number
) => {
  const client = axios.create({
    baseURL: url,
    timeout,
    headers: { Authorization: `Bearer ${process.env.HTTP_AUTH_KEY}` },
    validateStatus: () => true,
  })

  try {
    const result = await client[method](path)

    if (result.status === 200) {
      logger.info(
        tips(`[process][${method}] 请求成功:\n`) +
        `path: ${path}\n` +
        `body: ${JSON.stringify(result.data)}\n`
      )
      return { code: result.status, success: true }
    }

    if (result.status === 401) {
      logger.error(
        tips(`[process][${method}] 鉴权失败:\n`) +
        `path: ${path}\n` +
        `body: ${JSON.stringify(result.data)}\n`
      )
      return { code: result.status, success: false }
    }

    (path === '/ping' ? logger.debug : logger.error).call(logger,
      tips(`[process][${method}] 请求失败:\n`) +
      `path: ${path}\n` +
      `body: ${JSON.stringify(result.data)}\n`
    )

    return { code: result.status, success: false }
  } catch (error) {
    logger.debug(
      tips(`[process][${method}] 请求异常:\n`) +
      `path: ${path}\n` +
      `error: ${(error as Error)?.message || '未知错误'}\n`
    )

    return { code: 500, success: false }
  }
}
