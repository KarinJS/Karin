import chokidar from 'chokidar'
import path from 'node:path'
import { isTsx } from '@/env'
import { cache } from './cache'
import { LoaderPlugin } from './loader'
import { listeners } from '@/core/internal'
import type { PkgInfo } from '@/types/plugin'

interface WatchDirEvent {
  dir: string
}

/**
 * 热更新监听器
 */
export class WatcherPlugin {
  private watcher: chokidar.FSWatcher | null = null
  private watchDirs = new Set<string>()
  private loader: LoaderPlugin

  constructor (loader: LoaderPlugin) {
    this.loader = loader
  }

  /**
   * 初始化监听
   */
  public init () {
    // 仅在开发环境下监听所有类型插件
    const isDev = process.env.NODE_ENV === 'development'

    // 收集需要监听的目录
    Object.values(cache.index).forEach((pkg) => {
      if (!isDev && pkg.type !== 'app') return
      pkg.allApps.forEach(dir => this.watchDirs.add(dir))
    })

    // 等待2秒后开始监听
    setTimeout(() => {
      this.startWatch()
    }, 2000)

    // 监听新的监听目录
    listeners.on('watch-dir', ({ dir }: WatchDirEvent) => {
      if (typeof dir === 'string') {
        this.watchDirs.add(dir)
        this.restartWatch()
      }
    })
  }

  /**
   * 开始监听
   */
  private startWatch () {
    this.watcher = chokidar.watch(Array.from(this.watchDirs), {
      ignoreInitial: true,
      ignored: /(^|[/\\])\../,
    })

    this.watcher
      .on('add', file => this.handleFileChange(file, 'add'))
      .on('change', file => this.handleFileChange(file, 'change'))
      .on('unlink', file => this.handleFileChange(file, 'unlink'))

    /** 打印相对路径 */
    const relativePaths = Array.from(this.watchDirs).map(dir => path.relative(process.cwd(), dir).replace(/\\/g, '/'))
    logger.debug('\n[hmr] 开始监听文件夹:\n', relativePaths.join('\n'))
  }

  /**
   * 重启监听
   */
  private restartWatch () {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
    this.startWatch()
  }

  /**
   * 处理文件变化
   * @param file 文件路径
   * @param action 操作类型
   */
  private async handleFileChange (file: string, action: 'add' | 'change' | 'unlink') {
    // 检查文件后缀
    const ext = path.extname(file)
    const exts = isTsx() ? ['.ts', '.js'] : ['.js']
    if (!exts.includes(ext)) return

    const absPath = path.resolve(file)
    const pkg = this.findPkgByFile(absPath)
    if (!pkg) return

    /** 相对路径 */
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/')
    logger.debug(`[hmr][${pkg.name}] 文件${action}: ${relativePath}`)

    if (action === 'unlink') {
      this.unloadPlugin(absPath)
      logger.info(`[hmr][${pkg.name}] 已卸载: ${path.basename(file)}`)
      return
    }

    if (action === 'change') {
      this.unloadPlugin(absPath)
    }

    try {
      const result = await this.loader.importApp(pkg.name, absPath, true)
      this.loader.cachePlugin(result, pkg, absPath)
      this.loader.sort()

      const actionText = action === 'add' ? '新增插件' : '重载完成'
      logger.info(`[hmr][${pkg.name}] ${actionText}: ${path.basename(file)}`)
    } catch (error) {
      logger.error(`[hmr][${pkg.name}] 加载失败:`, error)
    }
  }

  /**
   * 根据文件路径查找对应的插件包
   */
  private findPkgByFile (file: string): PkgInfo | undefined {
    return Object.values(cache.index).find(pkg =>
      pkg.apps.includes(file) || pkg.allApps.some(dir => file.startsWith(dir))
    )
  }

  /**
   * 卸载插件
   */
  private unloadPlugin (file: string) {
    cache.accept = cache.accept.filter(p => p.file.absPath !== file)
    cache.command = cache.command.filter(p => p.file.absPath !== file)
    cache.task = cache.task.filter(p => {
      if (p.file.absPath === file && p.schedule) {
        p.schedule.cancel()
      }
      return p.file.absPath !== file
    })
    cache.button = cache.button.filter(p => p.file.absPath !== file)

    // 清理handler缓存
    Object.keys(cache.handler).forEach(key => {
      cache.handler[key] = cache.handler[key].filter(p => p.file.absPath !== file)
    })
  }
}
