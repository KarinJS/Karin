import axios from 'axios'
import type { ApiResponse } from './types'
import { HTTPStatusCode } from './types'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response

      switch (status) {
        case HTTPStatusCode.Unauthorized:
        case HTTPStatusCode.AccessTokenExpired:
        case HTTPStatusCode.RefreshTokenExpired:
          // 未授权或 token 过期，跳转登录页
          // window.location.href = '/login'
          console.error('认证失败，请重新登录')
          break
        case HTTPStatusCode.Forbidden:
          console.error('无权限访问')
          break
        case HTTPStatusCode.NotFound:
          console.error('资源不存在')
          break
        case HTTPStatusCode.InternalServerError:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败:', error.response.data?.message || '未知错误')
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接')
    } else {
      console.error('请求配置错误:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api

// 导出类型
export type { ApiResponse }

// 导出模块化 API
export * from './modules/config'
export * from './modules/stats'

