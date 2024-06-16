import fs from 'fs'
import lodash from 'lodash'
import path from 'path'
import util from 'util'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
// import Handler from '../utils/handler.js'
// import Button from '../utils/button.js'
import Renderer from '../renderer/App.js'
import { logger, handler, button, common } from '../index.js'

/**
 * 加载插件
 */
class Loader {
  constructor () {
    /**
      * 插件列表
      * @type {{
      *   App: import('./plugin.js').default,
      *   file: {
      *     name: string,
      *     dir: string
      *   },
      *   name: string,
      *   event: string,
      *   priority: number,
      *   permission: string,
      *   accept: boolean,
      *   rule: Array<{reg: RegExp, fnc: string, event?: string, permission?: string, log?: Function}>,
      * }[]}
      */
    this.Apps = []
    /**
     * 定时任务
     * @type {Array<{
     * App: import('./plugin.js').default,
     * file: { name: string, dir: string },
     * cron: string,
     * fnc: string,
     * log: Function,
     * name: string
     * }>}
     */
    this.task = []
    this.dir = './plugins'

    /** 插件监听 */
    this.watcher = {}
  }

  /**
   * 插件初始化
   * @returns {Promise<Loader>}
   */
  async load () {
    const files = this.getPlugins()

    logger.info(logger.green('-----------'))
    logger.info('加载插件中..')

    /** 载入插件 */
    const promises = files.map(async ({ dir, name }) => await this.createdApp(dir, name, false))

    /** 等待所有插件加载完成 */
    await Promise.all(promises)

    /** 创建定时任务 */
    this.creatTask()

    const handlerKeys = Object.keys(handler.events)
    let handlerCount = 0
    handlerKeys.forEach(key => {
      handlerCount += handler.events[key].length
    })

    logger.info(`[按钮][${button.Apps.length}个] 加载完成`)
    logger.info(`[插件][${this.Apps.length}个] 加载完成`)
    logger.info(`[渲染器][${Renderer.Apps.length}个] 加载完成`)
    logger.info(`[定时任务][${this.task.length}个] 加载完成`)
    logger.info(`[Handler][Key:${handlerKeys.length}个][fnc:${handlerCount}个] 加载完成`)
    logger.info(logger.green('-----------'))
    logger.info(`Karin启动完成：耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
    /** 优先级排序 */
    this.orderBy()
    return this
  }

  /**
   * 获取所有插件
   * @returns {Array<{dir: string, name: string}>} 插件信息
   */
  getPlugins () {
    const App = []
    /** 获取所有插件包 */
    const plugins = common.getPlugins()

    for (const val of plugins) {
      const dir = val.name
      const _path = `${this.dir}/${dir}`
      /** 带有package.json的视为插件包 */
      if (fs.existsSync(`${_path}/package.json`)) {
        /** index.js存在 */
        if (fs.existsSync(`${_path}/index.js`)) {
          App.push({ dir, name: 'index.js' })
          /** dev监听index.js */
          if (process.argv[2]?.includes('dev')) this.watch(dir, 'index.js')
        }
        /** apps存在 */
        if (fs.existsSync(`${_path}/apps`) && fs.statSync(`${_path}/apps`).isDirectory()) {
          App.push(...this.getApps(`${dir}/apps`))
        }
      } else {
        App.push(...this.getApps(dir))
      }
    }

    return App
  }

  /**
   * 获取app信息
   * @param {string} dir 文件夹目录
   * @returns {Array<{dir: string, name: string}>} 应用信息
   */
  getApps (dir) {
    const App = []
    const apps = fs.readdirSync(`${this.dir}/${dir}`, { withFileTypes: true })
    for (const app of apps) {
      /** 忽略非js文件 */
      if (!app.name.endsWith('.js')) continue
      /** 收集插件 */
      App.push({ dir, name: app.name })
    }
    if (dir.endsWith('apps')) {
      /** dev监听apps热更 */
      if (process.argv[2]?.includes('dev')) this.watchDir(dir)
    } else {
      /** 监听文件夹热更新 */
      this.watchDir(dir)
    }
    return App
  }

  /**
   * 构建插件缓存对象
   * @param {import('./plugin.js').default} App
   * @param {import('./plugin.js').default} Class new App()
   */
  App (App, Class, file) {
    const app = {
      App,
      /** 插件文件信息 */
      file,
      name: Class.name,
      event: Class.event || 'message',
      priority: Class.priority ?? 5000,
      permission: Class.permission || 'all',
      accept: !!Class.accept,
      rule: Class.rule || [],
    }

    /** 进一步处理rule */
    app.rule.forEach((val, index) => {
      app.rule[index].reg = new RegExp(val.reg)
      app.rule[index].log = val.log === false ? (id, log) => logger.debug('mark', id, log) : (id, log) => logger.bot('mark', id, log)
    })

    return app
  }

  /** 排序 */
  orderBy () {
    this.Apps = lodash.orderBy(this.Apps, ['priority'], ['asc'])
    button.Apps = lodash.orderBy(button.Apps, ['priority'], ['asc'])
  }

  /** 新增插件 */
  async createdApp (dir, name, isOrderBy = false) {
    try {
      let path = `../../plugins/${dir}/${name}`
      if (isOrderBy) path = path + `?${Date.now()}`
      const tmp = await import(path)
      lodash.forEach(tmp, (App) => {
        if (!App.prototype) return
        /** new App() */
        const Class = new App()
        logger.debug(`载入插件 [${name}][${Class.name}]`)
        /** 执行初始化 */
        Class.init && Class.init()

        /** 收集定时任务 */
        lodash.forEach(Class.task, (val) => {
          if (!val.name) return logger.error(`[${dir}][${name}] 定时任务name错误`)
          if (!val.cron) return logger.error(`[${dir}][${name}] 定时任务cron错误：${Class.name}`)
          this.task.push({ App, file: { dir, name }, cron: val.cron, fnc: val.fnc, name: val.name, log: val.log ?? true })
        })

        /** 注册Handler */
        if (!lodash.isEmpty(Class.handler)) handler.add({ name, dir, App, Class })

        /** 注册按钮 */
        if (!lodash.isEmpty(Class.button)) button.add({ name, dir, App, Class })

        /** 收集插件 */
        this.Apps.push(this.App(App, Class, { name, dir }))
        return true
      })

      if (isOrderBy) {
        /** 创建定时任务 */
        this.creatTask()
        /** 优先级排序 */
        this.orderBy()
      }
      return true
    } catch (error) {
      if (/Cannot find package '(.+?)'/.exec(error)?.[1]) {
        const pack = /Cannot find package '(.+?)'/.exec(error)?.[1]
        logger.error(logger.red('--------插件载入错误--------'))
        logger.mark(`错误: [${dir}][${name}] 缺少必要的依赖项: ${logger.red(pack)}`)
        logger.mark(`操作：请尝试在命令终端中执行 ${logger.red('pnpm i -P')} 命令安装依赖项`)
        logger.mark('提示：如安装后仍未解决，可选择以下方案')
        logger.mark(`      1.手工安装依赖: ${logger.red('pnpm i ' + pack)}`)
        logger.mark(`      2.联系插件作者：联系插件作者将 ${logger.red(pack)} 依赖项添加至插件的package.json文件中的dependencies字段中`)
        logger.error(logger.red('-----------------------------'))
      } else {
        logger.error(`载入插件错误：${logger.red(`${dir}/${name}`)}`)
        logger.error(error)
      }
      return false
    }
  }

  /** 卸载插件 */
  uninstallApp (dir, name) {
    this.Apps = this.Apps.filter(v => !(v.file.dir === dir && v.file.name === name))
    this.uninstallTask(dir, name)
    button.del(dir, name)
    handler.del({ dir, name })
  }

  /** 创建定时任务 */
  async creatTask () {
    this.task.forEach((val, index) => {
      if (val.schedule) return
      val.log = val.log === false ? () => '' : (log) => logger.mark(log)
      val.schedule = schedule.scheduleJob(val.cron, async () => {
        try {
          val.log(`[定时任务][${val.file.dir}][${val.name}] 开始执行`)
          const App = new val.App()
          let res = App[val.fnc] && App[val.fnc]()
          if (util.types.isPromise(res)) res = await res
          val.log(`[定时任务][${val.file.dir}][${val.name}] 执行完毕`)
        } catch (error) {
          logger.error(`[定时任务][${val.file.dir}][${val.name}] 执行报错`)
          logger.error(error)
        }
      })
      this.task[index] = val
    })
  }

  /** 卸载定时任务 */
  uninstallTask (dir, name) {
    this.task = this.task.filter(task => {
      if (task.file.dir === dir && task.file.name === name) {
        /** 停止定时任务 */
        task.schedule.cancel()
        /** 移除定时任务 */
        return false
      }
      /** 保留定时任务 */
      return true
    })
  }

  /** 监听单个文件热更新 */
  watch (dir, name) {
    if (this.watcher[`${dir}.${name}`]) return

    const file = `./plugins/${dir}/${name}`
    const watcher = chokidar.watch(file)

    /** 监听修改 */
    watcher.on('change', async () => {
      /** 卸载 */
      this.uninstallApp(dir, name)
      /** 载入插件 */
      const res = await this.createdApp(dir, name, true)
      if (!res) return
      logger.mark(`[修改插件][${dir}][${name}]`)
    })

    /** 监听删除 */
    watcher.on('unlink', async () => {
      /** 卸载 */
      this.uninstallApp(dir, name)
      delete this.watcher[`${dir}.${name}`]
      logger.mark(`[卸载插件][${dir}][${name}]`)
    })

    this.watcher[`${dir}.${name}`] = watcher
  }

  /** 监听文件夹更新 */
  watchDir (dir) {
    if (this.watcher[dir]) return

    const file = `${this.dir}/${dir}/`
    const watcher = chokidar.watch(file)

    /** 热更新 */
    setTimeout(() => {
      /** 新增文件 */
      watcher.on('add', async filePath => {
        logger.debug(`[热更新][新增插件] ${filePath}`)
        const name = path.basename(filePath)
        if (!name.endsWith('.js')) return
        if (!fs.existsSync(`${file}/${name}`)) return

        /** 载入插件 */
        const res = await this.createdApp(dir, name, true)
        if (!res) return
        /** 延迟1秒 等待卸载完成 */

        common.sleep(1000)
          .then(() => {
            /** 停止整个文件夹监听 */
            watcher.close()
            /** 新增插件之后重新监听文件夹 */
            delete this.watcher[dir]
            this.watchDir(dir)
            logger.mark(`[新增插件][${dir}][${name}]`)
            return true
          })
          .catch((error) => logger.error(error))
      })

      /** 监听修改 */
      watcher.on('change', async PluPath => {
        const name = path.basename(PluPath)
        if (!name.endsWith('.js')) return
        if (!fs.existsSync(`${this.dir}/${dir}/${name}`)) return

        /** 卸载 */
        this.uninstallApp(dir, name)
        /** 载入插件 */
        const res = await this.createdApp(dir, name, true)
        if (!res) return

        logger.mark(`[修改插件][${dir}][${name}]`)
      })

      /** 监听删除 */
      watcher.on('unlink', async PluPath => {
        const name = path.basename(PluPath)
        if (!name.endsWith('.js')) return

        /** 卸载 */
        this.uninstallApp(dir, name)
        /** 停止监听 */
        watcher.close()
        /** 重新监听文件夹 */
        delete this.watcher[dir]
        this.watchDir(dir)
        logger.mark(`[卸载插件][${dir}][${name}]`)
      })
    }, 500)

    /** 生成随机数0.5-2秒 */
    const random = Math.floor(Math.random() * 1000) + 500
    common.sleep(random)
      .then(() => {
        /** 这里需要检查一下是否已经存在，已经存在就关掉之前的监听 */
        if (this.watcher[dir]) this.watcher[dir].close()
        this.watcher[dir] = watcher
        return true
      })
      .catch(() => { })
  }
}

export default new Loader()
