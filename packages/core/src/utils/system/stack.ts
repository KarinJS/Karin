import path from 'node:path'
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

  const paths: string[] = []

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
   * 找到basePath在paths中的索引，value可能存在多个，需要找到最后一个
   */
  const index = paths.map((p, i) => ({ p, i }))
    .filter(item => item.p === basePath)
    .pop()?.i ?? -1

  if (index === -1) {
    throw new Error('解析调用栈失败')
  }

  /** 索引+1就是调用者 */
  const caller = paths[index + 1]
  if (!caller) {
    throw new Error('当前文件是入口文件，并非被动调用')
  }

  return caller
}

/** 在esm环境伪造 __dirname */
Object.defineProperty(global, '__dirname', {
  get () {
    return path.dirname(getCaller(import.meta.url)).replace(/\\/g, '/')
  },
})

/** 在esm环境伪造 __filename */
Object.defineProperty(global, '__filename', {
  get () {
    return getCaller(import.meta.url)
  },
})
