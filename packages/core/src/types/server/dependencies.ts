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
export interface DependenciesApiResponse {
  /** 依赖名称 */
  name: string
  /** 当前版本 */
  current: string
  /** 最新的15个版本 */
  latest: string[]
  /**
   * 依赖类型
   * - dependencies: 生产依赖
   * - devDependencies: 开发依赖
   * - unsavedDependencies: 未保存依赖
   * - peerDependencies: 对等依赖
   * - optionalDependencies: 可选依赖
   */
  type: 'dependencies' | 'devDependencies' | 'unsavedDependencies' | 'peerDependencies' | 'optionalDependencies'
}
