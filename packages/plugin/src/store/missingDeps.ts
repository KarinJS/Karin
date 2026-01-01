/**
 * 缺失依赖管理器
 * @description 独立的依赖错误追踪模块
 */
import path from 'node:path'
import { pkgRegistry } from '../pkg'

interface ERR_MODULE_NOT_FOUND {
  code: 'ERR_MODULE_NOT_FOUND'
  url?: string
  message: string
}

interface MissingDepEntry {
  type: 'import' | 'error'
  deps?: string
  error?: unknown
}

type MissingDepsStorage = Record<string, Record<string, MissingDepEntry[]>>

/**
 * 去重数据结构
 */
export interface DedupedMissingDeps {
  byPackage: Record<string, {
    deps: string[]
    errorCount: number
    fileCount: number
    files: string[]
  }>
  stats: {
    totalPackages: number
    totalDeps: number
    totalErrors: number
    totalFiles: number
  }
}

function createMissingDeps () {
  const storage: MissingDepsStorage = {}

  const isModuleNotFoundError = (error: unknown): error is ERR_MODULE_NOT_FOUND => {
    if (!error || typeof error !== 'object') return false
    return 'code' in error && error.code === 'ERR_MODULE_NOT_FOUND'
  }

  const ensurePackageAndFileExists = (packageName: string, filePath: string): void => {
    if (!storage[packageName]) {
      storage[packageName] = {}
    }
    if (!storage[packageName][filePath]) {
      storage[packageName][filePath] = []
    }
  }

  const extractDependencyName = (error: ERR_MODULE_NOT_FOUND): string => {
    return error.url || error.message.match(/'([^']+)'/)?.[1] || 'unknown'
  }

  return {
    /**
     * 获取所有缺失依赖
     */
    get (): MissingDepsStorage {
      return { ...storage }
    },

    /**
     * 清空所有记录
     */
    clear (): void {
      for (const key of Object.keys(storage)) {
        delete storage[key]
      }
    },

    /**
     * 添加缺失依赖
     */
    add (name: string, file: string, error: unknown): void {
      ensurePackageAndFileExists(name, file)

      if (isModuleNotFoundError(error)) {
        const depName = extractDependencyName(error)
        const normalizedDepName = depName.replaceAll('\\', '/')

        const isDuplicate = storage[name][file].some(
          item => item.type === 'import' && item.deps === normalizedDepName
        )

        if (!isDuplicate) {
          storage[name][file].push({ type: 'import', deps: normalizedDepName })
        }
      } else if (error instanceof Error) {
        const isDuplicate = storage[name][file].some(
          item => item.type === 'error' &&
            item.error instanceof Error &&
            (item.error as Error).message === error.message
        )

        if (!isDuplicate) {
          storage[name][file].push({ type: 'error', error })
        }
      }
    },

    /**
     * 获取指定包的缺失依赖
     */
    getByPackage (packageName: string): Record<string, MissingDepEntry[]> {
      return storage[packageName] || {}
    },

    /**
     * 获取去重后的数据
     */
    getDeduped (): DedupedMissingDeps {
      const byPackage: DedupedMissingDeps['byPackage'] = {}
      let totalPackages = 0
      let totalDeps = 0
      let totalErrors = 0
      let totalFiles = 0

      for (const [packageName, files] of Object.entries(storage)) {
        const depsSet = new Set<string>()
        const filesArray = Object.keys(files)
        let errorCount = 0

        for (const deps of Object.values(files)) {
          for (const dep of deps) {
            if (dep.type === 'import' && dep.deps) {
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
        stats: { totalPackages, totalDeps, totalErrors, totalFiles },
      }
    },

    /**
     * 打印报告
     */
    printReport (options: { showFilePaths?: boolean } = {}): void {
      if (Object.keys(storage).length === 0) {
        logger.debug('🎉 没有发现缺失依赖!')
        return
      }

      const showFilePaths = options.showFilePaths ?? false

      logger.info('-'.repeat(50))
      logger.warn(logger.yellow('📦 缺失依赖报告:'))

      const packages = Object.entries(storage)
      packages.forEach(([packageName, files], packageIndex) => {
        logger.info(`${logger.blue('📂')} ${logger.cyan(packageName)}`)

        const fileEntries = Object.entries(files)
        fileEntries.forEach(([filePath, deps], fileIndex) => {
          const isLastFile = fileIndex === fileEntries.length - 1
          const filePrefix = isLastFile ? '└─' : '├─'

          let displayPath = filePath
          if (!showFilePaths) {
            const pkgInfo = pkgRegistry.get(packageName)
            if (pkgInfo?.abs) {
              displayPath = path.relative(pkgInfo.abs, filePath)
            } else {
              displayPath = path.basename(filePath)
            }
          }

          logger.info(`${filePrefix} ${logger.gray('📄')} ${logger.gray(displayPath)}`)

          deps.forEach((dep, depIndex) => {
            const isLastDep = depIndex === deps.length - 1
            const depIndent = isLastFile ? ' ' : '│'
            const depPrefix = isLastDep ? '└─' : '├─'

            if (dep.type === 'import' && dep.deps) {
              logger.info(`${depIndent} ${depPrefix} ${logger.red('❌')} 缺失依赖: ${logger.red(dep.deps)}`)
            } else if (dep.type === 'error') {
              const errorMsg = dep.error instanceof Error ? dep.error.message : String(dep.error)
              logger.info(`${depIndent} ${depPrefix} ${logger.red('💥')} 错误: ${logger.red(errorMsg)}`)
            }
          })
        })

        if (packageIndex !== packages.length - 1) logger.info('')
      })

      logger.info('')
      logger.info('💡 建议: 安装缺失的依赖或检查错误信息')
      logger.info('-'.repeat(50))
    },
  }
}

/** 缺失依赖管理器单例 */
export const missingDeps = createMissingDeps()
