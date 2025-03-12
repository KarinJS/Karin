import axios from 'axios'
import { sleep } from '@/utils/common/sleep'

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
  const host = `http://127.0.0.1:${port}/api/v1`

  /** 1. 检查api是否正常 */
  const ping = await request(host, '/ping', 'get', 300)
  if (!ping || !ping.success) {
    logger.debug(logger.green('没有检测到后台进程~'))
    return
  }

  /** 2. 获取后台运行的pid */
  const pid = await request(host, '/status/karin', 'get', 300)
  console.log('pid:', pid)
  if (pid && pid.success) {
    if (pid.data?.data?.pid === process.pid) {
      logger.debug(logger.green(tips('后台进程pid与当前进程pid一致 跳过检查')))
      return
    }
  }

  /** 3. 发送关闭后台进程 */
  logger.error(logger.yellow(tips('检测到后台进程 正在关闭...')))
  const exit = await request(host, '/exit', 'post', 500)
  if (!exit || !exit.success) {
    logger.fatal(logger.red(tips('后台进程关闭失败，如多开Bot请更换端口')))
    process.exit(1)
  }

  /** 4. 等待后台进程关闭 */
  for (let i = 0; i < 100; i++) {
    const ping = await request(host, '/ping', 'get', 300)
    if (ping && ping.success) {
      await sleep(50)
      continue
    }

    logger.mark(logger.green(tips('后台进程已关闭')))
    return
  }

  /** 5. 后台进程关闭失败 */
  logger.error(logger.red(tips(`后台进程关闭失败，请检查是否有进程正在占用端口 ${port} `)))
  process.exit(1)
}
