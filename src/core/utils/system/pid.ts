import { exec } from './exec'
import { isWin } from './system'

/**
 * 传入端口号，返回对应的pid
 * @param port - 端口号
 */
export const getPid = async (port: number): Promise<number> => {
  const command = isWin ? `netstat -ano | findstr :${port}` : `lsof -i:${port} | grep LISTEN | awk '{print $2}'`
  const output = await exec(command)
  if (isWin) {
    const pid = output.split(/\s+/).filter(Boolean).pop()
    return Number(pid)
  }

  return Number(output)
}
