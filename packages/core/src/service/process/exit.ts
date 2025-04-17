import { tips } from './check'
import { exec } from '@/utils/system/exec'
import { uptime } from '@/utils/common/uptime'

let exitStatus = false

/**
 * @description 处理退出事件
 * @param code 退出码
 */
export const processExit = async (code: unknown) => {
  try {
    if (exitStatus) return
    exitStatus = true

    const { redis } = await import('@/core/db/redis/redis')
    await redis.save()

    logger.mark(tips(`运行结束 运行时间：${uptime()} 退出码：${code ?? '未知'}`))

    /** 如果是pm2环境 */
    if (process.env.pm_id) {
      await exec(`pm2 delete ${process.env.pm_id}`)
    }
  } finally {
    /** exit还会再触发一次事件  */
    setTimeout(() => {
      exitStatus = true
    }, 200)
    process.exit()
  }
}
