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
 * @description 是否为Js
 */
export const isJs = () => !isTsx()
/**
 * @description 是否为Ts
 */
export const isTs = () => isTsx()
/**
 * @description 是否为生产环境
 */
export const isProd = () => !isDev()

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
