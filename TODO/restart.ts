import { exec } from './exec'
import type { Contact } from '@karinjs/adapter'

/**
 * 重启选项
 */
export interface RestartOptions {
  /** 机器人 ID */
  selfId: string
  /** 联系人信息（消息来源） */
  contact: Contact
  /** 消息 ID */
  messageId: string
  /** 是否为前台重启（通过 process.send） @default true */
  useFrontend?: boolean
  /** 是否重新加载依赖 @default false */
  reloadDeps?: boolean
}

/**
 * 重启结果
 */
export interface RestartResult {
  /** 重启状态 */
  status: 'success' | 'failed'
  /** 返回数据或错误信息 */
  data: string | Error
}

/**
 * 直接重启选项
 */
export interface RestartDirectOptions {
  /** 是否使用 PM2 重启 @default false */
  usePm2?: boolean
  /** 是否重新加载依赖 @default false */
  reloadDeps?: boolean
}

/**
 * 重启 Bot
 *
 * 根据运行环境选择合适的重启方式：
 * - 前台模式：通过 process.send 通知父进程
 * - PM2 模式：使用 PM2 重启命令
 * - 其他：直接退出进程
 *
 * @param options - 重启选项
 * @returns 重启结果
 *
 * @throws {Error} 当 DB 模块不可用时抛出
 *
 * @example
 * ```typescript
 * // 在消息处理器中重启
 * async function handleRestart(e: KarinMessage) {
 *   const result = await restart({
 *     selfId: e.self_id,
 *     contact: e.contact,
 *     messageId: e.message_id,
 *   })
 *
 *   if (result.status === 'success') {
 *     await e.reply('正在重启...')
 *   }
 * }
 *
 * // 重启并重新加载依赖
 * await restart({
 *   selfId: bot.id,
 *   contact,
 *   messageId,
 *   reloadDeps: true,
 * })
 * ```
 *
 * @public
 */
export const restart = async (options: RestartOptions): Promise<RestartResult> => {
  const {
    selfId,
    contact,
    messageId,
    useFrontend = true,
    reloadDeps = false,
  } = options

  // 保存重启信息到数据库
  const { db } = await import('@karinjs/db')
  const key = `karin:restart:${selfId}`
  await db.set(key, {
    selfId,
    contact,
    messageId,
    time: Date.now(),
  })

  // 前台重启（通过 process.send）
  if (useFrontend && process.send) {
    process.send(JSON.stringify({ type: 'restart', reloadDeps }))
    return { status: 'success', data: '已发送重启信号' }
  }

  // 非 PM2 环境直接退出
  if (process.env.PM2_RESTART !== 'true') {
    process.exit()
  }

  // PM2 环境重启
  if (process.env.pm_id) {
    const { error } = await exec('npx karin rs')
    if (error) {
      return { status: 'failed', data: error }
    }
    process.exit()
  }

  // 调用 PM2 启动
  const { error } = await exec('npx karin pm2')
  if (error) {
    return { status: 'failed', data: error }
  }

  process.exit()
}

/**
 * 直接重启进程
 *
 * 不保存重启信息，直接根据运行环境重启
 *
 * @param options - 重启选项
 * @returns void
 *
 * @throws {Error} 当重启失败时抛出
 *
 * @example
 * ```typescript
 * // 前台重启
 * await restartDirect()
 *
 * // PM2 重启
 * await restartDirect({ usePm2: true })
 *
 * // 重启并重新加载依赖
 * await restartDirect({ reloadDeps: true })
 * ```
 *
 * @public
 */
export const restartDirect = async (options: RestartDirectOptions = {}): Promise<void> => {
  const { usePm2 = false, reloadDeps = false } = options

  // @ts-ignore
  const logger = global?.logger || console
  logger.mark('收到重启请求，正在重启...')

  // 前台重启
  if (!usePm2 && process.send) {
    process.send(JSON.stringify({ type: 'restart', reloadDeps }))
    logger.debug('正在通知父进程重启...')
    return
  }

  // PM2 运行时重启
  if (process.env.RUNTIME === 'pm2') {
    if (process.env.PM2_RESTART !== 'true') {
      process.exit()
    }
    await exec('npx karin rs')
    return
  }

  // tsx 不支持重启
  if (process.env.RUNTIME === 'tsx') {
    throw new Error('tsx 运行时不支持重启')
  }

  // 调用 PM2 启动
  if (process.env.PM2_RESTART !== 'true') {
    process.exit()
  }

  const { error } = await exec('npx karin pm2')
  if (error) {
    throw error
  }
}
