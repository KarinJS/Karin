import fs from 'node:fs'
import { execSync } from 'node:child_process'

/** 是否为pnpm10 */
let IS_PNPM10: boolean | null = null
/** 是否传递了 --expose-internals */
const isInternals = process.execArgv.includes('--expose-internals')

/**
 * @description 设置环境变量
 * @param key 键
 * @param value 值
 */
const setProcessEnv = (key: string, value: string | number) => {
  process.env[key] = value + ''
  return value
}

/**
 * @description 设置当前版本
 * @param version 版本
 */
export const setVersion = (version: string) => setProcessEnv('KARIN_VERSION', version)

/**
 * @description 设置监察者模式
 */
export const setWatch = (watch?: string) => watch && setProcessEnv('TSX_WATCH', watch)

/**
 * @description 设置运行器
 * @param runtime 运行器
 */
export const setRuntime = (runtime: 'node' | 'pm2' | 'tsx') => setProcessEnv('RUNTIME', runtime)

/**
 * @description 是否>= pnpm10
 */
export const isPnpm10 = () => {
  try {
    if (IS_PNPM10 === null) {
      const version = execSync('pnpm -v').toString().trim()
      const majorVersion = parseInt(version.split('.')[0], 10)
      IS_PNPM10 = !isNaN(majorVersion) && majorVersion >= 10
    }

    return IS_PNPM10
  } catch {
    IS_PNPM10 = false
    return false
  }
}

/**
 * @description 当前环境是否为pnpm工作区
 */
export const isWorkspace = () => {
  const workspace = fs.existsSync(`${process.cwd()}/pnpm-workspace.yaml`)
  return !!workspace
}

/**
 * @description 获取当前环境可加载的模块后缀类型
 */
export const getModuleType = () => {
  if (process.env.RUNTIME === 'tsx') {
    return ['.ts', '.js', '.mts', '.mjs']
  }

  return ['.js', '.mjs']
}

/**
 * @description 是否可以使用 Node.js 内部模块
 */
export const canUseNodeInternals = () => isInternals && process.release.name === 'node'

/**
 * 当前运行方式
 */
export const getRuntime = (() => {
  if (process.env.pm_id) return 'pm2'
  if (process.versions?.bun) return 'bun'
  const isTsx = process.execArgv.some(arg => /[/\\]tsx[/\\]/.test(arg))
  if (isTsx) return 'tsx'
  if (process.versions?.node) return 'node'
  throw new Error('runtime not identified')
})()
