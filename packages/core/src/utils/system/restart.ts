import { Contact } from '@/types/event'
import { exec } from '@/utils/system/exec'

/**
 * 重启Bot
 * @param selfId - 机器人的id 传e.self_id
 * @param contact - 事件联系人信息 也就是从哪来的这条消息 传e.contact即可
 * @param messageId - 消息id 传e.message_id
 * @param isFront - 是否为前台重启 默认是 不支持的环境会强制为pm2重启
 */
export const restart = async (
  selfId: string,
  contact: Contact,
  messageId: string,
  isFront = true
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
    process.send(JSON.stringify({
      type: 'restart',
      port: process.env.HTTP_PORT,
      token: process.env.HTTP_AUTH_KEY,
    }))
    return { status: 'success', data: '已发送重启信号' }
  }

  if (process.env.PM2_RESTART === 'false') process.exit()

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
 * @param isPm2 - 是否为pm2重启 默认false
 */
export const restartDirect = async (isPm2 = false) => {
  logger.mark('收到重启请求，正在重启...')
  if (!isPm2 && process?.send) {
    process.send(JSON.stringify({
      type: 'restart',
      port: process.env.HTTP_PORT,
      token: process.env.HTTP_AUTH_KEY,
    }))
    logger.mark('正在通知父进程重启...')
    process.exit(0)
  }

  if (process.env.RUNTIME === 'pm2') {
    await exec('npx karin rs')
    return
  }

  if (process.env.RUNTIME === 'tsx') {
    throw new Error('tsx 不支持重启')
  }

  /** 调用pm2启动 */
  const { error } = await exec('npx karin pm2')
  if (error) throw error
}
