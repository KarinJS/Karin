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
export const setPort = (port: number | string) => setProcessEnv('karin_app_port', port)
/**
 * @description 设置当前版本
 * @param version 版本
 */
export const setVersion = (version: string) => setProcessEnv('karin_app_version', version)
/**
 * @description 设置运行模式
 * @param mode 模式
 */
export const setMode = (mode: 'dev' | 'prod') => setProcessEnv('karin_app_mode', mode)
/**
 * @description 设置运行语言
 * @param lang 语言
 */
export const setLang = (lang: 'js' | 'ts') => setProcessEnv('karin_app_lang', lang)
/**
 * @description 设置运行器
 * @param runner 运行器
 */
export const setRunner = (runner: 'node' | 'tsx' | 'pm2') => setProcessEnv('karin_app_runn', runner)
/**
 * @description 设置监听模式
 * @param watch 是否监听
 */
export const setWatch = (watch: boolean) => setProcessEnv('karin_app_watc', watch ? 'true' : 'false')

/**
 * @description 设置启动次数
 * @param count 次数
 */
export const setStartCount = (count: number) => setProcessEnv('karin_app_star', count)

/**
 * @description 设置默认参数
 */
export const setDefault = () => {
  if (!process.env.karin_app_mode) setMode('prod')
  if (!process.env.karin_app_lang) setLang('js')
  if (!process.env.karin_app_watch) setWatch(false)
  if (!process.env.karin_app_start_count) setStartCount(0)
  process.env.pm_id ? setRunner('pm2') : setRunner('node')
}
