/**
 * 内部工具函数
 * 用于获取ESM缓存
 */

/**
 * ESM模块加载缓存
 * 支持Node.js 18+
 */
const loadCache = async (): Promise<Map<string, unknown>> => {
  try {
    // 尝试获取较新版本Node.js的ESM缓存(Node.js v20.6+)
    // @ts-ignore - 访问内部API
    const module = await import('node:internal/modules/esm/loader')
    return module.default.getOrInitializeCascadedLoader().loadCache
  } catch (error) {
    // 尝试获取较旧版本Node.js的ESM缓存(Node.js v18+)
    // @ts-ignore - 访问内部API
    const module = await import('node:internal/process/esm_loader')
    return module.default.esmLoader
  }
}

/**
 * 清理模块缓存
 * @param fileURL 模块的URL数组
 */
export const clearModuleCaches = async (fileURLs: string | string[]): Promise<void> => {
  const urls = Array.isArray(fileURLs) ? fileURLs : [fileURLs]
  const cache = await loadCache()
  logger.debug(`[clearModuleCaches] 清理 ${urls.length} 个模块缓存`)

  urls.forEach(url => {
    const exists = cache.has(url)
    if (exists) {
      cache.delete(url)
      logger.debug(`[clearModuleCaches] 已删除缓存: ${url}`)
    } else {
      logger.debug(`[clearModuleCaches] 缓存不存在: ${url}`)
    }
  })
}
/**
 * 传入一个模块URL，返回所有依赖该模块的模块URL数组，如果依赖该模块的模块还依赖了其他模块，则也会包含这些模块的URL。
 * @param moduleUrl 模块的URL
 * @param exclude 排除的模块URL数组
 * @returns 依赖该模块的模块URL数组
 */
export const findDependentModules = async (moduleUrl: string, exclude: string[] = []): Promise<string[]> => {
  /** 依赖模块URL数组 */
  const result: string[] = []
  /** 已访问过的模块URL集合，避免循环依赖导致的无限递归 */
  const visited = new Set<string>(exclude)
  /** 处理中的模块URL集合，避免重复处理 */
  const processing = new Set<string>()
  /** 加载缓存 */
  const cache = await loadCache()

  const collectDependents = async (url: string): Promise<void> => {
    if (visited.has(url) || processing.has(url)) return

    /** 标记为处理中 */
    processing.add(url)
    /** 标记为已访问 */
    visited.add(url)
    /** 依赖该模块的模块URL */
    result.push(url)

    /** 收集需要并发处理的依赖模块URL */
    const dependentUrls: string[] = []

    /** 遍历整个缓存，查找依赖当前模块的其他模块 */
    const cacheEntries = Array.from(cache.entries())

    /** 并发处理缓存条目的检查 */
    await Promise.allSettled(cacheEntries.map(async (entry) => {
      const [cacheUrl, moduleData] = entry as [string, Record<string, any>]
      /** 跳过模块  */
      if (cacheUrl.includes('node_modules') || cacheUrl.includes('node:') || visited.has(cacheUrl)) {
        return
      }

      /** 检查这个模块是否依赖当前模块 */
      if (moduleData?.javascript?.linked || moduleData?.linked) {
        try {
          const linkedModules = await moduleData.javascript?.linked || moduleData.linked
          const modules = Array.from(linkedModules)

          for (const linkedModule of modules) {
            // @ts-ignore
            if (linkedModule.url === url) {
              dependentUrls.push(cacheUrl)
              break
            }
          }
        } catch (error) {
          /** 忽略链接错误，继续处理其他模块 */
          console.error(`Error processing linked modules for ${cacheUrl}:`, error)
        }
      }
    })
    )

    /** 并发递归收集依赖者 */
    if (dependentUrls.length > 0) {
      await Promise.allSettled(
        dependentUrls.map(dependentUrl => collectDependents(dependentUrl))
      )
    }

    /** 处理完成，移除处理中标记 */
    processing.delete(url)
  }

  await collectDependents(moduleUrl)
  return result
}
