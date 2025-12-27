/**
 * 插件注册表状态打印工具
 */
import { pluginCache } from '../../cache'

/**
 * 打印插件注册表状态
 */
export const printRegistryStatus = (): void => {
  const stats = pluginCache.stats

  /** 获取包类型统计 */
  const npmCount = pluginCache.list.get('npm').length
  const gitCount = pluginCache.list.get('git').length
  const appsCount = pluginCache.list.get('apps').length
  const rootCount = pluginCache.list.get('dev').length
  const totalPlugins = npmCount + gitCount + appsCount + rootCount

  /** 简洁输出 */
  logger.info(`插件: ${totalPlugins} (Apps: ${appsCount}, Git: ${gitCount}, NPM: ${npmCount}${process.env.NODE_ENV === 'development' ? `, Root: ${rootCount}` : ''})`)
  logger.info(`注册: Commands: ${stats.command}, Accepts: ${stats.accept}, Buttons: ${stats.button}, Tasks: ${stats.task}, Packages: ${stats.pkg}`)
  logger.info(`Handler: Keys: ${stats.handler.key}, Funcs: ${stats.handler.fnc}`)
}
