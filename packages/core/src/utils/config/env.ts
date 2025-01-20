import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import chokidar from 'chokidar'
import { randomStr } from '../fs/data'
import { requireFileSync } from '../fs/require'
import type { Env } from '@/types/config/env'

/** ffmpeg路径 */
export const ffmpegPath = () => process.env.FFMPEG_PATH
/** ffprobe路径 */
export const ffprobePath = () => process.env.FFPROBE_PATH
/** ffplay路径 */
export const ffplayPath = () => process.env.FFPLAY_PATH
/** http端口 */
export const port = (): number => Number(process.env.HTTP_PORT) || 7777
/** host */
export const host = (): string => process.env.HTTP_HOST || '127.0.0.1'

/** env配置 */
export const env = () => {
  const env = requireFileSync<string>(`${process.cwd()}/.env`, { ex: 30 })
  return dotenv.parse(env) as unknown as Env
}

/** 鉴权秘钥 */
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
 * 监听.env文件变化并自动重新加载
 */
export const watchEnv = async () => {
  const targetPath = path.join(process.cwd(), '.env')
  const watcher = chokidar.watch(targetPath, { persistent: true, ignoreInitial: true })

  /** 备份RUNTIME */
  const runtime = process.env.RUNTIME
  watcher.on('change', async () => {
    logger.info('[配置文件变动] .env')
    dotenv.config({ path: targetPath, override: true })
    process.env.RUNTIME = runtime
    const { updateLevel } = await import('@/utils/config/admin')
    updateLevel(process.env.LOG_LEVEL)
  })
}

/**
 * 修改`.env`文件
 * @param data - 需要更新的环境变量键值对
 * @returns 是否更新成功
 */
export const setEnv = (data: Record<string, any>): boolean => {
  try {
    const targetPath = path.join(process.cwd(), '.env')

    const content = fs.readFileSync(targetPath, 'utf-8')
    const envConfig = dotenv.parse(content)
    Object.entries(data).forEach(([key, value]) => {
      envConfig[key] = String(value)
    })

    const newContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    fs.writeFileSync(targetPath, newContent)
    dotenv.config({ path: targetPath, override: true })

    return true
  } catch (error) {
    logger.error('[setEnv]', error)
    return false
  }
}

watchEnv()
