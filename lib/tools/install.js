import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

class Install {
  constructor () {
    this.dir = process.cwd()
  }

  /**
   * npm install
   */
  async init () {
    const dependenciesMap = {
      // 5.1.7版本很多人可能无法安装 暂时固定为5.1.6
      sqlite3: '5.1.6',
      sequelize: '^6.37.3',
      redis: '^4.6.14',
    }

    const install = []

    this.plugins = this.getPluginsPath()

    for (const plugin of this.plugins) {
      const packagePath = plugin + '/package.json'
      const data = this.package(packagePath)
      if (!data.karin || !data.karin.db || !Array.isArray(data.karin.db)) continue
      for (const name of data.karin.db) {
        /** 数组长度===4 */
        if (install.length === 4) break

        switch (name) {
          case 'sequelize': {
            if (!install.includes('sequelize')) install.push('sequelize')
            continue
          }
          case 'sqlite3': {
            if (!install.includes('sqlite3')) install.push('sqlite3')
            continue
          }
          case 'redis': {
            if (!install.includes('redis')) install.push('redis')
            continue
          }
          default: {
            console.error(`[install] 未知数据库插件：${name}`)
            continue
          }
        }
      }
    }

    console.log('[install] 需要安装的依赖：', install)

    const json = {
      name: 'karin-driver-db',
      type: 'module',
      dependencies: {},
    }

    for (const key in install) {
      const name = install[key]
      json.dependencies[name] = dependenciesMap[name]
    }

    const driverPath = this.dir + '/plugins/karin-driver-db'

    // 写入package.json
    fs.writeFileSync(driverPath + '/package.json', JSON.stringify(json, null, 2))
    if (process.env.npm_lifecycle_event === 'init:pack') {
      console.log('[install] 当前为生成包模式，不执行安装依赖，任务结束')
      return
    }

    this.plugins.push(driverPath)
    await this.install()
  }

  /**
   * 获取所有插件绝对路径
   */
  getPluginsPath () {
    const files = fs.readdirSync(this.dir + '/plugins', { withFileTypes: true })
    // 过滤掉非karin-plugin-开头或karin-adapter-开头的文件夹
    let plugins = files.filter(file => file.isDirectory() && (file.name.startsWith('karin-plugin-') || file.name.startsWith('karin-adapter-'))).map(dir => dir.name)
    // 排除没有package.json的插件
    plugins = plugins.filter(plugin => fs.existsSync(this.dir + '/plugins/' + plugin + '/package.json'))
    return plugins.map(plugin => this.dir + '/plugins/' + plugin)
  }

  /**
   * 创建目录
   * @param {string} Path - 路径
   */
  mkdir (Path) {
    if (fs.existsSync(Path)) return true
    /** 递归自调用 */
    if (this.mkdir(path.dirname(Path))) fs.mkdirSync(Path)
    return true
  }

  /**
   * 解析package.json
   * @param {string} Path - package.json路径
   */
  package (Path) {
    const data = JSON.parse(fs.readFileSync(Path, 'utf8'))
    return data
  }

  /**
   * 执行安装依赖
   */
  async install () {
    const { npm_lifecycle_event: lifecycleEvent, npm_config_user_agent: agent, npm_config_userconfig: userconfig } = process.env
    const isInit = lifecycleEvent === 'init'
    const baseCmd = isInit ? 'install -P' : 'install'
    let cmd

    if (agent && agent.includes('pnpm')) {
      cmd = `pnpm ${baseCmd}`
      await this.installDependencies(cmd, '[pnpm]')
    } else if (userconfig && userconfig.includes('cnpm')) {
      cmd = `cnpm ${baseCmd}`
      await this.installDependencies(cmd, '[cnpm]', true)
    } else if (agent && agent.includes('yarn')) {
      cmd = `yarn ${baseCmd}`
      await this.installDependencies(cmd, '[yarn]')
    } else {
      cmd = `npm ${baseCmd}`
      await this.installDependencies(cmd, '[npm]', true)
    }
  }

  /**
   * 安装依赖并打印日志
   * @param {string} cmd - 要执行的命令
   * @param {string} label - 日志标签
   * @param {boolean} installPlugins - 是否安装插件依赖
   */
  async installDependencies (cmd, label, installPlugins = false) {
    console.log(`[install]${label} 开始安装依赖: ${cmd}`)
    const res = await this.execPromise(cmd, this.dir)
    console.log(res)

    if (installPlugins) {
      await Promise.all(this.plugins.map(async (plugin) => {
        const pluginCmd = `${cmd} ${path.basename(plugin)}`
        console.log(`${label} 开始安装插件依赖: ${pluginCmd}`)
        const res = await this.execPromise(pluginCmd, plugin)
        console.log(res)
        console.log(`${label} ${plugin} 依赖安装完成`)
      }))
    }

    console.log(`${label} 依赖安装完成，任务结束`)
  }

  /**
   * 执行命令
   * @param {string} command - 命令
   * @param {string} cwd - 执行路径
   * @returns {Promise<string>}
   */
  async execPromise (command, cwd) {
    return new Promise((resolve, reject) => {
      exec(command, { env: process.env, cwd, silent: true }, (error, stdout) => {
        if (error) {
          reject(error)
        } else {
          resolve(stdout)
        }
      })
    })
  }
}

const install = new Install()
install.init()
