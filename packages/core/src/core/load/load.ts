import path from 'node:path'
import lodash from 'lodash'
import { karinPathPlugins } from '@/root'
import { createPluginDir, importModule, isClass, satisfies } from '@/utils'
import { errorHandler } from '../internal'
import { createAddEnv } from '@/plugin/system/env'
import { PluginPackageManagerRegister } from '@/core/load/register'

import type { PluginCacheKeyPkg } from '../karin/base'
import { PluginPackageManager } from '@/core/load/manager'
import { plguinManager } from '@/core/load'
import { createID, FNC, formatReg } from '@/core/karin/util'
import { CommandCache } from '@/core/karin/command'
import { AddRuleItemType, formatFnc, formatOptions, Plugin, RuleItemBase } from '@/core/karin/class'
import { MessageEventMap } from '@/types'

/** 插件管理加载类 */
export class PluginPackageManagerLoad extends PluginPackageManagerRegister {
  /** 是否初始化 */
  #isInit = false
  constructor (dir: string = karinPathPlugins) {
    super(dir)

    this.#isInit = false
  }

  async init () {
    if (this.#isInit) return
    await this.getPluginDetails()
    const list = await this.getPlugins()
    await Promise.all(list.map(async (v) => {
      const [, name] = v.split(':')
      await this.load(name)
    }))

    this.#isInit = true
  }

  /**
   * 加载插件
   * @param pluginName 插件名称 不带前缀
   */
  async load (pluginName: string) {
    const pkg = this.getPluginPackageDetail(pluginName)
    const files = this._getFiles(pkg)

    /** 检查版本号是否符合加载要求 */
    if (!this.checkVersion(pkg)) return

    /** 创建插件基本文件夹 - 这个需要立即执行 */
    await createPluginDir(pkg.name, files)

    /** 加载入口文件 */
    if (pkg.data) {
      const main = PluginPackageManager.getMain(pkg.data, pkg.dir)
      if (main) await this.loadMain(pluginName, main)
    }

    /** 加载全部app */
    await Promise.all(pkg.apps.map(async (file) => {
      const { status, data } = await importModule(file)
      // TODO: 这里需要加载class 因为class需要导出注册
      if (status) return

      logger.debug(new Error(`加载模块失败: ${pluginName} ${file}`, { cause: data }))
      errorHandler.loaderPlugin(pluginName, file, data)
    }))

    /** 获取静态资源目录 */
    this._getStaticDir(pkg)

    /** 当this.cache.command的lengt在200ms没变化 则认为加载完成 */
    await new Promise((resolve) => {
      let lastLength = this.cache.command.length
      const timer = setInterval(() => {
        if (this.cache.command.length === lastLength) {
          clearInterval(timer)
          resolve(true)
        }

        lastLength = this.cache.command.length
      }, 200)
    })
  }

  /** 排序 */
  sort () {
    this.cache.command = lodash.sortBy(this.cache.command, ['register.options.priority'], ['asc'])
  }

  _getFiles (pkg: PluginCacheKeyPkg) {
    const files: string[] = []
    if (!Array.isArray(pkg.data?.karin?.files)) {
      files.push('config', 'data', 'resources')
    } else {
      files.push(...pkg.data.karin.files)
    }

    return files
  }

  /**
   * 获取静态资源目录
   * @param pkg 插件包
   * @returns 静态资源目录
   */
  _getStaticDir (pkg: PluginCacheKeyPkg) {
    if (!pkg.data) {
      this.cache.static.push(path.resolve(pkg.dir, 'resource'))
      this.cache.static.push(path.resolve(pkg.dir, 'resources'))
      return
    }

    /** 静态资源目录处理 */
    if (typeof pkg.data?.karin?.static === 'string') {
      return this.cache.static.push(path.resolve(pkg.dir, pkg.data.karin.static))
    }

    if (Array.isArray(pkg.data.karin?.static)) {
      return this.cache.static.push(...pkg.data.karin.static.map(file => path.resolve(pkg.dir, file)))
    }
  }

  /**
   * 加载入口文件
   * @param name 插件名称
   * @param file 入口文件路径
   */
  async loadMain (name: string, file: string) {
    const { status, data } = await importModule<{ KARIN_PLUGIN_INIT?: () => Promise<void> }>(file)
    if (!status) {
      errorHandler.loaderPlugin(name, file, data)
      return
    }

    if (!data || typeof data.KARIN_PLUGIN_INIT !== 'function') return

    try {
      await data.KARIN_PLUGIN_INIT()
      logger.debug(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数成功`)
    } catch (error) {
      logger.error(new Error(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数失败`, { cause: error }))
    }
  }

  /**
   * 检查版本号是否符合加载要求
   * @param pkg 插件包
   * @returns 是否符合加载要求
   */
  checkVersion (pkg: PluginCacheKeyPkg) {
    const data = pkg.data
    if (!data) return true

    /** 检查版本兼容性 */
    const engines = data.karin?.engines?.karin || data.engines?.karin
    if (!engines) return true

    if (satisfies(engines, process.env.KARIN_VERSION)) return true
    logger.error(`[getPlugins][npm] ${name} 要求 node-karin 版本为 ${engines}，当前不符合要求，跳过加载插件`)
  }

  /**
   * 收集环境变量
   * @param pkg 插件包
   */
  collectEnv (pkg: PluginCacheKeyPkg) {
    const data = pkg.data
    if (!data || !Array.isArray(data.karin?.env)) return

    createAddEnv(data.karin.env)
  }

  /**
   * 加载 class 插件
   */
  loadClass (
    pkg: PluginCacheKeyPkg,
    pkgName: string,
    file: string,
    Cls: unknown

  ) {
    if (!isClass<Plugin>(Cls)) return
    const plugin = new Cls()

    if (!plugin._options || typeof plugin._options !== 'object') {
      logger.error(new Error(`[loadClass][${pkgName}] 插件 ${file} 的 _options 属性不存在或不是对象`))
      return
    }

    const exportName = plugin.constructor.name
    const options = formatOptions(plugin._options)
    options.exportName = exportName

    options.rule.forEach(v => {
      // @ts-ignore
      if (typeof v.fnc === 'string' && plugin?.[v.fnc]) {
        logger.warn(`[loadClass][${pkgName}] 插件 ${file} 的 ${v.fnc} 方法不存在，跳过注册当前rule`)
        return
      }

      const id = createID()
      const type = 'class'
      let regCache = formatReg(v.reg)
      let fncCache = formatFnc(v.fnc, plugin)
      const ruleOptions = v

      const result: CommandCache = {
        get pkg () {
          if (!pkgName) {
            throw new Error(`请在符合标准规范的文件中使用此方法: ${file}`)
          }
          return plguinManager.getPluginPackageDetail(pkgName)!
        },
        get file () {
          return plguinManager.getFileCache(file)
        },
        get app () {
          return {
            get id () {
              return id
            },
            get type (): 'class' {
              return type
            },
            get log () {
              return v.log
            },
            get name () {
              return v.name
            },
          }
        },
        get register () {
          return {
            get reg () {
              /** 这里重新赋值是防止lastIndex错误 */
              const r = regCache
              return r
            },
            get fnc () {
              return fncCache
            },
            get options () {
              return options
            },
            get ruleOptions () {
              return ruleOptions
            },
            get instance () {
              return plugin
            },
          }
        },
        get control () {
          return {
            setReg: (reg: string | RegExp) => {
              regCache = formatReg(reg)
            },
            setFnc: (fnc: FNC<any>) => {
              if (typeof fnc !== 'function') {
                throw new TypeError('setFnc 参数必须是一个函数')
              }
              fncCache = Object.freeze(fnc)
            },
            setRule: (rule: RuleItemBase) => {
              // ruleOptions = rule
            },
            remove: () => {
              plguinManager.unregisterCommand(result.app.id)
            },
            addRule: <T extends keyof MessageEventMap> (rule: AddRuleItemType<T> & { event?: T }) => {
              // options.rule.push(rule)
            },
            removeRule: () => {
              // options.rule.pop()
            },
          }
        },
      }

      /** 对部分属性进行冻结 */
      Object.freeze(result.app.id)
      Object.freeze(result.app.type)
      plguinManager.registerCommand(result)
    })
  }
}
