import axios from 'axios'
import { URL } from 'node:url'
import { sleep } from '@/utils/common/sleep'
import { execSync } from 'node:child_process'
import { BASE_ROUTER, EXIT_ROUTER, PING_ROUTER, SYSTEM_STATUS_KARIN_ROUTER } from '@/server/router/router'

/**
 * 日志添加前缀
 * @param msg - 日志内容
 * @param isTrim - 是否去除空格
 * @returns 日志内容
 */
export const tips = (msg: string, isTrim = false) => `[process]${isTrim ? '' : ' '}${msg}`

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
        tips(`[${method}] 请求成功:\n`, true) +
        `path: ${path}\n` +
        `body: ${JSON.stringify(result.data)}\n`
      )
      return { code: result.status, success: true, data: result.data }
    }

    if (result.status === 401) {
      logger.error(
        tips(`[${method}] 鉴权失败:\n`, true) +
        `path: ${path}\n` +
        `body: ${JSON.stringify(result.data)}\n`
      )
      return { code: result.status, success: false }
    }

    (path === '/ping' ? logger.debug : logger.error).call(logger,
      tips(`[${method}] 请求失败:\n`, true) +
      `path: ${path}\n` +
      `body: ${JSON.stringify(result.data)}\n`
    )

    return { code: result.status, success: false }
  } catch (error) {
    logger.debug(
      tips(`[${method}] 请求异常:\n`, true) +
      `path: ${path}\n` +
      `error: ${(error as Error)?.message || '未知错误'}\n`
    )

    return { code: 500, success: false }
  }
}

/**
 * 检查是否存在后台进程
 * @param port - 端口号
 */
export const checkProcess = async (port: number) => {
  const host = new URL(BASE_ROUTER, `http://127.0.0.1:${port}`).toString()

  /** 1. 检查api是否正常 */
  const ping = await request(host, PING_ROUTER, 'get', 300)
  if (!ping || !ping.success) {
    logger.debug(logger.green('没有检测到后台进程~'))
    return
  }

  /** 2. 获取后台运行的pid */
  const status = await request(host, SYSTEM_STATUS_KARIN_ROUTER, 'get', 300)
  if (status && status.success) {
    logger.debug(logger.green(tips('后台进程pid与当前进程pid一致 跳过检查')))
    return
  } else {
    /** 如果状态码是401 说明鉴权失败 */
    if (status.code === 401) {
      logger.error(logger.red(tips('鉴权失败，后台进程与当前非同一个Bot')))
      process.exit(1)
    }
  }

  const { pid, karin_runtime: runtime } = status.data.data

  /** 3. 发送关闭后台进程 */
  logger.error(logger.yellow(tips('检测到后台进程 正在关闭...')))
  const exit = await request(host, EXIT_ROUTER, 'post', 500)
  if (!exit || !exit.success) {
    logger.fatal(logger.red(tips('后台进程关闭失败，如多开Bot请更换端口')))
    process.exit(1)
  }

  /** 4. 等待后台进程关闭 */
  for (let i = 0; i < 100; i++) {
    const ping = await request(host, EXIT_ROUTER, 'get', 300)
    if (ping && ping.success) {
      /** 检查回来的pid是否与当前一致 */
      if (ping.data.data.pid === pid) {
        logger.mark(logger.green(tips('后台进程已关闭')))
        return
      }

      /** ping成功继续发退出请求 */
      await request(host, EXIT_ROUTER, 'post', 500)
      await sleep(50)
      continue
    }

    logger.mark(logger.green(tips('后台进程已关闭')))
    return
  }

  /** 5. 强制关闭 */
  logger.warn('api关闭失败，正在尝试强制关闭后台进程...')
  /** pm2 强制关闭 */
  if (runtime === 'pm2') {
    const list: { pid: number, pm_id: number }[] = JSON.parse(execSync('pm2 jlist').toString())
    const pmId = list.find((item: { pid: number, pm_id: number }) => item.pid + '' === pid)?.pm_id
    if (!pmId) {
      logger.error(logger.red(tips('强制关闭失败，没有找到pm2对应的pm_id')))
      process.exit(1)
    }

    execSync(`pm2 delete ${pmId}`)
  } else {
    process.kill(pid)
  }

  /** 再ping一次 如果还是失败... */
  await sleep(500)
  const ping2 = await request(host, PING_ROUTER, 'get', 300)
  if (!ping2 || !ping2.success) {
    logger.mark(logger.green(tips('后台进程强制关闭成功')))
    return
  }

  /** 6. 后台进程关闭失败 */
  logger.error(logger.red(tips(`后台进程关闭失败，请检查是否有进程正在占用端口 ${port} `)))
  process.exit(1)
}
