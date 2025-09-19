import lodash from 'lodash'
import { cache, core } from '../core'
import { loadClass } from '../decorators'
import { formatPath, imports } from '@karinjs/utils'
import type { TaskCache } from '../decorators/task'
import type { AcceptCache } from '../decorators/accept'
import type { ButtonCache } from '../decorators/button'
import type { HandlerCache } from '../decorators/handler'
import type { CommandCache } from '../decorators/command'

/**
 * 插件注册管理类
 */
class RegisterManager {
  logger: ReturnType<typeof logger.prefix>

  constructor () {
    this.logger = logger.prefix('[register]')
  }

  /**
   * 格式化路径
   * @param target 目标路径
   * @returns 格式化后的路径
   */
  private _formatPath (target: string): string {
    const num = Number(target)
    if (isNaN(num)) {
      return formatPath(target)
    }
    return target
  }

  /**
   * 加载单个App插件
   * @param file app的绝对路径
   * @param eager 是否立即执行
   */
  async loadApp (file: string, eager: boolean = false): Promise<void> {
    const pkgName = core.getPackageName(file)

    if (!pkgName) {
      throw new Error(`无法确定 ${file} 所属的插件包`)
    }

    this.logger.debug(`开始加载app: ${file}`)
    const result = await imports(file, { eager })
    this.logger.debug(`模块导入成功: ${file}`)

    /** 加载class插件 */
    await loadClass(pkgName, file, result)
    this.logger.debug(`加载: ${file}`)
  }

  /**
   * 注册命令插件
   * @param command 命令
   */
  registerCommand (command: CommandCache): void {
    cache.command.push(command)
    cache.count.command++
  }

  /**
   * 卸载单个命令插件
   * @param target 插件缓存ID或者app绝对路径
   */
  unregisterCommand (target: string): void {
    target = this._formatPath(target)
    this.logger.debug(`尝试卸载命令，目标: ${target}`)

    const index = cache.command.findIndex(v => v.app.id === target || v.file.absPath === target)

    if (index === -1) {
      this.logger.debug(`未找到要卸载的命令: ${target}`)
      this.logger.debug('当前注册的命令文件路径:', cache.command.slice(0, 3).map(cmd => cmd.file.absPath))
      return
    }

    const removedCommand = cache.command[index]
    this.logger.debug(`卸载命令: ${removedCommand.app.name}`)

    cache.command.splice(index, 1)
    cache.count.command--
  }

  /**
   * 注册accept插件
   * @param accept 插件
   */

  registerAccept (accept: AcceptCache): void {
    cache.accept.push(accept)
    cache.count.accept++
  }

  /**
   * 卸载accept插件
   * @param target 插件缓存ID或者app绝对路径
   */
  unregisterAccept (target: string): void {
    target = this._formatPath(target)
    const index = cache.accept.findIndex(v => v.app.id === target || v.file.absPath === target)
    if (index === -1) return

    cache.accept.splice(index, 1)
    cache.count.accept--
  }

  /**
   * 注册handler插件
   * @param handler 插件
   */
  registerHandler (handler: HandlerCache): void {
    if (!cache.handler[handler.register.key]) {
      cache.handler[handler.register.key] = []
      cache.count.handler.key++
    }
    cache.handler[handler.register.key].push(handler)
    cache.count.handler.fnc++
  }

  /**
   * 卸载handler插件
   * @param target handler的缓存ID或者app绝对路径
   */
  unregisterHandler (target: string): void {
    target = this._formatPath(target)

    Object.keys(cache.handler).forEach(key => {
      const oldLength = cache.handler[key].length
      cache.handler[key] = cache.handler[key].filter(
        handler => !(handler.app.id === target || handler.file.absPath === target)
      )
      const newLength = cache.handler[key].length
      const removed = oldLength - newLength
      cache.count.handler.fnc -= removed
    })
  }

  /**
   * 注册button插件
   * @param button 插件
   */
  registerButton (button: ButtonCache): void {
    cache.button.push(button)
    cache.count.button++
  }

  /**
   * 卸载button插件
   * @param target 插件缓存ID或者app绝对路径
   */
  unregisterButton (target: string): void {
    target = this._formatPath(target)
    const index = cache.button.findIndex(v => v.app.id === target || v.file.absPath === target)
    if (index === -1) return

    cache.button.splice(index, 1)
    cache.count.button--
  }

  /**
   * 注册task插件
   * @param task 插件
   */
  registerTask (task: TaskCache): void {
    cache.task.push(task)
    cache.count.task++
  }

  /**
   * 卸载task插件
   * @param target 插件缓存ID或者app绝对路径
   */
  unregisterTask (target: string): void {
    target = this._formatPath(target)
    const index = cache.task.findIndex(v => v.app.id === target || v.file.absPath === target)
    if (index === -1) return

    const task = cache.task[index]
    if (
      task.register.schedule &&
      typeof task.register.schedule.cancel === 'function'
    ) {
      task.register.schedule.cancel()
    }
    cache.task.splice(index, 1)
    cache.count.task--
  }

  /**
   * 卸载单个插件
   * @param target 插件缓存ID或者app绝对路径
   */
  unregisterApp (target: string): void {
    target = this._formatPath(target)
    logger.debug(`[unregisterApp] 卸载应用: ${target}`)

    this.unregisterAccept(target)
    this.unregisterHandler(target)
    this.unregisterButton(target)
    this.unregisterTask(target)
    this.unregisterCommand(target)
  }  /**
   * 卸载整个插件包
   * @param pkgName 插件包名称
   */

  unregisterPackage (pkgName: string): void {
    cache.pluginsMap.delete(pkgName)
    cache.plugins.apps = cache.plugins.apps.filter(v => v !== pkgName || v !== `apps:${v}`)
    cache.plugins.npm = cache.plugins.npm.filter(v => v !== pkgName || v !== `npm:${v}`)
    cache.plugins.git = cache.plugins.git.filter(v => v !== pkgName || v !== `git:${v}`)
    cache.plugins.root = cache.plugins.root.filter(v => v !== pkgName || v !== `root:${v}`)

    cache.accept = cache.accept.filter(v => v.pkg.name !== pkgName)
    cache.command = cache.command.filter(v => v.pkg.name !== pkgName)
    cache.button = cache.button.filter(v => v.pkg.name !== pkgName)

    Object.keys(cache.handler).forEach(key => {
      cache.handler[key] = cache.handler[key].filter(v => v.pkg.name !== pkgName)
    })

    cache.task = cache.task.filter(v => {
      if (v.pkg.name === pkgName) {
        if (v.register.schedule && typeof v.register.schedule.cancel === 'function') {
          v.register.schedule.cancel()
        }
        return false
      }
      return true
    })

    this.recount()
  }

  /**
   * 排序插件
   */
  sort (): void {
    cache.command = lodash.sortBy(cache.command, ['register.options.priority'], ['asc'])
    cache.accept = lodash.sortBy(cache.accept, ['register.options.priority'], ['asc'])
    cache.button = lodash.sortBy(cache.button, ['register.options.priority'], ['asc'])
    cache.button = cache.button.sort((a, b) => a.pkg.name.localeCompare(b.pkg.name))

    Object.keys(cache.handler).forEach(key => {
      cache.handler[key] = lodash.sortBy(cache.handler[key], ['register.options.priority'], ['asc'])
    })
  }

  /**
   * 重新统计数量
   */
  recount (): void {
    cache.count.command = cache.command.length
    cache.count.accept = cache.accept.length
    cache.count.button = cache.button.length
    cache.count.task = cache.task.length

    const handlerKeys = Object.keys(cache.handler)
    cache.count.handler.key = handlerKeys.length
    cache.count.handler.fnc = 0
    handlerKeys.forEach(key => {
      cache.count.handler.fnc += cache.handler[key].length
    })

    cache.count.pkg =
      cache.plugins.apps.length +
      cache.plugins.git.length +
      cache.plugins.npm.length +
      cache.plugins.root.length
  }
}

/**
 * 导出插件注册管理类实例
 */
export const register = new RegisterManager()
export default register
