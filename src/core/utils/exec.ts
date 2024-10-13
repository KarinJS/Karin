import { exec as execCmd } from 'child_process'

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 */
export const exec = (cmd: string, options?: Parameters<typeof execCmd>[1]): Promise<string> => {
  return new Promise((resolve, reject) => {
    execCmd(cmd, options, (error, stdout) => {
      if (error) return reject(error)
      resolve(stdout.toString().trim())
    })
  })
}
