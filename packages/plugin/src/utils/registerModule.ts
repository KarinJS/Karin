/**
 * 模块注册工具
 * @description 遍历导入的模块，自动识别并注册插件实例
 */
import type { PackageMetaInfoCache } from '../package/find'

/**
 * 注册导入的模块中的插件
 * @description 遍历模块导出，识别插件实例并自动注册
 * 现在使用 queueMicrotask 延迟注册机制，这里只需要确保模块被正确加载
 * @param meta - 插件包元信息
 * @param file - 文件路径
 * @param result - 导入的模块对象
 */
export const registerModule = async (
  meta: PackageMetaInfoCache,
  file: string,
  result: Record<string, unknown>
): Promise<void> => {
  /**
   * 现在的插件系统使用 queueMicrotask 延迟注册机制
   * 插件在被 import 的时候会自动通过 ctx 获取上下文并在微任务中注册
   * 所以这里不需要做额外的处理，只需要确保模块被正确加载即可
   */
  if (result) {
    logger.debug(`[${meta.name}] 模块已加载: ${file}`)
  }
}
