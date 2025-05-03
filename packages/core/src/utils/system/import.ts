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
