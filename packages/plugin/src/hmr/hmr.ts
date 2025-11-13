import { registry } from '../registry/registry'
import { pluginCache } from '../cache'
import { hmrProduction } from './watcher'

/**
 * 初始化插件热重载
 * @description 收集所有 apps 目录并启动生产环境 HMR
 */
export const initPluginHmr = async () => {
  const apps: string[] = []

  // 从所有插件包中收集所有 apps 路径
  const allPackageNames = Object.keys(pluginCache.instances.package || {})
  for (const pkgName of allPackageNames) {
    const pkgInfo = pluginCache.package.get(pkgName)
    if (pkgInfo) {
      // 获取该包的所有文件路径
      const files = pluginCache.package.getFilesByPackageName(pkgName)
      apps.push(...files)
    }
  }

  if (apps.length === 0) {
    logger.info('[hmr] 当前监听的插件列表为空')
    return
  }

  logger.info(`[hmr] 正在监听 ${apps.length} 个插件文件`)
  return hmrProduction(apps)
}

/**
 * 热重载单个 App 文件
 * @param file 文件的绝对路径
 */
export const reloadApp = async (file: string) => {
  await registry.unregister.plugin(file)
  await registry.loader.app(file, { eager: true })
  registry.sort()
}

/**
 * 热重载整个插件包
 * @param pkgName 插件包名称（不带前缀）
 */
export const reloadPackage = async (pkgName: string) => {
  const pkgInfo = pluginCache.package.get(pkgName)
  if (!pkgInfo) {
    logger.warn(`[hmr] 插件包 ${pkgName} 不存在`)
    return
  }

  await registry.unregister.package(pkgName)
  // 使用 PluginContext 重新加载
  const context = new (await import('../registry/context')).PluginContext(pkgName)
  await registry.loader.package(context)
  registry.sort()
}
