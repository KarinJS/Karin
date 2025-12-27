import semver from 'semver'
import { pluginCache } from '../../cache'

/**
 * 检查插件的 engines 配置是否符合要求
 * @param packageName - 插件包名称
 * @param engines - package.json 中的 engines 配置
 * @param ignoreEngines - 是否忽略引擎版本检查
 * @returns 是否符合要求
 */
const check = (
  packageName: string,
  engines?: string,
  ignoreEngines: boolean = false
): boolean => {
  if (!engines || ignoreEngines) {
    return true
  }

  const version = process.env.KARIN_VERSION
  if (!version) return true

  try {
    const matches = semver.satisfies(version, engines, { includePrerelease: true, loose: true })
    if (!matches) {
      pluginCache.settings.set(packageName, { version, ignoreEngines })
    }
    return matches
  } catch {
    return true
  }
}

/**
 * 打印不符合 engines 要求的插件包提示信息
 */
const print = (): void => {
  const result = pluginCache.settings.get('all')
  const keys = Object.keys(result)
  if (result && keys.length === 0) {
    return
  }

  const { chalk } = logger
  const karinVersion = process.env.KARIN_VERSION || 'unknown'

  logger.warn('')
  logger.warn(chalk.yellow.bold('⚠️  插件兼容性警告'))
  logger.warn(chalk.gray('─'.repeat(50)))
  logger.warn(chalk.cyan(`当前 Karin 版本: ${chalk.bold(karinVersion)}`))
  logger.warn(chalk.gray('─'.repeat(50)))
  logger.warn(chalk.yellow('以下插件包不符合 engines 版本要求:\n'))

  keys.forEach((pluginName, index) => {
    const info = result[pluginName]
    const count = chalk.gray(`[${index + 1}/${keys.length}]`)
    logger.warn(`  ${count} ${chalk.red('✗')} ${chalk.white.bold(pluginName)}`)
    if (info?.version) {
      logger.warn(chalk.gray(`      要求版本: ${info.version || '未知'}`))
    }
  })

  logger.warn('')
  logger.warn(chalk.gray('提示: 这些插件可能无法正常工作，请更新插件或升级 Karin 版本'))
  logger.warn(chalk.gray('─'.repeat(50)))
  logger.warn('')
}

/**
 * 引擎检查器
 */
export const engines = { check, print }
