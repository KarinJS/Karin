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
