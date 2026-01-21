import fs from 'node:fs'
import path from 'node:path'
import type { } from '@karinjs/envs'

/**
 * 格式化路径 统一使用斜杠 `/`
 * @param p 路径字符串
 */
const formatPath = (p: string): string => p.replaceAll('\\', '/')
/**
 * 格式化路径并确保目录存在
 * @param p 路径字符串
 */
const formatPathEnsureDir = (p: string): string => {
  const formattedPath = formatPath(p)
  fs.mkdirSync(formattedPath, { recursive: true })
  return formattedPath
}

/**
 * 拼接路径片段
 * @param baseDir 基础目录
 * @param env 环境变量值
 * @param name 默认名称
 */
const joinPath = (baseDir: string, env: string | undefined, name: string): string => {
  if (!env || env?.includes('/') || env?.includes('\\')) {
    return formatPath(`${baseDir}/${name}`)
  }

  return formatPath(path.join(baseDir, env))
}

const baseDir = (() => {
  const dir = process.env.BASE_DIR || '.karin'
  return formatPath(path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir))
})()

const platform = process.env.STORE_PLATFORM || process.platform
const tempDir = joinPath(baseDir, process.env.TEMP_DIR_NAME, 'temp')
const dbDir = `${baseDir}/data/db`

/**
   * 全局路径存储对象
   * @since 2.0
   */
export const store = Object.freeze({
  /**
   * 所有数据文件的基础目录
   * @example `/root/karin/.karin`
   * @description 1.0版本为 `@karinjs`，2.0版本变更为 `.karin` 以符合常见应用数据目录习惯
   */
  baseDir,
  /**
   * karin内部相关配置
   * @example `/root/karin/.karin/core`
   */
  core: {
    /**
     * @example `/root/karin/.karin/core`
     */
    dir: baseDir,
    /**
     * 内部配置文件存储目录
     * @example `/root/karin/.karin/core/config`
     */
    config: `${baseDir}/config`,
    /**
     * 内部数据目录
     * @example `/root/karin/.karin/core/data`
     */
    data: `${baseDir}/data`,
    /**
     * 数据库根目录
     * @example `/root/karin/.karin/core/data/db`
     */
    db: dbDir,
    /**
     * Redis SQLite 数据库目录
     * @example `/root/karin/.karin/core/data/db/redis-sqlite`
     */
    'redis-sqlite': `${dbDir}/redis-sqlite`,
    /**
     * 键值存储目录
     * @example `/root/karin/.karin/core/data/db/kv`
     */
    kv: `${dbDir}/kv`,
    /**
     * 定时任务数据目录
     * @example `/root/karin/.karin/core/data/db/task`
     */
    task: `${dbDir}/task`,
    /**
     * 日志文件目录
     * @example `/root/karin/.karin/logs`
     */
    logs: `${baseDir}/logs`,
    /**
     * 资源文件目录
     * @example `/root/karin/.karin/core/resource`
     */
    resource: `${baseDir}/resource`,
    /**
     * 临时文件根目录
     * @example `/root/karin/.karin/temp`
     */
    temp: tempDir,
    /**
     * HTML 临时文件目录
     * @example `/root/karin/.karin/temp/html`
     */
    html: `${tempDir}/html`,
    /**
     * 控制台临时文件目录
     * @example `/root/karin/.karin/temp/console`
     */
    console: `${tempDir}/console`,
    /**
     * 沙盒数据目录
     * @example `/root/karin/.karin/core/data/sandbox`
     */
    sandbox: `${baseDir}/data/sandbox`,
    /**
     * 沙盒临时数据目录
     * @example `/root/karin/.karin/temp/sandbox`
     */
    sandboxTemp: `${tempDir}/sandbox`,
  },
  /**
   * karin、插件包等相关路径信息
   */
  pkg: {
    /**
     * karin 项目根目录
     * @description 生产环境指向 node_modules/karin，开发环境指向 packages/core
     * @example `/root/karin/node_modules/karin` 或 `/root/karin/packages/core`
     */
    root: (() => {
      const forcePackaged = process.env.STORE_PKG_PACKAGED === '1'
      const file = import.meta.url.replace('file:///', '')
      if (forcePackaged || file.includes('node_modules')) {
        return formatPath(path.join(process.cwd(), 'node_modules', 'karin'))
      }
      return formatPath(path.join(file.split('packages')[0], 'packages', 'core'))
    })(),
    /**
     * karin 主入口文件路径
     * @example `/root/karin/node_modules/karin/dist/index.js`
     */
    get main () {
      return formatPath(path.join(this.root, 'dist', 'index.js'))
    },
    /**
     * 是否处于 node_modules 中（生产环境）
     * @example true
     */
    get isPackaged () {
      return this.root.includes('node_modules')
    },
    /**
     * 插件根目录
     * @example `/root/karin/plugins`
     */
    plugins: formatPath(path.join(process.cwd(), 'plugins')),
    /**
     * PM2 配置文件路径
     * @example `/root/karin/.karin/core/config/pm2.json`
     */
    get pm2 () {
      return formatPath(path.join(store.core.config, 'pm2.json'))
    },
    /**
     * karin package.json 文件路径
     * @example `/root/karin/node_modules/karin/package.json`
     */
    get karin () {
      return formatPath(path.join(this.root, 'package.json'))
    },
    /**
     * webui 静态文件目录
     * @example `/root/karin/node_modules/karin/dist/webui`
     */
    get webui () {
      return formatPath(path.join(this.root, 'dist', 'webui'))
    },
  },
  plugin: {
    /**
     * 获取插件数据根目录
     * @param name 插件名称
     * @example
     * ```ts
     * const pluginDataDir = store.plugin.getBaseDir('karin-plugin-example')
     * console.log(pluginDataDir)
     * // /root/karin/.karin/karin-plugin-example
     * ```
     */
    getBaseDir: (name: string) => {
      if (!name) throw new Error('请提供正确的插件名称')
      return formatPathEnsureDir(path.join(baseDir, name))
    },
    /**
     * 获取插件配置目录
     * @param name 插件名称
     * @description 会自动创建目录 无需手动管理
     * @example
     * ```ts
     * const pluginConfigDir = store.plugin.getConfigDir('karin-plugin-example')
     * console.log(pluginConfigDir)
     * // /root/karin/.karin/karin-plugin-example/config
     * ```
     */
    getConfigDir: (name: string) => {
      const dir = store.plugin.getBaseDir(name)
      return formatPathEnsureDir(path.join(dir, 'config'))
    },
    /**
     * 获取插件数据目录
     * @param name 插件名称
     * @description 会自动创建目录 无需手动管理
     * @example
     * ```ts
     * const pluginDataDir = store.plugin.getDataDir('karin-plugin-example')
     * console.log(pluginDataDir)
     * // /root/karin/.karin/karin-plugin-example/data
     * ```
     */
    getDataDir: (name: string) => {
      const dir = store.plugin.getBaseDir(name)
      return formatPathEnsureDir(path.join(dir, 'data'))
    },
    /**
     * 获取插件专属临时文件目录
     * @param name 插件名称
     * @description 会自动创建目录 无需手动管理
     * @example
     * ```ts
     * const pluginTempDir = store.plugin.getTempDir('karin-plugin-example')
     * console.log(pluginTempDir)
     * // /root/karin/.karin/karin-plugin-example/temp
     * ```
     */
    getTempDir: (name: string) => {
      return formatPathEnsureDir(path.join(tempDir, name, 'temp'))
    },
    /**
     * 创建并返回插件自定义数据目录
     * @param name 插件名称
     * @param subDir 子目录名称或路径
     * @description 会自动创建目录 无需手动管理
     * @example
     * ```ts
     * const pluginCustomDir = store.plugin.getCustomDir('karin-plugin-example', 'my-data')
     * // -> /root/karin/.karin/karin-plugin-example/my-data
     *
     * const pluginCustomDir = store.plugin.getCustomDir('karin-plugin-example', 'my-data/sub-dir')
     * // -> /root/karin/.karin/karin-plugin-example/my-data/sub-dir
     * ```
     */
    getCustomDir: (name: string, subDir: string) => {
      const dir = store.plugin.getBaseDir(name)
      return formatPathEnsureDir(path.join(dir, subDir))
    },
    // TODO: 在core包这边实现读取、写入等操作
  },
  /**
   * 命名管道路径管理
   */
  pipe: {
    /**
     * 获取管道路径
     * @param name 管道名称，默认为 'karin'
     * @returns 管道路径
     * @example
     * ```ts
     * const pipePath = store.pipe.getPath('my-app')
     * // Windows: \\\\.\\pipe\\my-app
     * // Unix: /root/karin/.karin/core/data/pipes/my-app.sock
     * ```
     */
    getPath: (name = 'karin') => {
      if (platform === 'win32') {
        return `\\\\.\\pipe\\${name}`
      }
      const pipeDir = `${baseDir}/data/pipes`
      fs.mkdirSync(pipeDir, { recursive: true })
      return formatPath(path.join(pipeDir, `${name}.sock`))
    },
    /**
     * 获取管道目录（仅 Unix 系统）
     * @returns 管道目录路径
     * @example `/root/karin/.karin/core/data/pipes`
     */
    getDir: () => {
      return formatPathEnsureDir(path.join(store.core.data, 'pipes'))
    },
    /**
     * 清理管道文件（仅 Unix 系统）
     * @param name 管道名称，默认为 'karin'
     * @returns 是否成功清理
     * @example
     * ```ts
     * store.pipe.clean('my-app')
     * // 删除 /root/karin/.karin/core/data/pipes/my-app.sock
     * ```
     */
    clean: (name = 'karin') => {
      if (platform === 'win32') return true

      const pipePath = store.pipe.getPath(name)
      if (!fs.existsSync(pipePath)) return false

      try {
        fs.unlinkSync(pipePath)
      } catch { }
      return !fs.existsSync(pipePath)
    },
    /**
     * 检查管道文件是否存在（仅 Unix 系统）
     * @param name 管道名称，默认为 'karin'
     * @returns 是否存在
     */
    exists: (name = 'karin') => {
      if (platform === 'win32') return false
      const pipePath = store.pipe.getPath(name)
      return fs.existsSync(pipePath)
    },
    /**
     * 获取所有管道文件列表（仅 Unix 系统）
     * @returns 管道文件名数组
     * @example
     * ```ts
     * const pipes = store.pipe.list()
     * // ['karin.sock', 'my-app.sock']
     * ```
     */
    list: () => {
      if (platform === 'win32') return []

      const pipeDir = store.pipe.getDir()
      if (!pipeDir || !fs.existsSync(pipeDir)) return []

      try {
        return fs.readdirSync(pipeDir).filter(file => file.endsWith('.sock'))
      } catch {
        return []
      }
    },
    /**
     * 清理所有管道文件（仅 Unix 系统）
     * @returns 成功清理的数量
     */
    cleanAll: () => {
      const pipes = store.pipe.list()
      let count = 0

      for (const pipe of pipes) {
        const name = pipe.replace('.sock', '')
        if (store.pipe.clean(name)) count++
      }

      return count
    },
  },
} as const)
