/**
 * 插件注册表状态打印工具
 */
import { pluginCache } from '../../cache'

/**
 * 打印插件注册表状态
 */
export const printRegistryStatus = (): void => {
  const stats = pluginCache.stats

  /** 渲染工具函数 */
  const renderRow = (label: string, value: string | number) => {
    const totalWidth = 19 // 总内容宽度
    const valueStr = String(value)
    const labelStr = String(label).padEnd(totalWidth - valueStr.length)
    return `│ ${labelStr}${valueStr} │`
  }

  const renderSeparator = () => '├─────────────────────┤'
  const renderHeader = () => '╭─────────────────────╮'
  const renderFooter = () => '╰─────────────────────╯'

  /** 获取包类型统计 */
  const npmCount = pluginCache.list.get('npm').length
  const gitCount = pluginCache.list.get('git').length
  const appsCount = pluginCache.list.get('apps').length
  const rootCount = pluginCache.list.get('dev').length
  const totalPlugins = npmCount + gitCount + appsCount + rootCount

  /** 渲染表格 */
  logger.info(renderHeader())
  logger.info('│   插件注册状态   │')
  logger.info(renderSeparator())
  logger.info(renderRow('Total Plugins', totalPlugins))

  logger.info(renderSeparator())
  logger.info(renderRow('Apps', appsCount))
  logger.info(renderRow('Git', gitCount))
  logger.info(renderRow('NPM', npmCount))
  if (process.env.NODE_ENV === 'development') {
    logger.info(renderRow('Root', rootCount))
  }

  logger.info(renderSeparator())
  logger.info(renderRow('Commands', stats.command))
  logger.info(renderRow('Accepts', stats.accept))
  logger.info(renderRow('Buttons', stats.button))
  logger.info(renderRow('Tasks', stats.task))
  logger.info(renderRow('Packages', stats.pkg))

  logger.info(renderSeparator())
  logger.info(renderRow('Handler Keys', stats.handler.key))
  logger.info(renderRow('Handler Funcs', stats.handler.fnc))

  logger.info(renderFooter())
}
