import fs from 'node:fs'
import moment from 'moment'
import path from 'node:path'
import { logsPath } from '@/root'
import { router } from '../router'
import { updateLevel } from '@/utils/config'
import { createBadRequestResponse, createSuccessResponse } from '../../utils/response'

import type { RequestHandler } from 'express'

/**
 * 检查是否为标准的YYYY-MM-DD格式
 * @param date - 日期字符串
 * @returns 是否为标准的YYYY-MM-DD格式
 */
const isStandardDate = (date: string) => {
  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
}

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
  createSuccessResponse(res, null, '修改成功')
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
  const date = moment()

  /** 检查日期是否有效 */
  if (!date.isValid()) {
    return createBadRequestResponse(res, '日期格式错误')
  }

  /** 日志文件路径 */
  const file = path.join(logsPath, `logger.${date.format('YYYY-MM-DD')}.log`)

  /** 响应头 */
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  /** 设置不缓存 */
  res.setHeader('Cache-Control', 'no-cache')
  /** 设置长连接 */
  res.setHeader('Connection', 'keep-alive')
  /** 禁用 Nginx 缓冲 */
  res.setHeader('X-Accel-Buffering', 'no')

  let position = 0

  // 检查是否是 EventSource 请求
  const isEventSource = req.headers.accept === 'text/event-stream'

  // 添加心跳定时器
  const heartbeat = setInterval(() => {
    if (isEventSource) {
      res.write(':heartbeat\n\n')
    }
  }, 30000)

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
        stream.on('data', (data: string) => {
          const lines = data.toString().split('\n')
          for (const line of lines) {
            if (isEventSource) {
              res.write(`data: ${line}\n\n`)
            } else {
              res.write(`${line}\n`)
            }
          }
        })

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
    clearInterval(heartbeat) // 清理心跳定时器
    activeConnections--
  })
}

/**
 * 获取日志文件列表
 */
const getLogFileListRouter: RequestHandler = async (req, res) => {
  const files = fs.readdirSync(logsPath)
  const logFiles = files
    .filter(file => file.startsWith('logger.') && file.endsWith('.log'))
    .map(file => file.replace('logger.', '').replace('.log', ''))
  createSuccessResponse(res, logFiles, '成功')
}

/**
 * 获取指定日志文件
 * @description 此接口一次性返回所有日志文件内容
 */
const getLogFileRouter: RequestHandler = async (req, res) => {
  const file = req.query.file as string
  if (!isStandardDate(file)) {
    return createBadRequestResponse(res, '日期格式错误')
  }

  const filePath = path.join(logsPath, `logger.${file}.log`)
  if (!fs.existsSync(filePath)) {
    return createBadRequestResponse(res, '日志文件不存在')
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  createSuccessResponse(res, content, '成功')
}
router.get('/log', getLogRouter)
router.get('/logs/level', logRouter)
router.get('/logs/list', getLogFileListRouter)
router.get('/logs/file', getLogFileRouter)
