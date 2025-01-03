export const isWin = () => process.platform === 'win32'
export const isMac = () => process.platform === 'darwin'
export const isLinux = () => process.platform === 'linux'
export const isDev = () => typeof process.env.karin_dev === 'string'
export const isWatch = () => typeof process.env.karin_watch === 'string'
export const isJs = () => process.env.karin_lang === 'js'
export const isTs = () => process.env.karin_lang === 'ts'
export const isNode = () => process.env.runtime === 'node'
export const isTsx = () => process.env.runtime === 'tsx'
export const isPm2 = () => process.env.runtime === 'pm2'
export const isProd = () => !isDev()

/**
 * @description 设置环境变量
 * @param key 键
 * @param value 值
 */
const setProcessEnv = (key: string, value: string | number) => {
  process.env[key] = value + ''
}

/**
 * @description 设置运行端口
 * @param port 端口
 */
export const setPort = (port: number | string) => setProcessEnv('karin_port', port)
/**
 * @description 设置当前版本
 * @param version 版本
 */
export const setVersion = (version: string) => setProcessEnv('karin_version', version)
/**
 * @description 设置运行语言
 * @param lang 语言
*/
export const setLang = (lang: 'js' | 'ts') => setProcessEnv('karin_lang', lang)
/**
 * @description 设置运行器
 * @param runner 运行器
*/
export const setRunner = (runner: 'node' | 'tsx' | 'pm2') => setProcessEnv('runtime', runner)
/**
 * @description 设置运行模式
 * @param mode 模式
 */
export const setMode = (mode?: string) => mode && setProcessEnv('karin_dev', mode)
/**
 * @description 设置监听模式
 * @param watch 是否监听
 */
export const setWatch = (watch?: boolean) => watch && setProcessEnv('karin_watch', 'true')

/**
 * @description 设置默认参数
 */
export const setDefault = () => {
  if (!process.env.karin_app_mode) setMode()
  if (!process.env.karin_app_lang) setLang('js')
  if (!process.env.karin_app_watch) setWatch(false)
  process.env.pm_id ? setRunner('pm2') : setRunner('node')
}
