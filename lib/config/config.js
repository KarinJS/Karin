import Yaml from 'yaml'
import fs from 'fs'
import chokidar from 'chokidar'
import logger from './log.js'

/** 配置文件 */
class Cfg {
  constructor () {
    this.dir = process.cwd()
    this._path = this.dir + '/config/config'
    this._pathDef = this.dir + '/config/defSet'

    /** 缓存 */
    this.change = {}
    /** 监听文件 */
    this.watcher = {}
    /** 拦截器状态 */
    this.review = false
    this.initCfg()
  }

  /** 初始化配置 */
  initCfg () {
    if (!fs.existsSync(this._path)) fs.mkdirSync(this._path)
    const files = fs.readdirSync(this._pathDef).filter(file => file.endsWith('.yaml'))
    for (let file of files) {
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

  getPlugins () {
    const files = fs.readdirSync('./plugins', { withFileTypes: true })
    // 过滤掉非karin-plugin-开头或karin-adapter-开头的文件夹
    return files.filter(file => file.isDirectory() && (file.name.startsWith('karin-plugin-') || file.name.startsWith('karin-adapter-'))).map(dir => dir.name)
  }

  /** 为每一个插件建立对应的文件夹 */
  async dirPath (name, plugins) {
    name = `./${name}`
    if (!fs.existsSync(name)) fs.mkdirSync(name)
    for (let plugin of plugins) {
      let path = `${name}/${plugin}`
      if (!fs.existsSync(path)) fs.mkdirSync(path)
    }
  }

  /**
   * 超时时间
   * @returns {number}
   */
  timeout (type = 'ws') {
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
   * @returns {redis}
   * @typedef {Object} redis
   * @property {string} host - 地址
   * @property {number} port - 端口
   * @property {string} username - 用户名
   * @property {string} password - 密码
   * @property {number} db - 数据库
   */
  get redis () {
    const config = this.getYaml('config', 'redis', false, false)
    const defSet = this.getYaml('defSet', 'redis', false, false)
    const data = { ...defSet, ...config }
    return data
  }

  /**
   * 主人列表
   * @returns {string[]}
   */
  get master () {
    return this.Config.master || []
  }

  /**
   * 管理员列表
   * @returns {string[]}
   */
  get admin () {
    return this.Config.admin || []
  }

  /** App管理 */
  get App () {
    const key = 'change.App'
    /** 取缓存 */
    if (this.change[key]) {
      return this.change[key]
    }

    /** 取配置 */
    const config = this.getYaml('config', 'App', true)
    const defSet = this.getYaml('defSet', 'App', true)
    const data = { ...defSet, ...config }
    /** 缓存 */
    this.change[key] = data
    return this.change[key]
  }

  /**
   * 功能黑名单
   * @returns {string[]}
   */
  get blackList () {
    return this.Config.BlackList || []
  }

  /**
   * @returns {Config} - 基本配置
   * @typedef {Object} Config
   * @property {string} log_level - 日志等级
   * @property {number} log_days_Keep - 日志保存天数
   * @property {string} ffmpeg_path - ffmpeg路径
   * @property {string} ffprobe_path - ffprobe路径
   * @property {string[]} master - 主人列表
   * @property {string[]} admin - 管理员列表
   * @property {Object} BlackList - 黑名单相关
   * @property {string[]} BlackList.users - 黑名单用户
   * @property {string[]} BlackList.groups - 黑名单群聊
   * @property {string[]} BlackList.GroupMsgLog - 消息日志黑名单群聊
   * @property {Object} WhiteList - 白名单相关
   * @property {string[]} WhiteList.users - 白名单用户
   * @property {string[]} WhiteList.groups - 白名单群聊
   * @property {string[]} WhiteList.GroupMsgLog - 消息日志白名单群聊
   */
  get Config () {
    const key = 'change.config'
    /** 取缓存 */
    if (this.change[key]) {
      return this.change[key]
    }

    /** 取配置 */
    const config = this.getYaml('config', 'config', true)
    const defSet = this.getYaml('defSet', 'config', false)
    const data = { ...defSet, ...config }
    /** 缓存 */
    this.change[key] = data
    return this.change[key]
  }

  /**
   * Server 配置文档
   * @returns {Server} - 服务配置
   * @typedef {Object} Server - 服务配置
   * @property {boolean} Server.HotUpdate - 当前文件热更新是否重启http、grpc服务
   *
   * @property {Object} Server.http - http 服务器配置
   * @property {string} Server.http.host - 监听地址
   * @property {number} Server.http.port - 端口
   *
   * @property {Object} Server.grpc - grpc 服务器配置
   * @property {string} Server.grpc.host - 监听地址
   * @property {number} Server.grpc.timeout - Api请求超时时间（秒）
   *
   * @property {Object} Server.websocket - websocket 服务器配置
   * @property {number} Server.websocket.timeout - API请求超时时间（秒）
   * @property {string[]} Server.websocket.render - websocket 渲染器地址
   * @property {string[]} Server.websocket.OneBot11Host - onebot11 正向WebSocket地址
   * @property {string[]} Server.websocket.OneBot12Host - onebot12 正向WebSocket地址
   *
   * @property {Object} Server.HttpRender - HTTP渲染器配置
   * @property {boolean} Server.HttpRender.enable - 是否开启http渲染
   * @property {string} Server.HttpRender.host - karin端Api地址 公网 > 局域网 > 127
   * @property {string} Server.HttpRender.post - karin-puppeteer渲染器 post请求地址
   * @property {string} Server.HttpRender.token - karin-puppeteer渲染器 post请求token
   * @property {string} Server.HttpRender.not_found - 请求的非html或非有效路径的返回内容 可以填http地址 例如：https://ys.mihoyo.com
   * @property {string} Server.HttpRender.WormholeClient - Wormhole代理地址 无公网环境的情况下使用
   */
  get Server () {
    const key = 'change.server'
    /** 取缓存 */
    if (this.change[key]) {
      return this.change[key]
    }

    /** 取配置 */
    const config = this.getYaml('config', 'server', true)
    const defSet = this.getYaml('defSet', 'server', false)
    const data = { ...defSet, ...config }
    /** 缓存 */
    this.change[key] = data
    return this.change[key]
  }

  /**
   * package.json
   * 实时获取package.json文件
   */
  get package () {
    let data = fs.readFileSync('package.json', 'utf8')
    data = JSON.parse(data)
    return data
  }

  /**
   * 获取群配置
   * @param {string} group_id 群号
   * @returns {Group} - 群配置
   * @typedef {Object} Group - 群配置
   * @property {number} Group.GroupCD - 群聊中所有消息冷却时间，单位秒,0则无限制
   * @property {number} Group.GroupUserCD - 群聊中 每个人的消息冷却时间，单位秒,0则无限制
   * @property {0|1|2|3|4|5} Group.mode - 机器人响应模式，0-所有 1-仅@机器人 2-仅回应主人 3-仅回应前缀 4-前缀或@机器人 5-主人无前缀，群员前缀或@机器人
   * @property {string[]} Group.alias - 机器人前缀
   * @property {string[]} Group.enable - 白名单插件、功能，只有在白名单中的插件、功能才会响应
   * @property {string[]} Group.disable - 黑名单插件、功能，黑名单中的插件、功能不会响应
   */
  group (group_id = '') {
    const key = 'change.group'
    /** 取缓存 */
    if (this.change[key]) {
      const res = { ...this.change[key].defCfg.default, ...this.change[key].Config.default, ...(this.change[key].Config[group_id] || {}) }
      return res
    }

    /** 取配置 */
    const Config = this.getYaml('config', 'group')
    const defCfg = this.getYaml('defSet', 'group')
    const data = { Config, defCfg }
    /** 缓存 */
    this.change[key] = data
    const res = { ...defCfg.default, ...Config.default, ...(Config[group_id] || {}) }
    return res
  }

  /**
   * 获取配置yaml
   * @param {'defSet'|'config'} type 类型
   * @param {string} name 文件名称 不带后缀
   * @param {boolean} isWatch 是否监听文件变化
   */
  getYaml (type, name, isWatch) {
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
  async watch (type, name, file) {
    const key = `change.${name}`
    /** 已经监听过了 */
    if (this.watcher[key]) return true
    /** 监听文件 */
    const watcher = chokidar.watch(file)
    /** 监听文件变化 */
    watcher.on('change', () => {
      delete this.change[key]
      logger.mark(`[修改配置文件][${type}][${name}]`)
      /** 文件修改后调用对应的方法 */
      if (this[`change_${name}`]) this[`change_${name}`]()
    })
    /** 缓存 防止重复监听 */
    this.watcher[key] = watcher
  }

  async change_App () {
    await this.#review()
  }

  async change_config () {
    /** 修改日志等级 */
    logger.level = this.Config.log_level
    await this.#review()
    if (this.Config.hot_update) {
      const { Bot } = await import('../index.js')
      Bot.emit('restart_http', {})
      Bot.emit('restart_grpc', {})
    }
  }

  async change_group () {
    await this.#review()
  }

  async #review () {
    if (this.review) return
    this.review = true
    const review = await import('../event/review.js')
    review.default.main()
    this.review = false
  }
}

export default new Cfg()
