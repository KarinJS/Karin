import { execSync } from 'node:child_process'

/**
 * 执行命令
 * @param cmd - 命令
 * @param options - 选项
 */
const exec = (
  cmd: string,
  options: import('node:child_process').ExecOptions = {}
): { status: boolean; error: Error | null; stdout: string; stderr: string } => {
  try {
    const result = execSync(cmd, options)
    return { status: true, error: null, stdout: result.toString(), stderr: '' }
  } catch (error) {
    return { status: false, error: error as Error, stdout: '', stderr: '' }
  }
}

export { exec as execSync }
