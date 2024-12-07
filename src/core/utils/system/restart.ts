import { Contact } from '@/adapter'
import { exec } from '@/utils/system/exec'
import { config } from '../config'

/**
 * 重启Bot
 * @param selfId - 机器人的id 传e.self_id
 * @param contact - 事件联系人信息 也就是从哪来的这条消息 传e.contact即可
 * @param messageId - 消息id 传e.message_id
 * @param isFront - 是否为前台重启 默认是
 */
export const restart = async (selfId: string, contact: Contact, messageId: string, isFront = true) => {
  const options = {
    selfId,
    contact,
    messageId,
    time: Date.now(),
  }

  const key = `karin:restart:${selfId}`
  const { level } = await import('../../../main/index')
  await level.set(key, options)

  if (isFront) {
    if (!process.send) return { status: 'failed', data: '前台重启失败，当前环境不支持，仅支持【npx karin start】启动的环境' }
    process.send('restart')
  }

  if (!config().pm2Restart) process.exit()

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
