import { exec as execCmd, type ExecException } from 'child_process'
import { stringifyError } from './error'

const logger = global?.logger || console

type ExecError = {
  error: ExecException | null
  stderr: string
  stdout: string
}
type ExecReturn<K extends boolean> = K extends true ? boolean : ExecError

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 */
export const exec = <K extends boolean = false> (
  cmd: string,
  options?: Parameters<typeof execCmd>[1] & {
    /** 是否打印日志 默认不打印 */
    log?: boolean
    /** 是否只返回布尔值 表示命令是否成功执行 优先级比抛错误高 */
    booleanResult?: K
  }
): Promise<ExecReturn<K>> => {
  return new Promise((resolve) => {
    if (options?.log) {
      logger.info([
        '[exec] 执行命令:',
        `pwd: ${options?.cwd || process.cwd()}`,
        `cmd: ${cmd}`,
        `options: ${JSON.stringify(options)}`,
      ].join('\n'))
    }
    execCmd(cmd, options, (error, stdout, stderr) => {
      if (options?.log) {
        const info = stringifyError(error)
        if (info.message) info.message = `\x1b[91m${info.message}\x1b[0m`
        logger.info([
          '[exec] 执行结果:',
          `stderr: ${stderr.toString()}`,
          `stdout: ${stdout.toString()}`,
          `error: ${JSON.stringify(info, null, 2)}`,
        ].join('\n'))
      }

      if (options?.booleanResult) {
        return resolve((!!error) as ExecReturn<K>)
      }

      const value = {
        error,
        stdout: stdout.toString().trim(),
        stderr: stderr.toString().trim(),
      } as ExecReturn<K>
      resolve(value)
    })
  })
}
