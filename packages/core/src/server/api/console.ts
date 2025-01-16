import { promises as fs } from 'node:fs'
import path from 'node:path'
import { router } from './router'
import { consolePath } from '@/root'
import { adapter } from '@/utils/config/adapter'
import { isLocalRequest } from '@/utils/system/ip'

import type { RequestHandler } from 'express'

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
      res.status(400).json({ error: '无效的请求', message: '文件名不能为空' })
      return
    }

    /** 防止路径穿越 */
    if (url.includes('..') || url.includes('~') || !url.match(/^[a-zA-Z0-9-_.]+$/)) {
      res.status(403).json({ error: '禁止访问', message: '非法请求' })
      return
    }

    const ext = path.extname(url).toLowerCase()
    if (!ALLOWED_TYPES[ext as keyof typeof ALLOWED_TYPES]) {
      res.status(403).json({ error: '禁止访问', message: '不支持的文件类型' })
      return
    }

    const isLocal = await isLocalRequest(req)
    if (cfg.console.isLocal) {
      if (!isLocal) {
        res.status(403).json({ error: '禁止访问', message: '无效的请求' })
        return
      }
    } else {
      if (!cfg.console.token) {
        res.status(500).json({ error: '配置错误', message: '缺少 token 配置' })
        return
      }

      const token = req.query.token
      if (!token || token !== cfg.console.token) {
        res.status(403).json({ error: '禁止访问', message: '无效的 token' })
        return
      }
    }

    const file = path.join(consolePath, url)

    try {
      /** 组合路径之后 判断一下文件是否处于 consolePath 目录下 */
      if (!file.startsWith(consolePath)) {
        res.status(403).json({ error: '禁止访问', message: '非法请求' })
        return
      }

      const stats = await fs.stat(file)
      if (stats.size > MAX_FILE_SIZE) {
        res.status(413).json({ error: '文件过大', message: '文件大小超过限制' })
        return
      }
    } catch {
      res.status(404).json({ error: '文件不存在', message: '文件不存在' })
      return
    }

    const data = await fs.readFile(file)
    res.setHeader('Content-Type', ALLOWED_TYPES[ext as keyof typeof ALLOWED_TYPES])
    res.setHeader('Content-Length', data.length)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.send(data)
  } catch (error) {
    console.error('Console router error:', error)
    res.status(500).json({ error: '内部错误', message: '服务器错误' })
  }
}

router.get('/console/*', consoleRouter)
