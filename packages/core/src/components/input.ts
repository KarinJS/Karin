import type { InputProps } from '@/types/components'

/**
 * 创建输入框配置
 * @param key 唯一标识符
 * @param config 输入框配置（可选）
 */
const createInput = (key: string, config?: Partial<Omit<InputProps, 'key' | 'componentType'>>) => {
  const result = {
    key,
    type: 'text',
    ...config,
    componentType: 'input',
  }
  return result
}

/**
 * 输入框
 */
export const input = {
  /**
   * 创建基础输入框
   * @param key 唯一标识符
   * @param options 输入框配置
   */
  create: (key: string, options: Omit<InputProps, 'key' | 'componentType'>) => createInput(key, options),

  /**
   * 字符串输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  string: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: '字符串',
    placeholder: '请输入字符串',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    ...config
  }),

  /**
   * 数字输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  number: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'number',
    label: '数字',
    placeholder: '请输入数字',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        min: 0,
        max: 100,
        error: '数字应在0-100之间'
      }
    ],
    ...config
  }),

  /**
   * 布尔值输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  boolean: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: '布尔值',
    placeholder: '请输入布尔值',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^(true|false)$/,
        error: '请输入有效的布尔值'
      }
    ],
    ...config
  }),

  /**
   * 日期输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  date: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: '日期',
    placeholder: '请输入日期',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^\d{4}-\d{2}-\d{2}$/,
        error: '请输入有效的日期格式'
      }
    ],
    ...config
  }),

  /**
   * 时间输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  time: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: '时间',
    placeholder: '请输入时间',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^\d{2}:\d{2}:\d{2}$/,
        error: '请输入有效的时间格式'
      }
    ],
    ...config
  }),

  /**
   * 日期时间输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  datetime: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: '日期时间',
    placeholder: '请输入日期时间',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
        error: '请输入有效的日期时间格式'
      }
    ],
    ...config
  }),

  /**
   * 邮箱输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  email: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        error: '请输入有效的邮箱地址'
      },
      {
        minLength: 5,
        maxLength: 50,
        error: '邮箱长度应在5-50个字符之间'
      }
    ],
    ...config
  }),

  /**
   * URL输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  url: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'url',
    label: 'URL',
    placeholder: '请输入URL',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        error: '请输入有效的URL地址'
      }
    ],
    ...config
  }),

  /**
   * 电话输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  tel: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'tel',
    label: '电话',
    placeholder: '请输入电话',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^1[3-9]\d{9}$/,
        error: '请输入有效的手机号码'
      }
    ],
    ...config
  }),

  /**
   * 密码输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  password: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'password',
    label: '密码',
    placeholder: '请输入密码',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        minLength: 1,
        error: '密码长度不能小于1位'
      }
    ],
    ...config
  }),

  /**
   * 颜色输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  color: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: '颜色',
    placeholder: '请输入颜色',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/,
        error: '请输入有效的颜色格式'
      }
    ],
    ...config
  }),

  /**
   * JSON输入框
   * @param key 唯一标识符
   * @param config 输入框配置
   */
  json: (key: string, config: Partial<Omit<InputProps, 'key' | 'componentType'>> = {}) => createInput(key, {
    type: 'text',
    label: 'JSON',
    placeholder: '请输入JSON',
    isRequired: true,
    isClearable: true,
    color: 'primary',
    rules: [
      {
        regex: /^[^{}]*$/,
        error: '请输入有效的JSON格式'
      }
    ],
    ...config
  })
}
