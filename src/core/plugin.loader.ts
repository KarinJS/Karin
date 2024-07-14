import fs from 'fs'
import path from 'path'
import lodash from 'lodash'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
import { Plugin } from './plugin'
import { listener } from './listener'
import PluginApp from './plugin.app'
import { render } from 'karin/render'
import { common, handler, logger } from 'karin/utils'
import { PluginApps, PluginTask, dirName, fileName, AppInfo, NewMessagePlugin, Permission } from 'karin/types'

class PluginLoader {
  dir: './plugins'
  dirPath: string
  /**
   * - 插件索引ID
   */
  index: number
  /**
   * - 命令插件索引列表
   */
  ruleIds: Array<number>
  /**
   * - 按钮插件索引列表
   */
  buttonIds: Array<number>
  /**
   * - accept插件索引列表
   */
  acceptIds: Array<number>
  /**
   * - handler
   */
  handlerIds: { [key: string]: Array<{ index: string, fnc: string | Function, priority: number }> }
  /**
   * - 插件列表
   */
  FileList: Array<AppInfo>
  /**
   * - 是否ts环境
   */
  isTs: boolean
  /**
   * - 是否开发环境
   */
  isDev: boolean
  /**
   * - 最终缓存的插件列表 通过index索引
   */
  PluginList: { [key: string]: PluginApps }
  /**
   * - 定时任务
   */
  task: Array<PluginTask & { App: NewMessagePlugin, schedule?: schedule.Job, file: { dir: dirName, name: fileName } }>

  /**
   * - 监听器
   */
  watcher: Map<string, chokidar.FSWatcher>
  /**
   * - 热更新列表
   */
  watchList: Array<{ dir: dirName, name?: fileName }>

  /**
   * - 所有插件包package.json
   */
  pkgJson: { [key: string]: any }

  constructor () {
    this.index = 0
    this.dir = './plugins'
    this.dirPath = common.urlToPath(import.meta.url)
    this.isTs = process.env.karin_app_lang === 'ts'
    this.isDev = process.env.karin_app_mode === 'dev'
    this.watcher = new Map()
    this.watchList = []
    this.FileList = []
    this.PluginList = {}
    this.task = []
    this.ruleIds = []
    this.acceptIds = []
    this.buttonIds = []
    this.handlerIds = {}
    this.pkgJson = {}
  }

  /**
   * 插件初始化
   */
  async load () {
    await this.getPlugins()
    listener.once('plugin.watch', () => {
      for (const v of this.watchList) {
        v.name ? this.watch(v.dir, v.name) : this.watchDir(v.dir)
        logger.debug(`[热更新][${v.dir}]${v.name ? `[${v.name}]` : ''} 监听中...`)
      }
    })

    logger.info(logger.green('-----------'))
    logger.info('加载插件中..')

    /** 载入插件 */
    const promises = this.FileList.map(async ({ dir, name }) => await this.createdApp(dir, name, false))
    /** 获取npm插件 */
    const npm = await common.getNpmPlugins(true)
    /** 载入npm插件 */
    promises.push(...npm.map(async ({ dir, name }) => await this.createdApp(dir, name, false, true)))

    /** 等待所有插件加载完成 */
    await Promise.all(promises)
    /** 释放缓存 */
    this.FileList = []

    /** 优先级排序并打印插件信息 */
    this.orderBy(true)
    listener.emit('plugin.watch')
    return this
  }

  /**
   * 获取所有插件
   */
  async getPlugins () {
    /** 获取所有插件包 */
    const plugins = common.getPlugins()

    for (const dir of plugins) {
      /**
       * - 插件包路径
       * - 例如: ./plugins/karin-plugin-example
       */
      const PluginPath = `${this.dir}/${dir}`

      /**
       * 一共3种模式
       * 1. npm run dev 开发模式  直接加载ts，js文件，对于同时存在编译产物、源代码的情况，优先加载编译产物而不加载源代码
       * 2. node . 生产模式  只加载js文件
       * 3. npm run debug 调试模式 利用tsx自身的热更新机制，重启karin
       */

      /** 非插件包 加载该文件夹下全部js 视语言环境加载ts */
      if (!common.isPlugin(PluginPath)) {
        this.getApps(dir, this.isTs, true)
        continue
      }

      /** package */
      const pkg = common.readJson(`${PluginPath}/package.json`)

      /** 缓存package.json */
      this.pkgJson[dir] = pkg

      /** 入口文件 */
      if (pkg.main) {
        const { dir: dirName, pop } = common.splitPath(pkg.main)
        const dirPath = `${dir}/${dirName}` as dirName
        if (common.exists(`${this.dir}/${dirPath}/${pop}`)) {
          this.FileList.push({ dir: dirPath, name: pop as fileName })
          this.isDev && this.watchList.push({ dir: dirPath, name: pop as fileName })
        } else {
          logger.debug(`[插件收集][${pkg.main}] 入口文件不存在，已忽略`)
        }
      } else {
        /** 没有配置入口默认为index.js */
        if (common.exists(`${PluginPath}/index.js`)) {
          this.FileList.push({ dir, name: 'index.js' })
          this.isDev && this.watchList.push({ dir, name: 'index.js' })
        }
      }

      /** 全部apps路径 */
      const apps = ['apps']
      if (pkg?.karin?.apps && Array.isArray(pkg.karin.apps)) apps.push(...pkg.karin.apps)

      /** js环境 或 ts环境、js插件 */
      if (!this.isTs || !common.exists(`${PluginPath}/tsconfig.json`)) {
        apps.forEach((apps: string) => {
          /** 路径存在才加载 */
          if (common.isDir(`${PluginPath}/${apps}`)) {
            this.getApps((`${dir}/${apps}`), false, this.isDev)
          } else {
            logger.debug(`[插件收集][${dir}/${apps}] 路径不存在，已忽略`)
          }
        })
        continue
      }

      /** ts环境 ts插件 */
      const outDir = pkg?.karin?.outDir || 'lib'
      const rootDir = pkg?.karin?.rootDir || 'src'

      /** 编译产物存在 */
      if (common.exists(`${PluginPath}/${outDir}/apps`)) {
        this.getApps((`${dir}/${outDir}/apps`), true, this.isDev)
        continue
      } else {
        /** 入口文件 */
        if (common.exists(`${PluginPath}/${rootDir}/index.ts`)) {
          this.FileList.push({ dir, name: 'index.ts' })
          this.isDev && this.watchList.push({ dir, name: 'index.ts' })
          continue
        }

        /** ts源码 */
        if (common.exists(`${PluginPath}/${rootDir}/apps`)) {
          this.getApps((`${dir}/${rootDir}/apps`), true, this.isDev)
          continue
        }
      }
    }

    return plugins
  }

  /**
   * 获取指定文件夹下的所有插件
   * @param dir - 插件包名称
   * @param isTs - 是否获取ts插件
   */
  getApps (dir: dirName, isTs: boolean, isWatch = false) {
    isWatch && this.watchList.push({ dir })
    const ext = isTs ? ['.js', '.ts'] : ['.js']
    const list = fs.readdirSync(`${this.dir}/${dir}`, { withFileTypes: true })

    for (const file of list) {
      const extname = path.extname(file.name)
      if (!ext.includes(extname)) continue
      this.FileList.push({ dir, name: file.name as fileName })
    }
  }

  /**
   * 排序并打印插件加兹安信息
   * @param isPrint - 是否打印
   */
  orderBy (isPrint = false) {
    let taskCount = 0
    let handlerCount = 0

    const rule: { key: string, val: number }[] = []
    const button: { key: string, val: number }[] = []
    const accept: { key: string, val: number }[] = []
    Object.keys(this.PluginList).forEach(key => {
      taskCount += this.PluginList[key].task.length
      if (this.PluginList[key].rule.length) rule.push({ key, val: this.PluginList[key].priority })
      if (this.PluginList[key].button.length) button.push({ key, val: this.PluginList[key].priority })
      if (this.PluginList[key].accept) accept.push({ key, val: this.PluginList[key].priority })
    })

    this.ruleIds = lodash.orderBy(rule, ['val'], ['asc']).map((v) => Number(v.key))
    logger.debug('rule排序完成...')
    this.buttonIds = lodash.orderBy(button, ['val'], ['asc']).map((v) => Number(v.key))
    logger.debug('button排序完成...')
    this.acceptIds = lodash.orderBy(accept, ['val'], ['asc']).map((v) => Number(v.key))

    if (!isPrint) return
    const PluginListKeys = Object.keys(this.PluginList)
    const handlerKeys = Object.keys(this.handlerIds)

    handlerKeys.forEach((key) => {
      handlerCount += this.handlerIds[key].length
    })

    logger.info(`[插件][${PluginListKeys.length}个] 加载完成`)
    logger.info(`[渲染器][${render.Apps.length}个] 加载完成`)
    logger.info(`[rule][${this.ruleIds.length}个] 加载完成`)
    logger.info(`[button][${this.buttonIds.length}个] 加载完成`)
    logger.info(`[accept][${this.acceptIds.length}个] 加载完成`)
    logger.info(`[定时任务][${taskCount}个] 加载完成`)
    logger.info(`[Handler][Key:${handlerKeys.length}个][fnc:${handlerCount}个] 加载完成`)
    logger.info(logger.green('-----------'))
    logger.info(`Karin启动完成：耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
  }

  /**
   * 新增插件
   * @param dir - 插件包路径
   * @param name - 插件名称
   * @param isOrderBy - 是否为动态导入 默认为静态导入
   * @param isNpm - 是否为npm包
   */
  async createdApp (dir: dirName, name: fileName, isOrderBy = false, isNpm = false) {
    try {
      const list: Promise<any>[] = []
      let path = `${this.dirPath}${isNpm ? 'node_modules' : 'plugins'}/${dir}/${name}`
      if (isOrderBy) path = path + `?${Date.now()}`

      const tmp: Array<(NewMessagePlugin) | PluginApps> = await import(path)

      lodash.forEach(tmp, (App) => {
        const index = this.index
        this.index++
        if (typeof App === 'object' && App?.file?.type === 'function') {
          if (!App?.name) {
            logger.error(`[${dir}][${name}] 插件名称错误`)
            return false
          }

          App.file.dir = dir
          App.file.name = name

          App.rule.forEach((v, index) => {
            App.rule[index].log = v.log === false ? (id: string, log: string) => logger.bot('debug', id, log) : (id: string, log: string) => logger.bot('mark', id, log)
          })

          /** handler */
          App.task = this.addTaskFnc(dir, App)
          this.PluginList[index] = App
          handler.add(index + '', App)
          if (App.accept) this.acceptIds.push(index)
          return true
        }

        if (typeof App !== 'function' || !App?.prototype?.constructor) return false

        const Class = new (App as NewMessagePlugin)()
        if (!Class.name) {
          logger.error(`[${dir}][${name}] 插件名称错误`)
          return false
        }

        logger.debug(`载入插件 [${name}][${Class.name}]`)

        this.PluginList[index] = PluginApp({
          file: { dir, name, type: 'class', fnc: App },
          name: Class.name,
          event: Class.event,
          priority: Class.priority,
          accept: false,
        })

        /** 异步收集 加载速度 */
        list.push(this.addRule(dir, name, index, Class))
        list.push(this.addTask(dir, name, index, Class, App))
        list.push(this.addAccept(index, Class))
        list.push(this.addButton(dir, name, index, Class))
        list.push(this.addInit(Class))
        return true
      })

      await Promise.all(list)
      /** 建立对应的规则索引并排序 */
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
   * 新增rule
   */
  async addRule (dir: dirName, name: fileName, index: number, Class: Plugin) {
    lodash.forEach(Class.rule, val => {
      if (!val.fnc) return logger.error(`[${dir}][${name}] rule.fnc错误：${Class.name}`)
      this.PluginList[index].rule.push({
        reg: val.reg instanceof RegExp ? val.reg : new RegExp(val.reg),
        fnc: val.fnc,
        event: val.event,
        permission: val.permission || Permission.All,
        log: val.log === false ? (id: string, log: string) => logger.debug('mark', id, log) : (id: string, log: string) => logger.bot('mark', id, log),
      })
    })
  }

  /**
   * 新增task fnc模式
   */
  addTaskFnc (dir: dirName, App: PluginApps) {
    const task: PluginTask[] = []
    lodash.forEach(App.task, val => {
      task.push({
        name: val.name,
        cron: val.cron,
        fnc: val.fnc,
        log: val.log === false ? (log: string) => logger.debug(log) : (log: string) => logger.mark(log),
        schedule: schedule.scheduleJob(val.cron, async () => {
          try {
            typeof val.log === 'function' && val.log(`[定时任务][${dir}][${val.name}] 开始执行`)
            if (typeof val.fnc === 'function') await val.fnc()
            typeof val.log === 'function' && val.log(`[定时任务][${dir}][${val.name}] 执行完毕`)
          } catch (error) {
            logger.error(`[定时任务][${dir}][${val.name}] 执行报错`)
            logger.error(error)
          }
        }),
      })
      return true
    })
    return task
  }

  /**
   * 新增task
   */
  async addTask (dir: dirName, name: fileName, index: number, Class: Plugin, App: NewMessagePlugin) {
    /** 定时任务 */
    lodash.forEach(Class.task, val => {
      if (!val.name) return logger.error(`[${dir}][${name}] 定时任务name错误`)
      if (!val.cron) return logger.error(`[${dir}][${name}] 定时任务cron错误：${Class.name}`)
      this.PluginList[index].task.push({
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
  }

  /**
   * 新增accept、handler
   */
  async addAccept (index: number, Class: Plugin) {
    if ('accept' in Class && typeof Class.accept === 'function') {
      this.PluginList[index].accept = true
      this.acceptIds.push(index)
    }
    await handler.add(index + '', Class)
  }

  /**
   * 新增button
   */
  async addButton (dir: dirName, name: fileName, index: number, Class: Plugin) {
    lodash.forEach(Class.button, val => {
      if (!val.fnc) return logger.error(`[${dir}][${name}] button.fnc错误：${Class.name}`)
      this.PluginList[index].button.push({
        reg: val.reg instanceof RegExp ? val.reg : new RegExp(val.reg),
        fnc: val.fnc,
      })
    })
  }

  /**
   * 执行初始化
   */
  async addInit (Class: Plugin) {
    'init' in Class && typeof Class.init === 'function' && await Class.init()
  }

  /**
   * 卸载插件
   */
  uninstallApp (dir: dirName, name: fileName) {
    const index: string[] = []
    Object.keys(this.PluginList).forEach(key => {
      const info = this.PluginList[key]
      /** 停止定时任务 */
      info.task.forEach(val => val.schedule?.cancel())
      if (info.file.dir === dir && info.file.name === name) {
        index.push(key)
        delete this.PluginList[key]
      }
    })

    /** 删除handler */
    index.forEach(key => handler.del(key))

    /** 重新排序 */
    this.orderBy()
  }

  /**
   * 监听单个文件热更新
   */
  watch (dir: dirName, name: fileName) {
    if (this.watcher.get(`${dir}.${name}`)) return
    const file = `./plugins/${dir}/${name}`
    const watcher = chokidar.watch(file)

    /** 监听修改 */
    watcher.on('change', async () => {
      /** 卸载 */
      this.uninstallApp(dir, name)
      /** 载入插件 */
      await this.createdApp(dir, name, true)
      logger.mark(`[修改插件][${dir}][${name}]`)
    })
    /** 监听删除 */
    watcher.on('unlink', async () => {
      /** 卸载 */
      this.uninstallApp(dir, name)
      this.watcher.delete(`${dir}.${name}`)
      logger.mark(`[卸载插件][${dir}][${name}]`)
      /** 卸载之后停止监听 */
      watcher.close()
    })
    this.watcher.set(`${dir}.${name}`, watcher)
  }

  /**
   * 监听文件夹更新
   */
  async watchDir (dir: dirName) {
    if (this.watcher.get(dir)) return
    const file = `${this.dir}/${dir}/`
    const watcher = chokidar.watch(file)

    await common.sleep(1000)

    watcher.on('add', async _path => {
      /** 排除掉不符合规则文件新增 */
      const ext = this.isTs ? ['.js', '.ts'] : ['.js']
      if (!ext.some(ext => _path.endsWith(ext))) return
      const name = path.basename(_path) as fileName
      await this.createdApp(dir, name, true)
      logger.mark(`[新增插件][${dir}][${name}]`)
      return true
    })

    watcher.on('change', async _path => {
      /** 排除掉不符合规则文件新增 */
      const ext = this.isTs ? ['.js', '.ts'] : ['.js']
      if (!ext.some(ext => _path.endsWith(ext))) return
      const name = path.basename(_path) as fileName
      /** 卸载 */
      this.uninstallApp(dir, name)
      /** 载入插件 */
      await this.createdApp(dir, name, true)
      logger.mark(`[修改插件][${dir}][${name}]`)
      return true
    })

    watcher.on('unlink', async _path => {
      /** 排除掉不符合规则文件新增 */
      const ext = this.isTs ? ['.js', '.ts'] : ['.js']
      if (!ext.some(ext => _path.endsWith(ext))) return
      const name = path.basename(_path) as fileName
      /** 卸载 */
      this.uninstallApp(dir, name)
      logger.mark(`[卸载插件][${dir}][${name}]`)
      return true
    })

    /** 这里需要检查一下是否已经存在，已经存在就关掉之前的监听 */
    const isExist = this.watcher.get(dir)
    if (isExist) {
      isExist.close()
      this.watcher.delete(dir)
    }
    this.watcher.set(dir, watcher)
    return true
  }
}

/**
 * 加载插件
 */
export const pluginLoader = new PluginLoader()
