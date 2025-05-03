import axios from '@karinjs/axios'
import type { AxiosResponse, AxiosRequestConfig } from '@karinjs/axios'

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
