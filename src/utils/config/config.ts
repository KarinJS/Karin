import fs from 'fs'
import Yaml from 'yaml'
import path from 'path'
import { Logger } from 'log4js'
import chokidar from 'chokidar'
import { karinDir } from 'karin/core'
import { common } from 'karin/utils/common/common'
import { Redis, App, Config, Server, Package, GroupCfg, KarinEventTypes } from 'karin/types'

/**
 * 配置文件
 */
export const config = new (class Cfg {
  /**
   * 运行目录绝对路径
   */
  dir: string
  /**
   * 运行目录配置文件夹路径
   */
  cfgDir: string
  /**
   * node-karin npm包路径
   */
  pkgDir: string
  /**
   * node-karin 包配置文件夹路径
   */
  pkgCfgDir: string
  change: Map<string, any>
  watcher: Map<string, any>
  review: boolean
  logger!: Logger
  constructor () {
    this.dir = process.cwd()
    this.pkgDir = karinDir
    this.cfgDir = this.dir + '/config'
    this.pkgCfgDir = this.pkgDir + '/config/defSet'

    /** 缓存 */
    this.change = new Map()
    /** 监听文件 */
    this.watcher = new Map()
    /** 拦截器状态 */
    this.review = false
    this.initCfg()
  }

  /**
   * 初始化配置
   */
  async initCfg () {
    const list = [
      this.dir + '/temp/input',
      this.dir + '/plugins/karin-plugin-example',
      this.cfgDir + '/config',
      this.cfgDir + '/plugin',
    ]

    list.forEach(path => this.mkdir(path))
    if (this.pkgCfgDir !== (this.cfgDir + '/defSet').replace(/\\/g, '/')) {
      const files = fs.readdirSync(this.pkgCfgDir).filter(file => file.endsWith('.yaml'))
      files.forEach(file => {
        const path = `${this.cfgDir}/config/${file}`
        const pathDef = `${this.pkgCfgDir}/${file}`
        if (!fs.existsSync(path)) fs.copyFileSync(pathDef, path)
      })
    }

    /** 为每个插件包创建统一存储的文件夹 */
    const plugins = await this.getPlugins()
    const DataList = [
      'data',
      'temp',
      'resources',
      'temp/html',
      this.cfgDir + '/plugin',
    ]
    DataList.forEach(path => this.dirPath(path, plugins))
    this.logger = (await import('../core/logger')).default
  }

  async getPlugins () {
    const list: string[] = []
    const files = fs.readdirSync('./plugins', { withFileTypes: true })
    // 过滤掉非karin-plugin-开头的文件夹
    list.push(...files.filter(file => file.isDirectory() && (file.name.startsWith('karin-plugin-'))).map(dir => dir.name))

    // 获取npm插件
    list.push(...(await common.getNpmPlugins(false)))
    return list
  }

  /**
   * 递归创建目录
   * @param dirname - 要创建的文件夹路径
   */
  mkdir (dirname: string): boolean {
    if (fs.existsSync(dirname)) return true
    /** 递归自调用 */
    if (this.mkdir(path.dirname(dirname))) fs.mkdirSync(dirname)
    return true
  }

  /**
   * 为每一个插件建立对应的文件夹
   */
  async dirPath (_path: string, plugins: string[]) {
    this.mkdir(_path)
    for (const plugin of plugins) {
      const path = `${_path}/${plugin}`
      this.mkdir(path)
    }
  }

  /**
   * 超时时间
   */
  timeout (type: 'ws' | 'grpc' = 'ws'): number {
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
  get redis (): Redis {
    const config = this.getYaml('config', 'redis', false)
    const defSet = this.getYaml('defSet', 'redis', false)
    const data = { ...defSet, ...config }
    return data
  }

  /**
   * 主人列表
   */
  get master () {
    return this.Config.master || []
  }

  /**
   * 管理员列表
   */
  get admin (): string[] {
    return this.Config.admin || []
  }

  /**
   * App管理
   */
  get App (): App {
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
  get Config (): Config {
    const key = 'change.config'
    const res = this.change.get(key)
    /** 取缓存 */
    if (res) return res

    /** 取配置 */
    const config = this.getYaml('config', 'config', true)
    const defSet = this.getYaml('defSet', 'config', false)
    const data = { ...defSet, ...config }
    const Config = {
      ...data,
      WhiteList: {
        users: data.WhiteList.users.map((i: string | number) => String(i)),
        groups: data.WhiteList.groups.map((i: string | number) => String(i)),
        GroupMsgLog: data.WhiteList.GroupMsgLog.map((i: string | number) => String(i)),
      },
      BlackList: {
        users: data.BlackList.users.map((i: string | number) => String(i)),
        groups: data.BlackList.groups.map((i: string | number) => String(i)),
        GroupMsgLog: data.BlackList.GroupMsgLog.map((i: string | number) => String(i)),
      },
      master: data.master.map((i: string | number) => String(i)),
      admin: data.admin.map((i: string | number) => String(i)),
      private: {
        white_list: data.private.white_list.map((i: string | number) => String(i)),
        tips: data.private.tips,
      },
    }
    /** 缓存 */
    this.change.set(key, Config)
    return Config
  }

  /**
   * Server 配置文档
   */
  get Server (): Server {
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
   * packageon
   * 实时获取packageon文件
   */
  get package (): Package {
    const data = fs.readFileSync(this.pkgDir + '/package.json', 'utf8')
    const pack = JSON.parse(data) as Package
    return pack
  }

  /**
   * 获取群配置
   * @param group_id - 群号
   * @param e - 事件
   */
  group (group_id: string, e: KarinEventTypes): GroupCfg {
    const key = 'change.group'
    /** 取缓存 */
    const res = this.change.get(key)
    const keys = e?.self_id ? [`Bot.${e.self_id}.${group_id}`, `Bot.${e.self_id}`, group_id] : [group_id]
    if (res) {
      const cfg = { ...res.defCfg.default, ...res.Config.default }
      for (const k of keys) {
        if (res.Config?.[k]) return { ...cfg, ...res.Config?.[k] }
      }
      return cfg
    }

    /** 取配置 */
    const Config = this.getYaml('config', 'group', true)
    const defCfg = this.getYaml('defSet', 'group', false)
    const data = { Config, defCfg }
    /** 缓存 */
    this.change.set(key, data)
    const cfg = { ...defCfg.default, ...Config.default }
    for (const k of keys) {
      if (Config[k]) return { ...cfg, ...Config[k] }
    }

    return cfg
  }

  /**
   * 获取配置yaml
   * @param type 类型
   * @param name 文件名称
   * @param isWatch 是否监听文件
   */
  getYaml (type: 'defSet' | 'config', name: string, isWatch = false) {
    /** 文件路径 */
    const file = type === 'defSet' ? `${this.pkgCfgDir}/${name}.yaml` : `${this.cfgDir}/config/${name}.yaml`

    /** 读取文件 */
    const data = Yaml.parse(fs.readFileSync(file, 'utf8'))

    /** 监听文件 */
    if (isWatch) this.watch(type, name, file)
    return data
  }

  /**
   * 监听配置文件
   * @param type 类型
   * @param name 文件名称 不带后缀
   * @param file 文件路径
   */
  async watch (type: 'defSet' | 'config', name: string, file: string) {
    const key = `change.${name}`
    /** 已经监听过了 */
    const res = this.watcher.get(key)
    if (res) return true
    /** 监听文件 */
    const watcher = chokidar.watch(file)
    /** 监听文件变化 */
    watcher.on('change', () => {
      this.change.delete(key)
      this.logger.mark(`[修改配置文件][${type}][${name}]`)
      /** 文件修改后调用对应的方法 */
      switch (`change_${name}`) {
        case 'change_App':
          this.changeApp()
          break
        case 'change_config':
          this.changeCfg()
          break
        case 'change_group':
          this.changeGroup()
          break
      }
    })

    /** 缓存 防止重复监听 */
    this.watcher.set(key, watcher)
  }

  async changeApp () {
    await this.#review()
  }

  async changeCfg () {
    /** 修改日志等级 */
    this.logger.level = this.Config.log4jsCfg.level
    await this.#review()
    if (this.Server.HotUpdate) {
      const { Bot } = await import('../..')
      Bot.emit('restart_http', {})
      Bot.emit('restart_grpc', {})
    }
  }

  async changeGroup () {
    await this.#review()
  }

  async #review () {
    // 应该改成事件监听
    if (this.review) return
    this.review = true
    const { review } = await import('karin/event')
    review.main()
    this.review = false
  }
})()

export const Cfg = config
