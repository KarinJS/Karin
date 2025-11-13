import path from 'node:path'

/**
 * 路径分隔符正则表达式
 */
const sep = path.sep === '/' ? /^file:\/\// : /^file:[/]{2,3}/

/**
 * 比较两个路径是否相同
 *
 * 支持不同格式的路径比较，自动处理大小写（Windows）
 *
 * @param path1 - 第一个路径
 * @param path2 - 第二个路径
 * @returns 路径是否相同
 *
 * @example
 * ```typescript
 * // Windows 路径比较
 * isEqual('C:\\Users\\admin', 'C:/Users/admin')
 * // => true
 *
 * // 相对路径比较
 * isEqual('./folder', 'folder')
 * // => true
 *
 * // 大小写不敏感（Windows）
 * isEqual('C:/Users/Admin', 'c:/users/admin')
 * // => true (Windows)
 * // => false (Linux/Mac)
 * ```
 *
 * @public
 */
export const isEqual = (path1: string, path2: string): boolean => {
  // 先直接判断
  if (path1 === path2) return true

  // 格式化后第二次比较
  const format = (p: string) => path.resolve(p.replace(sep, '')).replaceAll('\\', '/')
  const formatted1 = format(path1)
  const formatted2 = format(path2)

  if (formatted1 === formatted2) return true

  // Windows 系统大小写不敏感
  if (process.platform === 'win32') {
    return formatted1.toLowerCase() === formatted2.toLowerCase()
  }

  return false
}

/**
 * 检查目标路径是否是根路径的子路径
 *
 * @param root - 根路径
 * @param target - 目标路径
 * @param shouldResolve - 是否将路径解析为绝对路径
 * @returns 目标路径是否在根路径下
 *
 * @example
 * ```typescript
 * // 检查子路径
 * isSubPath('/home/user', '/home/user/project')
 * // => true
 *
 * // 不是子路径
 * isSubPath('/home/user', '/home/admin')
 * // => false
 *
 * // 使用相对路径（自动解析为绝对路径）
 * isSubPath('./src', './src/utils')
 * // => true
 *
 * // 不解析为绝对路径
 * isSubPath('./src', './src/utils', false)
 * // => true
 * ```
 *
 * @public
 */
export const isSubPath = (root: string, target: string, shouldResolve = true): boolean => {
  if (shouldResolve) {
    root = path.resolve(root)
    target = path.resolve(target)
  }

  // 计算相对路径
  const rel = path.relative(root, target)

  // 检查是否以 `..` 开头或是否为绝对路径
  // 如果是则代表目标路径不处于根路径下
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}
