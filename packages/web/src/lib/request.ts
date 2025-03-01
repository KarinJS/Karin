import axios from 'axios'
import key from '@/consts/key.ts'
import { toast } from 'react-hot-toast'

import type { ServerResponse } from '@/types/server'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ServerRequest extends AxiosInstance {
  serverGet<T> (url: string, config?: AxiosRequestConfig): Promise<T>
  serverPost<T, R> (url: string, data?: R, config?: AxiosRequestConfig): Promise<T>
}

/**
 * 无感知刷新访问令牌
 */
const refreshAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem(key.accessToken)
    const refreshToken = localStorage.getItem(key.refreshToken)
    if (!accessToken || !refreshToken) return false
    /** 刷新访问令牌 */
    const data = await axios.post(
      '/api/v1/refresh',
      { accessToken, refreshToken },
      { timeout: 10000 }
    )

    if (data.status === 200) {
      localStorage.setItem(key.accessToken, data.data.accessToken)
      return true
    }

    return false
  } catch (error) {
    console.error('无感知刷新访问令牌失败:')
    console.error(error)
    return false
  }
}

export const request: ServerRequest = axios.create({
  timeout: 10000,
}) as ServerRequest

request.interceptors.request.use(config => {
  const token = localStorage.getItem(key.accessToken)
  const userId = localStorage.getItem(key.userId)

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (userId) {
    config.headers['x-user-id'] = userId
  }

  return config
})

/** 防抖 */
let isRedirecting = false

/** 处理重定向到登录页 */
const redirectToLogin = (message: string) => {
  if (isRedirecting) return
  isRedirecting = true

  const token = localStorage.getItem(key.accessToken)
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
  localStorage.removeItem(key.userId)
  localStorage.removeItem(key.refreshToken)
  localStorage.removeItem(key.accessToken)
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

// export const requestServerWithFetch = async (url: string, options: RequestInit) => {
//   recordRequestInfo()
//   const token = localStorage.getItem(key.accessToken)
//   if (token) {
//     options.headers = {
//       ...options.headers,
//       Authorization: `Bearer ${token}`,
//     }
//   }
//   const response = await fetch(url, options)
//   const authorizationHeader = response.headers.get('authorization')
//   if (authorizationHeader) {
//     // 将 token 存储到本地存储
//     localStorage.setItem(key.accessToken, JSON.stringify(authorizationHeader))
//   }
//   return response
// }
