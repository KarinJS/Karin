import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { karinPathBase, requireFileSync } from 'node-karin'

/** 插件包绝对路径 */
const pluginDir = fileURLToPath(new URL('../', import.meta.url))
/** 插件包目录名称 */
const pluginName = path.basename(pluginDir)
/** package.json */
const pkg = requireFileSync(path.join(pluginDir, 'package.json'))

/**
 * 插件目录信息
 */
export const dir = {
  /** 根目录绝对路径 */
  pluginDir,
  /** 插件目录名称 */
  pluginName,
  /** package.json */
  pkg,
  /** 插件版本 package.json 的 version */
  get version () {
    return pkg.version
  },
  /** 插件名称 package.json 的 name */
  get name () {
    return pkg.name
  },
  /** 插件默认配置目录 */
  get defConfigDir () {
    return path.join(pluginDir, 'config')
  },
  /** 在`@karinjs`中的绝对路径 */
  get karinPath () {
    return path.join(karinPathBase, pluginName)
  },
  /** 插件配置目录 `@karinjs/karin-plugin-xxx/config` */
  get ConfigDir () {
    return path.join(this.karinPath, 'config')
  },
  /** 插件资源目录 `@karinjs/karin-plugin-xxx/resources` */
  get defResourcesDir () {
    return path.join(this.karinPath, 'resources')
  },
}
