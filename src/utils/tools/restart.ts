import exec from './exec'
import { level } from 'karin/db'
import { Contact } from 'karin/types'
import { config } from '../config/config'

/**
 * 重启Bot
 * @param self_id - 机器人的id 传e.self_id
 * @param contact - 事件联系人信息 也就是从哪来的这条消息 传e.contact即可
 * @param message_id - 消息id 传e.message_id
 * @param isFront - 是否为前台重启 默认是
 */
export const restart = async (self_id: string, contact: Contact, message_id: string, isFront = true) => {
  const options = {
    id: self_id,
    contact,
    message_id,
    time: Date.now(),
  }

  const key = `karin:restart:${options.id}`
  await level.set(key, options)

  if (isFront) {
    if (!process.send) return { status: 'failed', data: '前台重启失败，当前环境不支持，仅支持【npx karin start】启动的环境' }
    process.send({ action: 'npx karin start', env: process.env })
    process.exit()
  }

  if (!config.Config.pm2Restart) process.exit()

  if (process.env.pm_id) {
    const pm2 = await exec('npx karin rs')
    if (pm2.status === 'ok') process.exit()
    return { status: 'failed', data: pm2.error }
  }

  /** 调用pm2启动 */
  const pm2 = await exec('npx karin pm2')
  if (pm2.status === 'ok') process.exit()
  return { status: 'failed', data: pm2.error }
}
