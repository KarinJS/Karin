import { exec as execCmd, execSync as execSyncCmd } from 'node:child_process'

const shell = process.platform === 'win32' ? 'cmd' : '/bin/sh'

/**
 * 执行命令
 * @param cmd - 命令
 * @param options - 选项
 */
export const execSync = (
  cmd: string,
  options: import('node:child_process').ExecSyncOptions = {}
): { status: boolean; error: Error | null; stdout: string; stderr: string } => {
  try {
    const result = execSyncCmd(cmd, { ...options, shell })
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
export const exec = (
  cmd: string,
  options: import('node:child_process').ExecOptions = {}
): Promise<{ status: boolean; error: Error | null; stdout: string; stderr: string }> => {
  return new Promise(resolve => {
    execCmd(cmd, { ...options, shell }, (error, stdout, stderr) => {
      const status = !error
      if (typeof stdout !== 'string') {
        stdout = String(stdout)
      }
      resolve({ status, error, stdout, stderr })
    })
  })
}

/**
 * 安装依赖
 * @param cwd - 工作目录
 * @param packageManager - 包管理器
 */
export const installDependencies = async (cwd: string, packageManager = 'pnpm') => {
  const commands = {
    pnpm: 'pnpm install',
    npm: 'npm install',
    yarn: 'yarn install',
  } as const

  const installCommand = commands[packageManager as keyof typeof commands] || commands.pnpm

  execSync(installCommand, {
    cwd,
    stdio: 'inherit',
    shell,
  })
}

/**
 * 初始化Karin项目
 * @param targetDir - 目标目录
 */
export const initKarinProject = async (targetDir: string) => {
  console.log('targetDir: ', targetDir)
  execSync('pnpm install node-karin@latest && npx karin init ', {
    cwd: targetDir,
    stdio: 'inherit',
  })
}

/**
 * 配置Puppeteer环境
 * @param puppeteerDir - Puppeteer目录
 */
export const setupPuppeteer = async (puppeteerDir: string) => {
  execSync('pnpm init && pnpm install @karinjs/puppeteer', { cwd: puppeteerDir, stdio: 'inherit' })
  execSync('npx init', { cwd: puppeteerDir, stdio: 'inherit' })
}
