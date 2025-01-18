import fs from 'node:fs'
import moment from 'moment'
import path from 'node:path'
import { logsPath } from '@/root'
import { router } from './router'
import { updateLevel } from '@/utils/config'
import { createBadRequestResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 临时修改当前日志等级 重启后恢复
 */
const logRouter: RequestHandler = async (req, res) => {
  const level = req.body?.level
  const list = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

  if (!level || !list.includes(level)) {
    return createBadRequestResponse(res, '参数错误')
  }

  updateLevel(level)
  createSuccessResponse(res, null, '成功')
}

/**
 * 当前活跃的连接数
 */
let activeConnections = 0

/**
 * 获取当前日志
 * 支持查询指定日期的日志，如果没有指定则获取当天的
 */
const getLogRouter: RequestHandler = async (req, res) => {
  const maxConnections = Number(process.env.LOG_API_MAX_CONNECTIONS) || 5

  /** 检查连接数是否达到上限 */
  if (activeConnections >= maxConnections) {
    return createBadRequestResponse(res, '当前连接数已达到上限，请稍后重试')
  }

  activeConnections++

  /** 获取日期 */
  const date = req.query.date ? moment(req.query.date as string) : moment()

  /** 检查日期是否有效 */
  if (!date.isValid()) {
    return createBadRequestResponse(res, '日期格式错误')
  }

  /** 日志文件路径 */
  const file = path.join(logsPath, `logger.${date.format('YYYY-MM-DD')}.log`)
  if (!fs.existsSync(file)) {
    return createBadRequestResponse(res, '日志文件不存在')
  }

  /** 设置响应头 */
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  /** 设置不缓存 */
  res.setHeader('Cache-Control', 'no-cache')
  /** 设置长连接 */
  res.setHeader('Connection', 'keep-alive')
  /** 禁用 Nginx 缓冲 */
  res.setHeader('X-Accel-Buffering', 'no')

  let position = 0
  const tailFile = () => {
    fs.stat(file, (err, stats) => {
      if (err) {
        logger.error('读取日志文件状态错误:', err)
        return
      }

      if (position > stats.size) {
        /** 文件被截断，重置位置 */
        position = 0
      }

      if (position < stats.size) {
        /** 有新内容，读取并发送 */
        const stream = fs.createReadStream(file, { start: position, encoding: 'utf-8' })

        /** 监听数据流 */
        stream.on('data', (data: string) => res.write(data))

        /** 文件读取完毕 */
        stream.on('end', () => {
          position = stats.size
        })

        /** 监听错误 */
        stream.on('error', (error: Error) => {
          logger.error('读取日志文件错误:', error.message)
        })
      }
    })
  }

  /** 首次读取 */
  tailFile()
  /** 定期检查文件变化 */
  const interval = setInterval(tailFile, 1000)

  req.on('close', () => {
    clearInterval(interval)
    activeConnections--
  })
}

router.get('/log', getLogRouter)
router.post('/log_level', logRouter)
