import type { DividerProps } from '@/types/components'

/**
 * 创建分隔线配置
 * @param key 唯一标识符
 * @param config 分隔线配置（可选）
 */
const createDivider = (
  key: string,
  config: Partial<Omit<DividerProps, 'key' | 'componentType'>> = {}
): DividerProps => ({
  componentType: 'divider',
  transparent: false,
  orientation: 'horizontal',
  ...config,
  key,
})

/**
 * 分隔线组件
 */
export const divider = {
  /**
   * 创建基础分隔线
   * @param key 唯一标识符
   * @param options 分隔线配置
   */
  create: (key: string, options: Omit<DividerProps, 'key' | 'componentType'> = {}) => createDivider(key, options),

  /**
   * 创建水平分隔线
   * @param key 唯一标识符
   * @param config 分隔线配置
   */
  horizontal: (key: string, config: Partial<Omit<DividerProps, 'key' | 'componentType'>> = {}) => createDivider(key, {
    orientation: 'horizontal',
    ...config,
  }),

  /**
   * 创建垂直分隔线
   * @param key 唯一标识符
   * @param config 分隔线配置
   */
  vertical: (key: string, config: Partial<Omit<DividerProps, 'key' | 'componentType'>> = {}) => createDivider(key, {
    orientation: 'vertical',
    ...config,
  }),
}
