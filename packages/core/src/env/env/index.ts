import fs from 'node:fs'
import * as yaml from 'yaml'
import { execSync } from 'node:child_process'

/** 缓存的pnpm版本号 */
let PNPM_VERSION: string | null = null

/**
 * @description 获取pnpm版本号 获取失败返回空字符串
 */
export const getPnpmVersion = (): string => {
  try {
    if (PNPM_VERSION === null) {
      PNPM_VERSION = execSync('pnpm -v', { stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim()
    }
    return PNPM_VERSION
  } catch {
    PNPM_VERSION = ''
    return ''
  }
}

/**
 * @description 获取pnpm主版本号 获取失败返回0
 */
export const getPnpmMajorVersion = (): number => {
  const major = parseInt(getPnpmVersion().split('.')[0], 10)
  return isNaN(major) ? 0 : major
}

/**
 * @description 当前pnpm版本是否 >= 指定版本
 * @param major - 主版本号
 * @param minor - 次版本号
 */
export const isPnpmAtLeast = (major: number, minor = 0): boolean => {
  const version = getPnpmVersion()
  if (!version) return false
  const [maj, min] = version.split('.')
  const m = parseInt(maj, 10)
  const n = parseInt(min, 10) || 0
  return m > major || (m === major && n >= minor)
}

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
  if (IS_PNPM10 === null) IS_PNPM10 = isPnpmAtLeast(10)
  return IS_PNPM10
}

/**
 * @description 当前环境是否为pnpm工作区
 */
export const isWorkspace = () => {
  const workspace = fs.existsSync(`${process.cwd()}/pnpm-workspace.yaml`)
  if (!workspace) return false
  const data = yaml.parse(fs.readFileSync(`${process.cwd()}/pnpm-workspace.yaml`, 'utf-8'))
  return Array.isArray(data.packages) && data.packages.length > 0
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
    return ['.ts', '.js', '.cts', '.mts', '.mjs', '.cjs']
  }

  return ['.js', '.cjs', '.mjs']
}
