import { packageFinder } from '../package/find'
import { packageList } from '../store'
import { LoadStatus, PluginsLoader, PackageMetaInfoCache } from './base'

import type { DefineConfig } from '../config'
import type { Package } from '../package'

export class PluginsLoaderDev extends PluginsLoader {
  /**
   * 初始化插件加载器
   */
  async init () {
    /** 扫描列表 */
    const dev = await packageFinder.getDevPackages()

    if (dev.length === 0) {
      this.logger.debug('未找到开发环境插件包')
      return this
    }

    /** 设置插件列表缓存 */
    dev.forEach(pkg => packageList.add('dev', pkg))
    await Promise.all(dev.map((pkg) => this.load(pkg)))
    return this
  }

  /**
   * 加载插件
   * @param meta - 插件包元信息
   */
  private async load (meta: PackageMetaInfoCache) {
    this.logger.debug(`🔧 开始加载开发环境插件 ${global.logger.cyan(meta.name)}`)
    const pkg = await this.readPkg(meta.pkg)
    this.logger.debug(`[${meta.name}] 读取 package.json 成功: v${pkg.version}`)

    const { status, config } = await this.resolveLoad(meta, pkg)
    if (status !== LoadStatus.Success) return this

    /** 遵循1.0 加载main -> 加载apps */
    await this.loadMain(meta)
    await this.loadEntry(meta)

    /** 加载完成钩子 */
    await this.callHook(config?.hooks?.['load:done'])

    this.logger.debug(`✅ 开发环境插件 ${global.logger.cyan(meta.name)} 加载完成`)
    return this
  }

  /**
   * 解析并加载插件
   * @param meta - 插件包元信息
   * @param pkg - package.json 内容
   * @returns 加载状态和配置对象
   */
  private async resolveLoad (meta: PackageMetaInfoCache, pkg: Package): Promise<{ status: LoadStatus, config?: DefineConfig }> {
    /** 通过karin.config加载插件 */
    const result = await this.tryLoadV2(meta, pkg)
    if (result.status === LoadStatus.Success) return result

    if (result.status === LoadStatus.Incompatible) {
      this.logger.debug(`[${meta.name}] 插件版本不兼容: ${pkg.engines?.karin}`)
      return result
    }

    /** karin.config 不存在 */
    this.logger.warn(`[${meta.name}] 跳过加载: karin.config.mjs 不存在`)
    return { status: LoadStatus.NotFound }
  }

  /**
   * 尝试通过 karin.config 加载插件（v2）
   * @param meta - 插件包列表缓存对象
   * @param pkg - package.json 内容对象
   * @returns 加载状态和配置对象
   */
  private async tryLoadV2 (
    meta: PackageMetaInfoCache,
    pkg: Package
  ): Promise<{ status: LoadStatus, config?: DefineConfig }> {
    const cfg = await this.getConfig(pkg, meta.abs)
    if (!cfg) return { status: LoadStatus.NotFound }

    const ignoreEngines = cfg.ignoreEngines ?? false
    if (!this.checkVersion(meta.name, pkg.engines?.karin, ignoreEngines)) {
      return { status: LoadStatus.Incompatible }
    }

    /** 准备加载钩子 */
    await this.callHook(cfg?.hooks?.['load:before'])

    await this.setup(meta, { files: cfg.files, public: cfg.public, env: cfg.env })

    const entry = await this.getEntry(meta, cfg.entry)
    this.addCache(meta, 'dev', this.getMain(pkg, meta.abs), entry)

    return { status: LoadStatus.Success, config: cfg }
  }
}
