/**
 * 2.0 WebUI 兼容接口 - 认证路由
 * 使用 HTTP_AUTH_KEY 进行认证（与 1.0 保持一致）
 */

import { authKey } from '@/utils/config'
import type { RequestHandler } from 'express'

interface LoginPayload {
  token: string
  expiresIn: number
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 登录接口 - 使用 HTTP_AUTH_KEY 认证
 * 这个接口用于 2.0 WebUI 的登录流程
 * 实际上就是验证提供的 key 是否与 HTTP_AUTH_KEY 匹配
 */
export const loginRouter: RequestHandler = (req, res) => {
  const { key } = req.body as { key?: string }
  const expectedKey = authKey()

  if (!key) {
    const response: ApiResponse<LoginPayload> = {
      code: 1,
      message: 'missing-key',
      data: {
        token: '',
        expiresIn: 0,
      },
    }
    return res.status(400).json(response)
  }

  // 验证提供的 key 是否与 HTTP_AUTH_KEY 匹配
  if (key === expectedKey) {
    const response: ApiResponse<LoginPayload> = {
      code: 0,
      message: 'success',
      data: {
        token: key, // 直接使用 key 作为 token
        expiresIn: 86400, // 24 小时
      },
    }
    return res.json(response)
  } else {
    const response: ApiResponse<LoginPayload> = {
      code: 1,
      message: 'invalid-key',
      data: {
        token: '',
        expiresIn: 0,
      },
    }
    return res.status(401).json(response)
  }
}

/**
 * 刷新 Token 接口
 * 由于使用的是 HTTP_AUTH_KEY，Token 不会过期
 * 这个接口主要用于兼容 2.0 WebUI 的接口设计
 */
export const refreshTokenRouter: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    const response: ApiResponse<LoginPayload> = {
      code: 1,
      message: 'missing-token',
      data: {
        token: '',
        expiresIn: 0,
      },
    }
    return res.status(401).json(response)
  }

  const response: ApiResponse<LoginPayload> = {
    code: 0,
    message: 'success',
    data: {
      token,
      expiresIn: 86400,
    },
  }
  res.json(response)
}

/**
 * 验证 Token 中间件
 * 检查 Authorization 请求头中的 token 是否与 HTTP_AUTH_KEY 匹配
 */
export const verifyTokenMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')
  const expectedKey = authKey()

  if (!token) {
    const response: ApiResponse<null> = {
      code: 401,
      message: 'unauthorized',
      data: null,
    }
    return res.status(401).json(response)
  }

  // 验证 token 是否与 HTTP_AUTH_KEY 匹配
  if (token === expectedKey) {
    next()
  } else {
    const response: ApiResponse<null> = {
      code: 401,
      message: 'invalid-token',
      data: null,
    }
    res.status(401).json(response)
  }
}
