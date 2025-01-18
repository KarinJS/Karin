import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import key from '@/consts/key.ts'
import type { ServerResponse } from '@/types/server'

export interface ServerRequest extends AxiosInstance {
  serverGet<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  serverPost<T, R>(url: string, data?: R, config?: AxiosRequestConfig): Promise<T>
}

export const request: ServerRequest = axios.create({
  timeout: 10000,
}) as ServerRequest

request.interceptors.request.use(config => {
  const token = localStorage.getItem(key.token)

  if (token) {
    config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`
  }

  return config
})

request.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response.status === 401) {
      const token = localStorage.getItem(key.token)
      if (token && JSON.parse(token) && err.config.url !== '/api/login') {
        localStorage.removeItem(key.token)
        window.location.href = '/web/login'
      }
    }
    if (err?.response?.data?.message) throw new Error(err.response.data.message)

    throw new Error(err.message)
  },
)

request.serverGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await request.get<unknown, AxiosResponse<ServerResponse<T>>>(url, config)
  return response.data.data
}

request.serverPost = async <T, R>(url: string, data?: R, config?: AxiosRequestConfig) => {
  const response = await request.post<R, AxiosResponse<ServerResponse<T>>>(url, data, config)
  return response.data.data
}

export const requestServerWithFetch = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem(key.token)
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${JSON.parse(token)}`,
    }
  }
  const response = await fetch(url, options)
  return response
}
