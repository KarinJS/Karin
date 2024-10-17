import path from 'node:path'
import { PluginInfo } from '@/plugin/types'
import { requireFile } from '@/utils/require'

/**
 * 获取插件的package.json信息
 * @param name 插件名称
 * @returns package.json对象
 */
export const pluginPkg = async (name: string) => {
  const filename = path.join(process.cwd(), 'node_modules', name)
  const pkg = await requireFile(filename + '/package.json') as PluginInfo['pkg']
  return {
    /** npm包名 */
    name,
    /** npm包路径 */
    path: filename,
    /** npm包的package.json对象 */
    data: pkg,
    /** 是否为npm插件 */
    isPlugin: !!pkg.karin,
  }
}
