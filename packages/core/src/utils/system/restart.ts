import { Contact } from '@/types/event'
import { exec } from '@/utils/system/exec'
import { env, writeEnv } from '../config'

/**
 * 重启Bot
 * @param selfId - 机器人的id 传e.self_id
 * @param contact - 事件联系人信息 也就是从哪来的这条消息 传e.contact即可
 * @param messageId - 消息id 传e.message_id
 * @param isFront - 是否为前台重启 默认是 不支持的环境会强制为pm2重启
 * @param reloadDeps - 是否为重新加载依赖 默认是false
 */
export const restart = async (
  selfId: string,
  contact: Contact,
  messageId: string,
  isFront = true,
  reloadDeps = false
): Promise<{ status: 'success' | 'failed'; data: string | Error }> => {
  const options = {
    selfId,
    contact,
    messageId,
    time: Date.now(),
  }

  const { createDB } = await import('@/core/db/kv')
  const key = `karin:restart:${selfId}`
  const db = await createDB()
  await db.set(key, options)

  if (isFront && process.send) {
    process.send(JSON.stringify({ type: 'restart', reloadDeps }))
    return { status: 'success', data: '已发送重启信号' }
  }

  if (process.env.PM2_RESTART !== 'true') process.exit()

  if (process.env.pm_id) {
    const { error } = await exec('npx karin rs')
    if (error) return { status: 'failed', data: error }
    process.exit()
  }

  /** 调用pm2启动 */
  const { error } = await exec('npx karin pm2')
  if (error) return { status: 'failed', data: error }
  process.exit()
}

/**
 * 直接重启
 * @param options - 重启选项
 */
export const restartDirect = async (options?: {
  /** 是否为pm2重启 */
  isPm2?: boolean
  /** 是否为重新加载依赖 */
  reloadDeps?: boolean
}) => {
  const { isPm2 = false, reloadDeps = false } = options || {}
  logger.mark('收到重启请求，正在重启...')

  const envCfg = env()
  if (isPm2 && envCfg.RUNTIME === 'node') {
    const envCfg = env()
    if (envCfg.RUNTIME === 'node') {
      envCfg.RUNTIME = 'pm2'
      const envData = Object.entries(envCfg).map(([key, value]) => ({
        key,
        value,
        comment: value.comment,
      }))
      writeEnv(envData, undefined, true)
    }
  }

  if (!isPm2 && process?.send) {
    process.send(JSON.stringify({ type: 'restart', reloadDeps }))
    logger.debug('正在通知父进程重启...')
    return
  }

  if (process.env.RUNTIME === 'pm2') {
    if (process.env.PM2_RESTART !== 'true') process.exit()
    await exec('npx karin rs')
    return
  }

  if (process.env.RUNTIME === 'tsx') {
    throw new Error('tsx 不支持重启')
  }

  /** 调用pm2启动 */
  if (process.env.PM2_RESTART !== 'true') process.exit()
  const { error } = await exec('npx karin pm2')
  if (error) throw error
}
