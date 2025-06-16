import type { ImportModuleResult } from '@/types/system'

/**
 * 动态导入模块
 * @param url 模块地址 仅支持绝对路径 无需传递 `file://` 前缀
 * @param isRefresh 是否重新加载 不使用缓存
 */
export const importModule = async <T = any> (
  url: string,
  isRefresh = false
): Promise<ImportModuleResult<T>> => {
  try {
    const module = await import(`file://${url}${isRefresh ? `?t=${Date.now()}` : ''}`)
    return { status: true, data: module }
  } catch (error) {
    return { status: false, data: error }
  }
}

/**
 * 动态导入模块
 * @param url 模块地址 仅支持绝对路径 无需传递 `file://` 前缀
 * @param options 选项
 * @param options.isRefresh 是否重新加载 不使用缓存
 * @param options.isImportDefault 是否返回默认导出
 */
export const imports = async <T = any> (url: string, options: {
  isRefresh?: boolean
  isImportDefault?: boolean
} = {}): Promise<T> => {
  const { isRefresh = false, isImportDefault = true } = options
  const module = await import(`file://${url}${isRefresh ? `?t=${Date.now()}` : ''}`)
  if (isImportDefault) {
    return module.default
  }
  return module
}
