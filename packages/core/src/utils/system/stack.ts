import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 获取调用者
 * @param customError 可选的自定义错误对象
 * @returns 返回不包含`file://`的文件路径
 */
export const getCaller = (customError?: Error): string => {
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

  /**
   * 从索引3开始遍历调用栈，跳过Error和parseStack自身、command
   */
  for (let i = 3; i < stack.length; i++) {
    const line = stack[i]
    const match = line.match(/\(([^)]+):\d+:\d+\)$/) || line.match(/at\s+([^(]+):\d+:\d+$/)

    if (match && match[1]) {
      const file = match[1].trim()

      /**
       * 处理文件路径
       */
      if (file.startsWith('file://')) {
        return fileURLToPath(file).replace(/\\/g, '/')
      }

      const prefix = os.platform() === 'win32' ? 'file:///' : 'file://'
      return fileURLToPath(`${prefix}${file}`).replace(/\\/g, '/')
    }
  }

  throw new Error('解析调用栈失败')
}

/** 在esm环境伪造 __dirname */
Object.defineProperty(global, '__dirname', {
  get () {
    return path.dirname(getCaller())
  },
})

/** 在esm环境伪造 __filename */
Object.defineProperty(global, '__filename', {
  get () {
    return getCaller()
  },
})
