import fs from 'node:fs'
import lodash from 'lodash'
import moment from 'moment'
import path from 'node:path'
import util from 'node:util'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
import { common, logger } from '#Karin'

/**
 * 加载插件
 */
class PluginsLoader {
  constructor () {
    this.priority = []
    this.task = []
    this.dir = './plugins'

    /** 插件监听 */
    this.watcher = {}
  }

  /** 插件初始化 */
  async load () {
    const files = this.getPlugins()

    logger.info('加载插件中..')

    let packageErr = []

    const promises = files.map(async (app) => {
      try {
        const path = `../../plugins/${app.apps}/${app.name}`
        const tmp = await import(path)
        lodash.forEach(tmp, (App) => {
          if (!App.prototype) return
          let plugin = new App()
          logger.debug(`载入插件 [${app.name}][${plugin.name}]`)
          /** 执行初始化 */
          plugin.init && plugin.init()
          /** 初始化定时任务 */
          this.collectTask(plugin.task)

          /** 收集插件 */
          this.priority.push(this.createdPriority(App, app, plugin))
        })
      } catch (error) {
        if (error?.stack?.includes('Cannot find package')) {
          packageErr.push({ error, File: app })
        } else {
          logger.error(`载入插件错误：${logger.red(app.name)}`)
          logger.error(decodeURI(error.stack))
        }
      }
    })

    /** 等待所有插件加载完成 */
    await Promise.all(promises)

    this.packageTips(packageErr)
    /** 创建定时任务 */
    this.creatTask()

    logger.info(`加载定时任务[${this.task.length}个]`)
    logger.info(`加载插件完成[${this.priority.length}个]`)
    logger.info('-----------')

    /** 优先级排序 */
    this.priority = lodash.orderBy(this.priority, ['priority'], ['asc'])
  }

  packageTips (packageErr) {
    if (!packageErr || packageErr.length <= 0) return
    logger.mark('--------插件载入错误--------')
    packageErr.forEach(v => {
      let pack = v.error.stack.match(/'(.+?)'/g)[0].replace(/'/g, '')
      logger.mark(`${v.File.name} 缺少依赖：${logger.red(pack)}`)
      logger.mark(`新增插件后请执行安装命令：${logger.red('pnpm install -P')} 安装依赖`)
      logger.mark(`如安装后仍未解决可联系插件作者将 ${logger.red(pack)} 依赖添加至插件的package.json dependencies中，或手工安装依赖`)
    })
    logger.mark('---------------------')
  }

  getPlugins () {
    let ret = []
    /** 获取所有插件包 */
    let plugins = fs.readdirSync(this.dir, { withFileTypes: true })
    /** 忽略非文件夹、非karin-plugin-开头的文件夹 */
    plugins = plugins.filter(v => v.isDirectory() && v.name.startsWith('karin-plugin-'))

    for (let val of plugins) {
      let apps = fs.readdirSync(`${this.dir}/${val.name}`, { withFileTypes: true })
      /** 根据是否存在apps文件夹进行判断是否为插件包 */
      if (apps.some(v => v.name === 'apps' && v.isDirectory)) {
        /** 插件包只保留一个apps文件夹、index.js */
        apps = apps.filter(v => (v.name === 'apps' && v.isDirectory) || v.name === 'index.js')
      }

      for (let app of apps) {
        /** 插件包 */
        if (app.isDirectory() && app.name === 'apps') {
          let apps = fs.readdirSync(`${this.dir}/${val.name}/apps`, { withFileTypes: true })
          for (let app of apps) {
            if (!app.name.endsWith('.js')) continue
            /** 收集插件 */
            ret.push(this.createdApp(val.name, `apps/${app.name}`))
          }

          /** dev热更新 */
          if (process.argv[2] === '--dev') {
            /** 监听文件夹热更新 */
            this.watchDir(val.name, true)
          }
          continue
        }

        /** 忽略非js文件 */
        if (!app.name.endsWith('.js')) continue

        ret.push(this.createdApp(val.name, app.name))

        /** 监听热更新 */
        this.watch(val.name, app.name)
      }
    }

    return ret
  }

  /**
   * 构建插件基本参数
   * @param {string} apps 插件文件夹名称
   * @param {string} name 插件路径
   * @returns {object} 插件对象
   */
  createdApp (apps, name) {
    return { apps, name, rule: [], priority: 5000, event: 'message' }
  }

  /** 构建priority */
  createdPriority (App, app, plugin) {
    let priority = {
      App,
      apps: app.apps,
      name: app.name,
      rule: plugin.rule || app.event,
      priority: plugin.priority || app.priority,
      event: plugin.event || app.event
    }

    if (plugin.accept) priority.accept = true
    if (plugin.permission) priority.permission = plugin.permission

    return priority
  }

  /** 收集定时任务 */
  collectTask (task) {
    if (Array.isArray(task)) {
      task.forEach((val) => {
        if (!val.cron) return
        if (!val.name) throw new Error('插件任务名称错误')
        this.task.push(val)
      })
    } else {
      if (task.fnc && task.cron) {
        if (!task.name) throw new Error('插件任务名称错误')
        this.task.push(task)
      }
    }
  }

  /** 创建定时任务 */
  async creatTask () {
    this.task.forEach((val) => {
      val.job = schedule.scheduleJob(val.cron, async () => {
        try {
          if (val.log === true) {
            logger.mark(`开始定时任务：${val.name}`)
          }
          let res = val.fnc()
          if (util.types.isPromise(res)) res = await res
          if (val.log === true) {
            logger.mark(`定时任务完成：${val.name}`)
          }
        } catch (error) {
          logger.error(`定时任务报错：${val.name}`)
          logger.error(error)
        }
      })
    })
  }

  /** 监听热更新 */
  watch (dirName, appName) {
    if (this.watcher[`${dirName}.${appName}`]) return

    let file = `./plugins/${dirName}/${appName}`
    const watcher = chokidar.watch(file)

    /** 监听修改 */
    watcher.on('change', async path => {
      logger.mark(`[修改插件][${dirName}][${appName}]`)
      await this.reload(dirName, appName)
    })

    /** 监听删除 */
    watcher.on('unlink', async path => {
      logger.mark(`[卸载插件][${dirName}][${appName}]`)
      this.priority = this.priority.forEach((v, i) => {
        if (v.apps === dirName && v.name === appName) {
          this.priority.splice(i, 1)
          /** 停止监听 */
          this.watcher[`${dirName}.${appName}`].removeAllListeners('change')
        }
      })
    })

    this.watcher[`${dirName}.${appName}`] = watcher
  }

  /** 监听文件夹更新 */
  watchDir (dirName, isRevise = false) {
    if (this.watcher[dirName]) return

    let file = `./plugins/${dirName}/`
    const watcher = chokidar.watch(file)

    /** 热更新 */
    setTimeout(() => {
      /** 新增文件 */
      watcher.on('add', async PluPath => {
        let appName = path.basename(PluPath)
        if (!appName.endsWith('.js')) return
        /** isRevise的为插件包 需要加前缀 */
        if (isRevise) appName = `apps/${appName}`
        if (!fs.existsSync(`${this.dir}/${dirName}/${appName}`)) return

        this.watch(dirName, appName)

        /** 太快了延迟下 */
        await common.sleep(500)

        logger.mark(`[新增插件][${dirName}][${appName}]`)
        let tmp = {}
        try {
          tmp = await import(`../../plugins/${dirName}/${appName}?${moment().format('X')}`)
        } catch (error) {
          logger.error(`载入插件错误：${logger.red(dirName + '/' + appName)}`)
          logger.error(decodeURI(error.stack))
          return
        }

        lodash.forEach(tmp, (App) => {
          if (!App.prototype) {
            logger.error(`[载入失败][${dirName}][${appName}] 格式错误已跳过`)
            return
          }

          const plugin = new App()
          const app = this.createdApp(dirName, appName)

          /** 增加插件 */
          this.priority.push(this.createdPriority(App, app, plugin))
        })

        /** 优先级排序 */
        this.priority = lodash.orderBy(this.priority, ['priority'], ['asc'])
      })

      /** 修改文件 */
      if (isRevise) {
        watcher.on('change', async PluPath => {
          // 文件名称
          const name = 'apps/' + path.basename(PluPath)
          if (!name.endsWith('.js')) return

          /** 太快了延迟下 */
          await common.sleep(500)

          await this.reload(dirName, name)
          logger.mark(`[修改插件][${dirName}][${name}]`)
        })
      }
    }, 500)

    this.watcher[dirName] = watcher
  }

  /** 热更新-修改插件 */
  async reload (apps, name) {
    let tmp = {}
    try {
      tmp = await import(`../../plugins/${apps}/${name}?${moment().format('x')}`)
    } catch (error) {
      logger.error(`载入插件错误：${logger.red(apps + '/' + name)}`)
      logger.error(decodeURI(error.stack))
      return
    }

    lodash.forEach(tmp, (App) => {
      let plugin = new App()
      for (let i in this.priority) {
        const app = this.priority[i]
        if (app.apps === apps && app.name === name) {
          this.priority[i] = this.createdPriority(App, app, plugin)
        }
      }
    })

    this.priority = lodash.orderBy(this.priority, ['priority'], ['asc'])
  }
}

export default new PluginsLoader()
