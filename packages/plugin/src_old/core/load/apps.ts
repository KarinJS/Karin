import { packageFinder } from '../../package/find'
import { pluginCache } from '../../cache'
import { PluginsLoader } from './core'

import type { PackageMetaInfoCache } from '../../cache'

export class PluginsLoaderApps extends PluginsLoader {
  /**
   * 初始化插件加载器
   */
  async init () {
    /** 扫描列表 */
    const { apps } = await packageFinder.getPluginsPackages()
    /** 设置插件列表缓存 */
    pluginCache.list.set('apps', apps)
    await Promise.all(apps.map((pkg) => this.load(pkg)))
    return this
  }

  /**
   * 加载插件
   * @param meta - 插件包元信息
   */
  private async load (meta: PackageMetaInfoCache) {
    this.logger.debug(`📁 开始加载 Apps 插件 ${global.logger.cyan(meta.name)}`)
    const pkg = await this.readPkg(meta.pkg)
    this.logger.debug(`[${meta.name}] 读取 package.json 成功: v${pkg.version}`)

    /** apps 类型直接加载根目录入口文件 */
    await this.setup(meta, { files: ['config', 'data'] })

    /** 获取根目录下的所有入口文件 */
    const entry = await this.getEntry(meta, './')

    if (entry.length === 0) {
      this.logger.warn(`[${meta.name}] 未找到任何入口文件`)
      return this
    }

    /** apps 类型没有 main 文件，直接传 null */
    this.addCache(meta, 'apps', null, entry)

    await this.loadEntry(meta)

    this.logger.debug(`✅ Apps 插件 ${global.logger.cyan(meta.name)} 加载完成`)
    return this
  }
}
