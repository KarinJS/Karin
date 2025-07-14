import { karinPathPlugins } from '@/root'
import type { CommandCache } from '../karin/command'
import type { ClassCache } from '../karin/class'
import type { AcceptCache } from '../karin/accept'
import type { HandlerCache } from '../karin/handler'
import type { ButtonCache } from '../karin/button'
import type { TaskCache } from '../karin/task'
import { PluginPackageManager } from '@/core/load/manager'

/** 插件管理注册类 */
export class PluginPackageManagerRegister extends PluginPackageManager {
  constructor (dir: string = karinPathPlugins) {
    super(dir)
  }

  /**
   * 注册命令插件
   * @param command 命令
   */
  registerCommand (command: CommandCache) {
    this.cache.command.push(command)
  }

  /**
   * 卸载命令插件
   * @param command 命令
   */
  unregisterCommand (id: string) {
    const index = this.cache.command.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterCommand] ${id} 未找到`)
    }

    this.cache.command.splice(index, 1)
  }

  /**
   * 注册类插件
   * @param class 类
   */
  registerClass (cls: ClassCache) {
    this.cache.class.push(cls)
  }

  /**
   * 卸载类插件
   * @param class 类
   */
  unregisterClass (id: string) {
    const index = this.cache.class.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterClass] ${id} 未找到`)
    }

    this.cache.class.splice(index, 1)
  }

  /**
   * 注册accept插件
   * @param accept 插件
   */
  registerAccept (accept: AcceptCache) {
    this.cache.accept.push(accept)
  }

  /**
   * 卸载accept插件
   * @param accept 插件
   */
  unregisterAccept (id: string) {
    const index = this.cache.accept.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterAccept] ${id} 未找到`)
    }

    this.cache.accept.splice(index, 1)
  }

  /**
   * 注册handler插件
   * @param handler 插件
   */
  registerHandler (handler: HandlerCache) {
    this.cache.handler.push(handler)
  }

  /**
   * 卸载handler插件
   * @param id handler的id
   */
  unregisterHandler (id: string) {
    const index = this.cache.handler.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterHandler] ${id} 未找到`)
    }

    this.cache.handler.splice(index, 1)
  }

  /**
   * 注册button插件
   * @param button 插件
   */
  registerButton (button: ButtonCache) {
    this.cache.button.push(button)
  }

  /**
   * 卸载button插件
   * @param id button的id
   */
  unregisterButton (id: string) {
    const index = this.cache.button.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterButton] ${id} 未找到`)
    }

    this.cache.button.splice(index, 1)
  }

  /**
   * 注册task插件
   * @param task 插件
   */
  registerTask (task: TaskCache) {
    this.cache.task.push(task)
  }

  /**
   * 卸载task插件
   * @param id task的id
   */
  unregisterTask (id: string) {
    const index = this.cache.task.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterTask] ${id} 未找到`)
    }

    this.cache.task.splice(index, 1)
  }
}
