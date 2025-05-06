import fs from 'node:fs'
import path from 'node:path'
import { LoggerLevelPriority } from './types'
import type { LoggerLevel, LogWriter, FileLogConfig } from './types'

/**
 * @description 文件句柄管理
 */
interface FileHandles {
  normal: {
    stream: fs.WriteStream | null
    date: string
    fragment: number
    size: number
  }
  error: {
    stream: fs.WriteStream | null
    date: string
  }
}

/**
 * @description 获取当前日期字符串
 */
const getCurrentDate = (): string => {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}

/**
 * @description 确保日志目录存在
 * @param dir - 日志目录
 */
const ensureLogDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * @description 清理过期日志文件
 * @param dir - 日志目录
 * @param daysToKeep - 保留天数
 */
const cleanExpiredLogs = (dir: string, daysToKeep: number): void => {
  if (!fs.existsSync(dir)) return

  const files = fs.readdirSync(dir)
  const now = new Date()
  const logFileRegex = /^logger\.(?:error\.)?(\d{4}-\d{2}-\d{2})(?:-\d{2})?\.log$/

  files.forEach(file => {
    const match = file.match(logFileRegex)
    if (match) {
      const dateStr = match[1]
      const fileDate = new Date(dateStr)
      const diffDays = Math.floor((now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays > daysToKeep) {
        try {
          fs.unlinkSync(path.join(dir, file))
        } catch (err) {
          console.error(`清理日志文件 ${file} 失败:`, err)
        }
      }
    }
  })
}

/**
 * @description 创建文件写入器
 * @param config - 文件日志配置
 */
export const createFileWriter = (config: FileLogConfig): LogWriter => {
  /** 确保日志目录存在并清理过期日志 */
  ensureLogDir(config.dir)
  cleanExpiredLogs(config.dir, config.daysToKeep)

  /** 文件句柄 */
  const handles: FileHandles = {
    normal: { stream: null, date: '', fragment: 0, size: 0 },
    error: { stream: null, date: '' },
  }

  /**
   * @description 获取日志文件路径
   * @param date - 当前日期
   * @param type - 类型
   * @param fragment - 分片序号
   */
  const getFilePath = (date: string, type: 'normal' | 'error', fragment?: number): string => {
    if (type === 'error') {
      return path.join(config.dir, `logger.error.${date}.log`)
    }

    return fragment !== undefined && fragment > 0
      ? path.join(config.dir, `logger.${date}-${String(fragment).padStart(2, '0')}.log`)
      : path.join(config.dir, `logger.${date}.log`)
  }

  /**
   * @description 获取日志写入流
   * @param date - 当前日期
   * @param type - 类型
   */
  const getStream = (date: string, type: 'normal' | 'error'): fs.WriteStream => {
    const handle = handles[type]

    /** 错误日志处理 */
    if (type === 'error') {
      if (handle.date !== date || !handle.stream) {
        handle.stream?.end()
        handle.date = date
        handle.stream = fs.createWriteStream(getFilePath(date, 'error'), { flags: 'a' })
      }
      return handle.stream
    }

    /** 标准日志处理 */
    const normal = handle as typeof handles.normal
    const maxSize = config.maxFileSize * 1024 * 1024

    /** 日期变化或流不存在时，创建新流 */
    if (normal.date !== date || !normal.stream) {
      normal.stream?.end()
      normal.date = date
      normal.fragment = 0
      normal.size = 0

      const filePath = getFilePath(date, 'normal')
      normal.stream = fs.createWriteStream(filePath, { flags: 'a' })

      /** 获取文件大小 */
      if (fs.existsSync(filePath)) {
        normal.size = fs.statSync(filePath).size
      }

      return normal.stream
    }

    /** 检查文件大小是否超限（碎片化模式下） */
    if (config.enableFragmentMode && normal.size >= maxSize) {
      normal.stream.end()
      normal.fragment++
      normal.size = 0
      normal.stream = fs.createWriteStream(getFilePath(date, 'normal', normal.fragment), { flags: 'a' })
    }

    return normal.stream
  }

  return {
    write (level: LoggerLevel, content: string) {
      const date = getCurrentDate()
      const contentSize = Buffer.from(content).length

      /** 写入标准日志（如果启用任一模式） */
      if ((config.enableWholeMode || config.enableFragmentMode) &&
        (!config.level || LoggerLevelPriority[level] >= LoggerLevelPriority[config.level])) {
        const stream = getStream(date, 'normal')
        stream.write(content)
        handles.normal.size += contentSize
      }

      /** 写入错误日志 */
      if (config.separateErrorLog && (level === 'error' || level === 'fatal')) {
        getStream(date, 'error').write(content)
      }
    },

    close (): void {
      /** 关闭所有流 */
      handles.normal.stream?.end()
      handles.normal.stream = null
      handles.error.stream?.end()
      handles.error.stream = null
    },
  }
}
