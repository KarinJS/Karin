import { exec as execCmd } from 'child_process'

type ExecError = { error: Error; stderr: string }
type ExecReturn<K extends boolean, T extends boolean> = K extends true
  ? boolean
  : T extends true ? string : (ExecError | string)

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.throwOnError 是否抛出错误 默认抛出 为`false`时将返回错误对象
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 */
export const exec = <T extends boolean = true, K extends boolean = false> (
  cmd: string,
  options?: Parameters<typeof execCmd>[1] & {
    /** 是否只返回布尔值 表示命令是否成功执行 优先级比抛错误高 */
    booleanResult?: K
    /** 是否抛出错误 默认抛出 为`false`时将返回错误对象 */
    throwOnError?: T
  }
): Promise<ExecReturn<K, T>> => {
  return new Promise((resolve, reject) => {
    execCmd(cmd, options, (error, stdout, stderr) => {
      if (options?.booleanResult) {
        if (error) return resolve(false as ExecReturn<K, T>)
        return resolve(true as ExecReturn<K, T>)
      }

      if (error) {
        if (options?.throwOnError === false) {
          const info = { error, stderr: stderr.toString().trim() }
          return resolve(info as ExecReturn<K, T>)
        }

        return reject(error)
      }

      resolve(stdout.toString().trim() as ExecReturn<K, T>)
    })
  })
}
