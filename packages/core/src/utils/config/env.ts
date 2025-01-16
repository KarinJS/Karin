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

watchEnv()
