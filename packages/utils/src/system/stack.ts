import { fileURLToPath } from 'node:url'

/**
 * 获取调用者
 * @param url `import.meta.url`
 * @param customError 可选的自定义错误对象
 * @returns 返回不包含`file://`的文件路径
 */
export const getCaller = (url: string, customError?: Error): string => {
  if (!url) {
    throw new TypeError('请传入 import.meta.url 作为基本参数')
  }

  const stack = (customError || new Error()).stack?.split('\n')
  if (!stack || stack.length < 3) {
    throw new Error('解析调用栈失败')
  }

  /**
   * 在tsx环境下 不存在`file://`
   * Windows: `file:///`
   * Linux: `file://`
   * MacOS: `file://`
   */

  let paths: string[] = []

  /**
   * 提取所有paths
   */
  for (let i = 0; i < stack.length; i++) {
    const line = stack[i]
    if (typeof line !== 'string') continue
    const match = line.match(/\(([^)]+):\d+:\d+\)$/) || line.match(/at\s+([^(]+):\d+:\d+$/)

    if (!match || !match[1]) continue

    let file = match[1].trim()
    if (file.includes('node:internal')) continue

    /** 处理文件路径 */
    if (file.startsWith('file://')) {
      file = fileURLToPath(file)
    }

    /** 去掉后面的: */
    paths.push(file.replace(/\\/g, '/').replace(/:\d+:\d+$/, ''))
  }

  if (paths.length === 0) {
    throw new Error('解析调用栈失败')
  }

  const basePath = fileURLToPath(url).replace(/\\/g, '/')
  /**
   * 过滤basePath在paths中的所有值
   */
  paths = paths.filter(v => v !== basePath)
  /**
   * 过来当前文件本身
   */

  if (paths.length === 0) {
    throw new Error('解析调用栈失败')
  }

  /** 0调用者 */
  const caller = paths[0]
  if (!caller) {
    throw new Error('当前文件是入口文件，并非被动调用')
  }

  return caller
}
