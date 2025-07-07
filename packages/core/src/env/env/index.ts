import fs from 'node:fs'
import yaml from 'yaml'
import { execSync } from 'node:child_process'

let IS_PNPM10: boolean | null = null

/**
 * @description 是否为Windows
 */
export const isWin = () => process.platform === 'win32'
/**
 * @description 是否为Mac
 */
export const isMac = () => process.platform === 'darwin'
/**
 * @description 是否为Linux
 */
export const isLinux = () => process.platform === 'linux'
/**
 * @description 是否为开发环境
 */
export const isDev = () => process.env.NODE_ENV === 'development'
/**
 * @description 是否为监察者模式
 */
export const isWatch = () => typeof process.env.TSX_WATCH === 'string'
/**
 * @description 是否为Node直接运行
 */
export const isNode = () => process.env.RUNTIME === 'node'
/**
 * @description 是否为Tsx运行环境
 */
export const isTsx = () => process.env.RUNTIME === 'tsx'
/**
 * @description 是否为Pm2运行环境
 */
export const isPm2 = () => process.env.RUNTIME === 'pm2'
/**
 * @description 是否只允许运行js
 */
export const isJs = () => !isTsx()
/**
 * @description 是否允许直接运行Ts
 */
export const isTs = () => isTsx()
/**
 * @description 是否为生产环境
 */
export const isProd = () => !isDev()

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
 * @description 获取当前环境可加载的模块后缀类型
 */
export const getModuleType = () => {
  if (isTs()) {
    return ['.ts', '.js', '.mts', '.mjs']
  }

  return ['.js', '.mjs']
}
