import fs from 'fs'
import path from 'path'
import lodash from 'lodash'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
import { listener } from '../listener/listener'
import { render } from 'karin/render'
import { common, logger } from 'karin/utils'
import {
  UseInfo,
  AppsType,
  TaskInfo,
  ButtonInfo,
  AcceptInfo,
  CommandInfo,
  HandlerInfo,
  Permission,
  PluginInfoType,
  NewMessagePlugin,
  PluginTaskInfoType,
  PluginButtonInfoType,
  PluginAcceptInfoType,
  PluginHandlerInfoType,
  PluginCommandInfoType,
  PluginMiddlewareInfoType,
} from 'karin/types'

type AppType = CommandInfo | TaskInfo | HandlerInfo | ButtonInfo | AcceptInfo | UseInfo
export interface AppFile {
  /** 插件包名称 */
  plugin: string,
  /** 插件apps相对路径 */
  path: string,
  /** 插件文件名称 */
  file: string,
  /** 插件类型 */
  type: `${AppsType}`,
  /** 热更新 */
  isWatch: boolean
}

class PluginLoader {
  dir: './plugins'
  /**
   * - 插件索引ID
   */
  index: number
  /**
   * - 定时任务
   */
  // task: Array<PluginTask & { App: NewMessagePlugin, schedule?: schedule.Job, file: { dir: dirName, name: fileName } }>

  /**
   * - 监听器
   */
  watcher: Map<string, chokidar.FSWatcher>
  /**
   * - 热更新列表
   */
  watchList: Array<{ plugin: string, path: string }>

  /**
   * - 依赖缺失收集
   */
  dependErr: {
    [key: string]: {
      plugin: string
      path: string
      file: string
      depend: string
    }
  }

  /** accept */
  accept: PluginAcceptInfoType[]
  /** button */
  button: PluginButtonInfoType[]
  /** command规则集信息 */
  command: PluginCommandInfoType[]
  /** handler */
  handler: { [key: string]: PluginHandlerInfoType[] }

  /** plugin基本信息 */
  plugin: Map<number, PluginInfoType>
  /** task定时任务信息 */
  task: PluginTaskInfoType[]
  /** 中间件 */
  use: PluginMiddlewareInfoType
  /** 加载的文件数组 .js .ts */
  ext: string[]

  constructor () {
    this.accept = []
    this.button = []
    this.command = []
    this.handler = {}
    this.plugin = new Map()
    this.task = []
    this.use = {
      recvMsg: [],
      replyMsg: [],
      sendMsg: [],
    }

    this.ext = process.env.karin_app_lang === 'ts' ? ['.js', '.ts'] : ['.js']

    this.index = 0
    this.dir = './plugins'
    this.watcher = new Map()
    this.watchList = []
    this.dependErr = {}
  }

  /**
   * 插件初始化
   */
  async load () {
    listener.once('plugin.watch', () => {
      this.watchList.forEach(async ({ plugin, path }) => {
        await this.watchDir(plugin, path)
        logger.debug(`[热更新][${plugin}][${path}] 监听中...`)
      })
      this.watchList = []
    })

    logger.info(logger.green('-----------'))
    logger.info('加载插件中...')

    const list: Promise<boolean>[] = []
    list.push(...await this.getGitPlugin())
    list.push(...await this.getNpmPlugin())
    await Promise.all(list)

    /** 打印依赖缺失 */
    this.printDependErr()

    /** 优先级排序并打印插件信息 */
    this.orderBy(true)
    listener.emit('plugin.watch')
    return this
  }

  /**
   * 获取Git插件
   */
  async getGitPlugin () {
    /** 获取所有插件包 */
    const plugins = common.getPlugins()

    const list: Promise<boolean>[] = []

    for (const dir of plugins) {
      /** 插件包路径 例如: ./plugins/karin-plugin-example */
      const root = `${this.dir}/${dir}`

      /** 非插件包 加载该文件夹下全部js 视语言环境加载ts */
      if (!common.isPlugin(root)) {
        /** 热更新 */
        this.watchList.push({ plugin: dir, path: '' })
        list.push(...this.loadApps(dir, '', `${AppsType.Js}`))
        continue
      }

      /** package */
      const pkg = common.readJson(`${root}/package.json`)

      this.loadMain(root, pkg.main, false)

      /**
       * 插件加载优先级:
       * 1. ts环境: 按照 编译产物 > TS源代码 举例: 优先级高的不存在才会加载下一个。
       * 2. js环境: 按照 pkg.apps 进行加载。 当前版本兼容apps，apps处于根目录并且没有在pkg.apps中填写会自动加载，后续废弃。
       *
       * 注: ts编译产物的路径也是根据pkg.apps进行加载的。
       *
       * 开发环境说明:
       * 1. ts环境默认为开发模式
       * 2. 在开发环境下 会对所有 `.js`，`.ts` 文件进行热更新 只需要点下保存即可。
       * 3. 监察者模式当前暂未适配 待后续适配。
       */

      /** ts环境 */
      if (process.env.karin_app_lang === 'ts') {
        /** 加载ts入口 */
        if (pkg?.karin?.main) this.loadMain(root, pkg.karin.main, false)

        /** 获取apps */
        const apps: string[] = pkg?.karin?.apps && Array.isArray(pkg.karin.apps) ? pkg.karin.apps : []
        /** apps为空则跳过 */
        if (!apps.length) continue
        const { outDir, rootDir } = await this.getTsMain(root, pkg)

        /** 先瞅瞅编译产物根目录是否存在 */
        if (common.exists(path.join(root, outDir))) {
          for (const file of apps) {
            const rootApps = path.join(root, outDir, file)
            if (!common.exists(rootApps)) {
              logger.debug(`[插件收集][${rootApps}] 路径不存在，已忽略`)
              continue
            }

            const _path = path.join(outDir, file)

            /** 热更新 */
            this.watchList.push({ plugin: dir, path: _path })
            list.push(...this.loadApps(dir, _path, `${AppsType.Git}`))
          }
          continue
        }

        /** 源码根目录 */
        if (common.exists(path.join(root, rootDir))) {
          for (const file of apps) {
            const rootApps = path.join(root, rootDir, file)
            if (!common.exists(rootApps)) {
              logger.debug(`[插件收集][${rootApps}] 路径不存在，已忽略`)
              continue
            }

            const _path = path.join(rootDir, file)

            /** 热更新 */
            this.watchList.push({ plugin: dir, path: _path })
            list.push(...this.loadApps(dir, _path, `${AppsType.Git}`))
          }
          continue
        }

        /** 走到这说明有问题 打印错误信息 */
        logger.error(`[插件收集][${dir}] 加载错误，未检测到任何文件，请检查配置是否正确`)
        continue
      }

      /** 全部apps路径 */
      const apps: string[] = pkg?.karin?.apps && Array.isArray(pkg.karin.apps) ? pkg.karin.apps : []
      /** 暂时兼容旧版本 加入apps 计划在正式版本发布之前废弃 */
      if (!apps.includes('apps')) apps.push('apps')

      for (const file of apps) {
        const rootApps = path.join(root, file)
        if (!common.exists(rootApps)) {
          logger.debug(`[插件收集][${rootApps}] 路径不存在，已忽略`)
          continue
        }

        const dev = process.env.karin_app_mode === 'dev'
        if (dev) {
          /** 热更新 */
          this.watchList.push({ plugin: dir, path: file })
        }
        list.push(...this.loadApps(dir, file, `${AppsType.Git}`))
      }
    }

    return list
  }

  /**
   * 获取Npm插件
   */
  async getNpmPlugin () {
    const list: Promise<boolean>[] = []
    const info = await common.getNpmPlugins(true)
    for (const { plugin, path: _path, file, isMain } of info) {
      if (isMain) {
        const root = path.join(process.cwd(), 'node_modules', plugin, _path)
        this.loadMain(root, file, true)
        continue
      }

      list.push(this.createdApp(plugin, _path, file, `${AppsType.Npm}`))
    }
    return list
  }

  /**
   * 加载入口文件 只加载
   * @param root - 插件根目录
   * @param main - 入口文件
   * @param isNpm - 是否为npm插件
   */
  async loadMain (root: string, main: string, isNpm: boolean) {
    const _path = path.resolve(root, main || '')
    if (!common.exists(_path) || !main) {
      if (isNpm) return false
      const defRoot = path.resolve(root, 'index.js')
      if (common.exists(defRoot)) {
        await import(`file://${defRoot}`)
        return true
      }

      logger.debug(`[插件收集][${main}] 入口文件不存在，已忽略`)
      return false
    }

    await import(`file://${_path}`)
    return true
  }

  /**
   * 获取ts插件入口 编译入口路径
   * @param root - 插件根目录
   * @param pkg - package.json
   */
  async getTsMain (root: string, pkg: any): Promise<{
    /** 编译产物入口 */
    outDir: string,
    /** ts源码入口 */
    rootDir: string
  }> {
    let outDir = 'dist'
    let rootDir = 'src'

    /** 先尝试解析tsconfig.json来进行读取 */
    try {
      const tsconfig = common.readJson(`${root}/tsconfig.json`)
      if (tsconfig?.compilerOptions?.outDir) outDir = tsconfig.compilerOptions.outDir
      if (tsconfig?.compilerOptions?.rootDir) rootDir = tsconfig.compilerOptions.rootDir
    } catch (error: any) {
      logger.error(`[插件收集][${root}] tsconfig.json解析错误，请检查格式`)
      logger.error(error)
      /** 如果报错 则读取pkg的 */
      if (pkg?.karin?.outDir) outDir = pkg.karin.outDir
      if (pkg?.karin?.rootDir) rootDir = pkg.karin.rootDir
    }
    return { outDir, rootDir }
  }

  /**
   * 加载指定文件夹下的所有插件
   * @param plugin - 插件名称
   * @param _path - 插件apps相对路径
   * @param file - 插件文件名称
   * @param isNpm - 是否为npm插件
   * @param isWatch - 是否监听热更新
   */
  loadApps (plugin: string, _path: string, type: `${AppsType}`) {
    const list: Promise<boolean>[] = []
    const root = type === 'npm' ? path.join(process.cwd(), 'node_modules', plugin, _path) : path.join(this.dir, plugin, _path)
    const files = fs.readdirSync(root, { withFileTypes: true })

    for (const file of files) {
      const extname = path.extname(file.name)
      if (!this.ext.includes(extname)) continue
      list.push(this.createdApp(plugin, _path, file.name, type))
    }

    return list
  }

  /**
   * 排序并打印插件信息
   * @param isPrint - 是否打印
   */
  orderBy (isPrint = false) {
    let handlerCount = 0

    this.accept = lodash.orderBy(this.accept, ['rank'], ['asc'])
    this.button = lodash.orderBy(this.button, ['rank'], ['asc'])
    this.command = lodash.orderBy(this.command, ['rank'], ['asc'])
    this.task = lodash.orderBy(this.task, ['rank'], ['asc'])
    this.use.recvMsg = lodash.orderBy(this.use.recvMsg, ['rank'], ['asc'])
    this.use.replyMsg = lodash.orderBy(this.use.replyMsg, ['rank'], ['asc'])
    this.use.sendMsg = lodash.orderBy(this.use.sendMsg, ['rank'], ['asc'])

    const handler = Object.keys(this.handler)
    handler.forEach(key => {
      this.handler[key] = lodash.orderBy(this.handler[key], ['rank'], ['asc'])
      handlerCount += this.handler[key].length
    })

    if (!isPrint) return

    logger.info(`[插件][${Object.keys(this.plugin).length}个] 加载完成`)
    logger.info(`[渲染器][${render.Apps.length}个] 加载完成`)
    logger.info(`[command][${this.command.length}个] 加载完成`)
    logger.info(`[button][${this.button.length}个] 加载完成`)
    logger.info(`[accept][${this.accept.length}个] 加载完成`)
    logger.info(`[定时任务][${this.task.length}个] 加载完成`)
    logger.info(`[Handler][Key:${handler.length}个][fnc:${handlerCount}个] 加载完成`)
    logger.info(logger.green('-----------'))
    logger.info(`Karin启动完成：耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
  }

  /**
   * 新增插件
   * @param plugin - 插件名称 例如: karin-plugin-example
   * @param _path - 插件路径 例如: lib/apps 不存在则传空字符串
   * @param file - 插件文件 例如: index.js ts目前解释器支持不够，暂不支持ts
   * @param type - 插件类型 默认为git
   * @param isOrderBy - 是否排序 开启会使用动态导入
   */
  async createdApp (plugin: string, _path: string, file: string, type: `${AppsType}` = 'git', isOrderBy = false) {
    try {
      const index = ++this.index
      /** 缓存基本信息 */
      this.plugin.set(index, { type, plugin, path: _path, file })

      const list: any[] = []
      let rootPath = 'file://' + path.join(process.cwd(), type === 'npm' ? 'node_modules' : 'plugins', plugin, _path, file)
      if (isOrderBy) rootPath = rootPath + `?${Date.now()}`

      const tmp: Array<NewMessagePlugin | AppType> = await import(rootPath)

      lodash.forEach(tmp, (Fn) => {
        /** 函数语法糖 */
        if (typeof Fn === 'object' && Fn?.type) {
          logger.debug(`载入插件 [${plugin}]${_path ? `${common.getRelPath(_path)}` : ''}[${file}][${Fn.name}]`)
          list.push(this.cachePlugin(index, plugin, file, Fn))
          return true
        }

        if (typeof Fn !== 'function' || !Fn?.prototype?.constructor) return false

        const Class = new Fn()
        if (!Class.name) {
          logger.error(`[${plugin}]${_path ? `${common.getRelPath(_path)}` : ''}[${file}] 插件名称错误`)
          return false
        }

        logger.debug(`载入插件 [${plugin}]${_path ? `${common.getRelPath(_path)}` : ''}[${file}][${Class.name}]`)

        if (Class.rule.length) {
          for (const val of Class.rule) {
            const fnc = async () => {
              const log = val.log === false
                ? (id: string, log: string) => logger.debug('mark', id, log)
                : (id: string, log: string) => logger.bot('mark', id, log)

              const fn = typeof val.fnc === 'function' ? val.fnc : Class[val.fnc as keyof typeof Class] as any

              return this.cachePlugin(
                index,
                plugin,
                file,
                {
                  name: Class.name,
                  type: 'command',
                  fn,
                  fnname: typeof val.fnc === 'function' ? val.fnc.name || 'fnc' : val.fnc,
                  data: Fn,
                  event: val.event || Class.event || 'message',
                  log,
                  perm: val.permission || Permission.All,
                  rank: val.priority || Class.priority || 10000,
                  reg: val.reg instanceof RegExp ? val.reg : new RegExp(val.reg),
                },
                Fn
              )
            }
            list.push(fnc())
          }
        }

        if (Class.task.length) {
          for (const val of Class.task) {
            const fnc = async () => {
              if (!val.name) throw TypeError(`[${plugin}][${file}] 定时任务name错误`)
              if (!val.cron) throw TypeError(`[${plugin}][${file}] 定时任务cron错误：${Class.name}`)
              const log = val.log === false ? (log: string) => logger.debug(log) : (log: string) => logger.mark(log)

              return this.cachePlugin(
                index,
                plugin,
                file,
                {
                  name: Class.name,
                  fnname: val.name,
                  type: 'task',
                  fn: typeof val.fnc === 'function' ? val.fnc : Class[val.fnc as keyof typeof Class] as any,
                  log,
                  cron: val.cron,
                },
                Fn
              )
            }
            list.push(fnc())
          }
        }

        /** init */
        list.push('init' in Class && typeof Class.init === 'function' ? Class.init() : Promise.resolve())
        return true
      })

      await Promise.all(list)
      /** 建立对应的规则索引并排序 */
      if (isOrderBy) this.orderBy()
      return true
    } catch (error: any) {
      if (/Cannot find package '(.+?)'/.exec(error)?.[1]) {
        const key = `${plugin}.${_path}.${file}`
        if (this.dependErr[key]) return false
        this.dependErr[key] = {
          plugin,
          path: _path,
          file,
          depend: /Cannot find package '(.+?)'/.exec(error)?.[1] || '',
        }
      } else {
        logger.error(`载入插件错误：${logger.red(`${plugin}/${_path}/${file}`)}`)
        logger.error(error)
      }
      return false
    }
  }

  /**
   * 缓存插件
   * @param index - 插件索引
   */
  async cachePlugin (index: number, plugin: string, file: string, info: AppType, App?: any) {
    if (!info?.name) {
      logger.error(`[${plugin}][${file}][${info.name}] 插件名称错误`)
      return false
    }

    switch (info.type) {
      case 'accept': {
        this.accept.push({
          name: info.name,
          event: info.event,
          fn: info.fn,
          key: index,
          log: info.log,
          rank: info.rank,
        })
        return true
      }
      case 'button': {
        this.button.push({
          name: info.name,
          reg: info.reg,
          fn: info.fn as any,
          key: index,
          rank: info.rank,
        })
        return true
      }
      case 'handler': {
        if (!this.handler[info.key]) this.handler[info.key] = []
        this.handler[info.key].push({
          name: info.name,
          fn: info.fn as any,
          key: index,
          rank: info.rank,
        })
        return true
      }
      case 'command': {
        this.command.push({
          name: info.name,
          data: App,
          event: info.event,
          fn: info.fn,
          fnname: info.fnname,
          key: index,
          log: info.log,
          perm: info.perm,
          rank: info.rank,
          reg: info.reg,
          type: App ? 'class' : 'function',
        })
        return true
      }
      case 'task': {
        this.task.push({
          name: info.name,
          cron: info.cron,
          fn: info.fn,
          key: index,
          taskname: info.fnname,
          data: App,
          log: info.log,
          schedule: schedule.scheduleJob(info.cron, async () => {
            try {
              info.log(`[定时任务][${plugin}][${info.fnname}] 开始执行`)
              if (App) {
                const app = new App()
                await info.fn.call(app)
              } else {
                await info.fn()
              }
              info.log(`[定时任务][${plugin}][${info.fnname}] 执行完毕`)
            } catch (error) {
              logger.error(`[定时任务][${plugin}][${info.fnname}] 执行报错`)
              logger.error(error)
            }
          }),
        })
        return true
      }
      case 'use': {
        this.use[info.key].push({
          name: info.name,
          fn: info.fn as any,
          key: index,
          rank: info.rank,
        })
        return true
      }
    }
  }

  /**
   * 打印依赖缺失
   */
  printDependErr () {
    try {
      const keys = Object.keys(this.dependErr)
      if (!keys.length) return

      const msg = ['-----依赖缺失----']

      keys.forEach(key => {
        const { plugin, path, file, depend } = this.dependErr[key]
        msg.push(`[${plugin}]${path ? `[${path}]` : ''}[${file}] 缺少依赖：${logger.red(depend)}`)
      })

      msg.push('-------------------')
      logger.error(msg.join('\n'))
    } finally {
      /** 回收缓存 */
      this.dependErr = {}
    }
  }

  /**
   * 卸载插件
   */
  uninstallApp (plugin: string, _path: string, file: string) {
    this.plugin.forEach((info, key) => {
      if (info.plugin === plugin && info.path === _path && info.file === file) {
        /** 删除缓存 */
        this.plugin.delete(key)
        this.accept = this.accept.filter(val => val.key !== key)
        this.button = this.button.filter(val => val.key !== key)
        this.command = this.command.filter(val => val.key !== key)
        this.use.recvMsg = this.use.recvMsg.filter(val => val.key !== key)
        this.use.replyMsg = this.use.replyMsg.filter(val => val.key !== key)
        this.use.sendMsg = this.use.sendMsg.filter(val => val.key !== key)

        /** 定时任务需要先停止 */
        this.task = this.task.filter(val => {
          if (val.key === key) {
            val.schedule?.cancel()
            return false
          }
          return true
        })

        /** 处理handler */
        Object.keys(this.handler).forEach(keys => {
          this.handler[keys].forEach((val, i) => {
            if (val.key === key) {
              this.handler[keys].splice(i, 1)
              if (!this.handler[keys].length) delete this.handler[keys]
              return true
            }
          })
        })
      }
    })

    /** 重新排序 */
    this.orderBy()
  }

  /**
   * 监听文件夹更新
   */
  async watchDir (plugin: string, _path: string) {
    const root = path.join(this.dir, plugin, _path)
    if (this.watcher.get(root)) return false
    const watcher = chokidar.watch(root)

    await common.sleep(1000)

    watcher.on('add', async files => {
      /** 排除掉不符合规则文件新增 */
      if (!this.ext.some(ext => files.endsWith(ext))) return false

      const name = path.basename(files)
      await this.createdApp(plugin, _path, name, `${AppsType.Git}`, true)
      logger.mark(`[新增插件][${plugin}]${path ? `${common.getRelPath(_path)}` : ''}[${name}]`)
      return true
    })

    watcher.on('change', async files => {
      /** 排除掉不符合规则文件新增 */
      if (!this.ext.some(ext => files.endsWith(ext))) return false
      const name = path.basename(files)
      /** 卸载 */
      this.uninstallApp(plugin, _path, name)
      /** 载入插件 */
      await this.createdApp(plugin, _path, name, `${AppsType.Git}`, true)
      logger.mark(`[修改插件][${plugin}]${path ? `${common.getRelPath(_path)}` : ''}[${name}]`)
      return true
    })

    watcher.on('unlink', async files => {
      /** 排除掉不符合规则文件新增 */
      if (!this.ext.some(ext => files.endsWith(ext))) return false
      const name = path.basename(files)
      /** 卸载 */
      this.uninstallApp(plugin, _path, name)
      logger.mark(`[卸载插件][${plugin}]${path ? `${common.getRelPath(_path)}` : ''}[${name}]`)
      return true
    })

    this.watcher.set(root, watcher)
    return true
  }
}

/**
 * 加载插件
 */
export const pluginLoader = new PluginLoader()
