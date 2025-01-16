import { exec as execCmd, execSync as execSyncCmd } from 'node:child_process'

/**
 * 执行命令
 * @param cmd - 命令
 * @param options - 选项
 */
const execSync = (
  cmd: string,
  options: import('node:child_process').ExecOptions = {},
): { status: boolean; error: Error | null; stdout: string; stderr: string } => {
  try {
    const result = execSyncCmd(cmd, options)
    return { status: true, error: null, stdout: result.toString(), stderr: '' }
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
  options: import('node:child_process').ExecOptions = {},
): Promise<{ status: boolean; error: Error | null; stdout: string; stderr: string }> => {
  return new Promise(resolve => {
    execCmd(cmd, options, (error, stdout, stderr) => {
      const status = !error
      resolve({ status, error, stdout, stderr })
    })
  })
}

export { execSync, exec }
