import Yaml from 'yaml'
import fs from 'node:fs'
import chokidar from 'chokidar'
import logger from './log.js'

/** 配置文件 */
class Cfg {
  constructor () {
    this.config = {}
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
    // if (!fs.existsSync('data')) { fs.mkdirSync('data') }
    // if (!fs.existsSync('resources')) { fs.mkdirSync('resources') }
  }

  /** redis */
  get redis () {
    return this.getConfig('redis')
  }

  /** 主人列表 */
  get master () {
    return this.getConfig('config').master || []
  }

  /** 功能黑名单 */
  get blackList () {
    return this.getConfig('config').blackList || []
  }

  /** 基本配置 */
  get Config () {
    return this.getConfig('config')
  }

  /** package.json */
  get package () {
    if (this._package) return this._package
    this._package = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    return this._package
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
    watcher.on('change', path => {
      delete this.config[key]
      logger.mark(`[修改配置文件][${type}][${name}]`)
      if (this[`change_${name}`]) this[`change_${name}`]()
    })
    this.watcher[key] = watcher
  }

  async change_config () {
    /** 修改日志等级 */
    logger.level = this.Config.log_level
  }
}

export default new Cfg()
