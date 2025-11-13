/**
 * 插件缺失依赖管理器
 * @description 提供插件文件缺失依赖的管理方法
 */
import path from 'node:path'
import { logger } from '@karinjs/logger'
import type { PluginCacheStorage } from './default'

interface ERR_MODULE_NOT_FOUND {
  code: 'ERR_MODULE_NOT_FOUND'
  url?: string
  message: string
}

/**
 * 去重数据结构
 */
export interface DedupedMissingDeps {
  /**
   * 按插件分组的缺失依赖
   */
  byPackage: Record<string, {
    /**
     * 依赖名称
     */
    deps: string[]
    /**
     * 错误数量
     */
    errorCount: number
    /**
     * 影响的文件数量
     */
    fileCount: number
    /**
     * 文件列表
     */
    files: string[]
  }>
  /**
   * 全局统计
   */
  stats: {
    /**
     * 总插件数量
     */
    totalPackages: number
    /**
     * 总依赖数量
     */
    totalDeps: number
    /**
     * 总错误数量
     */
    totalErrors: number
    /**
     * 总文件数量
     */
    totalFiles: number
  }
}

/**
 * 创建缺失依赖管理器
 * @param cache - 插件缓存存储对象
 * @returns 缺失依赖管理器对象
 */
export const createMissingDeps = (cache: PluginCacheStorage) => {
  const getDeduped = (): DedupedMissingDeps => {
    const byPackage: DedupedMissingDeps['byPackage'] = {}
    let totalPackages = 0
    let totalDeps = 0
    let totalErrors = 0
    let totalFiles = 0

    for (const [packageName, files] of Object.entries(cache.missingDeps)) {
      const depsSet = new Set<string>()
      const filesArray = Object.keys(files)
      let errorCount = 0

      for (const [, deps] of Object.entries(files)) {
        for (const dep of deps) {
          if (dep.type === 'import') {
            depsSet.add(dep.deps)
          } else {
            errorCount++
          }
        }
      }

      if (depsSet.size > 0 || errorCount > 0) {
        byPackage[packageName] = {
          deps: Array.from(depsSet),
          errorCount,
          fileCount: filesArray.length,
          files: filesArray,
        }
        totalPackages++
        totalDeps += depsSet.size
        totalErrors += errorCount
        totalFiles += filesArray.length
      }
    }

    return {
      byPackage,
      stats: {
        totalPackages,
        totalDeps,
        totalErrors,
        totalFiles,
      },
    }
  }

  /**
   * 检查是否为模块未找到错误
   * @param error - 错误对象
   * @returns 是否为模块未找到错误
   */
  const isModuleNotFoundError = (error: unknown): error is ERR_MODULE_NOT_FOUND => {
    if (!error || typeof error !== 'object') return false
    return 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND'
  }

  /**
   * 确保包和文件的缓存结构存在
   * @param packageName - 包名
   * @param filePath - 文件路径
   */
  const ensurePackageAndFileExists = (packageName: string, filePath: string): void => {
    if (!cache.missingDeps[packageName]) {
      cache.missingDeps[packageName] = {}
    }
    if (!cache.missingDeps[packageName][filePath]) {
      cache.missingDeps[packageName][filePath] = []
    }
  }

  /**
   * 从错误对象中提取依赖名称
   * @param error - 模块未找到错误
   * @returns 依赖名称
   */
  const extractDependencyName = (error: ERR_MODULE_NOT_FOUND): string => {
    return error.url || error.message.match(/'([^']+)'/)?.[1] || 'unknown'
  }

  /**
   * 添加缺失依赖
   * @param packageName - 包名
   * @param filePath - 文件路径
   * @param error - 模块未找到错误
   */
  const addMissingDependency = (packageName: string, filePath: string, error: ERR_MODULE_NOT_FOUND): void => {
    const depName = extractDependencyName(error)
    const normalizedDepName = depName.replaceAll('\\', '/')

    const isDuplicate = cache.missingDeps[packageName][filePath].some(
      item => item.type === 'import' && item.deps === normalizedDepName
    )

    if (!isDuplicate) {
      cache.missingDeps[packageName][filePath].push({ type: 'import', deps: normalizedDepName })
    }
  }

  /**
   * 添加通用错误
   * @param packageName - 包名
   * @param filePath - 文件路径
   * @param error - 错误对象
   */
  const addGenericError = (packageName: string, filePath: string, error: unknown): void => {
    if (!(error instanceof Error)) return

    const isDuplicate = cache.missingDeps[packageName][filePath].some(
      item => item.type === 'error' &&
        item.error instanceof Error &&
        item.error.message === error.message
    )

    if (!isDuplicate) {
      cache.missingDeps[packageName][filePath].push({ type: 'error', error })
    }
  }

  /**
   * 打印报告头部
   */
  const printReportHeader = (): void => {
    logger.info('-'.repeat(50))
    logger.warn(logger.yellow('📦 缺失依赖报告:'))
  }

  /**
   * 打印报告尾部
   */
  const printReportFooter = (): void => {
    logger.info('')
    logger.info('💡 建议: 安装缺失的依赖或检查错误信息')
    logger.info('-'.repeat(50))
  }

  /**
   * 获取显示路径
   * @param packageName - 包名
   * @param filePath - 文件路径
   * @param showFilePaths - 是否显示完整路径
   * @returns 显示路径
   */
  const getDisplayPath = (packageName: string, filePath: string, showFilePaths: boolean): string => {
    if (showFilePaths) {
      return filePath
    }

    const packageInfo = cache.package.info[packageName]
    if (packageInfo?.abs) {
      return path.relative(packageInfo.abs, filePath)
    }

    return path.basename(filePath)
  }

  /**
   * 打印依赖报告
   * @param dep - 依赖信息
   * @param isLastFile - 是否为最后一个文件
   * @param isLastDep - 是否为最后一个依赖
   */
  const printDependencyReport = (
    dep: { type: 'import' | 'error', deps?: string, error?: unknown },
    isLastFile: boolean,
    isLastDep: boolean
  ): void => {
    const depIndent = isLastFile ? ' ' : '│'
    const depPrefix = isLastDep ? '└─' : '├─'

    if (dep.type === 'import' && dep.deps) {
      logger.info(`${depIndent} ${depPrefix} ${logger.red('❌')} 缺失依赖: ${logger.red(dep.deps)}`)
    } else if (dep.type === 'error') {
      const errorMsg = dep.error instanceof Error ? dep.error.message : String(dep.error)
      logger.info(`${depIndent} ${depPrefix} ${logger.red('💥')} 错误: ${logger.red(errorMsg)}`)
    }
  }

  /**
   * 打印单个文件的报告
   * @param packageName - 包名
   * @param filePath - 文件路径
   * @param deps - 依赖信息
   * @param isLastFile - 是否为最后一个文件
   * @param showFilePaths - 是否显示完整文件路径
   */
  const printFileReport = (
    packageName: string,
    filePath: string,
    deps: Array<{ type: 'import' | 'error', deps?: string, error?: unknown }>,
    isLastFile: boolean,
    showFilePaths: boolean
  ): void => {
    const filePrefix = isLastFile ? '└─' : '├─'
    const displayPath = getDisplayPath(packageName, filePath, showFilePaths)

    logger.info(`${filePrefix} ${logger.gray('📄')} ${logger.gray(displayPath)}`)

    deps.forEach((dep, depIndex) => {
      const isLastDep = depIndex === deps.length - 1
      printDependencyReport(dep, isLastFile, isLastDep)
    })
  }

  /**
   * 打印单个包的报告
   * @param packageName - 包名
   * @param files - 文件及其依赖信息
   * @param showFilePaths - 是否显示完整文件路径
   */
  const printPackageReport = (
    packageName: string,
    files: Record<string, Array<{ type: 'import' | 'error', deps?: string, error?: unknown }>>,
    showFilePaths: boolean
  ): void => {
    logger.info(`${logger.blue('📂')} ${logger.cyan(packageName)}`)

    const fileEntries = Object.entries(files)
    fileEntries.forEach(([filePath, deps], fileIndex) => {
      const isLastFile = fileIndex === fileEntries.length - 1
      printFileReport(packageName, filePath, deps, isLastFile, showFilePaths)
    })
  }

  /**
   * 打印所有包的报告
   * @param showFilePaths - 是否显示完整文件路径
   */
  const printPackageReports = (showFilePaths: boolean): void => {
    const packages = Object.entries(cache.missingDeps)
    packages.forEach(([packageName, files], packageIndex) => {
      const isLastPackage = packageIndex === packages.length - 1
      printPackageReport(packageName, files, showFilePaths)
      if (!isLastPackage) logger.info('')
    })
  }

  return {
    /**
     * 获取所有包的缺失依赖
     * @returns 缺失依赖 Record 对象
     * @example
     * ```ts
     * const allMissingDeps = missingDeps.get()
     * // -> { 'karin-plugin-example': { 'd:/path/to/file.ts': [...] } }
     * ```
     */
    get: () => {
      return { ...cache.missingDeps }
    },

    /**
     * 清空所有缺失依赖记录
     * @example
     * ```ts
     * missingDeps.clear()
     * ```
     */
    clear: () => {
      cache.missingDeps = {}
      logger.info('已清空所有缺失依赖记录')
    },

    /**
     * 获取去重后的缺失依赖数据
     * @returns 去重后的缺失依赖数据
     * @example
     * ```ts
     * const deduped = missingDeps.getDeduped()
     * console.log(deduped.stats.totalDeps) // 总依赖数量
     * ```
     */
    getDeduped,

    /**
     * 打印优雅的缺失依赖报告到控制台
     * @param options - 打印选项
     * @example
     * ```ts
     * missingDeps.printReport()
     * missingDeps.printReport({ showFilePaths: true })
     * ```
     */
    printReport: (options: {
      /**
       * 是否显示文件路径
       */
      showFilePaths?: boolean
    } = {}) => {
      if (Object.keys(cache.missingDeps).length === 0) {
        logger.debug('🎉 没有发现缺失依赖!')
        return
      }

      printReportHeader()
      printPackageReports(options.showFilePaths ?? false)
      printReportFooter()
    },

    /**
     * 获取指定插件的缺失依赖
     * @param packageName - 插件包名
     * @returns 指定插件的缺失依赖
     */
    getByPackage: (packageName: string) => {
      return cache.missingDeps[packageName] || {}
    },

    add: (
      name: string,
      file: string,
      error: unknown
    ) => {
      ensurePackageAndFileExists(name, file)

      if (isModuleNotFoundError(error)) {
        addMissingDependency(name, file, error)
      } else {
        addGenericError(name, file, error)
      }
    },
  }
}
