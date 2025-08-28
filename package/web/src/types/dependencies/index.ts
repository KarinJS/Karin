import type { Dependency } from 'node-karin'

/**
 * 增强依赖项接口，包含UI状态
 */
export interface EnhancedDependency extends Dependency {
  /** 是否被选中 */
  isSelected: boolean
  /** 用户选择的目标版本（如果有） */
  targetVersion: string | null
}

/**
 * 更新类型定义
 */
export type UpdateType = 'all' | 'selected'

/**
 * 更新依赖参数接口
 */
export interface UpdateParams {
  /** 更新类型 */
  type: UpdateType
  /** 需要更新的依赖数据 */
  data: Array<{ name: string, version: string }> | null
}
