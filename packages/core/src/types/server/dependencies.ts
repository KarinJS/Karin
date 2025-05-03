/**
 * dependencies value类型
 */
export interface PnpmDependency {
  /** 依赖来源 */
  from: string
  /** 依赖版本 */
  version: string
  /** 依赖路径 */
  path: string
  /** 依赖下载地址 在link下不存在 例如 https://registry.npmjs.org/@types/node/-/node-18.19.84.tgz */
  resolved?: string
}

/**
 * `pnpm list --depth=0 --json`命令返回类型
 */
export interface PnpmDependencies {
  /** 项目名称 */
  name: string
  /** 项目版本 */
  version: string
  /** 项目路径 */
  path: string
  /** 是否为私有项目 */
  private: boolean
  /** 项目依赖 */
  dependencies: Record<string, PnpmDependency>
  /** 项目开发依赖 */
  devDependencies: Record<string, PnpmDependency>
  /** 未保存的依赖 */
  unsavedDependencies: Record<string, PnpmDependency>
}

/**
 * dependenciesApi响应类型
 */
export interface Dependency {
  /** 依赖名称 */
  name: string
  /** 是否为karin插件 */
  isKarinPlugin: boolean
  /** 当前版本 */
  current: string
  /** 最新的15个版本 */
  latest: string[]
  /** package.json中的值 如果不存在会返回空字符串 */
  packageValue: string
  /**
   * 依赖类型
   * - dependencies: 生产依赖
   * - devDependencies: 开发依赖
   * - unsavedDependencies: 未保存依赖
   * - peerDependencies: 对等依赖
   * - optionalDependencies: 可选依赖
  */
  type: 'dependencies' | 'devDependencies' | 'unsavedDependencies' | 'peerDependencies' | 'optionalDependencies'
  /**
  * 依赖来源
  * - 此处最大的作用就是用于区分别名安装的依赖
  * - 例如`lodash@npm:@karinjs/lodash` 这里的值就会是`@karinjs/lodash`
  */
  from: string
}
