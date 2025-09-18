import axios from 'axios'
import { URL } from 'node:url'
import { sleep } from '../common'
import { logger } from '@karinjs/logger'
import { execSync } from 'node:child_process'
import { exec, waitPort, uptime } from '../system'

import type { AxiosInstance, AxiosResponse } from 'axios'

let exitStatus = false

/**
 * 请求响应类型
 */
type RequestResponse = {
  code: number
  success: boolean
  data?: any
}

/**
 * 进程状态信息
 */
type ProcessStatus = {
  pid: number
  karin_runtime: string
}

/**
 * 日志添加前缀
 * @param msg - 日志内容
 * @param isTrim - 是否去除空格
 * @returns 带前缀的日志内容
 */
const tips = (msg: string, isTrim = false): string => `[进程管理]${isTrim ? '' : ' '}${msg}`

/**
 * 创建HTTP客户端
 * @param baseURL - 基础URL
 * @param timeout - 超时时间
 * @returns Axios实例
 */
const createHttpClient = (baseURL: string, timeout: number): AxiosInstance => axios.create({
  baseURL,
  timeout,
  headers: { Authorization: `Bearer ${process.env.HTTP_AUTH_KEY}` },
  validateStatus: () => true,
})

/**
 * 发送请求
 * @param url - 请求地址
 * @param path - 请求路径
 * @param method - 请求方法
 * @param timeout - 请求超时时间
 * @param isPrint - 是否打印日志
 * @returns 请求响应结果
 */
const request = async (
  url: string,
  path: string,
  method: 'get' | 'post',
  timeout: number,
  isPrint = true
): Promise<RequestResponse> => {
  const client = createHttpClient(url, timeout)

  try {
    const result = await client[method](path)

    return handleResponse(result, method, path, isPrint)
  } catch (error) {
    logger.debug(
      tips(`${method.toUpperCase()} 请求异常:`, true) +
      ` ${path} - ${(error as Error)?.message || '未知错误'}`
    )

    return { code: 500, success: false }
  }
}

/**
 * 处理响应结果
 * @param result - 响应结果
 * @param method - 请求方法
 * @param path - 请求路径
 * @param isPrint - 是否打印日志
 * @returns 格式化的响应结果
 */
const handleResponse = (
  result: AxiosResponse,
  method: string,
  path: string,
  isPrint: boolean
): RequestResponse => {
  if (result.status === 200) {
    isPrint && logger.info(
      tips(`${method.toUpperCase()} 请求成功:`, true) +
      ` ${path} -> ${JSON.stringify(result.data)}`
    )
    return { code: result.status, success: true, data: result.data }
  }

  if (result.status === 401) {
    logger.error(
      tips(`${method.toUpperCase()} 鉴权失败:`, true) +
      ` ${path} -> ${JSON.stringify(result.data)}`
    )
    return { code: result.status, success: false }
  }

  const logMethod = path === '/ping' ? logger.debug : logger.error
  logMethod.call(logger,
    tips(`${method.toUpperCase()} 请求失败:`, true) +
    ` ${path} -> ${JSON.stringify(result.data)}`
  )

  return { code: result.status, success: false }
}

/**
 * 检查端口占用
 * @param port - 端口号
 * @returns 端口检查结果，成功返回true
 */
const checkPort = async (port: number): Promise<boolean> => {
  try {
    const portAvailable = await waitPort(port)
    if (!portAvailable) {
      logger.fatal(logger.red(tips(`端口 ${port} 仍被占用且无法释放，请手动结束占用进程或更换端口`)))
      process.exit(1)
    }
    return true
  } catch (error) {
    logger.error(logger.red(tips(`检查端口 ${port} 失败: ${(error as Error).message || '未知错误'}`)))
    return false
  }
}

/**
 * 安全地执行终端命令
 * @param command - 要执行的命令
 * @returns 命令执行结果
 */
const safeExecSync = (command: string): string => {
  try {
    return execSync(command).toString().trim()
  } catch (error) {
    logger.error(logger.red(tips(`命令执行失败 "${command}": ${(error as Error).message || '未知错误'}`)))
    return ''
  }
}

/**
 * 获取PM2进程ID
 * @param pid - 进程PID
 * @returns PM2进程ID
 */
const getPm2Id = (pid: number): number | null => {
  try {
    const isWindows = process.platform === 'win32'
    const command = isWindows ? 'pm2 jlist' : 'pm2 jlist'
    const listOutput = safeExecSync(command)

    if (!listOutput) {
      return null
    }

    const list: { pid: number, pm_id: number }[] = JSON.parse(listOutput)
    const pmProcess = list.find(item => String(item.pid) === String(pid))

    return pmProcess?.pm_id ?? null
  } catch (error) {
    logger.error(logger.red(tips(`获取PM2进程信息失败: ${(error as Error).message || '未知错误'}`)))
    return null
  }
}

/**
 * 安全地终止进程
 * @param pid - 进程ID
 * @returns 是否成功终止
 */
const safeKillProcess = (pid: number): boolean => {
  try {
    process.kill(pid)
    return true
  } catch (error) {
    logger.error(logger.red(tips(`无法终止进程 PID:${pid}: ${(error as Error).message || '未知错误'}`)))
    return false
  }
}

/**
 * 强制终止后台进程
 * @param pid - 进程ID
 * @param runtime - 运行时环境
 * @returns 是否成功终止
 */
const forceKillProcess = (pid: number, runtime: string): boolean => {
  if (runtime === 'pm2') {
    const pmId = getPm2Id(pid)
    if (!pmId) {
      logger.error(logger.red(tips(`找不到PM2对应的进程ID，PID:${pid}`)))
      return false
    }

    const isWindows = process.platform === 'win32'
    const command = isWindows ? `pm2 delete ${pmId}` : `pm2 delete ${pmId}`
    safeExecSync(command)
    return true
  } else {
    return safeKillProcess(pid)
  }
}

/**
 * 检查是否存在后台进程
 * @param port - 端口号
 * @returns 无返回值
 */
const checkProcess = async (port: number): Promise<void> => {
  const { BASE_ROUTER, EXIT_ROUTER, PING_ROUTER, SYSTEM_STATUS_KARIN_ROUTER } = await import('@karinjs/server')
  const host = new URL(BASE_ROUTER, `http://127.0.0.1:${port}`).toString()

  /**
   * 检查API是否正常
   */
  const ping = await request(host, PING_ROUTER, 'get', 300)
  if (!ping || !ping.success) {
    logger.debug(logger.green(tips('未检测到后台进程')))
    return
  }

  /**
   * 获取后台运行的PID
   */
  const status = await request(host, SYSTEM_STATUS_KARIN_ROUTER, 'get', 300)
  if (!status || !status.success) {
    if (status?.code === 401) {
      logger.error(logger.red(tips('鉴权失败，后台进程与当前Bot不匹配')))
      process.exit(1)
    }
    return
  }

  const processStatus = status.data.data as ProcessStatus
  const { pid, karin_runtime: runtime } = processStatus

  if (pid === process.pid) {
    logger.debug(logger.green(tips('后台进程PID与当前进程一致，跳过检查')))
    return
  }

  /**
   * 发送关闭后台进程请求
   */
  logger.error(logger.yellow(tips(`检测到后台进程，正在关闭 PID:${pid} 运行时:${runtime}`)))
  const exit = await request(host, EXIT_ROUTER, 'post', 500)
  if (!exit || !exit.success) {
    logger.fatal(logger.red(tips('后台进程关闭失败，如需多开请更换端口')))
    process.exit(1)
  }

  /**
   * 等待后台进程关闭
   */
  const MAX_WAIT_COUNT = 100
  const WAIT_INTERVAL = 500

  for (let i = 0; i < MAX_WAIT_COUNT; i++) {
    const startResult = await request(host, SYSTEM_STATUS_KARIN_ROUTER, 'get', 300, false)
    if (startResult && startResult.success) {
      const resultStatus = startResult.data.data as ProcessStatus
      const { pid: pingPid, karin_runtime: pingRuntime } = resultStatus

      if (pingPid === process.pid) {
        await checkPort(port)
        logger.mark(logger.green(tips(`后台进程已关闭 PID:${pingPid} 运行时:${pingRuntime}`)))
        return
      }

      await sleep(WAIT_INTERVAL)
      continue
    }

    await checkPort(port)
    logger.mark(logger.green(tips(`后台进程已关闭 PID:${pid} 运行时:${runtime}`)))
    return
  }

  /**
   * 强制关闭后台进程
   */
  logger.warn(tips('API关闭失败，正在尝试强制关闭后台进程...'))
  const killSuccess = forceKillProcess(pid, runtime)

  if (!killSuccess) {
    logger.error(logger.red(tips('强制关闭失败，无法终止后台进程')))
    process.exit(1)
  }

  /**
   * 验证进程是否成功关闭
   */
  await sleep(WAIT_INTERVAL)
  const ping2 = await request(host, PING_ROUTER, 'get', 300)
  if (!ping2 || !ping2.success) {
    await checkPort(port)
    logger.mark(logger.green(tips('后台进程强制关闭成功')))
    return
  }

  /**
   * 后台进程关闭失败
   */
  logger.error(logger.red(tips(`后台进程关闭失败，请检查端口 ${port} 占用情况`)))
  process.exit(1)
}

/**
 * @description 处理退出事件
 * @param code 退出码
 * @param isKillPm2 是否杀死pm2进程
 */
export const processExit = async (code: unknown, isKillPm2 = false) => {
  logger.debug('[child] 子进程收到退出申请:', code)
  try {
    if (exitStatus) return
    exitStatus = true

    logger.debug('[child] 开始保存redis数据')
    const { redis } = await import('@karinjs/db')

    /** 2秒之内需要保存完成 */
    await Promise.race([
      redis.save(),
      new Promise<void>((resolve, _reject) => setTimeout(() => {
        logger.warn('[child] redis数据保存超时，强制退出')
        resolve()
      }, 2000)),
    ])
    logger.debug('[child] redis数据保存完成')

    logger.mark(tips(`运行结束 运行时间：${uptime()} 退出码：${code ?? '未知'}`))

    /** 如果是pm2环境 */
    if (process.env.pm_id && isKillPm2) {
      logger.mark(tips('[child] pm2环境 删除pm2进程'))
      await exec(`pm2 delete ${process.env.pm_id}`)
    }
  } catch (error) {
    logger.error(new Error('[child] 退出事件发生错误:', { cause: error }))
  } finally {
    /** exit还会再触发一次事件  */
    setTimeout(() => {
      exitStatus = true
    }, 200)
    process.exit()
  }
}

/** 处理基本信号 */
const processHandler = async () => {
  const { emitter } = await import('@karinjs/core')

  /** 设置程序标题 */
  process.title = `karin v${process.env.KARIN_VERSION} © ${new Date().getFullYear()} - Karinjs`

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
  process.on('warning', warning => emitter.emit('warn', warning))
  /** 捕获错误 */
  process.on('uncaughtException', (error, origin) => {
    emitter.emit('error', error, origin)
  })
  /** 捕获未处理的Promise错误 */
  process.on('unhandledRejection', (error, promise) => {
    emitter.emit('error', error, promise)
  })
  /** 捕获Promise错误 */
  process.on('rejectionHandled', error => {
    emitter.emit('error', error)
  })

  emitter.on('error', (...args: [unknown]) => {
    logger.error(...args)
  })

  /** 如果是pm2环境 设置运行器为pm2 */
  if (process.env.pm_id) process.env.RUNTIME = 'pm2'

  if (typeof process.send === 'function') {
    process.on('disconnect', () => {
      logger.fatal('IPC通道已断开，父进程可能已退出，Karin将结束运行')
      process.exit(1)
    })
  }
}

/**
 * @internal
 * @description 初始化进程
 * @param port - 端口号
 */
export const initProcess = async (port: number) => {
  processHandler()
  await checkProcess(port)
}
