import axios from 'axios'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import type {
  TestNetworkRequestDetail,
  ExtendedAxiosRequestConfig,
  PingRequestResult,
  RaceResult,
  StandardResult,
} from '@/types/utils/request'

interface RaceRequestConfig extends AxiosRequestConfig {
  /** 响应成功状态码 默认[200] */
  successCodes?: number[]
}

/**
 * 竞速请求 返回最先成功响应的数据
 * @param urls - 请求地址数组
 * @param config - 请求配置 默认 { timeout: 10000, method: 'HEAD', successCodes: [200] }
 * @returns 返回最先成功响应的数据
 * @example
 * const urls = ['https://api.github.com', 'https://api.gitee.com']
 * const data = await raceRequest(urls)
 * console.log(data)
 *
 * @example
 * const urls = ['https://api.github.com/post', 'https://api.gitee.com/post']
 * const data = await raceRequest(urls, {
 *   method: 'post',
 *   data: { foo: 'bar' },
 *   timeout: 10000,
 *   successCodes: [200, 201]
 * })
 * console.log(data)
 */
export const raceRequest = async <R = AxiosRequestConfig, T = any> (
  urls: string[],
  config: RaceRequestConfig = {
    method: 'HEAD',
    timeout: 2000,
    successCodes: [200],
  }
): Promise<AxiosResponse<T, R> | null> => {
  const successCodes = Array.isArray(config.successCodes) && config.successCodes.length > 0 ? config.successCodes : [200]

  const requests = urls.map(
    url =>
      new Promise<AxiosResponse<T, R>>((resolve, reject) => {
        axios
          .request<T>({ ...config, url, timeout: config.timeout || 2000 })
          .then(response => {
            if (successCodes.includes(response.status)) {
              resolve(response)
            } else {
              reject(new Error(`响应状态码 ${response.status} 不在 successCodes 范围内`))
            }
          })
          .catch(reject)
      })
  )

  try {
    const result = await Promise.any(requests)
    return result
  } catch {
    return null
  }
}

/**
 * 测试网络请求
 * @template D - 请求数据类型
 * @template T - 是否返回详细信息
 * @template R - 是否为竞速模式
 * @param urls - 请求地址数组
 * @param config - 扩展的请求配置，包含成功状态码列表和是否返回详细信息选项
 * @returns 根据配置返回不同格式的结果
 * @example
 * const urls = ['https://api.github.com', 'https://api.gitee.com']
 * const data = await pingRequest(urls)
 * console.log(data)
 * // -> ['https://api.github.com']
 *
 * @example
 * const urls = ['https://api.github.com', 'https://api.gitee.com']
 * const data = await pingRequest(urls, { detailed: true })
 * console.log(data)
 * // -> [{ url: 'https://api.github.com', success: true, duration: 100, error: null }]
 *
 * @example
 * const urls = ['https://api.github.com', 'https://api.gitee.com']
 * const data = await pingRequest(urls, { isRace: true })
 * console.log(data)
 * // -> 'https://api.github.com' 启用竞速模式，返回第一个成功的请求结果
 */
export const pingRequest = async <D = any, T extends boolean = false, R extends boolean = false> (
  urls: string[],
  config: ExtendedAxiosRequestConfig<D, T, R> = {
    timeout: 2000,
    successCodes: [200],
    detailed: false as T,
    isRace: false as R,
  }
): Promise<PingRequestResult<T, R>> => {
  config.timeout = typeof config.timeout === 'number' ? config.timeout : 2000
  config.successCodes = Array.isArray(config.successCodes) && config.successCodes.length > 0 ? config.successCodes : [200]
  config.detailed = typeof config.detailed === 'boolean' ? config.detailed : false as T
  config.isRace = typeof config.isRace === 'boolean' ? config.isRace : false as R

  /**
   * 执行单个请求并返回请求结果
   * @param url - 请求地址
   * @returns 返回请求结果
   */
  const sendRequest = async (url: string): Promise<TestNetworkRequestDetail> => {
    const startTime = Date.now()
    try {
      const response = await axios.request<T>({ ...config, url })
      const duration = Date.now() - startTime

      if (!config.successCodes!.includes(response.status)) {
        throw new Error(`请求失败: ${response.status}`, { cause: response })
      }

      return { url, success: true, duration, error: null }
    } catch (error) {
      const duration = Date.now() - startTime
      return { url, success: false, duration, error }
    }
  }

  /** 竞速模式：第一个成功的请求立即返回 */
  if (config.isRace) {
    const raceResult = await raceMode(urls, sendRequest, config.detailed)
    return raceResult as PingRequestResult<T, R>
  }

  /** 标准模式：等待所有请求完成后返回 */
  const result = await standardMode(urls, sendRequest, config.detailed)
  return result as PingRequestResult<T, R>
}

/**
 * 竞速模式实现 - 第一个成功的请求立即返回
 * @param urls - 请求地址数组
 * @param sendRequest - 发送请求的函数
 * @param detailed - 是否返回详细信息
 * @returns 返回单个请求结果，成功返回第一个成功结果，全部失败返回null
 */
const raceMode = async <T extends boolean> (
  urls: string[],
  sendRequest: (url: string) => Promise<TestNetworkRequestDetail>,
  detailed: T
): Promise<RaceResult<T>> => {
  return new Promise<RaceResult<T>>((resolve) => {
    let pendingCount = urls.length

    urls.forEach(async (url) => {
      const res = await sendRequest(url)

      if (res.success) {
        if (detailed) {
          resolve(res as RaceResult<T>)
        } else {
          resolve(url as RaceResult<T>)
        }
        return
      }

      /** 记录完成的请求数 */
      pendingCount--

      /** 如果所有请求都失败了 */
      if (pendingCount === 0) {
        resolve(null as RaceResult<T>)
      }
    })
  })
}

/**
 * 标准模式实现 - 等待所有请求完成后返回
 * @param urls - 请求地址数组
 * @param sendRequest - 发送请求的函数
 * @param detailed - 是否返回详细信息
 * @returns 返回所有请求结果数组
 */
const standardMode = async <T extends boolean> (
  urls: string[],
  sendRequest: (url: string) => Promise<TestNetworkRequestDetail>,
  detailed: T
): Promise<StandardResult<T>> => {
  const results = await Promise.all(urls.map(sendRequest))

  /** 按照响应时间排序 */
  const sortedResults = [...results].sort((a, b) => a.duration - b.duration)

  if (detailed) {
    return sortedResults as StandardResult<T>
  }

  const successUrls = sortedResults
    .filter(item => item.success)
    .map(item => item.url)

  return successUrls as StandardResult<T>
}

/**
 * 返回最快的npm registry
 * @description 阿里云兜底
 * @returns 返回最快的npm registry
 */
export const getFastRegistry = async (): Promise<string> => {
  const urls = [
    'https://registry.npmmirror.com',
    'https://registry.npmjs.com',
    'https://mirrors.cloud.tencent.com/npm',
  ]

  try {
    const result = await raceRequest(urls)
    return result?.config.url || urls[0]
  } catch (error) {
    console.error('获取最快的npm registry失败:', error)
    return urls[0]
  }
}

/**
 * 获取指定仓库的package.json
 * @param owner - 仓库所属用户名
 * @param repo - 仓库名
 * @returns 返回指定仓库的package.json
 */
export const getPackageJson = async (owner: string, repo: string): Promise<any> => {
  try {
    const urls = [
      `https://jsd.cdn.zzko.cn/gh/${owner}/${repo}/package.json`,
      `https://jsd.onmicrosoft.cn/gh/${owner}/${repo}/package.json`,
      `https://raw.github.com/${owner}/${repo}/HEAD/package.json`,
      `https://gitproxy.click/https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`,
      `https://gh.qninq.cn/https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`,
      `https://github.starrlzy.cn/https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`,
      `https://gh-proxy.ygxz.in/https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`,
    ]

    const result = await raceRequest(urls)
    return result?.data || { version: '0.0.0' }
  } catch (error) {
    console.error('获取package.json失败:', error)
    return { version: '0.0.0' }
  }
}
