import fs from 'node:fs'
import path from 'node:path'

// ────────────────────── 工具函数 ──────────────────────

/** 格式化路径，统一使用 `/` */
const fmt = (p: string): string => p.replaceAll('\\', '/')

// ────────────────────── 插件名校验 ──────────────────────

const PLUGIN_NAME_RE = /^[\w@][\w@.\-/]*$/

const validatePluginName = (name: string): void => {
  if (!name) throw new Error('插件名称不能为空')
  if (name.includes('..')) throw new Error(`插件名称不能包含 "..": "${name}"`)
  if (!PLUGIN_NAME_RE.test(name)) {
    throw new Error(`无效的插件名称 "${name}"，仅允许字母、数字、@、-、_、.、/`)
  }
}

// ────────────────────── 插件路径 ──────────────────────

/**
 * 插件标准目录结构
 */
export interface PluginPaths {
  /** 插件数据根目录 `.karin/<plugin>` */
  readonly base: string
  /** 插件配置目录 `.karin/<plugin>/config` */
  readonly config: string
  /** 插件数据目录 `.karin/<plugin>/data` */
  readonly data: string
  /** 插件临时目录 `.karin/temp/<plugin>/temp` */
  readonly temp: string
  /** 获取插件自定义子目录 */
  custom (subDir: string): string
}

// ────────────────────── pkg.root 检测 ──────────────────────

const detectPkgRoot = (): string => {
  if (process.env.STORE_PKG_PACKAGED === '1') {
    return fmt(path.join(process.cwd(), 'node_modules', 'karin'))
  }
  const file = fmt(import.meta.url.replace('file:///', ''))
  if (file.includes('node_modules')) {
    return fmt(path.join(process.cwd(), 'node_modules', 'karin'))
  }
  // 开发模式：匹配 /packages*/ 目录段，兼容 packages、packages-core、packages-v2 等
  const match = file.match(/^(.+?)\/packages(?:-[\w]+)?\//)
  if (match) {
    return `${match[1]}/packages/core`
  }
  return fmt(path.join(process.cwd(), 'packages', 'core'))
}

// ────────────────────── 标准目录 ──────────────────────

/** karin 标准目录路径集合 */
class Dirs {
  /** 配置目录 `.karin/config` */
  readonly config: string
  /** 数据目录 `.karin/data` */
  readonly data: string
  /** 日志目录 `.karin/logs` */
  readonly logs: string
  /** 资源目录 `.karin/resource` */
  readonly resource: string
  /** 临时根目录 `.karin/temp` */
  readonly temp: string
  /** 管道目录 `.karin/data/pipes` */
  readonly pipes: string

  constructor (base: string) {
    const data = `${base}/data`

    this.config = `${base}/config`
    this.data = data
    this.logs = `${base}/logs`
    this.resource = `${base}/resource`
    this.temp = `${base}/temp`
    this.pipes = `${data}/pipes`
  }
}

// ────────────────────── 包信息 ──────────────────────

/** karin 包路径信息 */
class Pkg {
  /** karin 项目根目录 */
  readonly root: string
  /** 插件根目录 */
  readonly plugins: string
  /** 配置目录 */
  private readonly _configDir: string

  constructor (configDir: string) {
    this.root = detectPkgRoot()
    this.plugins = fmt(path.join(process.cwd(), 'plugins'))
    this._configDir = configDir
  }

  /** 主入口文件 */
  get main (): string {
    return `${this.root}/dist/index.js`
  }
  /** 是否处于 node_modules（生产环境） */
  get isPackaged (): boolean {
    return this.root.includes('node_modules')
  }
  /** karin package.json 路径 */
  get karin (): string {
    return `${this.root}/package.json`
  }
  /** webui 静态资源目录 */
  get webui (): string {
    return `${this.root}/dist/webui`
  }
  /** PM2 配置路径 */
  get pm2 (): string {
    return `${this._configDir}/pm2.json`
  }
}

// ────────────────────── Store ──────────────────────

/**
 * 全局路径管理
 *
 * 设计原则：
 * - **零副作用**：import 不会创建任何目录，所有路径都是纯字符串计算
 * - **显式创建**：需要目录时调用 `store.ensure()`
 * - **职责单一**：只提供路径，不做 fs 读写操作
 *
 * @example
 * ```ts
 * import { store } from '@karinjs/core-store'
 *
 * // 启动时确保目录存在
 * store.ensure([store.dir.config, store.dir.logs, store.dir])
 * store.ensure(store.dir.config)
 *
 * // 获取插件目录
 * const p = store.plugin('karin-plugin-example')
 * store.ensure([
 *   p.config,
 *   p.data
 * ])
 *
 * // 从 baseDir 拼接自定义路径
 * store.resolve('custom', 'sub')  // .karin/custom/sub
 * ```
 */
export class Store {
  /** 数据根目录 `.karin` */
  readonly baseDir: string
  /** 标准目录路径集合 */
  readonly dir: Dirs
  /** 包路径信息 */
  readonly pkg: Pkg
  /** 运行平台 */
  private readonly platform: string

  constructor () {
    const dir = '.karin'
    this.baseDir = fmt(path.resolve(process.cwd(), dir))
    this.dir = new Dirs(this.baseDir)
    this.pkg = new Pkg(this.dir.config)
    this.platform = process.env.STORE_PLATFORM || process.platform
  }

  /**
   * 获取插件标准目录路径对象
   *
   * @param name 插件名称（支持 scoped package，如 `@org/plugin`）
   * @returns 冻结的路径对象，包含 base / config / data / temp / custom()
   *
   * @example
   * ```ts
   * const p = store.plugin('karin-plugin-example')
   * p.base   // .karin/karin-plugin-example
   * p.config // .karin/karin-plugin-example/config
   * p.data   // .karin/karin-plugin-example/data
   * p.temp   // .karin/temp/karin-plugin-example/temp
   * p.custom('cache') // .karin/karin-plugin-example/cache
   * ```
   */
  plugin (name: string): PluginPaths {
    validatePluginName(name)
    const base = fmt(path.join(this.baseDir, name))
    return Object.freeze({
      base,
      config: `${base}/config`,
      data: `${base}/data`,
      temp: fmt(path.join(this.dir.temp, name, 'temp')),
      custom: (subDir: string) => fmt(path.join(base, subDir)),
    })
  }

  /**
   * 获取命名管道路径
   *
   * @param name 管道名称，默认 `karin`
   * @returns Windows: `\\.\pipe\<name>`，Unix: `.karin/data/pipes/<name>.sock`
   */
  pipe (name = 'karin'): string {
    if (this.platform === 'win32') return `\\\\.\\pipe\\${name}`
    return `${this.dir.pipes}/${name}.sock`
  }

  /**
   * 从 baseDir 拼接子路径
   *
   * @example
   * ```ts
   * store.resolve('custom', 'dir') // .karin/custom/dir
   * ```
   */
  resolve (...segments: string[]): string {
    return fmt(path.join(this.baseDir, ...segments))
  }

  /**
   * 确保给定的目录存在，不存在则递归创建
   *
   * @example
   * ```ts
   * store.ensure(store.dir.config)
   * store.ensure([
   *   store.dir.logs,
   *   store.dir.db
   * ])
   * ```
   */
  ensure (dirs: string | string[]): void {
    if (!Array.isArray(dirs)) {
      dirs = [dirs]
    }

    for (const dir of dirs) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  /** 格式化路径为 `/` 分隔 */
  fmt (p: string): string {
    return fmt(p)
  }
}

/**
 * 全局单例
 */
export const store = new Store()
