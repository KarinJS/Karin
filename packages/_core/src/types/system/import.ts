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
