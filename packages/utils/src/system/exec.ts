import util from 'node:util'
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
 * 状态验证器
 */
export type StatusValidator = 'strict' | 'ignoreStderr' | 'ignoreError' | ((error: ExecException | null, stdout: string, stderr: string) => boolean)

/**
 * 执行 shell 命令参数
 */
export type ExecOptions<T extends boolean> = Parameters<typeof execChild>[1] & {
  /** 是否打印详细日志 默认不打印 */
  verbose?: boolean
  /** 是否只返回布尔值 表示命令是否成功执行 */
  simple?: T
  /** 是否去除输出中的换行符 默认不去除 */
  trim?: boolean
  /**
   * 状态验证器 @default 'strict'
   * - 'strict': !error && !stderr (默认，error 和 stderr 都为空才算成功)
   * - 'ignoreStderr': !error (只检查 error，忽略 stderr)
   * - 'ignoreError': !stderr (只检查 stderr，忽略 error)
   * - 自定义函数: (error, stdout, stderr) => boolean (自定义判断逻辑)
   */
  validator?: StatusValidator
  /** @deprecated 使用 verbose 代替 */
  log?: boolean
  /** @deprecated 使用 simple 代替 */
  booleanResult?: T
}

/**
 * 日志接口
 */
interface Logger {
  info: (msg: string) => void
  warn?: (msg: string) => void
}

/**
 * 记录命令
 */
const logCmd = (log: Logger, cmd: string, cwd: string | URL, opts: any): void => {
  log.info([
    '[exec] 执行命令:',
    `pwd: ${cwd}`,
    `cmd: ${cmd}`,
    `options: ${JSON.stringify(opts)}`,
  ].join('\n'))
}

/**
 * 记录结果
 */
const logRes = (log: Logger, out: string, err: string, error: ExecException | null): void => {
  log.info([
    '[exec] 执行结果:',
    `stderr: ${err}`,
    `stdout: ${out}`,
    `error: ${util.format(error)}`,
  ].join('\n'))
}

/**
 * 标准化选项
 */
const normalize = <T extends boolean> (
  opts: ExecOptions<T> | undefined,
  log: Logger
): ExecOptions<T> | undefined => {
  if (!opts) return opts

  const need = opts.log !== undefined || opts.booleanResult !== undefined
  if (!need) return opts

  const res = { ...opts }

  if (opts.log !== undefined && opts.verbose === undefined) {
    log.warn?.('[exec] 参数 "log" 已废弃，请使用 "verbose" 代替')
    res.verbose = opts.log
  }

  if (opts.booleanResult !== undefined && opts.simple === undefined) {
    log.warn?.('[exec] 参数 "booleanResult" 已废弃，请使用 "simple" 代替')
    res.simple = opts.booleanResult
  }

  return res
}

/**
 * 处理输出
 */
const fmt = (data: Buffer | string, trim?: boolean): string => {
  const str = data.toString()
  return trim ? str.trim() : str
}

/**
 * 根据规则判断状态
 */
const checkStatus = (
  error: ExecException | null,
  stdout: string,
  stderr: string,
  validator: StatusValidator = 'strict'
): boolean => {
  if (typeof validator === 'function') {
    return validator(error, stdout, stderr)
  }

  switch (validator) {
    case 'ignoreStderr':
      return !error
    case 'ignoreError':
      return !stderr
    case 'strict':
    default:
      return !error && !stderr
  }
}

/**
 * 构建结果
 */
const build = <T extends boolean> (
  err: ExecException | null,
  out: string,
  stderr: string,
  simple?: T,
  validator?: StatusValidator
): ExecReturn<T> => {
  const status = checkStatus(err, out, stderr, validator)

  if (simple) return status as ExecReturn<T>

  return {
    status,
    error: err || null,
    stdout: out,
    stderr,
  } as ExecReturn<T>
}

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.verbose 是否打印详细日志 默认不打印
 * @param options.simple 是否只返回布尔值 默认返回完整结果
 * @param options.trim 是否去除输出中的换行符 默认不去除
 * @param options.timeout 命令执行超时时间（毫秒） 0 表示不超时 @default 0
 * @param options.validator 状态验证器 @default 'strict'
 * @example
 * ```ts
 * // 基础用法
 * const { status, error, stdout, stderr } = await exec('ls -al')
 * const status = await exec('ls -al', { simple: true })
 *
 * // 带超时（30秒）
 * await exec('npm install', { timeout: 30000 })
 *
 * // 只检查 error，忽略 stderr（适合有警告输出的命令）
 * const result = await exec('npm install', { validator: 'ignoreStderr' })
 *
 * // 只检查 stderr，忽略 error
 * const result = await exec('command', { validator: 'ignoreError' })
 *
 * // 自定义判断规则
 * const result = await exec('git diff --exit-code', {
 *   validator: (error, stdout, stderr) => {
 *     // git diff 返回 1 表示有差异，这也算正常
 *     return !error || error.code === 1
 *   }
 * })
 * ```
 */
export const exec = <T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> => {
  const log = (global?.logger || console) as Logger
  const opts = normalize(options, log)
  const { verbose, simple, trim, cwd = process.cwd(), validator } = opts || {}

  if (verbose) logCmd(log, cmd, cwd, opts)

  return new Promise((resolve) => {
    execCmd(cmd, options, (error, stdout, stderr) => {
      const out = fmt(stdout, trim)
      const err = fmt(stderr, trim)

      if (verbose) logRes(log, out, err, error)
      resolve(build(error, out, err, simple, validator))
    })
  })
}
