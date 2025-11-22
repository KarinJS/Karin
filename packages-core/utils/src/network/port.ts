import { exec } from '../system/exec'

export class PortManager {
  /**
   * 获取端口对应的进程 PID
   * @param port - 要查询的端口号
   * @returns 端口对应的进程 PID，如果端口未被占用则返回 null
   * @throws 当命令执行失败时抛出错误
   * @example
   * ```ts
   * const portManager = new PortManager()
   * const pid = await portManager.getPortPid(3000)
   * console.log(pid) // 输出: 12345 或 null
   * ```
   */
  async getPortPid (port: number): Promise<number | null> {
    const isWindows = process.platform === 'win32'

    if (isWindows) {
      // Windows: 使用 netstat 命令
      const command = `netstat -ano | findstr :${port}`
      const { stdout, status } = await exec(command)

      if (!status) {
        return null
      }

      // 解析输出，提取 PID
      const lines = stdout.trim().split('\n')
      for (const line of lines) {
        // 匹配 LISTENING 状态的行
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/)
          const pid = parseInt(parts[parts.length - 1])
          if (!isNaN(pid)) {
            return pid
          }
        }
      }

      // 如果没有 LISTENING 状态，尝试提取第一行的 PID
      const parts = lines[0].trim().split(/\s+/)
      const pid = parseInt(parts[parts.length - 1])
      return isNaN(pid) ? null : pid
    } else {
      // Linux/Mac: 使用 lsof 命令
      const command = `lsof -i :${port} -t`
      const { stdout, status } = await exec(command)

      if (!status) {
        return null
      }

      const pid = parseInt(stdout.trim().split('\n')[0])
      return isNaN(pid) ? null : pid
    }
  }

  /**
   * 检查端口是否被占用
   * @param port - 要检查的端口号
   * @returns 如果端口被占用返回 true，否则返回 false
   * @throws 当命令执行失败时抛出错误
   * @example
   * ```ts
   * const portManager = new PortManager()
   * const isInUse = await portManager.isPortInUse(3000)
   * console.log(isInUse) // 输出: true 或 false
   * ```
   */
  async isPortInUse (port: number): Promise<boolean> {
    const pid = await this.getPortPid(port)
    return pid !== null
  }

  /**
   * 检查指定端口是否可用
   * @param port - 要检查的端口号
   * @returns 如果端口可用返回 true，否则返回 false
   * @throws 当命令执行失败时抛出错误
   * @example
   * ```ts
   * const portManager = new PortManager()
   * const isAvailable = await portManager.isPortAvailable(3000)
   * console.log(isAvailable) // 输出: true 或 false
   * ```
   */
  async isPortAvailable (port: number): Promise<boolean> {
    const inUse = await this.isPortInUse(port)
    return !inUse
  }

  /**
   * 从指定端口开始递增查找空闲端口
   * @param startPort - 起始端口号
   * @param maxAttempts - 最大尝试次数，默认为 100
   * @returns 找到的空闲端口号
   * @throws 当超过最大尝试次数仍未找到空闲端口或命令执行失败时抛出错误
   * @example
   * ```ts
   * const portManager = new PortManager()
   * const freePort = await portManager.getFreePort(3000)
   * console.log(freePort) // 输出: 3000 或更大的空闲端口
   *
   * // 限制最大尝试次数
   * const freePort2 = await portManager.getFreePort(3000, 50)
   * ```
   */
  async getFreePort (startPort: number, maxAttempts: number = 100): Promise<number> {
    if (startPort < 1 || startPort > 65535) {
      throw new Error(`无效的端口号: ${startPort}，端口范围应该在 1-65535 之间`)
    }

    if (maxAttempts < 1) {
      throw new Error(`无效的最大尝试次数: ${maxAttempts}，应该大于 0`)
    }

    let currentPort = startPort
    let attempts = 0

    while (attempts < maxAttempts) {
      if (currentPort > 65535) {
        throw new Error(`已超过最大端口号 65535，从端口 ${startPort} 开始未能找到空闲端口`)
      }

      const isAvailable = await this.isPortAvailable(currentPort)

      if (isAvailable) {
        return currentPort
      }

      currentPort++
      attempts++
    }

    throw new Error(`在 ${maxAttempts} 次尝试后未能找到空闲端口（起始端口: ${startPort}）`)
  }
}

/**
 * 端口管理类
 * @description 提供端口相关的工具方法，包括获取端口占用进程、检查端口状态、查找空闲端口等
 * @example
 * ```ts
 * const port = new PortManager()
 *
 * // 获取端口对应的 PID
 * const pid = await port.getPortPid(3000)
 *
 * // 检查端口是否被占用
 * const isInUse = await port.isPortInUse(3000)
 *
 * // 检查端口是否可用
 * const isAvailable = await port.isPortAvailable(3000)
 *
 * // 获取空闲端口（从指定端口开始递增查找）
 * const freePort = await port.getFreePort(3000)
 * ```
 */
export const port = new PortManager()
