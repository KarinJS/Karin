import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { randomStr } from '../../fs/data'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'
import type { Env } from '@/types/config/env'

/**
 * 自定义解析器
 * @param content - 内容
 * @returns 解析后的内容
 */
const parser = (content: string) => {
  const lines = content.split('\n')
  const list: { key: string, value: string, comment: string }[] = []

  /** 反序成对象 */
  const obj: Record<string, string> = {}
  lines.forEach((line, index) => {
    obj[index] = line
  })

  lines.forEach((line, index) => {
    /** 跳过非kv元素 */
    if (!line.includes('=')) return

    let comment = ''
    let [key, value] = line.split('=').map((item) => item.trim())

    /** value 存在#说明是注释 */
    if (value.includes('#')) {
      const arr = value.split('#').map((item) => item.trim())
      comment = arr.length > 1 ? `# ${arr[1]}` : ''
      value = arr[0].replace(/^"|"$/g, '')
    } else {
      /** 不存在则获取上一行内容 查看是否为注释: 开始带# */
      const data = obj[index - 1]
      if (data.startsWith('#')) {
        comment = data
      }
      value = value.replace(/^"|"$/g, '')
    }

    list.push({ key, value, comment: comment.replace(/\\r|\\n/g, '').trim() })
  })

  /** 返回对象 */
  const result: Record<string, { value: string; comment: string }> = {}
  list.forEach((item) => {
    result[item.key] = {
      value: item.value,
      comment: item.comment,
    }
  })

  return result
}

/**
 * @internal
 * @description 初始化.env文件
 */
const initEnv = () => {
  const name = '.env'
  const file = `${process.cwd()}/${name}`

  watch<ReturnType<typeof parser>>(file, (old, data) => {
    dotenv.config({ path: file, override: true })
    process.env.RUNTIME = data.RUNTIME.value as 'node' | 'pm2' | 'tsx' || 'node'
    logger.level = process.env.LOG_LEVEL || 'info'

    const options = { file, old, data }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { parser })
}

/**
 * @public 公开Api
 * @description 获取ffmpeg路径
 */
export const ffmpegPath = () => process.env.FFMPEG_PATH
/**
 * @public 公开Api
 * @description 获取ffprobe路径
 */
export const ffprobePath = () => process.env.FFPROBE_PATH

/**
 * @public 公开Api
 * @description 获取ffplay路径
 */
export const ffplayPath = () => process.env.FFPLAY_PATH

/**
 * @public 公开Api
 * @description 获取http端口
 */
export const port = (): number => Number(process.env.HTTP_PORT) || 7777

/**
 * @public 公开Api
 * @description 获取http主机
 */
export const host = (): string => process.env.HTTP_HOST || '127.0.0.1'

/**
 * @public 公开Api
 * @description 获取鉴权秘钥
 */
export const authKey = () => {
  const key = process.env.HTTP_AUTH_KEY
  /** 如果是默认 则生成随机秘钥 */
  if (!key || key === 'default') {
    const value = randomStr()
    process.env.HTTP_AUTH_KEY = value
    logger.warn(`HTTP鉴权秘钥为默认 使用随机秘钥: ${value}`)
    return value
  }

  return key
}

/**
 * @public 公开Api
 * @description 修改`.env`文件 此方法仅允许写入单个键值对 如需写入多个键值对和注释 请使用`writeEnv`方法
 * @param data - 需要更新的环境变量键值对
 * @returns 是否更新成功
 */
export const setEnv = (data: Record<string, any>): boolean => {
  try {
    const targetPath = path.join(process.cwd(), '.env')

    const envConfig = getEnv(targetPath)

    Object.entries(data).forEach(([key, value]) => {
      envConfig[key] = {
        value,
        comment: envConfig[key]?.comment ?? '',
      }
    })

    const newContent = Object.entries(envConfig)
      .map(([key, value]) => `${value.comment}\n${key}="${value.value}"`)
      .join('\n')

    fs.writeFileSync(targetPath, newContent)
    dotenv.config({ path: targetPath, override: true })

    return true
  } catch (error) {
    logger.error('[setEnv]', error)
    return false
  }
}

/**
 * @public 公开Api
 * @description 获取.env文件内容
 */
export const getEnv = (filePath: string = path.join(process.cwd(), '.env')): Record<string, {
  /** 值 */
  value: string
  /** 注释 */
  comment: string
}> => {
  const data = requireFileSync<ReturnType<typeof parser>>(filePath, { parser })
  return data
}

/**
 * @public 公开Api
 * @description 获取.env文件内容
 */
export const env = (): Env => {
  const data = getEnv(path.join(process.cwd(), '.env'))
  const env = {} as Record<string, string>

  Object.entries(data).forEach(([key, value]) => {
    env[key] = value.value
  })

  return env as unknown as Env
}

/**
 * 写入单个或多个环境变量
 * @param data 要写入的环境变量
 * @param cwd env文件路径 默认系统.env文件
 * @param isCover 如果键已经存在 是否覆盖已有的值 默认否
 */
export const writeEnv = (
  data: { key: string, value: string, comment: string } | { key: string, value: string, comment: string }[],
  cwd: string = path.join(process.cwd(), '.env'),
  isCover: boolean = false
) => {
  const env = getEnv(cwd)
  if (!Array.isArray(data)) data = [data]

  data.forEach((item) => {
    const { key, value, comment } = item
    if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
      logger.error('[writeEnv]', 'key 和 value 必须为字符串')
      return
    }

    if (env[key]) {
      if (!isCover) {
        logger.debug(`[writeEnv] key: ${key} 已存在 跳过`)
        return
      }
    }

    env[key] = {
      value,
      comment: comment || env?.[key]?.comment || '',
    }
  })

  const content = Object.entries(env)
    .map(([key, value]) => {
      /** 统一处理value前后的注释 */
      const val = /^".*"$/.test(value.value) ? value.value : `"${value.value}"`

      if (value.comment) {
        const comment = /^#/.test(value.comment) ? value.comment : `# ${value.comment}`
        return `${comment}\n${key}=${val}`
      }

      return `${key}=${val}`
    })
    .join('\n')

  fs.writeFileSync(cwd, content)
  dotenv.config({ path: cwd, override: true })
}

export default initEnv
