import { packageFinder } from '../../package/find'
import { pluginCache } from '../../cache'
import { LoadStatus, PluginsLoader } from './core'

import type { DefineConfig } from '../../config'
import type { Package } from '../../package'
import type { PackageMetaInfoCache } from '../../cache'

export class PluginsLoaderNpm extends PluginsLoader {
  /**
   * 初始化插件加载器
   */
  async init () {
    /** 扫描列表 */
    const npm = await packageFinder.getNpmPackages()
    /** 设置插件列表缓存 */
    pluginCache.list.set('npm', npm)
    await Promise.all(npm.map((pkg) => this.load(pkg)))
    return this
  }

  /**
   * 加载插件
   * @param meta - 插件包元信息
   */
  private async load (meta: PackageMetaInfoCache) {
    this.logger.debug(`📦 开始加载插件 ${global.logger.cyan(meta.name)}`)
    const pkg = await this.readPkg(meta.pkg)
    this.logger.debug(`[${meta.name}] 读取 package.json 成功: v${pkg.version}`)

    const { status, config } = await this.resolveLoad(meta, pkg)
    if (status !== LoadStatus.Success) return this

    /** 遵循1.0 加载main -> 加载apps */
    await this.loadMain(meta)
    await this.loadEntry(meta)

    /** 加载完成钩子 */
    await this.callHook(config?.hooks?.['load:done'])

    this.logger.debug(`✅ 插件 ${global.logger.cyan(meta.name)} 加载完成`)
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

    /** karin.config 不存在，尝试通过 package.karin 加载插件 */
    this.logger.debug(`[${meta.name}] karin.config.mjs 不存在，尝试通过 package.karin 加载插件`)
    const pkgResult = await this.tryLoadV1(meta, pkg)

    if (pkgResult === LoadStatus.NotFound) {
      this.logger.warn(`[${meta.name}] 跳过加载: karin.config.mjs 和 package.karin 均不存在`)
      return { status: pkgResult }
    }

    if (pkgResult === LoadStatus.Incompatible) {
      this.logger.debug(`[${meta.name}] 插件版本不兼容: ${pkg.engines?.karin}`)
      return { status: pkgResult }
    }

    return { status: pkgResult }
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

    const ignoreEngines = cfg.ignoreEngines ?? pkg.karin?.ignoreEngines ?? false
    if (!this.checkVersion(meta.name, pkg.engines?.karin, ignoreEngines)) {
      return { status: LoadStatus.Incompatible }
    }

    /** 准备加载钩子 */
    await this.callHook(cfg?.hooks?.['load:before'])
    await this.setup(meta, { files: cfg.files, public: cfg.public, env: cfg.env })

    const entry = await this.getEntry(meta, cfg.entry)
    this.addCache(meta, 'npm', this.getMain(pkg, meta.abs), entry)

    return { status: LoadStatus.Success, config: cfg }
  }

  /**
   * 尝试通过 package.karin 加载插件（v1）
   * @param meta - 插件包列表缓存对象
   * @param pkg - package.json 内容对象
   * @returns 加载状态
   */
  private async tryLoadV1 (
    meta: PackageMetaInfoCache,
    pkg: Package
  ): Promise<LoadStatus> {
    if (!pkg.karin) return LoadStatus.NotFound

    const ignoreEngines = pkg.karin.ignoreEngines ?? false
    if (!this.checkVersion(meta.name, pkg.engines?.karin, ignoreEngines)) {
      return LoadStatus.Incompatible
    }

    await this.setupV1(meta, { files: pkg.karin.files, public: pkg.karin.static, env: pkg.karin.env })

    const [app, apps] = await Promise.all([
      this.getEntry(meta, pkg.karin.app),
      this.getEntry(meta, pkg.karin.apps),
    ])

    const entry = [...app, ...apps]
    this.addCache(meta, 'npm', this.getKarinMain(pkg, meta.abs), entry)

    return LoadStatus.Success
  }
}
