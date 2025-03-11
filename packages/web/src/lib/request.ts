import axios from 'axios'
import { toast } from 'react-hot-toast'
import { EventSourcePolyfill } from 'event-source-polyfill'
import {
  clearAccessToken,
  clearRefreshToken,
  clearUserId,
  getAccessToken,
  getRefreshToken,
  getUserId,
  setAccessToken
} from './token'

import type { ServerResponse } from '@/types/server'
import type { EventSourcePolyfillInit } from 'event-source-polyfill'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ServerRequest extends AxiosInstance {
  serverGet<T> (url: string, config?: AxiosRequestConfig): Promise<T>
  serverPost<T, R> (url: string, data?: R, config?: AxiosRequestConfig): Promise<T>
}

/** 缓存token */
const cacheToken: {
  token: string | null
  userId: string | null
} = {
  token: null,
  userId: null
}

/**
 * 无感知刷新访问令牌
 */
const refreshAccessToken = async () => {
  try {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    if (!accessToken || !refreshToken) return false
    /** 刷新访问令牌 */
    const data = await axios.post(
      '/api/v1/refresh',
      { accessToken, refreshToken },
      { timeout: 10000 }
    )

    if (data.status === 200) {
      setAccessToken(data.data.accessToken)
      return true
    }

    return false
  } catch (error) {
    console.error('无感知刷新访问令牌失败:')
    console.error(error)
    return false
  }
}

/** 防抖 */
let isRedirecting = false

/** 处理重定向到登录页 */
const redirectToLogin = (message: string) => {
  if (isRedirecting) return
  isRedirecting = true

  const token = getAccessToken()
  clearLocalAuthData()
  if (window.location.pathname === '/web/login') {
    token && toast.error('登录会话过期，请重新登录', { duration: 2000 })
    setTimeout(() => {
      isRedirecting = false
    }, 2000)
    return
  }

  toast.error(`${message}，5秒后将跳转登录界面`, { duration: 5000 })

  setTimeout(() => {
    isRedirecting = false
    /** 如果当前页面已经是登录页面，则不进行跳转 */
    if (window.location.pathname === '/web/login') return
    window.location.href = '/web/login'
  }, 5000)
}

/** 清除本地认证数据 */
const clearLocalAuthData = () => {
  cacheToken.token = null
  cacheToken.userId = null
  clearAccessToken()
  clearRefreshToken()
  clearUserId()
}

/** 处理认证相关错误 */
const handleAuthError = async (error: any) => {
  if (isRedirecting) return false

  const status = error?.response?.status
  switch (status) {
    /** 访问令牌过期 */
    case 419: {
      const result = await refreshAccessToken()
      if (result) return true
      redirectToLogin('登录信息过期')
      break
    }
    /** 刷新令牌过期 */
    case 420:
      redirectToLogin('登录信息已过期')
      break
    /** 未授权 */
    case 401:
      redirectToLogin('登录信息已失效')
      break
  }

  return false
}

/**
 * 获取token和userId 优先从缓存中获取
 */
export const getToken = () => {
  if (cacheToken.token && cacheToken.userId) {
    return cacheToken
  }

  const token = getAccessToken()
  const userId = getUserId()

  cacheToken.token = token
  cacheToken.userId = userId
  return { token, userId }
}

/**
 * axios实例
 */
export const request: ServerRequest = axios.create({
  timeout: 10000,
}) as ServerRequest

request.interceptors.request.use(config => {
  const { token, userId } = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (userId) {
    config.headers['x-user-id'] = userId
  }

  return config
})

request.interceptors.response.use(
  response => response,
  async error => {
    // console.log(error)
    if (error?.config?.url !== '/api/login') {
      const shouldRetry = await handleAuthError(error)
      if (shouldRetry) {
        return await request(error.config)
      }
    }

    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error(error.message)
  }
)

request.serverGet = async <T> (url: string, config?: AxiosRequestConfig) => {
  const response = await request.get<unknown, AxiosResponse<ServerResponse<T>>>(url, config)
  return response.data.data
}

request.serverPost = async <T, R> (url: string, data: R = {} as R, config?: AxiosRequestConfig) => {
  const response = await request.post<R, AxiosResponse<ServerResponse<T>>>(url, data, config)
  return response.data.data
}

/**
 * EventSourcePolyfill
 * @param url - 请求地址
 * @param options - 请求配置
 * @description 无需配置headers，会自动添加token和userId
 * @description 默认Accept为text/event-stream
 */
export const eventSourcePolyfill = (
  url: string,
  options: EventSourcePolyfillInit = {}
) => {
  if (!options.headers) {
    options.headers = {}
  }

  const { token, userId } = getToken()
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  if (userId) {
    options.headers['x-user-id'] = userId
  }

  if (!options.headers?.Accept) {
    options.headers.Accept = 'text/event-stream'
  }

  return new EventSourcePolyfill(url, options)
}
