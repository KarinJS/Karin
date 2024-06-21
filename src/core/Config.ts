import Yaml from 'yaml'
import fs from 'fs'
import chokidar from 'chokidar'
import logger from './logger.js'
import { Redis, App, Config, Server, Package, GroupCfg } from '../types/Config.js'

/** 配置文件 */
class Cfg {
  dir: string
  _path: string
  _pathDef: string
  change: Map<string, any>
  watcher: Map<string, any>
  review: boolean
  constructor() {
    this.dir = process.cwd()
    this._path = this.dir + '/config/config'
    this._pathDef = this.dir + '/config/defSet'

    /** 缓存 */
    this.change = new Map()
    /** 监听文件 */
    this.watcher = new Map()
    /** 拦截器状态 */
    this.review = false
    this.initCfg()
  }

  /** 初始化配置 */
  initCfg() {
    if (!fs.existsSync(this._path)) fs.mkdirSync(this._path)
    const files = fs.readdirSync(this._pathDef).filter(file => file.endsWith('.yaml'))
    for (const file of files) {
      const path = `${this._path}/${file}`
      const pathDef = `${this._pathDef}/${file}`
      if (!fs.existsSync(path)) fs.copyFileSync(pathDef, path)
    }

    // 创建插件文件夹文件夹
    const plugins = this.getPlugins()
    this.dirPath('data', plugins)
    this.dirPath('temp', plugins)
    this.dirPath('resources', plugins)
    this.dirPath('temp/html', plugins)
  }

  getPlugins() {
    const files = fs.readdirSync('./plugins', { withFileTypes: true })
    // 过滤掉非karin-plugin-开头或karin-adapter-开头的文件夹
    return files.filter(file => file.isDirectory() && (file.name.startsWith('karin-plugin-') || file.name.startsWith('karin-adapter-'))).map(dir => dir.name)
  }

  /**
   * 为每一个插件建立对应的文件夹
   */
  async dirPath(name: string, plugins: string[]) {
    name = `./${name}`
    if (!fs.existsSync(name)) fs.mkdirSync(name)
    for (const plugin of plugins) {
      const path = `${name}/${plugin}`
      if (!fs.existsSync(path)) fs.mkdirSync(path)
    }
  }

  /**
   * 超时时间
   */
  timeout(type: 'ws' | 'grpc' = 'ws'): number {
    let timeout = 60
    if (type === 'ws') {
      timeout = this.Server.websocket.timeout
    } else {
      timeout = this.Server.grpc.timeout
    }
    return timeout || 60
  }

  /**
   * Redis 配置
   * 采用实时读取优化性能
   */
  get redis(): Redis {
    const config = this.getYaml('config', 'redis', false)
    const defSet = this.getYaml('defSet', 'redis', false)
    const data = { ...defSet, ...config }
    return data
  }

  /**
   * 主人列表
   * @returns {string[]}
   */
  get master() {
    return this.Config.master || []
  }

  /**
   * 管理员列表
   */
  get admin(): string[] {
    return this.Config.admin || []
  }

  /** App管理 */
  get App(): App {
    const key = 'change.App'
    const res = this.change.get(key)
    /** 取缓存 */
    if (res) return res

    /** 取配置 */
    const config = this.getYaml('config', 'App', true)
    const defSet = this.getYaml('defSet', 'App', true)
    const data = { ...defSet, ...config }
    /** 缓存 */
    this.change.set(key, data)
    return data
  }

  /**
   * 基本配置
   */
  get Config(): Config {
    const key = 'change.config'
    const res = this.change.get(key)
    /** 取缓存 */
    if (res) return res

    /** 取配置 */
    const config = this.getYaml('config', 'config', true)
    const defSet = this.getYaml('defSet', 'config', false)
    const data = { ...defSet, ...config }
    /** 缓存 */
    this.change.set(key, data)
    return data
  }

  /**
   * Server 配置文档
   */
  get Server(): Server {
    const key = 'change.server'
    /** 取缓存 */
    const res = this.change.get(key)
    if (res) return res

    /** 取配置 */
    const config = this.getYaml('config', 'server', true)
    const defSet = this.getYaml('defSet', 'server', false)
    const data = { ...defSet, ...config }
    /** 缓存 */
    this.change.set(key, data)
    return data
  }

  /**
   * package.json
   * 实时获取package.json文件
   */
  get package(): Package {
    const data = fs.readFileSync('package.json', 'utf8')
    const pack = JSON.parse(data) as Package
    return pack
  }

  /**
   * 获取群配置
   */
  group(group_id: string = ''): GroupCfg {
    const key = 'change.group'
    /** 取缓存 */
    let res = this.change.get(key)
    if (res) {
      res = { ...res.defCfg.default, ...res.Config.default, ...(res.Config[group_id] || {}) }
      return res
    }

    /** 取配置 */
    const Config = this.getYaml('config', 'group')
    const defCfg = this.getYaml('defSet', 'group')
    const data = { Config, defCfg }
    /** 缓存 */
    res = this.change.set(key, data)
    res = { ...defCfg.default, ...Config.default, ...(Config[group_id] || {}) }
    return res
  }

  /**
   * 获取配置yaml
   */
  getYaml(type: 'defSet' | 'config', name: string, isWatch = false) {
    /** 文件路径 */
    const file = `./config/${type}/${name}.yaml`

    /** 读取文件 */
    const data = Yaml.parse(fs.readFileSync(file, 'utf8'))

    /** 监听文件 */
    if (isWatch) this.watch(type, name, file)
    return data
  }

  /**
   * 监听配置文件
   * @param {'defSet'|'config'} type 类型
   * @param {string} name 文件名称 不带后缀
   * @param {string} file 文件路径
   */
  async watch(type: 'defSet' | 'config', name: string, file: string) {
    const key = `change.${name}`
    /** 已经监听过了 */
    const res = this.change.get(key)
    if (res) return true
    /** 监听文件 */
    const watcher = chokidar.watch(file)
    /** 监听文件变化 */
    watcher.on('change', () => {
      this.change.delete(key)
      logger.mark(`[修改配置文件][${type}][${name}]`)
      /** 文件修改后调用对应的方法 */
      switch (`change_${name}`) {
        case 'change_App':
          this.change_App()
          break
        case 'change_config':
          this.change_config()
          break
        case 'change_group':
          this.change_group()
          break
      }
    })

    /** 缓存 防止重复监听 */
    this.watcher.set(key, watcher)
  }

  async change_App() {
    await this.#review()
  }

  async change_config() {
    /** 修改日志等级 */
    logger.level = this.Config.log_level
    await this.#review()
    // if (this.Server.HotUpdate) {
    //   const { Bot } = await import('../index')
    //   Bot.emit('restart_http', {})
    //   Bot.emit('restart_grpc', {})
    // }
  }

  async change_group() {
    await this.#review()
  }

  async #review() {
    // if (this.review) return
    // this.review = true
    // const review = await import('../event/review.js')
    // review.default.main()
    // this.review = false
  }
}

export default new Cfg()
