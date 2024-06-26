import fs from 'fs'
import lodash from 'lodash'
import path from 'path'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
import Renderer from '../renderer/app'
import button from '../utils/button'
import Common from '../utils/common'
import handler from '../utils/handler'
import listener from './listener'
import logger from '../utils/logger'
import Plugin from './plugin'
import { Plugin as PluginType, PluginApps, PluginTask, dirName, fileName, AppInfo } from '../types/plugin'
import PluginApp from './plugin.app'

/**
 * 加载插件
 */
export default new (class PluginLoader {
  dir: './plugins'
  dirPath: string
  /**
   * - 插件列表
   */
  Apps: Array<PluginApps>
  /**
   * - 定时任务
   */
  task: Array<
    PluginTask & {
      App: new () => Plugin
      /**
       * - 定时任务
       */
      schedule?: schedule.Job
      /**
       * - 文件信息
       */
      file: {
        dir: dirName
        name: fileName
      }
    }
  >

  /**
   * - 监听器
   */
  watcher: Map<string, chokidar.FSWatcher>
  /**
   * - 热更新列表
   */
  watchList: Array<{
    dir: dirName
    name?: fileName
  }>

  /**
   * - 插件索引ID
   */
  index: number

  /**
   * - 命令插件索引列表
   */
  rule: Array<number>

  PluginList: {
    [key: string]: PluginApps
  }

  constructor () {
    this.dir = './plugins'
    this.dirPath = Common.urlToPath(import.meta.url)
    this.Apps = []
    this.task = []
    this.watcher = new Map()
    /** 热更新收集 */
    this.watchList = []

    this.rule = []
    this.index = 0
    this.PluginList = {}
  }

  /**
   * 插件初始化
   */
  async load () {
    const files = this.getPlugins()

    listener.once('plugin.loader', () => {
      for (const v of this.watchList) {
        v.name ? this.watch(v.dir, v.name) : this.watchDir(v.dir)
      }
    })

    logger.info(logger.green('-----------'))
    logger.info('加载插件中..')

    /** 载入插件 */
    const promises = files.map(async ({ dir, name }) => await this.createdApp(dir, name, false))

    /** 等待所有插件加载完成 */
    await Promise.all(promises)

    const handlerKeys = Object.keys(handler.events)
    let handlerCount = 0
    handlerKeys.forEach((key) => {
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
    listener.emit('plugin.loader')
    return this
  }

  /**
   * 获取所有插件
   */
  getPlugins () {
    const Apps: Array<AppInfo> = []
    /** 获取所有插件包 */
    const plugins = Common.getPlugins()

    const isTs = process.env.karin_app_lang === 'ts'

    for (const dir of plugins) {
      /**
       * - 插件包路径
       * - 例如: ./plugins/karin-plugin-example
       */
      const PluginPath = `${this.dir}/${dir}`

      // 非插件包
      if (!Common.isPlugin(PluginPath)) {
        const list = fs.readdirSync(`${this.dir}/${dir}`, {
          withFileTypes: true,
        })
        for (const file of list) {
          /** 忽略不符合规则的文件 */
          const ext = isTs ? ['.js', '.ts'] : ['.js']
          if (!ext.includes(path.extname(file.name))) continue
          Apps.push({ dir, name: file.name as fileName })
        }
      }

      /** js环境 */
      if (Common.exists(`${PluginPath}/index.js`)) {
        Apps.push({ dir, name: 'index.js' as fileName })
      }

      const appList = ['apps', 'dist/apps']
      appList.forEach(app => {
        if (Common.isDir(`${PluginPath}/${app}`)) {
          const result = this.getApps((`${dir}/${app}`))
          Apps.push(...result)
        }
      })

      /** ts环境 */
      if (isTs) {
        if (Common.exists(`${PluginPath}/index.ts`)) {
          Apps.push({ dir, name: 'index.ts' as fileName })
        }

        if (Common.isDir(`${PluginPath}/src/apps`)) {
          const result = this.getApps((`${dir}/src/apps`), true)
          Apps.push(...result)
        }
      }
    }

    return Apps
  }

  /**
   * 获取指定文件夹下的所有插件
   * @param dir - 插件包名称
   * @param isTs - 是否获取ts插件
   */
  getApps (dir: dirName, isTs = false) {
    const info: Array<AppInfo> = []
    const ext = isTs ? ['.js', '.ts'] : ['.js']

    const list = fs.readdirSync(`${this.dir}/${dir}`, { withFileTypes: true })

    for (const file of list) {
      // 获取后缀
      const extname = path.extname(file.name)
      if (!ext.includes(extname)) continue
      info.push({ dir, name: file.name as fileName })
    }

    return info
  }

  /**
   * 构建插件信息
   */
  App (
    /**
     * - 插件Class 未实例化
     */
    App: new () => Plugin,
    /**
     * - 插件实例化后的Class
     */
    Class: PluginType,
    /**
     * - 插件文件信息
     */
    file: {
      /**
       * - 插件根目录名称
       * - 例如: karin-plugin-example
       * - 例如: karin-plugin-example/apps
       */
      dir: string
      /**
       * - 插件名称
       * - 例如: index.js
       */
      name: string
      /**
       * - 插件相对路径
       * - 从插件根目录开始
       */
      path: string
    }
  ) {
    const info = {
      App,
      /** 插件文件信息 */
      file,
      name: Class.name,
      desc: Class.dsc || Class.desc || Class.name,
      event: Class.event || 'message',
      priority: Class.priority ?? 5000,
      accept: typeof Class.accept === 'function',
      rule: Class.rule || [],
      type: typeof App === 'function' ? 'function' : ('class' as 'function' | 'class'),
      task: Class.task || [],
      handler: Class.handler || [],
      button: Class.button || [],
    }

    /** 进一步处理rule */
    info.rule.forEach((val, index) => {
      info.rule[index].reg = new RegExp(val.reg)
      info.rule[index].log = val.log === false ? (id: string, log: string) => logger.debug('mark', id, log) : (id: string, log: string) => logger.bot('mark', id, log)
    })

    return info
  }

  /** 排序 */
  orderBy () {
    const list: { key: string, val: number }[] = []
    Object.keys(this.PluginList).forEach(key => {
      list.push({ key, val: this.PluginList[key].priority })
    })
    this.rule = lodash.orderBy(list, ['val'], ['asc']).map((v) => Number(v.key))
    logger.debug('rule排序完成...')
  }

  /**
   * 新增插件
   * @param dir - 插件包路径
   * @param name - 插件名称
   * @param isOrderBy - 是否重新导入
   */
  async createdApp (dir: dirName, name: fileName, isOrderBy = false) {
    try {
      let path = `${this.dirPath}plugins/${dir}/${name}`
      if (isOrderBy) path = path + `?${Date.now()}`
      const tmp: Array<(new () => Plugin) | PluginApps> = await import(path)
      lodash.forEach(tmp, (App) => {
        const index = this.index
        this.index++
        if (typeof App === 'object') {
          if (App?.file?.type !== 'function') return
          if (!App?.name) return logger.error(`[${dir}][${name}] 插件名称错误`)
          App.file.dir = dir
          App.file.name = name
          this.PluginList[index] = App
        }

        if (typeof App !== 'function' || !App?.prototype?.constructor) return

        const Class = new (App as new () => Plugin)()
        if (!Class.name) return logger.error(`[${dir}][${name}] 插件名称错误`)
        logger.debug(`载入插件 [${name}][${Class.name}]`)

        const info = PluginApp({
          file: {
            dir,
            name,
            type: 'class',
            fnc: App,
          },
          name: Class.name,
          event: Class.event,
          priority: Class.priority,
          accept: Class.accept && typeof Class.accept === 'function',
        })

        /** 定时任务 */
        lodash.forEach(Class.task, (val) => {
          if (!val.name) return logger.error(`[${dir}][${name}] 定时任务name错误`)
          if (!val.cron) return logger.error(`[${dir}][${name}] 定时任务cron错误：${Class.name}`)
          info.task.push({
            name: val.name,
            cron: val.cron,
            fnc: val.fnc,
            log: val.log === false ? (log: string) => logger.debug(log) : (log: string) => logger.mark(log),
            schedule: schedule.scheduleJob(val.cron, async () => {
              try {
                typeof val.log === 'function' && val.log(`[定时任务][${dir}][${val.name}] 开始执行`)
                if (typeof val.fnc === 'function') {
                  await val.fnc()
                } else {
                  const cla = new App()
                  await (cla[val.fnc as keyof typeof cla] as Function)()
                }
                typeof val.log === 'function' && val.log(`[定时任务][${dir}][${val.name}] 执行完毕`)
              } catch (error) {
                logger.error(`[定时任务][${dir}][${val.name}] 执行报错`)
                logger.error(error)
              }
            }),
          })
        })

        /** rule */
        lodash.forEach(Class.rule, (val) => {
          if (!val.fnc) return logger.error(`[${dir}][${name}] rule.fnc错误：${Class.name}`)
          info.rule.push({
            reg: val.reg instanceof RegExp ? val.reg : new RegExp(val.reg),
            fnc: val.fnc,
            event: val.event,
            permission: val.permission || 'all',
            log: val.log === false ? (id: string, log: string) => logger.debug('mark', id, log) : (id: string, log: string) => logger.bot('mark', id, log),
          })
        })

        /** 执行初始化 */
        Class.init && Class.init()
        this.PluginList[index] = info

        // const Class = new App()

        /** 注册Handler */
        // if (!lodash.isEmpty(Class.handler)) handler.add({ name, dir, App, Class })

        /** 注册按钮 */
        // if (!lodash.isEmpty(Class.button)) button.add({ name, dir, App, Class })

        /** 收集插件 */
        // const res = this.App(App, Class, { name, dir, path: `${dir}/${name}` })
        // this.Apps.push(res)
        return true
      })

      // rule收集并排序
      if (isOrderBy) this.orderBy()
      return true
    } catch (error: any) {
      if (/Cannot find package '(.+?)'/.exec(error)?.[1]) {
        const pack = /Cannot find package '(.+?)'/.exec(error)?.[1] || ''
        logger.error(logger.red('--------插件载入错误--------'))
        logger.mark(`错误: [${dir}][${name}] 缺少必要的依赖项: ${logger.red(pack)}`)
        logger.mark(`操作：请尝试在命令终端中执行 ${logger.red('pnpm i -P')} 命令安装依赖项`)
        logger.mark('提示：如安装后仍未解决，可选择以下方案')
        logger.mark(`      1.手工安装依赖: ${logger.red('pnpm i ' + pack)}`)
        logger.mark(`      2.联系插件作者：联系插件作者将 ${logger.red(pack)} 依赖项添加至插件的packageon文件中的dependencies字段中`)
        logger.error(logger.red('-----------------------------'))
      } else {
        logger.error(`载入插件错误：${logger.red(`${dir}/${name}`)}`)
        logger.error(error)
      }
      return false
    }
  }

  /**
   * 卸载插件
   */
  uninstallApp (dir: dirName, name: fileName) {
    this.Apps = this.Apps.filter((v) => !(v.file.dir === dir && v.file.name === name))
    this.uninstallTask(dir, name)
    button.del(dir, name)
    handler.del({ dir, name, key: '' })
  }

  /** 创建定时任务 */
  async creatTask () {
    this.task.forEach((val, index) => {
      if (val.schedule) return
      val.log = val.log === false ? (log: string) => logger.debug(log) : (log: string) => logger.mark(log)
      val.schedule = schedule.scheduleJob(val.cron, async () => {
        try {
          typeof val.log === 'function' && val.log(`[定时任务][${val.file.dir}][${val.name}] 开始执行`)
          const App = new val.App()
          await (App[val.fnc as keyof typeof App] as Function)()
          typeof val.log === 'function' && val.log(`[定时任务][${val.file.dir}][${val.name}] 执行完毕`)
        } catch (error) {
          logger.error(`[定时任务][${val.file.dir}][${val.name}] 执行报错`)
          logger.error(error)
        }
      })
      this.task[index] = val
    })
  }

  /**
   * 卸载定时任务
   */
  uninstallTask (dir: dirName, name: fileName) {
    this.task = this.task.filter((task) => {
      if (task.file.dir === dir && task.file.name === name) {
        /** 停止定时任务 */
        task.schedule && task.schedule.cancel()
        /** 移除定时任务 */
        return false
      }
      /** 保留定时任务 */
      return true
    })
  }

  /**
   * 监听单个文件热更新
   */
  watch (dir: dirName, name: fileName) {
    // if (this.watcher.get(`${dir}.${name}`)) return
    // const file = `./plugins/${dir}/${name}`
    // const watcher = chokidar.watch(file)
    // /** 监听修改 */
    // watcher.on('change', async () => {
    //   /** 卸载 */
    //   this.uninstallApp(dir, name)
    //   /** 载入插件 */
    //   const res = await this.createdApp(dir, name, true)
    //   if (!res) return
    //   logger.mark(`[修改插件][${dir}][${name}]`)
    // })
    /** 监听删除 */
    // watcher.on('unlink', async () => {
    //   /** 卸载 */
    //   this.uninstallApp(dir, name)
    //   this.watcher.delete(`${dir}.${name}`)
    //   logger.mark(`[卸载插件][${dir}][${name}]`)
    // })
    // this.watcher.set(`${dir}.${name}`, watcher)
  }

  /**
   * 监听文件夹更新
   */
  watchDir (dir: dirName) {
    // if (dir) return
    //   if (this.watcher.get(dir)) return
    //   const file = `${this.dir}/${dir}/`
    //   const watcher = chokidar.watch(file)
    //   /** 热更新 */
    //   setTimeout(() => {
    //     /** 新增文件 */
    //     watcher.on('add', async filePath => {
    //       logger.debug(`[热更新][新增插件] ${filePath}`)
    //       const name = path.basename(filePath) as fileName
    //       if (!name.endsWith('')) return
    //       if (!fs.existsSync(`${file}/${name}`)) return
    //       /** 载入插件 */
    //       const res = await this.createdApp(dir, name, true)
    //       if (!res) return
    //       /** 延迟1秒 等待卸载完成 */
    //       Common.sleep(1000)
    //         .then(() => {
    //           /** 停止整个文件夹监听 */
    //           watcher.close()
    //           /** 新增插件之后重新监听文件夹 */
    //           this.watcher.delete(dir)
    //           this.watchDir(dir)
    //           logger.mark(`[新增插件][${dir}][${name}]`)
    //           return true
    //         })
    //         .catch(error => logger.error(error))
    //     })
    //     /** 监听修改 */
    //     watcher.on('change', async PluPath => {
    //       const name = path.basename(PluPath) as fileName
    //       if (!name.endsWith('')) return
    //       if (!fs.existsSync(`${this.dir}/${dir}/${name}`)) return
    //       /** 卸载 */
    //       this.uninstallApp(dir, name)
    //       /** 载入插件 */
    //       const res = await this.createdApp(dir, name, true)
    //       if (!res) return
    //       logger.mark(`[修改插件][${dir}][${name}]`)
    //     })
    //     /** 监听删除 */
    //     watcher.on('unlink', async PluPath => {
    //       const name = path.basename(PluPath) as fileName
    //       if (!name.endsWith('')) return
    //       /** 卸载 */
    //       this.uninstallApp(dir, name)
    //       /** 停止监听 */
    //       watcher.close()
    //       /** 重新监听文件夹 */
    //       this.watcher.delete(dir)
    //       this.watchDir(dir)
    //       logger.mark(`[卸载插件][${dir}][${name}]`)
    //     })
    //   }, 500)
    //   /** 生成随机数0.5-2秒 */
    //   const random = Math.floor(Math.random() * 1000) + 500
    //   Common.sleep(random)
    //     .then(() => {
    //       const isExist = this.watcher.get(dir)
    //       /** 这里需要检查一下是否已经存在，已经存在就关掉之前的监听 */
    //       if (isExist) {
    //         isExist.close()
    //         this.watcher.delete(dir)
    //       }
    //       this.watcher.set(dir, watcher)
    //       return true
    //     })
    //     .catch(() => {})
  }
})()
