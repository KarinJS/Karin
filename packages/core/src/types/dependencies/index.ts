/** 依赖管理基类 */
export interface DependenciesManageBase {
  /** 操作类型：升级、删除、添加 */
  type: 'upgrade' | 'remove' | 'add'
}

/**
 * 新增依赖请求参数
 * @description 新增依赖请求参数
 */
export interface AddDependenciesParams extends DependenciesManageBase {
  type: 'add'
  data: {
    /** 依赖名称 */
    name: string
    /** 安装到哪里 */
    location: 'dependencies' | 'devDependencies' | 'optionalDependencies'
    /** 依赖版本 */
    version?: string
  }
}

/** 升级依赖请求参数 */
export interface UpgradeDependenciesParams extends DependenciesManageBase {
  type: 'upgrade'
  /** 是否更新所有依赖 */
  isAll: boolean
  /** 依赖列表 */
  data: Array<{
    /** 依赖名称 */
    name: string
    /** 依赖版本 */
    version?: string
  }>
}

/** 删除依赖请求参数 */
export interface RemoveDependenciesParams extends DependenciesManageBase {
  type: 'remove'
  /** 依赖列表 */
  data: string[]
}
/**
 * 依赖管理请求参数接口
 */
export type DependenciesManage = UpgradeDependenciesParams | RemoveDependenciesParams | AddDependenciesParams
