import lodash from 'lodash'
import { formatPath } from '@karinjs/utils'
import * as manager from './manager'
import type { TaskCache } from '../decorators/task'
import type { AcceptCache } from '../decorators/accept'
import type { ButtonCache } from '../decorators/button'
import type { HandlerCache } from '../decorators/handler'
import type { CommandCache } from '../decorators/command'

const _formatPath = (target: string) => {
  const num = Number(target)
  if (isNaN(num)) {
    return formatPath(target)
  }

  return target
}

/**
 * 注册命令插件
 * @param command 命令
 */
export const registerCommand = (command: CommandCache) => {
  manager.cache.command.push(command)
  manager.cache.count.command++
}

/**
 * 卸载单个命令插件
 * @param target 插件缓存ID或者app绝对路径
 */
export const unregisterCommand = (target: string) => {
  target = _formatPath(target)
  const index = manager.cache.command.findIndex(v => v.app.id === target || v.file.absPath === target)
  if (index === -1) return

  manager.cache.command.splice(index, 1)
  manager.cache.count.command--
}

/**
 * 注册accept插件
 * @param accept 插件
 */
export const registerAccept = (accept: AcceptCache) => {
  manager.cache.accept.push(accept)
  manager.cache.count.accept++
}

/**
 * 卸载accept插件
 * @param target 插件缓存ID或者app绝对路径
 */
export const unregisterAccept = (target: string) => {
  target = _formatPath(target)
  const index = manager.cache.accept.findIndex(v => v.app.id === target || v.file.absPath === target)
  if (index === -1) return

  manager.cache.accept.splice(index, 1)
  manager.cache.count.accept--
}

/**
 * 注册handler插件
 * @param handler 插件
 */
export const registerHandler = (handler: HandlerCache) => {
  if (!manager.cache.handler[handler.register.key]) {
    manager.cache.handler[handler.register.key] = []
    manager.cache.count.handler.key++
  }
  manager.cache.handler[handler.register.key].push(handler)
  manager.cache.count.handler.fnc++
}

/**
 * 卸载handler插件
 * @param target handler的缓存ID或者app绝对路径
 */
export const unregisterHandler = (target: string) => {
  target = _formatPath(target)

  Object.keys(manager.cache.handler).forEach(key => {
    const oldLength = manager.cache.handler[key].length
    manager.cache.handler[key] = manager.cache.handler[key].filter(
      handler => !(handler.app.id === target || handler.file.absPath === target)
    )
    const newLength = manager.cache.handler[key].length
    const removed = oldLength - newLength
    manager.cache.count.handler.fnc -= removed
  })
}

/**
 * 注册button插件
 * @param button 插件
 */
export const registerButton = (button: ButtonCache) => {
  manager.cache.button.push(button)
  manager.cache.count.button++
}

/**
 * 卸载button插件
 * @param target 插件缓存ID或者app绝对路径
 */
export const unregisterButton = (target: string) => {
  target = _formatPath(target)
  const index = manager.cache.button.findIndex(v => v.app.id === target || v.file.absPath === target)
  if (index === -1) return

  manager.cache.button.splice(index, 1)
  manager.cache.count.button--
}

/**
 * 注册task插件
 * @param task 插件
 */
export const registerTask = (task: TaskCache) => {
  manager.cache.task.push(task)
  manager.cache.count.task++
}

/**
 * 卸载task插件
 * @param target 插件缓存ID或者app绝对路径
 */
export const unregisterTask = (target: string) => {
  target = _formatPath(target)
  const index = manager.cache.task.findIndex(v => v.app.id === target || v.file.absPath === target)
  if (index === -1) return

  const task = manager.cache.task[index]
  if (
    task.register.schedule &&
    typeof task.register.schedule.cancel === 'function'
  ) {
    task.register.schedule.cancel()
  }
  manager.cache.task.splice(index, 1)
  manager.cache.count.task--
}

/**
 * 卸载单个插件
 * @param target 插件缓存ID或者app绝对路径
 */
export const unregisterApp = (target: string) => {
  target = _formatPath(target)
  unregisterAccept(target)
  unregisterHandler(target)
  unregisterButton(target)
  unregisterTask(target)
  unregisterCommand(target)
}

/**
 * 卸载整个插件包
 * @param pkgName 插件包名称
 */
export const unregisterPackage = (pkgName: string) => {
  manager.cache.pluginsDetails.delete(pkgName)
  const list = [`npm:${pkgName}`, `git:${pkgName}`, `root:${pkgName}`, `apps:${pkgName}`]
  list.forEach(key => {
    manager.cache.plugins = manager.cache.plugins.filter(v => v !== key)
  })

  manager.cache.accept = manager.cache.accept.filter(v => v.pkg.name !== pkgName)
  manager.cache.command = manager.cache.command.filter(v => v.pkg.name !== pkgName)
  manager.cache.button = manager.cache.button.filter(v => v.pkg.name !== pkgName)

  Object.keys(manager.cache.handler).forEach(key => {
    manager.cache.handler[key] = manager.cache.handler[key].filter(v => v.pkg.name !== pkgName)
  })

  manager.cache.task = manager.cache.task.filter(v => {
    if (v.pkg.name === pkgName) {
      if (v.register.schedule && typeof v.register.schedule.cancel === 'function') {
        v.register.schedule.cancel()
      }
      return false
    }
    return true
  })
}

/**
 * 排序插件
 */
export const sort = () => {
  manager.cache.command = lodash.sortBy(manager.cache.command, ['register.options.priority'], ['asc'])
  manager.cache.accept = lodash.sortBy(manager.cache.accept, ['register.options.priority'], ['asc'])
  manager.cache.button = lodash.sortBy(manager.cache.button, ['register.options.priority'], ['asc'])
  manager.cache.button = manager.cache.button.sort((a, b) => a.pkg.name.localeCompare(b.pkg.name))

  Object.keys(manager.cache.handler).forEach(key => {
    manager.cache.handler[key] = lodash.sortBy(manager.cache.handler[key], ['register.options.priority'], ['asc'])
  })
}
