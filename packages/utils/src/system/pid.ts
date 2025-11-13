import { exec } from './exec'

/**
 * 传入端口号，返回对应的pid
 * @param port - 端口号
 */
export const getPid = async (port: number): Promise<number | null> => {
  const isWindows = process.platform === 'win32'
  const command = isWindows ? `netstat -ano | findstr :${port}` : `lsof -i:${port} | grep LISTEN | awk '{print $2}'`
  const { stdout } = await exec(command)
  if (!stdout) return null
  if (isWindows) {
    const pid = stdout.toString().split(/\s+/).filter(Boolean).pop()
    return isNaN(Number(pid)) ? null : Number(pid)
  }

  return isNaN(Number(stdout)) ? null : Number(stdout)
}

/**
 * 根据端口号获取进程 PID
 *
 * 跨平台获取占用指定端口的进程 PID
 *
 * @param port - 端口号
 * @returns 进程 PID，如果未找到则返回 null
 *
 * @example
 * ```typescript
 * // 获取占用 3000 端口的进程
 * const pid = await getPidByPort(3000)
 * if (pid) {
 *   console.log(`Port 3000 is used by PID: ${pid}`)
 * }
 *
 * // 检查端口是否被占用
 * const isPortInUse = await getPidByPort(8080) !== null
 * ```
 *
 * @public
 */
export const getPidByPort = async (port: number): Promise<number | null> => {
  const isWindows = process.platform === 'win32'

  const command = isWindows
    ? `netstat -ano | findstr :${port}`
    : `lsof -i :${port} -t`

  const { status, stdout } = await exec(command)

  if (!status || !stdout) {
    return null
  }

  // 提取 PID
  const pid = stdout.toString().split(/\s+/).filter(Boolean).pop()
  return pid && !isNaN(Number(pid)) ? Number(pid) : null
}

/**
 * 终止指定 PID 或端口的进程
 *
 * 跨平台终止进程，支持通过 PID 或端口号终止
 *
 * @param identifier - 进程 PID 或端口号
 * @param isPort - 是否为端口号 @default false
 * @returns 是否成功终止进程
 *
 * @example
 * ```typescript
 * // 通过 PID 终止进程
 * await killProcess(12345)
 *
 * // 通过端口号终止进程
 * await killProcess(3000, true)
 *
 * // 释放被占用的端口
 * const success = await killProcess(8080, true)
 * if (success) {
 *   console.log('Port 8080 is now free')
 * }
 * ```
 *
 * @public
 */
export const killProcess = async (identifier: number, isPort = false): Promise<boolean> => {
  // 如果是端口号，先获取对应的 PID
  const pid = isPort ? await getPidByPort(identifier) : identifier

  if (!pid) {
    return false
  }

  // 根据平台选择终止命令
  const command = process.platform === 'win32'
    ? `taskkill /F /PID ${pid}`
    : `kill -9 ${pid}`

  const { status } = await exec(command)
  return status
}

/**
 * 检查端口是否被占用
 *
 * @param port - 端口号
 * @returns 端口是否被占用
 *
 * @example
 * ```typescript
 * // 检查端口是否可用
 * if (await isPortInUse(3000)) {
 *   console.log('Port 3000 is already in use')
 * }
 *
 * // 查找可用端口
 * let port = 3000
 * while (await isPortInUse(port)) {
 *   port++
 * }
 * console.log(`Available port: ${port}`)
 * ```
 *
 * @public
 */
export const isPortInUse = async (port: number): Promise<boolean> => {
  const pid = await getPidByPort(port)
  return pid !== null
}
