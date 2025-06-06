import type { ComponentConfig } from 'node-karin'

interface BaseValue {
  /** 组件类型 */
  key:
  | 'input'
  | 'input-group'
  | 'switch'
  | 'radio-group'
  | 'checkbox-group'
  | 'accordion'
  | 'accordion-pro'
  | 'cron'
}

/**
 * 输入框初始值类型
 */
export interface InputValue extends BaseValue {
  key: 'input'
  value: string
}

/**
 * 输入框组初始值类型
 */
export interface InputGroupValue extends BaseValue {
  key: 'input-group'
  value: string[]
}

/**
 * 开关初始值类型
 */
export interface SwitchValue extends BaseValue {
  key: 'switch'
  value: boolean
}

/**
 * 单选框初始值类型
 */
export interface RadioGroupValue extends BaseValue {
  key: 'radio-group'
  value: string
}

/**
 * 多选框初始值类型
 */
export interface CheckboxGroupValue extends BaseValue {
  key: 'checkbox-group'
  value: string[]
}

/**
 * 手风琴初始值类型
 */
export interface AccordionValue extends BaseValue {
  key: 'accordion'
  value: Record<string, Value>[]
}

/**
 * 手风琴poro初始值类型
 */
export interface AccordionProValue extends BaseValue {
  key: 'accordion-pro'
  value: Record<string, any>[]
}

/**
 * 联合初始值类型
 */
/**
 * Cron表达式值类型
 */
export interface CronValue extends BaseValue {
  key: 'cron'
  value: string
}

/**
 * 联合初始值类型
 */
export type Value = InputValue | InputGroupValue | SwitchValue | RadioGroupValue | CheckboxGroupValue | AccordionValue | AccordionProValue | CronValue

/**
 * initDefaultValues函数返回值类型
 */
export type DefaultValues = Record<string, Value>

/**
 * 基础组件初始值
 * @param defaultValues - 默认值对象
 * @param option - 组件配置
 * @param isAccordion - 是否是手风琴组件
 * @param data - 手风琴pro数据
 */
const initValue = (
  defaultValues: DefaultValues,
  option: ComponentConfig,
  isAccordion: boolean = false,
  data?: any
) => {
  if (option.componentType === 'divider') return
  if ('componentType' in option && option.componentType === 'cron') {
    defaultValues[option.key] = {
      key: 'cron',
      value: data ?? option.defaultValue ?? '* * * * * *',
    }
    return
  }

  if (option.componentType === 'input') {
    defaultValues[option.key] = {
      key: 'input',
      value: data ?? option.value ?? option.defaultValue ?? '',
    }
    return
  }

  if (option.componentType === 'switch') {
    defaultValues[option.key] = {
      key: 'switch',
      value: data ?? option.defaultSelected ?? false,
    }
    return
  }

  if (option.componentType === 'radio-group') {
    defaultValues[option.key] = {
      key: 'radio-group',
      value: data ?? option.defaultValue ?? '',
    }
    return
  }

  if (option.componentType === 'checkbox-group') {
    const selectedValues = option.defaultValue || []

    defaultValues[option.key] = {
      key: 'checkbox-group',
      value: data ?? selectedValues,
    }
    return
  }

  if (option.componentType === 'input-group') {
    defaultValues[option.key] = {
      key: 'input-group',
      value: data || option.data || [],
    }
    return
  }

  if (option.componentType === 'accordion') {
    if (isAccordion) return
    if (!Array.isArray(option.children)) {
      defaultValues[option.key] = { key: 'accordion', value: [] }
      return
    }

    const value: DefaultValues[] = []
    option.children.forEach((item) => {
      if (!Array.isArray(item.children)) return
      const val: DefaultValues = {}
      item.children.forEach((child) => {
        initValue(val, child as ComponentConfig, true)
      })
      value.push(val)
    })

    defaultValues[option.key] = { key: 'accordion', value }
    return
  }

  if (option.componentType === 'accordion-pro') {
    if (!Array.isArray(option.data)) {
      defaultValues[option.key] = { key: 'accordion-pro', value: [] }
      return
    }

    const value: DefaultValues[] = []

    option.data.forEach((item) => {
      const val: DefaultValues = {}
      // 获取子组件配置的映射关系
      const childConfigMap: Record<string, ComponentConfig> = {}
      if (Array.isArray(option.children?.children)) {
        option.children.children.forEach(child => {
          childConfigMap[child.key] = child as ComponentConfig
        })
      }

      Object.entries(item).forEach(([key, value]) => {
        if (key === 'title' || key === 'subtitle') return
        const config = childConfigMap[key]
        if (!config) {
          console.error(`[accordion-pro] 组件的子组件配置中不存在key为${key}的组件`)
          return
        }

        initValue(val, config, true, value)
      })

      value.push(val)
    })

    defaultValues[option.key] = { key: 'accordion-pro', value }
    return
  }

  console.error(`[不支持的组件] ${option.componentType} 组件未实现默认值初始化`)
}

/**
 * 获取组件返回值
 * @param result - 结果对象
 * @param key - 组件key
 * @param option - 组件配置
 * @param isAccordion - 是否是手风琴组件
 */
const resultValue = (
  result: Record<string, any>,
  key: string,
  option: Value,
  isAccordion: boolean = false
) => {
  if (
    option.key === 'input' ||
    option.key === 'switch' ||
    option.key === 'radio-group' ||
    option.key === 'checkbox-group' ||
    option.key === 'input-group' ||
    option.key === 'cron'
  ) {
    result[key] = option.value
    return
  }

  if (option.key === 'accordion' && !isAccordion) {
    result[key] = []
    option.value.forEach((item) => {
      const val: DefaultValues = {}
      Object.entries(item).forEach(([key, value]) => {
        resultValue(val, key, value, true)
      })
      result[key].push(val)
    })
    return
  }

  if (option.key === 'accordion-pro' && !isAccordion) {
    result[key] = []
    option.value.forEach((item) => {
      const val: DefaultValues = {}
      Object.entries(item).forEach(([key, value]) => {
        resultValue(val, key, value, true)
      })
      result[key].push(val)
    })
    return
  }

  console.error(`[不支持的组件] ${JSON.stringify(option)} 组件未实现返回值初始化`)
}

/**
 * 获取组件的初始值
 * @param options - 组件配置
 * @returns
 */
export const getComponentValue = (options: ComponentConfig[]): DefaultValues => {
  const defaultValues: DefaultValues = {}
  options.forEach((option) => initValue(defaultValues, option))
  return defaultValues
}

/**
 * 获取组件返回值
 */
export const getComponentResult = (options: DefaultValues): DefaultValues => {
  const value: Record<string, any> = {}
  Object.entries(options).forEach(([key, option]) => resultValue(value, key, option))
  return value
}
