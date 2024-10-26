import lodash from 'lodash'
import { cache } from '../cache/cache'
import { getAppPluginsInfo } from './app'
import { getGitPluginsInfo } from './git'
import { getNpmPluginsInfo } from './npm'
import type { Plugin } from '../class'
import type { PluginInfo } from './types'
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
import { isClass } from '@/utils/system/class'

/**
 * @description 获取所有插件详细信息列表
 */
export const gitAllPlugin = async (): Promise<PluginInfo[]> => {
  const list = await Promise.all([
    getAppPluginsInfo(),
    getGitPluginsInfo(),
    getNpmPluginsInfo(),
  ])

  return list.flat()
}

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

export const loaderPlugin = async () => {
  logger.info(logger.green('-----------'))
  logger.info('加载插件中...')

  const list = await gitAllPlugin()
  for (const item of list) {
    /** 入口文件只做导入即可 */
    import(`file://${item.main}`)
    for (const file of item.apps) {
      const data: Record<string, FncType | FncType[]> = await import(`file://${file}`)
      lodash.forEach(data, (fnc, key) => {
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

            cache.command.push({
              type: 'class',
              name: app.name,
              fncname: v.fnc,
              adapter: v.adapter?.length ? v.adapter : [],
              dsbAdapter: v.dsbAdapter?.length ? v.dsbAdapter : [],
              fncType: 'command',
              cls: fnc,
              index: 0,
              log: (msg: string) => logger.info(logger.green(`[${app.name}]`), msg),
              reg: v.reg instanceof RegExp ? v.reg : new RegExp(v.reg),
              perm: v.permission || 'all',
            })
          }
        }

        const list: FncType[] = Array.isArray(fnc) ? fnc : [fnc]
        list.forEach(fnc => {
          switch (fnc.fncType) {
            case 'accept':
              fnc.name = fnc.name === 'accept' ? key : fnc.name
              cache.accept.push(fnc)
              break
            case 'button':
              cache.button.push(fnc)
              break
            case 'handler':
              cache.handler.push(fnc)
              break
            case 'middleware':
              cache.middleware.push(fnc)
              break
            case 'command':
              cache.command.push(fnc)
              break
            case 'task':
              cache.task.push(fnc)
              break
          }
        })
      })
    }
  }
}
