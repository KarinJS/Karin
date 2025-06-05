import { exec } from './exec'
import { isWin } from './system'

/**
 * 传入端口号，返回对应的pid
 * @param port - 端口号
 */
export const getPid = async (port: number): Promise<number | null> => {
  const command = isWin ? `netstat -ano | findstr :${port}` : `lsof -i:${port} | grep LISTEN | awk '{print $2}'`
  const { stdout } = await exec(command)
  if (!stdout) return null
  if (isWin) {
    const pid = stdout.toString().split(/\s+/).filter(Boolean).pop()
    return isNaN(Number(pid)) ? null : Number(pid)
  }

  return isNaN(Number(stdout)) ? null : Number(stdout)
}
