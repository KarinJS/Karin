/**
 * 动态导入模块成功结果
 */
interface ImportSuccessResult<T = any> {
  status: true,
  data: T
}

/**
 * 动态导入模块失败结果
 */
interface ImportErrorResult {
  status: false,
  data: unknown
}

/**
 * 动态导入模块结果
 */
export type ImportModuleResult<T = any> = ImportSuccessResult<T> | ImportErrorResult

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
