import type { Radio, RadioGroupProps } from '@/types/components'

/**
 * 创建复选框配置
 * @param key 唯一标识符
 * @param config 复选框配置（可选）
 */
const createRadio = (
  key: string,
  config: Partial<Omit<Radio, 'key' | 'componentType'>> = {}
): Radio => ({
  ...config,
  key,
  value: config.value || '',
  componentType: 'radio',
})

/**
 * 创建复选框组配置
 * @param key 唯一标识符
 * @param config 复选框组配置（可选）
 */
const createRadioGroup = (
  key: string,
  config: Partial<Omit<RadioGroupProps, 'key' | 'componentType'>> = {}
): RadioGroupProps => ({
  ...config,
  key,
  componentType: 'radio-group',
  radio: config.radio || [],
})

/**
 * 单选框
 */
export const radio = {
  /**
   * 创建基础单选框
   * @param key 唯一标识符
   * @param options 单选框配置
   */
  create: (key: string, options: Omit<Radio, 'key' | 'componentType' | 'className'>) => createRadio(key, options),

  /**
   * 创建单选框组
   * @param key 唯一标识符
   * @param options 单选框组配置
   */
  group: (key: string, options: Omit<RadioGroupProps, 'key' | 'componentType'>) => createRadioGroup(key, options),

  /**
   * 默认单选框组
   * @param key 唯一标识符
   * @param config 单选框组配置
   */
  defaultGroup: (key: string, config?: Partial<Omit<RadioGroupProps, 'key' | 'componentType'>>) => {
    if (!Array.isArray(config?.radio)) {
      throw new Error('radio 必须是一个数组')
    }

    return createRadioGroup(key, { radio: config.radio, })
  },

  /**
   * 默认单选框
   * @param key 唯一标识符
   * @param config 单选框配置
   */
  default: (key: string, config: Partial<Omit<Radio, 'key' | 'componentType' | 'className'>> = {}) => createRadio(key, {
    ...config
  }),

  /**
   * 必选单选框
   * @param key 唯一标识符
   * @param config 单选框配置
   */
  required: (key: string, config: Partial<Omit<Radio, 'key' | 'componentType' | 'className'>> = {}) => createRadio(key, {
    ...config,
    isRequired: true,
  }),

  /**
   * 禁用单选框
   * @param key 唯一标识符
   * @param config 单选框配置
   */
  disabled: (key: string, config: Partial<Omit<Radio, 'key' | 'componentType' | 'className'>> = {}) => createRadio(key, {
    ...config,
    isDisabled: true,
  }),

  /**
   * 只读单选框
   * @param key 唯一标识符
   * @param config 单选框配置
   */
  readonly: (key: string, config: Partial<Omit<Radio, 'key' | 'componentType' | 'className'>> = {}) => createRadio(key, {
    ...config,
    isReadOnly: true,
  }),

  /**
   * 错误状态单选框
   * @param key 唯一标识符
   * @param config 单选框配置
   */
  invalid: (key: string, config: Partial<Omit<Radio, 'key' | 'componentType' | 'className'>> = {}) => createRadio(key, {
    isInvalid: true,
    ...config
  })
}
