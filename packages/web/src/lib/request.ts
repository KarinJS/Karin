import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import key from '@/consts/key.ts'
import type { ServerResponse } from '@/types/server'

export interface ServerRequest extends AxiosInstance {
  serverGet<T> (url: string, config?: AxiosRequestConfig): Promise<T>
  serverPost<T, R> (url: string, data?: R, config?: AxiosRequestConfig): Promise<T>
}

export const request: ServerRequest = axios.create({
  timeout: 10000,
}) as ServerRequest

request.interceptors.request.use(config => {
  recordRequestInfo()
  const token = localStorage.getItem(key.token)

  if (token) {
    config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`
  }

  return config
})

request.interceptors.response.use(
  response => {
    const authorizationHeader = response.headers['authorization']
    if (authorizationHeader) {
      // 将 token 存储到本地存储
      localStorage.setItem(key.token, JSON.stringify(authorizationHeader))
    }
    return response
  },
  err => {
    if (err.response.status === 401) {
      const token = localStorage.getItem(key.token)
      if (token && JSON.parse(token) && err.config.url !== '/api/login') {
        localStorage.removeItem(key.token)
      }
      if (err.config.url !== '/api/login') {
        window.location.href = '/web/login'
      }
    }
    if (err?.response?.data?.message) throw new Error(err.response.data.message)

    throw new Error(err.message)
  },
)

request.serverGet = async <T> (url: string, config?: AxiosRequestConfig) => {
  const response = await request.get<unknown, AxiosResponse<ServerResponse<T>>>(url, config)
  return response.data.data
}

request.serverPost = async <T, R> (url: string, data?: R, config?: AxiosRequestConfig) => {
  const response = await request.post<R, AxiosResponse<ServerResponse<T>>>(url, data, config)
  return response.data.data
}

export const requestServerWithFetch = async (url: string, options: RequestInit) => {
  recordRequestInfo()
  const token = localStorage.getItem(key.token)
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${JSON.parse(token)}`,
    }
  }
  const response = await fetch(url, options)
  const authorizationHeader = response.headers.get('authorization')
  if (authorizationHeader) {
    // 将 token 存储到本地存储
    localStorage.setItem(key.token, JSON.stringify(authorizationHeader))
  }
  return response
}

const FINAL_REQUEST = 'FINAL_REQUEST'
/** 记录最后一次请求时间 */
function recordRequestInfo () {
  localStorage.setItem(FINAL_REQUEST, Date.now().toString())
}
