/**
 * 插件卸载器
 * @description 提供各类插件实例的卸载方法
 */
import type { PluginCacheStorage } from './default'
import type { InstanceManager } from './instances'

/**
 * 创建插件卸载器
 * @param cache - 插件缓存存储对象
 * @param instances - 插件实例管理器
 * @returns 插件卸载器对象，包含按文件卸载和按包卸载两个方法
 */
export const createUnregister = (cache: PluginCacheStorage, instances: InstanceManager) => {
  return {
    /**
     * 根据文件路径卸载插件
     * @description 从缓存中完全移除指定文件的所有插件实例，包括全局实例、包级实例、索引和统计信息
     * @param filePath - 文件绝对路径
     * @returns 无返回值，如果文件不存在则直接返回
     * @example
     * ```ts
     * unregister.byFile('/path/to/plugin/file.js')
     * ```
     */
    byFile: (filePath: string) => {
      /** 步骤1: 通过文件路径获取所属包名，从 fileToPackage 索引中查找文件对应的包名 */
      const packageName = cache.package.index.fileToPackage[filePath]
      if (!packageName) return

      /** 步骤2: 获取包信息对象，从缓存中获取包的详细信息 */
      const packageInfo = cache.package.info[packageName]
      if (!packageInfo) return

      /** 步骤3: 获取文件信息对象，从包信息中获取该文件的详细信息，包含该文件的所有插件实例 */
      const fileInfo = packageInfo.files[filePath]
      if (!fileInfo) return

      /** 步骤4: 从全局 accept 实例列表中移除该文件的所有 accept 实例 */
      cache.instances.accept = cache.instances.accept.filter(
        item => item.file.absPath !== filePath
      )

      /** 步骤5: 从全局 button 实例列表中移除该文件的所有 button 实例 */
      cache.instances.button = cache.instances.button.filter(
        item => item.file.absPath !== filePath
      )

      /** 步骤6: 从原始 command 实例列表中移除该文件的所有 command 实例 */
      cache.instances.command.raw.command = cache.instances.command.raw.command.filter(
        item => item.file.absPath !== filePath
      )

      /** 步骤7: 从原始 class 插件实例列表中移除该文件的所有 class 实例 */
      cache.instances.command.raw.class = cache.instances.command.raw.class.filter(
        item => item.file.absPath !== filePath
      )

      /** 步骤8: 从全局 task 实例列表中移除该文件的所有 task 实例 */
      cache.instances.task = cache.instances.task.filter(
        item => item.file.absPath !== filePath
      )

      /** 步骤9: 从排序后的 normal 命令缓存中移除该文件的所有命令实例 */
      cache.instances.command.raw.class = cache.instances.command.raw.class.filter(
        item => item.file.absPath !== filePath
      )
      cache.instances.command.raw.command = cache.instances.command.raw.command.filter(
        item => item.file.absPath !== filePath
      )

      /** 步骤10: 从热点缓存中移除该文件的所有命令实例，遍历 hot 缓存对象删除匹配的热点命令 */
      for (const key in cache.instances.command.hot) {
        if (cache.instances.command.hot[key].file.absPath === filePath) {
          delete cache.instances.command.hot[key]
        }
      }

      /** 步骤11: 从所有 handler 分组中移除该文件的 handler 实例，遍历所有 handler 键过滤移除匹配的实例并更新相关统计 */
      for (const key in cache.instances.handler) {
        /** 记录移除前的 handler 数组长度 */
        const originalLength = cache.instances.handler[key].length
        /** 过滤移除该文件的所有 handler 实例 */
        cache.instances.handler[key] = cache.instances.handler[key].filter(
          item => item.file.absPath !== filePath
        )
        /** 计算实际移除的 handler 实例数量 */
        const removedCount = originalLength - cache.instances.handler[key].length

        /** 如果该 key 下的 handler 数组已清空，则删除该 key 并减少 key 计数 */
        if (cache.instances.handler[key].length === 0) {
          delete cache.instances.handler[key]
          cache.stats.handler.key--
        }

        /** 更新 handler 函数总数统计 */
        if (removedCount > 0) {
          cache.stats.handler.fnc -= removedCount
        }
      }

      /** 步骤12: 更新全局统计信息，根据文件实例数量减少各类插件的统计计数 */
      cache.stats.accept -= fileInfo.instances.accept.length
      cache.stats.button -= fileInfo.instances.button.length
      cache.stats.command -= fileInfo.instances.command.length
      cache.stats.task -= fileInfo.instances.task.length
      cache.stats.classPlugin -= fileInfo.instances.class.length

      /** 步骤13: 从包级实例缓存中移除该文件，删除包信息中该文件的所有实例记录 */
      delete packageInfo.files[filePath]

      /** 步骤14: 从 fileToPackage 索引中删除该文件的映射，清理文件到包名的索引关系 */
      delete cache.package.index.fileToPackage[filePath]

      /** 步骤15: 从 packageToFiles 索引数组中移除该文件路径，在包的文件列表中查找并移除该文件路径 */
      const fileIndex = cache.package.index.packageToFiles[packageName]?.indexOf(filePath)
      if (fileIndex !== undefined && fileIndex !== -1) {
        cache.package.index.packageToFiles[packageName].splice(fileIndex, 1)
      }

      /** 步骤16: 标记缓存为脏状态，确保下次访问时重新排序 */
      instances.markAsUnsorted('accept')
      instances.markAsUnsorted('button')
      instances.markAsUnsorted('command')
      instances.markAsUnsorted('handler')
    },

    /**
     * 根据包名卸载插件
     * @description 从缓存中完全移除指定包的所有插件实例，包括该包下的所有文件、全局实例、索引和统计信息
     * @param packageName - 插件包名称
     * @returns 无返回值，如果包不存在则直接返回
     * @example
     * ```ts
     * unregister.byPackage('karin-plugin-example')
     * ```
     */
    byPackage: (packageName: string) => {
      /** 步骤1: 获取包信息对象，从缓存中获取包的详细信息，如果包不存在则直接返回 */
      const packageInfo = cache.package.info[packageName]
      if (!packageInfo) return

      /** 步骤2: 获取包中所有文件的路径列表，从包信息中提取所有文件的绝对路径 */
      const filePaths = Object.keys(packageInfo.files)

      /** 步骤3: 遍历并卸载包中的每个文件，对包中的每个文件执行完整的卸载流程 */
      for (const filePath of filePaths) {
        /** 获取当前文件的详细信息 */
        const fileInfo = packageInfo.files[filePath]
        if (!fileInfo) continue

        /** 步骤3.1: 从全局 accept 实例列表中移除该文件的所有 accept 实例 */
        cache.instances.accept = cache.instances.accept.filter(
          item => item.file.absPath !== filePath
        )

        /** 步骤3.2: 从全局 button 实例列表中移除该文件的所有 button 实例 */
        cache.instances.button = cache.instances.button.filter(
          item => item.file.absPath !== filePath
        )

        /** 步骤3.3: 从原始 command 实例列表中移除该文件的所有 command 实例 */
        cache.instances.command.raw.command = cache.instances.command.raw.command.filter(
          item => item.file.absPath !== filePath
        )

        /** 步骤3.4: 从原始 class 插件实例列表中移除该文件的所有 class 实例 */
        cache.instances.command.raw.class = cache.instances.command.raw.class.filter(
          item => item.file.absPath !== filePath
        )

        /** 步骤3.5: 从全局 task 实例列表中移除该文件的所有 task 实例 */
        cache.instances.task = cache.instances.task.filter(
          item => item.file.absPath !== filePath
        )

        /** 步骤3.6: 从排序后的 normal 命令缓存中移除该文件的所有命令实例 */
        cache.instances.command.raw.class = cache.instances.command.raw.class.filter(
          item => item.file.absPath !== filePath
        )
        cache.instances.command.raw.command = cache.instances.command.raw.command.filter(
          item => item.file.absPath !== filePath
        )

        /** 步骤3.7: 从热点缓存中移除该文件的所有命令实例 */
        for (const key in cache.instances.command.hot) {
          if (cache.instances.command.hot[key].file.absPath === filePath) {
            delete cache.instances.command.hot[key]
          }
        }

        /** 步骤3.8: 从所有 handler 分组中移除该文件的 handler 实例 */
        for (const key in cache.instances.handler) {
          /** 记录移除前的 handler 数组长度 */
          const originalLength = cache.instances.handler[key].length
          /** 过滤移除该文件的所有 handler 实例 */
          cache.instances.handler[key] = cache.instances.handler[key].filter(
            item => item.file.absPath !== filePath
          )
          /** 计算实际移除的 handler 实例数量 */
          const removedCount = originalLength - cache.instances.handler[key].length

          /** 如果该 key 下的 handler 数组已清空，则删除该 key 并减少 key 计数 */
          if (cache.instances.handler[key].length === 0) {
            delete cache.instances.handler[key]
            cache.stats.handler.key--
          }

          /** 更新 handler 函数总数统计 */
          if (removedCount > 0) {
            cache.stats.handler.fnc -= removedCount
          }
        }

        /** 步骤3.9: 更新全局统计信息 */
        cache.stats.accept -= fileInfo.instances.accept.length
        cache.stats.button -= fileInfo.instances.button.length
        cache.stats.command -= fileInfo.instances.command.length
        cache.stats.task -= fileInfo.instances.task.length
        cache.stats.classPlugin -= fileInfo.instances.class.length

        /** 步骤3.10: 从 fileToPackage 索引中删除该文件的映射 */
        delete cache.package.index.fileToPackage[filePath]
      }

      /** 步骤4: 从包信息缓存中删除整个包，移除包的所有元信息和文件记录 */
      delete cache.package.info[packageName]

      /** 步骤5: 从 packageToFiles 索引中删除该包的文件列表，清理包到文件列表的索引关系 */
      delete cache.package.index.packageToFiles[packageName]

      /** 步骤6: 更新包总数统计，减少插件包总数计数 */
      cache.stats.pkg--

      /** 步骤7: 标记缓存为脏状态，确保下次访问时重新排序 */
      instances.markAsUnsorted('accept')
      instances.markAsUnsorted('button')
      instances.markAsUnsorted('command')
      instances.markAsUnsorted('handler')
    },
  }
}
