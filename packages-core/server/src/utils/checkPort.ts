import net from 'node:net'

/**
 * 检查端口是否可用
 * @returns true 表示可用，false 表示被占用
 */
export const isPortFree = (host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(false)) // 被占用
      .once('listening', () => {
        tester.close(() => resolve(true)) // 可用
      })
      .listen(port, host)
  })
}

/**
 * 获取可用端口，自动递增（按次数）
 * @param host 主机
 * @param port 起始端口
 * @param maxIncrease 最多递增次数
 */
export const getAvailablePort = async (
  host: string,
  port: number,
  maxIncrease: number
): Promise<number | null> => {
  for (let i = 0; i <= maxIncrease; i++) {
    const checkPort = port + i
    const free = await isPortFree(host, checkPort)
    if (free) return checkPort
  }

  return null
}
