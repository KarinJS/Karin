import fs from 'node:fs'
import path from 'node:path'

/**
 * INI文件解析器，专用于解析和保存 .npmrc 格式的文件
 */
interface INIParser {
  /**
   * 从指定路径读取并解析INI文件
   * @param filePath - 文件路径
   * @returns 解析后的键值对对象
   */
  read: (filePath: string) => Record<string, string>

  /**
   * 将键值对对象保存到指定路径
   * @param data - 要保存的键值对数据
   * @param filePath - 保存的文件路径
   * @returns 是否保存成功
   */
  write: (data: Record<string, string>, filePath: string) => boolean
}

/**
 * 创建并返回INI解析器对象
 * @returns INI解析器对象
 */
export const createINIParser = (): INIParser => {
  /**
   * 解析INI格式的字符串内容
   * @param content - INI格式的文件内容
   * @returns 解析后的键值对对象
   */
  const parseINIContent = (content: string): Record<string, string> => {
    const result: Record<string, string> = {}

    // 按行分割内容
    const lines = content.split(/\r?\n/)

    for (const line of lines) {
      // 跳过空行和注释行
      const trimmedLine = line.trim()
      if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith(';')) {
        continue
      }

      // 解析键值对
      const separatorIndex = trimmedLine.indexOf('=')
      if (separatorIndex !== -1) {
        const key = trimmedLine.slice(0, separatorIndex).trim()
        const value = trimmedLine.slice(separatorIndex + 1).trim()

        if (key) {
          result[key] = value
        }
      }
    }

    return result
  }

  /**
   * 将键值对对象转换为INI格式的字符串
   * @param data - 键值对数据
   * @returns INI格式的字符串
   */
  const stringifyINI = (data: Record<string, string>): string => {
    return Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
  }

  return {
    /**
     * 从指定路径读取并解析INI文件
     * @param filePath - 文件路径
     * @returns 解析后的键值对对象
     */
    read: (filePath: string): Record<string, string> => {
      try {
        const resolvedPath = path.resolve(filePath)
        if (!fs.existsSync(resolvedPath)) {
          return {}
        }

        const content = fs.readFileSync(resolvedPath, 'utf-8')
        return parseINIContent(content)
      } catch (error) {
        console.error(`读取INI文件失败: ${error}`)
        return {}
      }
    },
    /**
     * 将键值对对象保存到指定路径
     * @param data - 要保存的键值对数据
     * @param filePath - 保存的文件路径
     * @returns 是否保存成功
     */
    write: (data: Record<string, string>, filePath: string): boolean => {
      try {
        const resolvedPath = path.resolve(filePath)
        const content = stringifyINI(data)

        // 确保目录存在
        const dirname = path.dirname(resolvedPath)
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true })
        }

        fs.writeFileSync(resolvedPath, content, 'utf-8')
        return true
      } catch (error) {
        console.error(`保存INI文件失败: ${error}`)
        return false
      }
    },
  }
}

/**
 * INI解析器
 */
export const ini = createINIParser()
