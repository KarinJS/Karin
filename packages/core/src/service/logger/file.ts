import fs from 'node:fs'
import path from 'node:path'
import { LoggerLevelPriority } from './types'
import { formatLogString } from '@/adapter/onebot/core/convert'
import type { LoggerLevel, LogWriter, FileLogConfig } from './types'

/**
 * @description 文件句柄信息
 */
interface FileHandle {
  /** 文件流 */
  stream: fs.WriteStream | null
  /** 日期标识 */
  date: string
  /** 分片序号 */
  fragment: number
  /** 当前写入大小 */
  size: number
}

/**
 * @description 获取当前日期字符串
 */
const getCurrentDate = (): string => {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}

/**
 * @description 计算距离下一个午夜的毫秒数
 */
const getMillisecondsUntilMidnight = (): number => {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

/**
 * @description 确保日志目录存在
 * @param dir - 日志目录
 */
const ensureLogDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true })
    } catch (err) {
      // 不再静默处理错误，输出到控制台
      console.error(`[Logger] 创建日志目录失败: ${dir}`, err)
    }
  }
}

/**
 * @description 清理过期日志文件
 * @param dir - 日志目录
 * @param daysToKeep - 保留天数
 */
const cleanExpiredLogs = async (dir: string, daysToKeep: number): Promise<void> => {
  if (!fs.existsSync(dir)) return

  const files = fs.readdirSync(dir)
  const now = new Date()
  const logFileRegex = /^logger\.(?:error\.)?(\d{4}-\d{2}-\d{2})(?:-\d{2})?\.log$/

  await Promise.all(files.map(async (file) => {
    const match = file.match(logFileRegex)
    if (match) {
      const dateStr = match[1]
      const fileDate = new Date(dateStr)
      const diffDays = Math.floor((now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays > daysToKeep) {
        try {
          await fs.promises.unlink(path.join(dir, file))
        } catch { }
      }
    }
  }))
}

/**
 * @description 创建文件写入器
 * @param config - 文件日志配置
 */
export const createFileWriter = (config: FileLogConfig): LogWriter => {
  /** 普通日志句柄 */
  const normalHandle: FileHandle = { stream: null, date: '', fragment: 0, size: 0 }
  /** 错误日志句柄 */
  const errorHandle: FileHandle = { stream: null, date: '', fragment: 0, size: 0 }

  /** 定时器引用 */
  let midnightTimer: NodeJS.Timeout | null = null

  /** 当前配置引用，支持热更新 */
  let currentConfig = { ...config }

  /**
   * @description 获取日志文件路径
   * @param date - 日期
   * @param isError - 是否为错误日志
   * @param fragment - 分片序号
   */
  const getLogFilePath = (date: string, isError: boolean, fragment = 0): string => {
    const prefix = isError ? `logger.error.${date}` : `logger.${date}`
    const suffix = !isError && fragment > 0 ? `-${String(fragment).padStart(2, '0')}` : ''
    return path.join(currentConfig.dir, `${prefix}${suffix}.log`)
  }

  /**
   * @description 安全获取文件大小
   * @param filePath - 文件路径
   */
  const safeGetFileSize = (filePath: string): number => {
    try {
      return fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
    } catch (err) {
      return 0
    }
  }

  /**
   * @description 创建安全的写入流
   * @param filePath - 文件路径
   */
  const createWriteStream = (filePath: string): fs.WriteStream => {
    try {
      const fileDir = path.dirname(filePath)
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true })
      }

      // 降低水位线阈值，更频繁地刷新到磁盘
      return fs.createWriteStream(filePath, {
        flags: 'a',
        highWaterMark: 1024, // 降低缓冲阈值到1KB
      })
    } catch (err) {
      /** 创建一个空的写入流避免空引用异常 */
      const dummyStream = new fs.WriteStream(null as any)
      // 覆盖写方法，避免写入undefined
      dummyStream.write = () => true
      return dummyStream
    }
  }

  /**
   * @description 安全关闭流
   * @param stream - 要关闭的流
   */
  const safeCloseStream = (stream: fs.WriteStream | null): void => {
    if (stream) stream.end()
  }

  /**
   * @description 获取写入流
   * @param isError - 是否为错误日志
   */
  const getStream = (isError: boolean): fs.WriteStream => {
    const handle = isError ? errorHandle : normalHandle
    const currentDate = getCurrentDate()
    const maxSize = currentConfig.maxFileSize * 1024 * 1024

    /** 日期变更、流不存在或文件被删除时创建新流 */
    const filePath = getLogFilePath(currentDate, isError, handle.fragment)
    if (handle.date !== currentDate || !handle.stream || !fs.existsSync(filePath)) {
      /** 安全关闭旧流 */
      safeCloseStream(handle.stream)

      /** 重置状态 */
      if (handle.date !== currentDate) {
        handle.fragment = 0
      }
      handle.date = currentDate

      /** 创建新流 */
      handle.size = safeGetFileSize(filePath)
      handle.stream = createWriteStream(filePath)

      return handle.stream
    }

    /** 检查文件大小并处理分片（仅普通日志且启用分片模式） */
    if (!isError && currentConfig.enableFragmentMode && handle.size >= maxSize) {
      safeCloseStream(handle.stream)

      handle.fragment++
      const newFilePath = getLogFilePath(currentDate, isError, handle.fragment)
      handle.size = 0
      handle.stream = createWriteStream(newFilePath)
    }

    return handle.stream
  }

  /**
   * @description 设置午夜定时器
   */
  const setupMidnightTimer = (): void => {
    /** 清除已有定时器 */
    if (midnightTimer) {
      clearTimeout(midnightTimer)
    }

    /** 计算到午夜的毫秒数 */
    const msUntilMidnight = getMillisecondsUntilMidnight()

    /** 设置新定时器 */
    midnightTimer = setTimeout(() => {
      /** 关闭现有流，下次写入时会创建新的 */
      closeStreams()

      /** 清理过期日志 */
      cleanExpiredLogs(currentConfig.dir, currentConfig.daysToKeep)

      /** 重新设置定时器 */
      setupMidnightTimer()
    }, msUntilMidnight)
  }

  /**
   * @description 关闭所有流
   */
  const closeStreams = (): void => {
    /** 关闭普通日志流 */
    safeCloseStream(normalHandle.stream)
    normalHandle.stream = null
    normalHandle.date = ''

    /** 关闭错误日志流 */
    safeCloseStream(errorHandle.stream)
    errorHandle.stream = null
    errorHandle.date = ''
  }

  /** 初始化 */
  ensureLogDir(currentConfig.dir)
  cleanExpiredLogs(currentConfig.dir, currentConfig.daysToKeep)
  setupMidnightTimer()

  /**
   * @description 写入日志内容
   * @param level - 日志级别
   * @param content - 日志内容
   */
  const write = (level: LoggerLevel, content: string): void => {
    const contentSize = Buffer.from(content).length

    const logLevel = currentConfig.level || 'info'
    const formattedContent = formatLogString(content)

    /** 写入普通日志 */
    if ((currentConfig.enableWholeMode || currentConfig.enableFragmentMode) &&
      LoggerLevelPriority[level] >= LoggerLevelPriority[logLevel]) {
      const stream = getStream(false)
      if (!stream.write(formattedContent)) {
        normalHandle.stream = null
        const newStream = getStream(false)
        newStream.write(formattedContent)
      }
      normalHandle.size += contentSize
    }

    /** 写入错误日志 */
    if (currentConfig.separateErrorLog && (level === 'error' || level === 'fatal')) {
      const stream = getStream(true)
      stream.write(formattedContent)
    }
  }

  /** 返回写入器接口 */
  return {
    write,

    /**
     * @description 更新配置
     * @param newConfig - 新的配置
     */
    updateConfig: (newConfig: Partial<FileLogConfig>): void => {
      // 更新当前配置
      currentConfig = { ...currentConfig, ...newConfig }
    },

    /**
     * @description 关闭日志写入器
     */
    close: closeStreams,
  }
}
