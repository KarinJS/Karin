/**
 * 插件注册表状态打印工具
 * @description 使用新的 store API 重构
 */
import { store, packageList } from '../store'

/**
 * 打印插件注册表状态
 */
export const printRegistryStatus = (): void => {
  const stats = store.stats()

  /** 获取包类型统计 */
  const pkgStats = packageList.stats()

  /** 简洁输出 */
  logger.info(`插件: ${pkgStats.total} (Apps: ${pkgStats.apps}, NPM: ${pkgStats.npm}${process.env.NODE_ENV === 'development' ? `, Dev: ${pkgStats.dev}` : ''})`)
  logger.info(`注册: Commands: ${stats.command.total}, Accepts: ${stats.accept.total}, Buttons: ${stats.button.total}, Tasks: ${stats.task.total}, Packages: ${stats.packages}`)
  logger.info(`Handler: Keys: ${stats.handler.keys}, Funcs: ${stats.handler.total}`)
}
