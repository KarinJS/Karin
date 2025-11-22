import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * HTTP 请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

/**
 * HTTP 请求选项
 */
export interface RequestOptions extends AxiosRequestConfig {
  /** 请求方法 @default 'GET' */
  method?: HttpMethod
  /** 请求头 */
  headers?: Record<string, string>
  /** 请求超时（毫秒） @default 10000 */
  timeout?: number
}

/**
 * 发送 HTTP 请求
 *
 * 基于 axios 的 HTTP 请求封装
 *
 * @param url - 请求 URL
 * @param options - 请求选项
 * @returns Axios 响应对象
 *
 * @throws {Error} 当请求失败时抛出
 *
 * @example
 * ```typescript
 * // GET 请求
 * const response = await request('https://api.example.com/data')
 * console.log(response.data)
 *
 * // POST 请求
 * const response = await request('https://api.example.com/users', {
 *   method: 'POST',
 *   data: { name: 'Alice', age: 25 },
 *   headers: { 'Content-Type': 'application/json' }
 * })
 *
 * // 带超时的请求
 * const response = await request('https://api.example.com/slow', {
 *   timeout: 5000
 * })
 *
 * // 下载文件
 * const response = await request('https://example.com/file.zip', {
 *   responseType: 'stream'
 * })
 * ```
 *
 * @public
 */
export const request = async <T = any> (
  url: string,
  options: RequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const {
    method = 'GET',
    timeout = 10000,
    headers = {},
    ...restOptions
  } = options

  return axios({
    url,
    method,
    timeout,
    headers,
    ...restOptions,
  })
}

/**
 * GET 请求
 *
 * @param url - 请求 URL
 * @param options - 请求选项
 * @returns Axios 响应对象
 *
 * @example
 * ```typescript
 * const response = await get('https://api.example.com/users')
 * ```
 *
 * @public
 */
export const get = async <T = any> (
  url: string,
  options?: Omit<RequestOptions, 'method' | 'data'>
): Promise<AxiosResponse<T>> => {
  return request<T>(url, { ...options, method: 'GET' })
}

/**
 * POST 请求
 *
 * @param url - 请求 URL
 * @param data - 请求数据
 * @param options - 请求选项
 * @returns Axios 响应对象
 *
 * @example
 * ```typescript
 * const response = await post('https://api.example.com/users', {
 *   name: 'Alice',
 *   age: 25
 * })
 * ```
 *
 * @public
 */
export const post = async <T = any> (
  url: string,
  data?: any,
  options?: Omit<RequestOptions, 'method'>
): Promise<AxiosResponse<T>> => {
  return request<T>(url, { ...options, method: 'POST', data })
}

/**
 * PUT 请求
 *
 * @param url - 请求 URL
 * @param data - 请求数据
 * @param options - 请求选项
 * @returns Axios 响应对象
 *
 * @example
 * ```typescript
 * const response = await put('https://api.example.com/users/1', {
 *   name: 'Bob'
 * })
 * ```
 *
 * @public
 */
export const put = async <T = any> (
  url: string,
  data?: any,
  options?: Omit<RequestOptions, 'method'>
): Promise<AxiosResponse<T>> => {
  return request<T>(url, { ...options, method: 'PUT', data })
}

/**
 * DELETE 请求
 *
 * @param url - 请求 URL
 * @param options - 请求选项
 * @returns Axios 响应对象
 *
 * @example
 * ```typescript
 * const response = await del('https://api.example.com/users/1')
 * ```
 *
 * @public
 */
export const del = async <T = any> (
  url: string,
  options?: Omit<RequestOptions, 'method' | 'data'>
): Promise<AxiosResponse<T>> => {
  return request<T>(url, { ...options, method: 'DELETE' })
}

// 导出 delete 别名
export { del as delete }
