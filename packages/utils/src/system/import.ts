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
export type importsResult<T = any> = ImportSuccessResult<T> | ImportErrorResult

/**
 * 动态导入模块
 * @param url 模块地址 仅支持绝对路径 无需传递 `file://` 前缀
 * @param options 选项
 * @param options.import 导入方式 `default`-默认导出、`*`-整个模块、`str`-命名导出 默认为`*`
 * @param options.eager 是否立即加载 `(重新加载，不使用缓存)`
 * @example
 * const module = await imports('./module', { import: 'default' })
 * // => 返回值为模块的默认导出
 *
 * const module = await imports('./module', { import: '*' })
 * // => 返回值为模块的整个导出
 *
 * const module = await imports('./module', { import: 'namedExport' })
 * // => 返回值为模块的命名导出
 *
 * const module = await imports('./module', { import: 'default', eager: true })
 * // => 返回值为模块的默认导出 并且会重新加载模块不使用缓存
 */
export const imports = async <T = any> (url: string, options: {
  /**
   * @description 导入方式
   * - `default` - 默认导出
   * - `*` - 整个模块
   * - `str` - 命名导出
   * @default '*'
   */
  import?: 'default' | '*' | string
  /**
   * @description 是否立即加载 `(重新加载，不使用缓存)`
   * @default false
   */
  eager?: boolean
} = {}): Promise<T> => {
  const { eager = false, import: importType = '*' } = options

  const isFilePath = /^([a-zA-Z]:)?[/\\]|^\.\.?[/\\]/.test(url)
  const timestamp = eager ? `?t=${Date.now()}` : ''
  const prefix = isFilePath ? `file://${url}` : `${url}`
  const importUrl = `${prefix}${timestamp}`

  const module = await import(importUrl)
  return importType === '*' ? module : module[importType]
}
