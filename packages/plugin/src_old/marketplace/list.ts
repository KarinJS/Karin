import path from 'node:path'
import { requireFile } from '@karinjs/utils'

/**
 * 判断是否为npm插件
 * @param name 包名称
 * @returns 是否为karin插件
 */
export const isNpmPlugin = async (name: string): Promise<boolean> => {
  try {
    const file = path.join(process.cwd(), 'node_modules', name, 'package.json')
    const pkg = await requireFile(file)
    return !!pkg.karin
  } catch {
    return false
  }
}
