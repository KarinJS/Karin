import { gitAllPlugin } from '../list/all'
import { isClass } from '@/utils/system/class'
import { cache, createCommandClassCache as createCommandClass } from '../cache/cache'
import type { Plugin } from '../class'
import type {
  Accept,
  CommandClass,
  CommandFnc,
  Task,
  Button,
  Handler,
  RecvMsg,
  ReplyMsg,
  SendMsg,
  ForwardMsg,
  NotFoundMsg,
} from '../cache/types'
import { PluginInfo } from '../list/types'
import { handleError } from '@/internal/error'

type FncType = Accept
  | CommandClass
  | CommandFnc
  | Task
  | Button
  | Handler
  | RecvMsg
  | ReplyMsg
  | SendMsg
  | ForwardMsg
  | NotFoundMsg
type Fnc = Record<string, FncType | FncType[]>

const load: {
  main: (() => Promise<void>)[]
  pkg: (Promise<void>)[]
  apps: (Promise<void>)[]
} = {
  main: [],
  pkg: [],
  apps: [],
}

export const loaderPlugin = async () => {
  logger.info(logger.green('-----------'))
  logger.info('加载插件中...')

  const list = await gitAllPlugin()
  await Promise.all([loaderMain(list), loaderPkg(list)])
  await Promise.all(load.apps)
}

/**
 * 加载入口文件
 * @param list 插件列表详细信息
 */
export const loaderMain = async (list: PluginInfo[]) => {
  list.forEach(item => {
    load.main.push(async () => {
      try {
        await import(`file://${item.main}`)
      } catch (error) {
        handleError('loaderPlugin', { name: item.name, error, file: item.main })
      }
    })
  })
}

/** 加载插件包 */
const loaderPkg = async (list: PluginInfo[]) => {
  const createPkg = async (name: string, file: string) => {
    try {
      const data: Fnc = await import(`file://${file}`)
      for (const key in data) {
        load.apps.push(loaderApp(data[key], key))
      }
    } catch (error) {
      handleError('loaderPlugin', { name, error, file })
    }
  }

  for (const item of list) {
    const { name, apps } = item
    for (const file of apps) {
      load.pkg.push(createPkg(name, file))
    }
  }
}

/**
 * 加载每个插件
 * @param fnc 插件方法
 * @param key 插件方法名称
 */
const loaderApp = async (fnc: FncType | FncType[], key: string) => {
  if (typeof fnc === 'function') {
    if (!isClass(fnc)) return
    const App = fnc as new () => Plugin
    const app = new App()
    /** 非插件 */
    if (!app?.rule) return

    for (const v of app.rule) {
      /** 没有对应方法跳过 */
      if (!(v.fnc in app)) continue
      /** 没有正则跳过 */
      if (typeof v.reg !== 'string' && !(v.reg instanceof RegExp)) continue

      createCommandClass({
        log: v.log,
        index: v.priority || 10000,
        name: app.name,
        fncname: v.fnc,
        adapter: v.adapter,
        dsbAdapter: v.dsbAdapter,
        cls: fnc,
        reg: v.reg,
        permission: v.permission,
        priority: v.priority,
      })
    }
    return
  }

  const list: FncType[] = Array.isArray(fnc) ? fnc : [fnc]
  list.forEach(fnc => {
    if (!fnc.fncType) return
    fnc.fncname = key
    switch (fnc.fncType) {
      case 'accept':
        return cache.accept.push(fnc)
      case 'button':
        return cache.button.push(fnc)
      case 'handler':
        return cache.handler.push(fnc)
      case 'middleware':
        return cache.middleware.push(fnc)
      case 'command':
        return cache.command.push(fnc)
      case 'task':
        return cache.task.push(fnc)
      default:
    }
  })
}
