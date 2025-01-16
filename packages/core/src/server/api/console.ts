import { promises as fs } from 'node:fs'
import path from 'node:path'
import { router } from './router'
import { consolePath } from '@/root'
import { adapter } from '@/utils/config/adapter'
import { isLocalRequest } from '@/utils/system/ip'

import type { RequestHandler } from 'express'
import {
  createBadRequestResponse,
  createForbiddenResponse,
  createNotFoundResponse,
  createPayloadTooLargeResponse,
  createServerErrorResponse,
} from '../utils/response'

/** 允许的文件类型及其对应的 Content-Type */
const ALLOWED_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.css': 'text/css',
} as const

/** 最大文件大小 (1024MB) */
const MAX_FILE_SIZE = 1024 * 1024 * 1024

const consoleRouter: RequestHandler = async (req, res) => {
  try {
    const cfg = adapter()

    let url = decodeURIComponent(req.path)
      .replace(/\/+/g, '/') // 处理多个斜杠的情况
      .replace(/^\/+|\/+$/g, '') // 移除开头和结尾的斜杠

    url = url.split('/').pop() || ''
    if (!url) {
      return createBadRequestResponse(res, '文件名不能为空')
    }

    /** 防止路径穿越 */
    if (url.includes('..') || url.includes('~') || !url.match(/^[a-zA-Z0-9-_.]+$/)) {
      return createForbiddenResponse(res, '非法请求')
    }

    const ext = path.extname(url).toLowerCase()
    if (!ALLOWED_TYPES[ext as keyof typeof ALLOWED_TYPES]) {
      return createBadRequestResponse(res, '不支持的文件类型')
    }

    const isLocal = await isLocalRequest(req)
    if (cfg.console.isLocal) {
      if (!isLocal) {
        return createForbiddenResponse(res, '非法请求')
      }
    } else {
      if (!cfg.console.token) {
        return createServerErrorResponse(res, '缺少 token 配置')
      }

      const token = req.query.token
      if (!token || token !== cfg.console.token) {
        return createForbiddenResponse(res, '无效的 token')
      }
    }

    const file = path.join(consolePath, url)

    try {
      /** 组合路径之后 判断一下文件是否处于 consolePath 目录下 */
      if (!file.startsWith(consolePath)) {
        return createForbiddenResponse(res, '非法请求')
      }

      const stats = await fs.stat(file)
      if (stats.size > MAX_FILE_SIZE) {
        return createPayloadTooLargeResponse(res, '文件过大')
      }
    } catch {
      return createNotFoundResponse(res, '文件不存在')
    }

    const data = await fs.readFile(file)
    res.setHeader('Content-Type', ALLOWED_TYPES[ext as keyof typeof ALLOWED_TYPES])
    res.setHeader('Content-Length', data.length)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.send(data)
  } catch (error) {
    console.error('Console router error:', error)
    return createServerErrorResponse(res, '服务器错误')
  }
}

router.get('/console/*', consoleRouter)
