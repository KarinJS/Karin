import https from 'node:https'
import { green } from 'kolorist'
import { exec as execCommand, ExecOptions } from 'node:child_process'

/**
 * 测试结果的接口定义
 */
interface TestResult {
  url: string
  success: boolean
  status?: number
  time?: number
}

/**
 * 测试选项的接口定义
 */
interface TestOptions {
  /** 超时时间（毫秒） */
  timeout?: number
  /** 是否打印结果 */
  silent?: boolean
}

/** 默认超时时间（毫秒） */
const DEFAULT_TIMEOUT = 1000

/** 默认测试 URL */
const DEFAULT_URLS = [
  'https://x.com',
  'https://registry.npmjs.org',
  'https://github.com',
  'https://www.google.com',
  'https://chatgpt.com',
  'https://www.facebook.com',
  'https://www.twitter.com',
  'https://www.instagram.com',
  'https://www.youtube.com',
]

/**
 * 发送 GET 请求并测试连接
 * @param url - 请求的 URL
 * @returns Promise<TestResult>
 */
export const ping = (url: string): Promise<TestResult> => {
  return new Promise(resolve => {
    const startTime = Date.now()

    const req = https.get(url, res => {
      const time = Date.now() - startTime
      resolve({ url, success: true, status: res.statusCode, time })
      res.destroy()
    })

    req.on('error', () => {
      const time = Date.now() - startTime
      resolve({ url, success: false, time })
    })

    req.setTimeout(DEFAULT_TIMEOUT, () => {
      req.destroy()
      resolve({ url, success: false, time: DEFAULT_TIMEOUT })
    })
  })
}

/**
 * 带超时的请求包装
 * @param url - 请求的 URL
 * @param timeout - 超时时间
 * @returns Promise<TestResult>
 */
const pingWithTimeout = (url: string, timeout: number): Promise<TestResult> => {
  return Promise.race([
    ping(url),
    new Promise<TestResult>(resolve =>
      setTimeout(() => resolve({ url, success: false, time: timeout }), timeout),
    ),
  ])
}

/**
 * 格式化输出结果
 * @param results - 测试结果数组
 */
const formatResults = (results: TestResult[]) => {
  console.log('\n' + green('网络连接测试结果：'))
  console.table(results)
}

/**
 * 测试多个 URL 的连接性能
 * @param urls - 要测试的 URL 数组，如果不提供则使用默认值
 * @param options - 测试选项
 * @returns Promise<TestResult[]> 测试结果数组
 */
export const testUrls = async (
  urls: string[] = DEFAULT_URLS,
  options: TestOptions = {},
): Promise<{ results: TestResult[]; succ: number; fail: number; count: number }> => {
  const { timeout = DEFAULT_TIMEOUT, silent = false } = options

  console.log(green(`开始测试网络连接... (超时时间: ${timeout}ms)`))

  const results = await Promise.all(urls.map(url => pingWithTimeout(url, timeout)))

  if (silent) {
    formatResults(results)
  }

  /** 统计测试数量 成功数量 */
  let succ = 0
  results.forEach(result => {
    if (result.success) succ++
  })

  return { results, succ, fail: results.length - succ, count: results.length }
}

/**
 * 执行命令
 * @param command - 要执行的命令
 */
export const exec = (
  command: string,
  options: ExecOptions = {},
): Promise<{
  status: boolean
  error?: Error | null
  stdout?: string
  stderr?: string
}> => {
  return new Promise(resolve => {
    execCommand(command, options, (error, stdout, stderr) => {
      const status = !error
      resolve({ status, error, stdout, stderr })
    })
  })
}

/**
 * 生成随机字母字符串
 * @param length - 字符串长度
 */
export const getStr = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
