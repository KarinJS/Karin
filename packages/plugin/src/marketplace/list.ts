/**
 * 插件列表工具
 * @module marketplace/list
 */

import path from 'node:path'
import { promises as fs } from 'node:fs'

/**
 * 判断是否为npm插件
 * @param name 包名称
 * @returns 是否为karin插件
 */
export const isNpmPlugin = async (name: string): Promise<boolean> => {
  try {
    const file = path.join(process.cwd(), 'node_modules', name, 'package.json')
    const content = await fs.readFile(file, 'utf-8')
    const pkg = JSON.parse(content)
    return !!pkg.karin
  } catch {
    return false
  }
}
