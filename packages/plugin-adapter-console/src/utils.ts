import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { buffer } from '@karinjs/utils'
import type { } from '@karinjs/logger'
import type { ConsoleConfig } from './core'
import type { Elements } from '@karinjs/adapter'

/**
 * 文件索引生成
 */
export const getFileName = (() => {
  let index = 0
  return (salt: string, ext: string) => {
    const name = `${salt}.${index++}${ext}`
    return name
  }
})()

/**
 * 构建临时文件访问链接
 */
export const createTempFileUrl = async (
  config: ConsoleConfig,
  tempPath: string,
  data: string | Buffer,
  salt: string,
  ext: string
) => {
  const filename = getFileName(salt, ext)
  const filePath = path.join(tempPath, filename)
  await fs.promises.writeFile(filePath, await buffer(data))

  if (config.isLocal) {
    return `http://127.0.0.1:${process.env.HTTP_PORT}/console/${filename}`
  }

  if (config.host) {
    return `${config.host}/console/${filename}?token=${config.token}`
  }

  return `http://127.0.0.1:${process.env.HTTP_PORT}/console/${filename}?token=${config.token}`
}

/**
 * 生成盐值
 */
export const generateSalt = (saltConfig: string | number): string => {
  return typeof saltConfig === 'number'
    ? crypto.randomBytes(32).toString('hex').slice(0, saltConfig)
    : String(saltConfig)
}

/**
 * 创建默认配置
 */
export const createDefaultConfig = (): ConsoleConfig => {
  const avatar = 'https://p.qlogo.cn/gh/967068507/967068507/0'
  return {
    host: '',
    token: crypto.randomUUID(),
    isLocal: true,
    salt: 3,
    avatar: {
      bot: avatar,
      user: avatar,
      group: avatar,
    },
  }
}

/**
 * 清空临时文件夹
 */
export const cleanTempFolder = async (tempPath: string): Promise<void> => {
  try {
    const exists = await fs.promises.stat(tempPath).catch(() => null)
    if (!exists) return

    const files = await fs.promises.readdir(tempPath)

    await Promise.allSettled(
      files.map(async file => {
        const filePath = path.join(tempPath, file)
        const stat = await fs.promises.stat(filePath)
        if (stat.isDirectory()) {
          return fs.promises.rm(filePath, { recursive: true, force: true })
        }

        return fs.promises.unlink(filePath)
      })
    )
  } catch { }
}

/**
 * 消息格式化器
 */
export class MessageFormatter {
  constructor (
    private getUrlFn: (data: string | Buffer, ext: string) => Promise<string>
  ) { }

  /**
   * 格式化消息元素数组为字符串
   */
  async format (elements: Array<Elements>): Promise<string[]> {
    const msg: string[] = []

    for (const v of elements) {
      if (v.type === 'at') {
        msg.push(`[at:${v.targetId}]`)
        continue
      }

      if (v.type === 'text') {
        msg.push(v.text)
        continue
      }

      if (v.type === 'image' || v.type === 'record' || v.type === 'video') {
        const url = v.file.startsWith('http') ? v.file : await this.getUrlFn(v.file, '.png')
        msg.push(`[${v.type}: ${logger.blue(url)} ]`)
        continue
      }

      msg.push(JSON.stringify(v))
    }

    return msg
  }
}

/**
 * 命令处理器
 */
export class CommandHandler {
  private readonly LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const

  /**
   * 处理日志等级命令
   */
  handleLogCommand (text: string): boolean {
    if (!text.startsWith('log')) return false

    const level = text.replace(/^log/, '').trim() as typeof this.LOG_LEVELS[number]

    if (!this.LOG_LEVELS.includes(level)) {
      logger.error(`无效的日志等级: ${level || ''} 可选值为 ${this.LOG_LEVELS.join(', ')}`)
      return true
    }

    logger.level = level
    logger.info(`日志等级已更新为: ${level}`)
    return true
  }

  /**
   * 处理进程控制命令
   */
  handleProcessCommand (text: string): boolean {
    if (text === 'rs' || text === 'restart') {
      process.send!(JSON.stringify({ type: 'restart' }))
      return true
    }

    if (text === 'stop') {
      process.send!(JSON.stringify({ type: 'stop' }))
      return true
    }

    return false
  }

  /**
   * 检查是否为群消息命令
   */
  isGroupCommand (text: string): boolean {
    return text.startsWith('group')
  }

  /**
   * 检查是否为频道私信消息命令
   */
  isDirectCommand (text: string): boolean {
    return text.startsWith('direct')
  }

  /**
   * 检查是否为频道消息命令
   */
  isGuildCommand (text: string): boolean {
    return text.startsWith('guild')
  }

  /**
   * 检查是否为群临时消息命令
   */
  isGroupTempCommand (text: string): boolean {
    return text.startsWith('groupTemp')
  }

  /**
   * 移除命令前缀
   */
  removePrefix (text: string, prefix: string): string {
    return text.replace(new RegExp(`^${prefix}`), '').trim()
  }
}
