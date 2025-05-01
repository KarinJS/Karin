import axios from 'axios'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'

/**
 * 竞速请求 返回最先成功响应的数据
 * @param urls - 请求地址数组
 * @param config - 请求配置 默认 { timeout: 10000 }
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
 *   data: { foo: 'bar' }
 * })
 * console.log(data)
 */
export const raceRequest = async <R = AxiosRequestConfig, T = any> (
  urls: string[],
  config: AxiosRequestConfig = {
    method: 'HEAD',
    timeout: 10000,
  }
): Promise<AxiosResponse<T, R> | null> => {
  const requests = urls.map(async url => {
    try {
      const response = await axios.request<T>({ ...config, url, timeout: config.timeout || 10000 })
      return response
    } catch {
      return null
    }
  })

  const results = await Promise.race(requests)
  return results
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

  const result = await raceRequest(urls)
  return result?.config.url || urls[0]
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
    ]

    const result = await raceRequest(urls)
    return result?.data || { version: '0.0.0' }
  } catch (error) {
    logger.debug(error)
    return { version: '0.0.0' }
  }
}
