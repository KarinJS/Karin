/**
 * 插件注册器
 * @description 提供各类插件实例的注册方法
 */
import type { PluginCacheStorage } from './default'
import type {
  CreateAccept,
  CreateButton,
  CreateClassPlugin,
  CreateCommand,
  CreateHandler,
  CreateTask,
} from '../create'

/**
 * 创建插件注册器
 * @param cache - 插件缓存存储对象
 * @returns 插件注册器对象
 */
export const createRegister = (cache: PluginCacheStorage) => {
  /**
   * 确保包和文件缓存路径存在
   * @param packageName - 包名
   * @param filePath - 文件路径
   */
  const ensureCachePath = (packageName: string, filePath: string) => {
    try {
      if (!cache.package.info[packageName]) {
        logger.warn(`未找到插件包缓存: ${packageName}`)
        return false
      }
      if (!cache.package.info[packageName].files[filePath]) {
        logger.warn(`未找到文件缓存: ${filePath}`)
        return false
      }
      return true
    } catch (error) {
      logger.fatal(new Error(`缓存路径检查失败: ${packageName} -> ${filePath}`, { cause: error }))
      return false
    }
  }

  return {
    /**
     * 注册 accept 实例
     * @param instance - accept 实例对象
     */
    accept: (instance: CreateAccept) => {
      cache.stats.accept++
      /** 全局缓存 */
      cache.instances.accept.push(instance)
      /** 文件等级缓存 */
      if (ensureCachePath(instance.packageName, instance.file.absPath)) {
        cache.package.info[instance.packageName].files[instance.file.absPath].instances.accept.push(instance)
      }
    },

    /**
     * 注册 button 实例
     * @param instance - button 实例对象
     */
    button: (instance: CreateButton) => {
      cache.stats.button++
      cache.instances.button.push(instance)
      if (ensureCachePath(instance.packageName, instance.file.absPath)) {
        cache.package.info[instance.packageName].files[instance.file.absPath].instances.button.push(instance)
      }
    },

    /**
     * 注册 command 实例
     * @param instance - command 实例对象
     */
    command: (instance: CreateCommand) => {
      cache.stats.command++
      cache.instances.command.raw.command.push(instance)
      if (ensureCachePath(instance.packageName, instance.file.absPath)) {
        cache.package.info[instance.packageName].files[instance.file.absPath].instances.command.push(instance)
      }
    },

    /**
     * 注册 task 实例
     * @param instance - task 实例对象
     */
    task: (instance: CreateTask) => {
      cache.stats.task++
      cache.instances.task.push(instance)
      if (ensureCachePath(instance.packageName, instance.file.absPath)) {
        cache.package.info[instance.packageName].files[instance.file.absPath].instances.task.push(instance)
      }
    },

    /**
     * 注册 class plugin 实例
     * @param instance - class plugin 实例对象`(new之后)`
     * @param classPlugin - class plugin`(new之前)`
     */
    classPlugin: (instance: CreateClassPlugin) => {
      cache.stats.classPlugin++
      cache.instances.command.raw.class.push(instance)
      if (ensureCachePath(instance.packageName, instance.file.absPath)) {
        cache.package.info[instance.packageName].files[instance.file.absPath].instances.class.push(instance)
      }
    },

    /**
     * 注册 handler 实例
     * @param key - handler 分组标识符
     * @param instance - handler 实例对象
     */
    handler: (key: string, instance: CreateHandler) => {
      if (!cache.instances.handler[key]) {
        cache.stats.handler.key++
        cache.instances.handler[key] = []
      }

      cache.stats.handler.fnc++
      cache.instances.handler[key].push(instance)

      if (ensureCachePath(instance.packageName, instance.file.absPath)) {
        if (!cache.package.info[instance.packageName].files[instance.file.absPath].instances.handler[key]) {
          cache.package.info[instance.packageName].files[instance.file.absPath].instances.handler[key] = []
        }
        cache.package.info[instance.packageName].files[instance.file.absPath].instances.handler[key].push(instance)
      }
    },
  }
}
