import type { CheckboxProps, CheckboxGroupProps } from '@/types/components'

/**
 * 创建复选框配置
 * @param key 唯一标识符
 * @param config 复选框配置（可选）
 */
const createCheckbox = (
  key: string,
  config: Partial<Omit<CheckboxProps, 'key' | 'componentType'>> = {}
): CheckboxProps => ({
  ...config,
  key,
  componentType: 'checkbox',
})

/**
 * 创建复选框组配置
 * @param key 唯一标识符
 * @param config 复选框组配置（可选）
 */
const createCheckboxGroup = (
  key: string,
  config: Partial<Omit<CheckboxGroupProps, 'key' | 'componentType'>> = {}
): CheckboxGroupProps => ({
  ...config,
  key,
  componentType: 'checkbox-group',
  checkbox: config.checkbox || [],
})

/**
 * 复选框
 */
export const checkbox = {
  /**
   * 创建基础复选框
   * @param key 唯一标识符
   * @param options 复选框配置
   */
  create: (key: string, options: Omit<CheckboxProps, 'key' | 'componentType' | 'className'>) => createCheckbox(key, options),

  /**
   * 创建复选框组
   * @param key 唯一标识符
   * @param options 复选框组配置
   */
  group: (key: string, options: Omit<CheckboxGroupProps, 'key' | 'componentType'>) => createCheckboxGroup(key, options),

  /**
   * 默认复选框组
   * @param key 唯一标识符
   * @param config 复选框组配置
   */
  defaultGroup: (key: string, config?: Partial<Omit<CheckboxGroupProps, 'key' | 'componentType'>>) => {
    if (!Array.isArray(config?.checkbox)) {
      throw new Error('checkbox 必须是一个数组')
    }

    return createCheckboxGroup(key, { checkbox: config.checkbox, })
  },

  /**
   * 默认复选框
   * @param key 唯一标识符
   * @param config 复选框配置
   */
  default: (key: string, config: Partial<Omit<CheckboxProps, 'key' | 'componentType' | 'className'>> = {}) => createCheckbox(key, {
    ...config
  }),

  /**
   * 必选复选框
   * @param key 唯一标识符
   * @param config 复选框配置
   */
  required: (key: string, config: Partial<Omit<CheckboxProps, 'key' | 'componentType' | 'className'>> = {}) => createCheckbox(key, {
    ...config,
    isRequired: true,
  }),

  /**
   * 禁用复选框
   * @param key 唯一标识符
   * @param config 复选框配置
   */
  disabled: (key: string, config: Partial<Omit<CheckboxProps, 'key' | 'componentType' | 'className'>> = {}) => createCheckbox(key, {
    ...config,
    isDisabled: true,
  }),

  /**
   * 只读复选框
   * @param key 唯一标识符
   * @param config 复选框配置
   */
  readonly: (key: string, config: Partial<Omit<CheckboxProps, 'key' | 'componentType' | 'className'>> = {}) => createCheckbox(key, {
    ...config,
    isReadOnly: true,
  }),

  /**
   * 不确定状态复选框
   * @param key 唯一标识符
   * @param config 复选框配置
   */
  indeterminate: (key: string, config: Partial<Omit<CheckboxProps, 'key' | 'componentType' | 'className'>> = {}) => createCheckbox(key, {
    isIndeterminate: true,
    ...config
  }),

  /**
   * 错误状态复选框
   * @param key 唯一标识符
   * @param config 复选框配置
   */
  invalid: (key: string, config: Partial<Omit<CheckboxProps, 'key' | 'componentType' | 'className'>> = {}) => createCheckbox(key, {
    isInvalid: true,
    ...config
  })
}
