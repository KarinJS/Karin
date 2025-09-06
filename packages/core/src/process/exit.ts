import { tips } from './check'
import { exec, uptime } from '@karinjs/utils'

let exitStatus = false

/**
 * @description 处理退出事件
 * @param code 退出码
 * @param isKillPm2 是否杀死pm2进程
 */
export const processExit = async (code: unknown, isKillPm2 = false) => {
  logger.debug('[child] 子进程收到退出申请:', code)
  try {
    if (exitStatus) return
    exitStatus = true

    logger.debug('[child] 开始保存redis数据')
    const { redis } = await import('@karinjs/db')

    /** 2秒之内需要保存完成 */
    await Promise.race([
      redis.save(),
      new Promise<void>((resolve, _reject) => setTimeout(() => {
        logger.warn('[child] redis数据保存超时，强制退出')
        resolve()
      }, 2000)),
    ])
    logger.debug('[child] redis数据保存完成')

    logger.mark(tips(`运行结束 运行时间：${uptime()} 退出码：${code ?? '未知'}`))

    /** 如果是pm2环境 */
    if (process.env.pm_id && isKillPm2) {
      logger.mark(tips('[child] pm2环境 删除pm2进程'))
      await exec(`pm2 delete ${process.env.pm_id}`)
    }
  } catch (error) {
    logger.error(new Error('[child] 退出事件发生错误:', { cause: error }))
  } finally {
    /** exit还会再触发一次事件  */
    setTimeout(() => {
      exitStatus = true
    }, 200)
    process.exit()
  }
}
