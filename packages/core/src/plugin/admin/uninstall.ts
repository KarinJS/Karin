import { cache } from '../cache'
import { isPathEqual } from '@/utils/fs/path'

/**
 * 卸载插件包
 * @param pkgName 插件包名称
 */
export const pkgRemoves = async (pkgName: string) => {
  cache.accept = cache.accept.filter(p => p.pkg.name !== pkgName)
  cache.command = cache.command.filter(p => p.pkg.name !== pkgName)
  cache.task = cache.task.filter(p => p.pkg.name !== pkgName)
  cache.button = cache.button.filter(p => p.pkg.name !== pkgName)

  // 清理handler缓存
  Object.keys(cache.handler).forEach(key => {
    cache.handler[key] = cache.handler[key].filter(p => p.pkg.name !== pkgName)
  })
}

/**
 * 卸载单个插件模块
 * @param file 插件模块路径
 */
export const pkgRemoveModule = async (file: string) => {
  cache.accept = cache.accept.filter(p => !isPathEqual(p.file.absPath, file))
  cache.command = cache.command.filter(p => !isPathEqual(p.file.absPath, file))
  cache.task = cache.task.filter(p => {
    const isEqual = isPathEqual(p.file.absPath, file)
    if (isEqual && p.schedule) {
      p.schedule.cancel()
    }
    return !isEqual
  })
  cache.button = cache.button.filter(p => !isPathEqual(p.file.absPath, file))

  // 清理handler缓存
  Object.keys(cache.handler).forEach(key => {
    cache.handler[key] = cache.handler[key].filter(p => !isPathEqual(p.file.absPath, file))
  })
}
