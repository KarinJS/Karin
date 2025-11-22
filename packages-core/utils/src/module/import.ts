/**
 * 动态导入模块成功结果
 */
interface ImportSuccessResult<T = any> {
  status: true
  data: T
}

/**
 * 动态导入模块失败结果
 */
interface ImportErrorResult {
  status: false
  data: unknown
}

/**
 * 动态导入模块结果
 */
export type importsResult<T = any> = ImportSuccessResult<T> | ImportErrorResult

/**
 * 模块导入选项
 */
export interface ImportOptions {
  /**
   * 导入方式
   * - `default`: 默认导出
   * - `*`: 整个模块
   * - `string`: 命名导出
   * @default '*'
   */
  import?: 'default' | '*' | string

  /**
   * 是否立即加载（重新加载，不使用缓存）
   * @default false
   */
  eager?: boolean
}

/**
 * 动态导入模块（带状态返回）
 *
 * @param url - 模块地址，仅支持绝对路径，无需传递 `file://` 前缀
 * @param isRefresh - 是否重新加载，不使用缓存
 * @returns 包含状态和数据的结果对象
 *
 * @example
 * ```typescript
 * // 导入模块
 * const result = await importWithStatus('./module.js')
 * if (result.status) {
 *   console.log(result.data)
 * } else {
 *   console.error(result.data)
 * }
 *
 * // 强制重新加载
 * const result2 = await importWithStatus('./module.js', true)
 * ```
 *
 * @see {@link imports} 直接返回模块的版本
 *
 * @public
 */
export const importWithStatus = async <T = any>(
  url: string,
  isRefresh = false
): Promise<importsResult<T>> => {
  try {
    const module = await import(`file://${url}${isRefresh ? `?t=${Date.now()}` : ''}`)
    return { status: true, data: module }
  } catch (error) {
    return { status: false, data: error }
  }
}

/**
 * 动态导入模块
 *
 * @param url - 模块地址，仅支持绝对路径，无需传递 `file://` 前缀
 * @param options - 导入选项
 * @returns 导入的模块
 *
 * @throws 当模块导入失败时抛出错误
 *
 * @example
 * ```typescript
 * // 导入整个模块（默认）
 * const module = await imports('./module.js')
 * // => 返回值为模块的所有导出
 *
 * // 导入默认导出
 * const module = await imports('./module.js', { import: 'default' })
 * // => 返回值为模块的默认导出
 *
 * // 导入命名导出
 * const fn = await imports('./module.js', { import: 'namedExport' })
 * // => 返回值为模块的命名导出
 *
 * // 强制重新加载（不使用缓存）
 * const module = await imports('./module.js', { eager: true })
 * // => 返回值为重新加载的模块
 *
 * // 组合使用
 * const defaultExport = await imports('./module.js', {
 *   import: 'default',
 *   eager: true
 * })
 * ```
 *
 * @see {@link importWithStatus} 返回带状态的版本
 *
 * @public
 */
export const imports = async <T = any>(
  url: string,
  options: ImportOptions = {}
): Promise<T> => {
  const { eager = false, import: importType = '*' } = options

  const isFilePath = /^([a-zA-Z]:)?[/\\]|^\.\.?[/\\]/.test(url)
  const timestamp = eager ? `?t=${Date.now()}` : ''
  const prefix = isFilePath ? `file://${url}` : `${url}`
  const importUrl = `${prefix}${timestamp}`

  const module = await import(importUrl)
  return importType === '*' ? module : module[importType]
}
