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
    this.config = {}
    /** 是否正在修改配置 */
    this.review = false
    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }
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
   * @returns {redis}
   * @typedef {Object} redis
   * @property {string} host - 地址
   * @property {number} port - 端口
   * @property {string} username - 用户名
   * @property {string} password - 密码
   * @property {number} db - 数据库
   */
  get redis () {
    return this.getConfig('redis')
  }

  /**
   * 主人列表
   * @returns {string[]}
   */
  get master () {
    return this.getConfig('config').master || []
  }

  /**
   * 管理员列表
   * @returns {string[]}
   */
  get admin () {
    return this.getConfig('config').admin || []
  }

  /** App管理 */
  get App () {
    return { ...this.getdefSet('App'), ...this.getConfig('App') }
  }

  /**
   * 功能黑名单
   * @returns {string[]}
   */
  get blackList () {
    return this.getConfig('config').blackList || []
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
    return { ...this.getdefSet('config'), ...this.getConfig('config') }
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
    return { ...this.getdefSet('Server'), ...this.getConfig('Server') }
  }

  /** package.json */
  get package () {
    if (this._package) return this._package
    this._package = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    return this._package
  }

  /**
   * 获取群配置
   * @param {string} group_id 群号
   * @returns {Group} - 群配置
   * @typedef {Object} Group - 群配置
   * @property {number} Group.GroupCD - 群聊中所有消息冷却时间，单位秒,0则无限制
   * @property {number} Group.GroupUserCD - 群聊中 每个人的消息冷却时间，单位秒,0则无限制
   * @property {0|1|2|3|4|5} Group.mode - 机器人响应模式，0-所有 1-仅@机器人 2-仅回应主人 3-仅回应前缀 4-前缀或@机器人 5-主人无前缀，群员前缀或@机器人
   * @property {string[]} Group.ailas - 机器人前缀
   * @property {string[]} Group.enable - 白名单插件、功能，只有在白名单中的插件、功能才会响应
   * @property {string[]} Group.disable - 黑名单插件、功能，黑名单中的插件、功能不会响应
   */
  group (group_id = '') {
    const Config = this.getConfig('group')
    const defCfg = this.getdefSet('group')
    return { ...defCfg.default, ...Config.default, ...(Config[group_id] || {}) }
  }

  /**
   * 用户配置
   * @param {string} name 文件名称 不带后缀
   */
  getConfig (name) {
    return this.getYaml('config', name)
  }

  /**
   * 默认配置 建议使用 getConfig
   * @param {string} name 文件名称 不带后缀
   */
  getdefSet (name) {
    return this.getYaml('defSet', name)
  }

  /**
   * 获取配置yaml
   * @param {'defSet'|'config'} type 类型
   * @param {string} name 文件名称 不带后缀
   */
  getYaml (type, name) {
    let file = `config/${type}/${name}.yaml`
    let key = `${type}.${name}`
    if (this.config[key]) return this.config[key]
    this.config[key] = Yaml.parse(fs.readFileSync(file, 'utf8'))
    this.watch(file, name, type)
    return this.config[key]
  }

  /**
   * 监听配置文件
   * @param {string} file 文件路径
   * @param {string} name 文件名称 不带后缀
   * @param {'defSet'|'config'} type 类型
   */
  watch (file, name, type = 'defSet') {
    let key = `${type}.${name}`
    if (this.watcher[key]) { return }
    const watcher = chokidar.watch(file)
    watcher.on('change', () => {
      delete this.config[key]
      logger.mark(`[修改配置文件][${type}][${name}]`)
      if (this[`change_${name}`]) this[`change_${name}`]()
    })
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
