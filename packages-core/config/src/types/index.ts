/**
 * karin 的 `package.json` 类型
 */
export interface PackageJsonKarin {
  /** 包名 */
  name: string
  /** 版本 */
  version: string
  /** 是否私有 */
  private: boolean
  /** 描述 */
  description: string
  /** 主页 */
  homepage: string
  /** bug地址 */
  bugs: {
    /** bug地址 */
    url: string
  }
  /** 仓库 */
  repository: {
    /** 仓库类型 */
    type: string
    /** 仓库地址 */
    url: string
  }
  /** 开源协议 */
  license: string
  /** 作者 */
  author: string
  /** 语法环境 */
  type: 'module'
  /** 导出 */
  exports: Record<string, {
    /** 导入 */
    import: string
    /** require */
    require: string
    /** 类型 */
    types: string
  }>
  /** 入口文件 */
  main: string
  /** 类型文件 */
  types: string
  /** bin */
  bin: Record<string, string>
  /** npm文件 */
  files: string[]
  /** 工作区 */
  workspaces: string[]
  /** 脚本 */
  scripts: Record<string, string>
  /** 依赖 */
  dependencies: Record<string, string>
  /** 开发依赖 */
  devDependencies: Record<string, string>
  /** peer依赖 */
  peerDependencies: Record<string, string>
  /** @deprecated 请使用 engines.karin 代替 */
  engines: Record<string, string>
  /** 发布配置 */
  publishConfig: {
    /** 访问 */
    access: string
    /** 注册 */
    registry: string
  }
}
