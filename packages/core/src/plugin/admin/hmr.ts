import path from 'node:path'
import chokidar from 'chokidar'
import { cache } from '../system/cache'
import { pkgRemoveModule } from './uninstall'
import { getModuleType, isDev } from '@/env'
import { formatPath } from '@/utils/fs/path'
import { pkgCache, findPkgByFile, pkgLoadModule, pkgSort } from './load'

import type { FSWatcher } from 'chokidar'

/**
 * 监听插件变化的watcher
 */
export let watcher: FSWatcher

/**
 * 初始化插件热重载
 */
export const initPluginHmr = async (
) => {
  /**
   * 监听的目录
   * @description 这里的目录全部都是apps目录
   */
  const watchDirs = new Set<string>()

  Object.values(cache.index).forEach((pkg) => {
    if (!isDev() && pkg.type !== 'app') return
    pkg.allApps.forEach(dir => watchDirs.add(dir))
  })

  watcher = chokidar.watch(Array.from(watchDirs), {
    ignoreInitial: true,
    ignored: /(^|[/\\])\../,
  })

  watcher
    .on('add', file => handleFileChange(file, 'add'))
    .on('change', file => handleFileChange(file, 'change'))
    .on('unlink', file => handleFileChange(file, 'unlink'))

  /** 打印相对路径 */
  const relativePaths = Array.from(watchDirs).map(dir => {
    return path.relative(process.cwd(), dir).replace(/\\/g, '/')
  })

  watchDirs.clear()
  relativePaths.length
    ? logger.info(`\n[hmr] ${logger.magenta('正在监听文件夹')}:\n  ${relativePaths.join('\n  ')}`)
    : logger.info('[hmr] 当前监听的插件列表为空')
}

/**
 * 处理文件变化
 * @param file 文件路径
 * @param action 操作类型
 */
const handleFileChange = async (file: string, action: 'add' | 'change' | 'unlink') => {
  /** 文件后缀 */
  const ext = path.extname(file)
  const exts = getModuleType()
  if (!exts.includes(ext)) return

  const absPath = formatPath(file)
  const pkg = findPkgByFile(absPath)
  if (!pkg) return

  /** 相对路径 */
  const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/')
  logger.debug(`[hmr][${pkg.name}] 文件${action}: ${relativePath}`)

  if (action === 'unlink') {
    pkgRemoveModule(absPath)
    logger.info(`[hmr][${pkg.name}] 已卸载: ${path.basename(file)}`)
    return
  }

  if (action === 'change') {
    pkgRemoveModule(absPath)
  }

  try {
    const result = await pkgLoadModule(pkg.name, absPath, true)
    pkgCache(result, pkg, absPath)
    pkgSort()

    const actionText = action === 'add' ? '新增插件' : '重载完成'
    logger.info(`[hmr][${pkg.name}] ${actionText}: ${path.basename(file)}`)
  } catch (error) {
    logger.error(`[hmr][${pkg.name}] 加载失败:`)
    logger.error(error)
  }
}
