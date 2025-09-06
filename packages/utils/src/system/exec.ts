import { stringifyError } from './error'
import { exec as execCmd } from 'child_process'
import type { exec as execChild, ExecException } from 'child_process'

/**
 * 执行 shell 命令返回类型
 */
export interface ExecType {
  status: boolean
  error: ExecException | null
  stderr: string
  stdout: string
}

/**
 * 执行 shell 命令返回类型泛型
 */
export type ExecReturn<K extends boolean> = K extends true ? boolean : ExecType

/**
 * 执行 shell 命令参数
 */
export type ExecOptions<T extends boolean> = Parameters<typeof execChild>[1] & {
  /** 是否打印日志 默认不打印 */
  log?: boolean
  /** 是否只返回布尔值 表示命令是否成功执行 优先级比抛错误高 */
  booleanResult?: T
  /** 是否去除日志中的换行符 默认不去除 */
  trim?: boolean
}

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 * @example
 * ```ts
 * const { status, error, stdout, stderr } = await exec('ls -al')
 * // -> { status: true, error: null, stdout: '...', stderr: '...' }
 *
 * const status = await exec('ls -al', { booleanResult: true })
 * // -> true
 *
 * const { status, error, stdout, stderr } = await exec('ls -al', { log: true })
 * // -> 打印执行命令和结果
 * ```
 */
export const exec = <T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> => {
  // @ts-ignore
  const logger = global?.logger || console
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
        return resolve((!error) as ExecReturn<T>)
      }

      stdout = stdout.toString()
      stderr = stderr.toString()

      if (options?.trim) {
        stdout = stdout.trim()
        stderr = stderr.trim()
      }

      const value = {
        status: !error,
        error,
        stdout,
        stderr,
      } as ExecReturn<T>
      resolve(value)
    })
  })
}
