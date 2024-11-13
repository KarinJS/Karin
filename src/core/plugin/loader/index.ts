import lodash from 'lodash'
import path from 'node:path'
import util from 'node:util'
import chokidar from 'chokidar'
import schedule from 'node-schedule'
import { gitAllPlugin } from '../list'
import { Middleware } from '../cache/types'
import { handleError } from '@/internal/error'
import { isClass } from '@/utils/system/class'
import { cache, createLogger } from '../cache/cache'
import { isDir } from '@/utils/fs/exists'
import { requireFileSync } from '@/utils'
import { filesByExt } from '@/utils/fs/path'
import { createPluginDir } from '@/plugin/resource'
import type { Info } from '../list/types'
import type { PkgData } from '@/utils/fs/pkg'
import type { Plugin } from '../class'
import type {
  Accept,
  CommandClass,
  CommandFnc,
  Task,
  Button,
  Handler,
} from '../cache/types'

type FncType = Accept
  | CommandClass
  | CommandFnc
  | Task
  | Button
  | Handler
  | Middleware
type Fnc = Record<string, FncType | FncType[]>

let seq = 0
const load: {
  main: (Promise<void>)[]
  apps: (Promise<void>)[]
  createDir: (Promise<void>)[]
  watchList: { file: string, index: number, info: Info }[]
} = {
  main: [],
  apps: [],
  createDir: [],
  watchList: [],
}

/**
 * 初始化插件
 */
export const loaderPlugin = async () => {
  logger.info(logger.green('-----------'))
  logger.info('加载插件中...')

  const list = await getPluginList()

  /** 导入的apps promise数组 */
  const loadApps: Promise<{ data: Fnc, index: number, info: Info, file: string } | undefined>[] = []

  for (const { index, info, apps } of list) {
    for (const file of apps) {
      loadApps.push(importPlugin(file, index, info))
    }
  }

  const apps = await Promise.all(loadApps)
  for (const app of apps) {
    if (!app) continue
    const { data, index, info, file } = app
    if (typeof data !== 'object') continue
    for (const [key, val] of Object.entries(data)) {
      load.apps.push(loaderApp(index, info, file, key, val))
    }
  }

  await Promise.all([...load.main, ...load.apps, ...load.createDir])
  sort()

  logger.info('插件加载完成')
  logger.info(logger.green('-----------'))

  load.watchList.forEach(({ file, index, info }) => watchApps(file, index, info))
  clearCache()
}

/**
 * @description 获取插件列表
 * @returns 插件列表
 */
export const getPluginList = async () => {
  const list = await gitAllPlugin()

  const ext = process.env.karin_app_lang === 'ts' ? ['.ts', '.js'] : ['.js']

  return list.map(info => {
    const index = ++seq
    cache.index[index] = {
      dir: info.dir,
      name: info.name,
      type: info.type,
      pkgPath: info.type === 'app' ? '' : path.join(info.dir, 'package.json'),
    }

    if (info.type === 'app') {
      /** 热更新 */
      load.watchList.push({ file: info.dir, index, info })
      /** 创建插件文件夹 */
      load.createDir.push(createPluginDir(info.name))
      return {
        index,
        info,
        apps: filesByExt(info.dir, ext, 'absolutePath'),
      }
    }

    const pkg = requireFileSync<PkgData>(path.join(info.dir, 'package.json'))
    /** 创建插件文件夹 */
    load.createDir.push(createPluginDir(info.name, pkg?.karin?.files))

    const apps: string[] = []
    if (pkg.karin?.apps) {
      /** 热更新 */
      const appsList = Array.isArray(pkg.karin.apps) ? pkg.karin.apps : [pkg.karin.apps]
      appsList.forEach(file => {
        load.watchList.push({ file, index, info })
        const filePath = path.resolve(info.dir, file)
        if (isDir(filePath)) {
          apps.push(...filesByExt(filePath, ext, 'absolutePath'))
        }
      })
    }

    if (pkg.main) {
      load.main.push(loaderMain(info.name, path.join(info.dir, pkg.main)))
    }

    return {
      index,
      info,
      apps,
    }
  })
}

/** 清理收集的缓存 */
export const clearCache = () => {
  load.main.length = 0
  load.apps.length = 0
  load.createDir.length = 0
  load.watchList.length = 0
}

/**
 * 加载入口文件
 * @param name 插件名称
 * @param file 入口文件
 * @param isRefresh 是否刷新
 */
const loaderMain = async (name: string, file: string, isRefresh = false) => {
  try {
    return import(`file://${file}${isRefresh ? `?t=${Date.now()}` : ''}`)
  } catch (error) {
    handleError('loaderPlugin', { name, error, file })
  }
}

/**
 * 导入插件
 * @param file 插件路径
 * @param index 插件索引
 * @param info 插件信息
 * @param isRefresh 是否刷新
 */
export const importPlugin = async (file: string, index: number, info: Info, isRefresh = false) => {
  try {
    /** 导入文件 */
    const data: Fnc = await import(`file://${file}${isRefresh ? `?t=${Date.now()}` : ''}`)
    return {
      data,
      index,
      info,
      file,
    }
  } catch (error) {
    handleError('loaderPlugin', { name: info.name, error, file: `${file}` })
  }
}

/**
 * 加载每个插件
 * @param info 插件信息
 * @param file 插件路径
 * @param key 插件方法名称
 * @param val 插件方法
 */
const loaderApp = async (
  index: number,
  info: Info,
  file: string,
  key: string,
  val: FncType | FncType[]
) => {
  const dirname = path.dirname(file)
  const basename = path.basename(file)
  logger.debug(`加载插件：[index:${index}][${info.name}][${basename}][${key}]`)
  if (typeof val === 'function') {
    if (!isClass(val)) return
    const Cls = val as new () => Plugin
    const app = new Cls()
    /** 非插件 */
    if (!app?.rule) return

    for (const v of app.rule) {
      /** 没有对应方法跳过 */
      if (!(v.fnc in app)) continue
      /** 没有正则跳过 */
      if (typeof v.reg !== 'string' && !(v.reg instanceof RegExp)) continue

      cache.command.push({
        type: 'class',
        index,
        log: createLogger(v.log, false),
        name: app.name,
        adapter: v.adapter || [],
        dsbAdapter: v.dsbAdapter || [],
        Cls,
        reg: v.reg instanceof RegExp ? v.reg : new RegExp(v.reg),
        perm: v.permission || 'all',
        event: v.event || app.event || 'message',
        rank: v.priority || 10000,
        get info () {
          return cache.index[this.index]
        },
        file: {
          basename,
          dirname,
          method: key,
          type: 'command',
          get path () {
            return path.join(this.dirname, this.basename)
          },
        },
      })
    }
    return
  }

  if (typeof val !== 'object') return

  const list: FncType[] = Array.isArray(val) ? val : [val]
  list.forEach(fnc => {
    if (!fnc?.file?.type) return
    fnc.index = index
    fnc.file.dirname = dirname
    fnc.file.basename = basename
    fnc.file.method = key
    switch (fnc.file.type) {
      case 'accept':
        cache.count.accept++
        return cache.accept.push(fnc as Accept)
      case 'command':
        cache.count.command++
        return cache.command.push(fnc as CommandFnc)
      case 'button':
        cache.count.button++
        return cache.button.push(fnc as Button)
      case 'handler': {
        const fn = fnc as Handler
        if (!cache.handler[fn.key]) {
          cache.count.handler.key++
          cache.handler[fn.key] = []
        }
        cache.count.handler.fnc++
        cache.handler[fn.key].push(fn)
        return
      }
      case 'middleware':
        cache.count.middleware++
        return cache.middleware[(fnc as Middleware).type].push(fnc as any)
      case 'task': {
        const fn = fnc as Task
        fn.schedule = schedule.scheduleJob(fn.cron, async () => {
          try {
            fn.log(`[定时任务][${fnc.name}][${fn.name}]: 开始执行`)
            const result = fn.fnc()
            if (util.types.isPromise(result)) await result
            fn.log(`[定时任务][${fn.name}][${fn.name}]: 执行完成`)
          } catch (error) {
            handleError('taskStart', { name: fnc.name, task: fn.name, error })
          }
        })
        cache.count.task++
        return cache.task.push(fn)
      }
      default:
    }
  })
}

/** 排序 */
export const sort = () => {
  cache.accept = lodash.sortBy(cache.accept, ['rank'], ['asc'])
  cache.command = lodash.sortBy(cache.command, ['rank'], ['asc'])
  cache.task = lodash.sortBy(cache.task, ['rank'], ['asc'])
  cache.button = lodash.sortBy(cache.button, ['rank'], ['asc'])
  cache.middleware.recvMsg = lodash.sortBy(cache.middleware.recvMsg, ['rank'], ['asc'])
  cache.middleware.replyMsg = lodash.sortBy(cache.middleware.replyMsg, ['rank'], ['asc'])
  cache.middleware.sendMsg = lodash.sortBy(cache.middleware.sendMsg, ['rank'], ['asc'])
  cache.middleware.forwardMsg = lodash.sortBy(cache.middleware.forwardMsg, ['rank'], ['asc'])
  cache.middleware.notFoundMsg = lodash.sortBy(cache.middleware.notFoundMsg, ['rank'], ['asc'])
  for (const key of Object.keys(cache.handler)) {
    cache.handler[key] = lodash.sortBy(cache.handler[key], ['rank'], ['asc'])
  }
}

/**
 * 卸载插件
 * @param file 插件路径
 * @param index 插件索引
 */
export const unloadApps = async (file: string, index: number) => {
  cache.accept = cache.accept.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.command = cache.command.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.button = cache.button.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.task = cache.task.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.middleware.recvMsg = cache.middleware.recvMsg.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.middleware.replyMsg = cache.middleware.replyMsg.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.middleware.sendMsg = cache.middleware.sendMsg.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.middleware.forwardMsg = cache.middleware.forwardMsg.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  cache.middleware.notFoundMsg = cache.middleware.notFoundMsg.filter(fnc => fnc.index !== index || fnc.file.path !== file)
  for (const key of Object.keys(cache.handler)) {
    cache.handler[key] = cache.handler[key].filter(fnc => fnc.index !== index || fnc.file.path !== file)
  }
  sort()
}

/**
 * 监听apps文件夹变动
 * @param dir apps文件夹路径
 * @param index 插件索引
 * @param info 插件信息
 */
export const watchApps = async (dir: string, index: number, info: Info) => {
  const isDev = process.env.karin_app_mode === 'dev'
  if (info.type !== 'app' && !isDev) return

  const ext = process.env.karin_app_lang === 'ts' ? ['.ts', '.js'] : ['.js']

  logger.debug(`[hmr][${info.name}] 监听文件夹：${dir}`)
  const watcher = chokidar.watch(dir)

  /** 处理文件变动 */
  const handleFileChange = async (file: string, action: 'add' | 'change' | 'unlink') => {
    if (!ext.includes(path.extname(file))) return

    if (action === 'unlink') {
      await unloadApps(file, index)
      logger.info(`[hmr][${info.name}][${path.basename(file)}] 卸载完成`)
      return
    }

    if (action === 'change') {
      await unloadApps(file, index)
    }

    const fnc = await importPlugin(file, index, info, true)
    if (fnc) {
      const list: Promise<void>[] = []
      const { data, index, info, file } = fnc
      if (typeof data !== 'object') return
      for (const [key, val] of Object.entries(data)) {
        list.push(loaderApp(index, info, file, key, val))
      }

      await Promise.all(list)
    }

    const actionText = action === 'add' ? '加载' : '重载'
    logger.info(`[hmr][${info.name}][${path.basename(file)}] ${actionText}完成`)
  }

  watcher.on('add', async (file: string) => await handleFileChange(file, 'add'))
  watcher.on('change', async (file: string) => await handleFileChange(file, 'change'))
  watcher.on('unlink', async (file: string) => await handleFileChange(file, 'unlink'))

  sort()
}
