import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import chokidar from 'chokidar'

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
    const { updateLevel } = await import('@/utils/config/config')
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
