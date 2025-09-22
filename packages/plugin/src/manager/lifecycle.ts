import { getPluginLoader } from './load'
import { register } from './register'
import { cache } from '../core'

/**
 * 插件生命周期管理器
 */
class PluginLifecycleManager {
  /**
   * 加载所有插件
   */
  async loadAll (): Promise<void> {
    const loader = getPluginLoader()
    await loader.run()
  }

  /**
   * 重新加载插件
   * @param pluginName 插件名称
   */
  async reloadPlugin (pluginName: string): Promise<void> {
    // 先卸载
    this.unloadPlugin(pluginName)
    // TODO: 实现重新加载逻辑
    console.log(`Reloading plugin: ${pluginName}`)
  }

  /**
   * 卸载插件
   * @param pluginName 插件名称或文件路径
   */
  unloadPlugin (pluginName: string): void {
    register.unregisterApp(pluginName)
  }

  /**
   * 注册单个应用文件
   * @param filePath 文件路径
   * @param isRefresh 是否强制刷新
   */
  async registerApp (filePath: string, isRefresh = false): Promise<void> {
    await register.loadApp(filePath, isRefresh)
  }

  /**
   * 注销单个应用文件
   * @param filePath 文件路径
   */
  unregisterApp (filePath: string): void {
    register.unregisterApp(filePath)
  }

  /**
   * 获取已注册的插件统计信息
   */
  getStats () {
    return {
      commands: cache.command.length,
      handlers: Object.values(cache.handler).reduce((sum, arr) => sum + arr.length, 0),
      buttons: cache.button.length,
      tasks: cache.task.length,
      accepts: cache.accept.length,
      packages: cache.count.pkg,
    }
  }

  /**
   * 清空所有缓存
   */
  clearCache (): void {
    cache.command.length = 0
    cache.button.length = 0
    cache.task.length = 0
    cache.accept.length = 0

    // 清空handler的所有事件
    Object.keys(cache.handler).forEach(key => {
      cache.handler[key] = []
    })

    // 重置计数器
    cache.count.command = 0
    cache.count.handler.fnc = 0
    cache.count.handler.key = 0
    cache.count.button = 0
    cache.count.task = 0
    cache.count.accept = 0
    cache.count.pkg = 0
  }
}

/**
 * 插件生命周期管理器实例
 */
export const pluginLifecycle = new PluginLifecycleManager()

// 向后兼容的导出
export { getPluginLoader } from './load'
export { register } from './register'
