import type { SelectItem, SelectProps } from '@/types/components'

/**
 * 创建下拉选项配置
 * @param key 唯一标识符
 * @param config 下拉选项配置（可选）
 */
const createSelectItem = (
  key: string,
  config: Partial<Omit<SelectItem, 'key' | 'componentType'>> = {}
): SelectItem => ({
  ...config,
  key,
  value: config.value || '',
  componentType: 'select-item',
})

/**
 * 创建下拉选择框配置
 * @param key 唯一标识符
 * @param config 下拉选择框配置（可选）
 */
const createSelect = (
  key: string,
  config: Partial<Omit<SelectProps, 'key' | 'componentType'>> = {}
): SelectProps => ({
  ...config,
  key,
  componentType: 'select',
  items: config.items || [],
})

/**
 * 下拉选择框
 */
export const select = {
  /**
   * 创建基础下拉选项
   * @param key 唯一标识符
   * @param options 下拉选项配置
   */
  createItem: (key: string, options: Omit<SelectItem, 'key' | 'componentType' | 'className'>) => createSelectItem(key, options),

  /**
   * 创建下拉选择框
   * @param key 唯一标识符
   * @param options 下拉选择框配置
   */
  create: (key: string, options: Omit<SelectProps, 'key' | 'componentType'>) => createSelect(key, options),

  /**
   * 默认下拉选择框
   * @param key 唯一标识符
   * @param config 下拉选择框配置
   */
  default: (key: string, config?: Partial<Omit<SelectProps, 'key' | 'componentType'>>) => {
    if (!Array.isArray(config?.items)) {
      throw new Error('items 必须是一个数组')
    }

    return createSelect(key, { items: config.items })
  },

  /**
   * 必选下拉选择框
   * @param key 唯一标识符
   * @param config 下拉选择框配置
   */
  required: (key: string, config: Partial<Omit<SelectProps, 'key' | 'componentType'>>) => createSelect(key, {
    ...config,
    isRequired: true,
  }),

  /**
   * 禁用下拉选择框
   * @param key 唯一标识符
   * @param config 下拉选择框配置
   */
  disabled: (key: string, config: Partial<Omit<SelectProps, 'key' | 'componentType'>>) => createSelect(key, {
    ...config,
    isDisabled: true,
  }),

  /**
   * 只读下拉选择框
   * @param key 唯一标识符
   * @param config 下拉选择框配置
   */
  readonly: (key: string, config: Partial<Omit<SelectProps, 'key' | 'componentType'>>) => createSelect(key, {
    ...config,
    isReadOnly: true,
  }),

  /**
   * 错误状态下拉选择框
   * @param key 唯一标识符
   * @param config 下拉选择框配置
   */
  invalid: (key: string, config: Partial<Omit<SelectProps, 'key' | 'componentType'>>) => createSelect(key, {
    isInvalid: true,
    ...config,
  }),
}
