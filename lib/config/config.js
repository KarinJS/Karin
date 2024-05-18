import Yaml from 'yaml'
import fs from 'fs'
import chokidar from 'chokidar'
import logger from './log.js'

/** 配置文件 */
class Cfg {
  constructor () {
    this.config = {}
    this.review = false
    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }
    this.initCfg()
  }

  /** 初始化配置 */
  initCfg () {
    let path = 'config/config/'
    let pathDef = 'config/defSet/'
    const files = fs.readdirSync(pathDef).filter(file => file.endsWith('.yaml'))
    for (let file of files) {
      if (!fs.existsSync(`${path}${file}`)) {
        fs.copyFileSync(`${pathDef}${file}`, `${path}${file}`)
      }
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

  /** 超时时间 */
  get timeout () {
    return this.getConfig('config').timeout || this.getdefSet('config').timeout || 10000
  }

  /** redis */
  get redis () {
    return this.getConfig('redis')
  }

  /** 主人列表 */
  get master () {
    return this.getConfig('config').master || []
  }

  /** 管理员列表 */
  get admin () {
    return this.getConfig('config').admin || []
  }

  /** App管理 */
  get App () {
    return { ...this.getdefSet('App'), ...this.getConfig('App') }
  }

  /** 功能黑名单 */
  get blackList () {
    return this.getConfig('config').blackList || []
  }

  /** 基本配置 */
  get Config () {
    return { ...this.getdefSet('config'), ...this.getConfig('config') }
  }

  /** puppeteer */
  get puppeteer () {
    return this.getConfig('puppeteer')
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
   */
  group (group_id = '') {
    const Config = this.getConfig('group')
    const defCfg = this.getdefSet('group')
    return { ...defCfg.default, ...Config.default, ...(Config[group_id] || {}) }
  }

  /**
   * @param app  功能
   * @param name 配置文件名称
   */
  getdefSet (name) {
    return this.getYaml('defSet', name)
  }

  /** 用户配置 */
  getConfig (name) {
    return this.getYaml('config', name)
  }

  /**
   * 获取配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  getYaml (type, name) {
    let file = `config/${type}/${name}.yaml`
    let key = `${type}.${name}`
    if (this.config[key]) return this.config[key]
    this.config[key] = Yaml.parse(fs.readFileSync(file, 'utf8'))
    this.watch(file, name, type)
    return this.config[key]
  }

  /** 监听配置文件 */
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
