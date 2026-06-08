import { exec as execCmd, execSync as execSyncCmd } from 'node:child_process'

import type {
  ExecException,
  ExecOptionsWithStringEncoding,
  ExecSyncOptionsWithStringEncoding,
} from 'node:child_process'

type ExecResult = { status: boolean; error: ExecException | Error | null; stdout: string; stderr: string }

/**
 * 执行命令
 * @param cmd - 命令
 * @param options - 选项
 */
const execSync = (
  cmd: string,
  options: Partial<ExecSyncOptionsWithStringEncoding> = {}
): ExecResult => {
  try {
    const result = execSyncCmd(cmd, { encoding: 'utf8', ...options })
    return { status: true, error: null, stdout: result, stderr: '' }
  } catch (error) {
    return { status: false, error: error as Error, stdout: '', stderr: '' }
  }
}

/**
 * 执行命令
 * @param cmd - 命令
 * @param options - 选项
 */
const exec = (
  cmd: string,
  options: ExecOptionsWithStringEncoding = {}
): Promise<ExecResult> => {
  return new Promise(resolve => {
    execCmd(cmd, options, (error, stdout, stderr) => {
      const status = !error
      resolve({ status, error, stdout, stderr })
    })
  })
}

export { execSync, exec }
