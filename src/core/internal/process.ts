import { listeners } from './listeners'
import { axios } from '@/utils/common'
import { getPid } from '@/utils/system/pid'

/** 处理基本信号 */
export const processHandler = () => {
  /** 监听挂起信号 在终端关闭时触发 */
  process.once('SIGHUP', code => listeners.emit('exit', { type: 'SIGHUP', code }))
  /** 监听中断信号 用户按下 Ctrl + C 时触发 */
  process.once('SIGINT', code => listeners.emit('exit', { type: 'SIGINT', code }))
  /** 监听终止信号 程序正常退出时触发 */
  process.once('SIGTERM', code => listeners.emit('exit', { type: 'SIGTERM', code }))
  /** 监听退出信号 windows下程序正常退出时触发 */
  process.once('SIGBREAK', code => listeners.emit('exit', { type: 'SIGBREAK', code }))
  /** 监听退出信号 与 SIGINT 类似，但会生成核心转储 */
  process.once('SIGQUIT', code => listeners.emit('exit', { type: 'SIGQUIT', code }))
  /** 监听退出信号 Node.js进程退出时触发 */
  process.once('exit', code => listeners.emit('exit', { type: 'exit', code }))
  /** 捕获警告 */
  process.on('warning', warning => listeners.emit('warn', warning))
  /** 捕获错误 */
  process.on('uncaughtException', error => listeners.emit('error', error))
  /** 捕获未处理的Promise错误 */
  process.on('unhandledRejection', error => listeners.emit('error', error))
}

/**
 * 检查是否存在后台进程
 * @param port - 端口号
 */
export const checkProcess = async (port: number) => {
  const host = `http://127.0.0.1:${port}`
  const data = await axios({ url: `${host}/ping`, method: 'get', timeout: 2000 })
  if (!data || data.status !== 200) return

  /** 端口被未知程序占用 获取对应的进程ID */
  if (data?.data?.name !== 'karin') {
    const pid = await getPid(port).catch(() => -0)
    logger.fatal(`端口 ${port} 被进程占用，进程ID：${pid}，请手动关闭对应进程或解除端口占用`)
    return
  }

  /** 判断是否为同个进程 防止无限循环启动 */
  if (data?.data?.pm2_id === process.pid) {
    return
  }

  logger.warn('检测到后台进程 正在关闭...')
  await axios({ url: `${host}/exit`, method: 'get', timeout: 2000 })

  for (let i = 0; i < 50; i++) {
    const result = await axios({ url: `${host}/ping`, method: 'get', timeout: 100 })
    /** 请求成功继续循环 */
    if (result) continue
    /** 请求异常即代表后台进程已关闭 */
    logger.mark('后台进程已关闭')
    return
  }

  /** 走到这里说明后台关闭失败 */
  logger.error(`后台进程关闭失败，请检查是否有进程正在占用端口${port}`)
  process.exit()
}
