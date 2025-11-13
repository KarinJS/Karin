/**
 * @description 是否为Windows
 */
export const isWin = () => process.platform === 'win32'

/**
 * @description 是否为Windows
 */
export const isWindows = () => process.platform === 'win32'

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
