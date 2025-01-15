import type { exec, ExecException } from 'child_process'

export { ExecException }

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
export type ExecOptions<T extends boolean> = Parameters<typeof exec>[1] & {
  /** 是否打印日志 默认不打印 */
  log?: boolean
  /** 是否只返回布尔值 表示命令是否成功执行 优先级比抛错误高 */
  booleanResult?: T
}
