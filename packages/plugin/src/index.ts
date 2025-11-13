/**
 * 插件加载器模块
 * @description 统一导出所有类型的插件加载器
 */
import { pluginCache } from './cache'
import { emitter } from '@karinjs/events'
import { PluginsLoaderNpm, PluginsLoaderDev, PluginsLoaderGit, PluginsLoaderApps, printRegistryStatus, engines } from './core'

/**
 * 插件加载器工厂
 */
export const pluginLoader = {
  /**
   * 运行所有插件加载器
   */
  run: async () => {
    return Promise.all([
      new PluginsLoaderNpm().init(),
      new PluginsLoaderGit().init(),
      new PluginsLoaderDev().init(),
      new PluginsLoaderApps().init(),
    ]).finally(() => {
      emitter.emit('plugin:load:done')
      pluginLoader.sort()
      printRegistryStatus()
      engines.print()
      pluginCache.missingDeps.printReport()
      // TODO: 环境变量
      // TODO: 热点缓存添加配置文件
      // TODO: 导出类型、部分API
      // TODO: 更新、禁用、启用、卸载等功能
      // TODO: hmr hot API实现
    })
  },
  /**
   * 排序
   */
  sort: async () => {
    pluginCache.instances.markAsUnsorted('accept')
    pluginCache.instances.markAsUnsorted('button')
    pluginCache.instances.markAsUnsorted('command')
    pluginCache.instances.markAsUnsorted('handler')
  },
}

export {
  Plugin,
  accept,
  button,
  command,
  handler,
  task,
  ctx,
} from './create'

export { pluginCache } from './cache'
export { parsePluginMetadata } from './core/metadata'
export { defineKarinConfig, defineWebConfig } from './config'
export { packageFinder } from './package'

export type { DefineConfigWeb, DefineConfig, PluginMeta } from './config'
export type { PluginsTypes, PkgEnv, Package, PackageKarin, PkgData } from './package'
export type { CreateAccept, CreateButton, CreateCommand, CreateHandler, CreateTask, CreateClassPlugin } from './create'
