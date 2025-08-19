import { createServer } from 'node:net'
import { sleep } from '../common/sleep'
import { exec } from './exec'
import { getPid } from './pid'

/**
 * 检查端口是否可用
 * @param port - 端口号
 * @returns 端口可用返回true，否则返回false
 */
export const checkPort = (port: number): Promise<boolean> => {
  return new Promise(resolve => {
    const server = createServer()

    server.once('error', () => {
      server.close()
      resolve(false)
    })

    server.once('listening', () => {
      server.close()
      resolve(true)
    })

    server.listen(port, '127.0.0.1')
  })
}

/**
 * 等待端口可用
 * @param port - 端口号
 * @param maxAttempts - 最大尝试次数
 * @param interval - 检查间隔(ms)
 * @returns 端口是否可用
 */
export const waitPort = async (
  port: number,
  maxAttempts = 30,
  interval = 1000
): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const available = await checkPort(port)
    if (available) {
      return true
    }

    // @ts-ignore
    global?.logger?.debug(`端口 ${port} 被占用，等待释放... (${attempt + 1}/${maxAttempts})`)
    await sleep(interval)
  }

  return false
}

/**
 * 结束指定PID或端口的程序
 * @param identifier - PID号或端口号
 * @param isPort - 是否为端口号
 * @returns 是否成功结束程序
 */
export const killApp = async (
  identifier: number,
  isPort: boolean = false
): Promise<boolean> => {
  const pid: number | null = isPort ? await getPid(Number(identifier)) : Number(identifier)
  if (!pid) return false
  const isWindows = process.platform === 'win32'
  const command = isWindows
    ? `taskkill /F /PID ${pid}`
    : `kill -9 ${pid}`
  const { stderr } = await exec(command)
  if (stderr) return false
  return true
}
