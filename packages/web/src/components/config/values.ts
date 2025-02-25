import type { ComponentConfig } from 'node-karin'

interface BaseValue {
  /** 组件类型 */
  key:
  'input' |
  'input-group' |
  'switch' |
  'radio-group' |
  'checkbox-group' |
  'accordion' |
  'accordion-pro'
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
  value: boolean[]
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
export type Value = InputValue | InputGroupValue | SwitchValue | RadioGroupValue | CheckboxGroupValue | AccordionValue | AccordionProValue

/**
 * initDefaultValues函数返回值类型
 */
export type DefaultValues = Record<string, Value>

/**
 * 初始化defaultValues
 * @param options - 组件配置
 * @param isAccordion - 是否是手风琴
 * @returns
 */
export const initDefaultValues = (
  options: ComponentConfig[],
  isAccordion: boolean = false
): DefaultValues => {
  const defaultValues: DefaultValues = {}
  options.forEach((option) => {
    if (option.componentType === 'input') {
      defaultValues[option.key] = {
        key: 'input',
        value: option.value ?? option.defaultValue ?? ''
      }
      return
    }

    if (option.componentType === 'switch') {
      defaultValues[option.key] = {
        key: 'switch',
        value: option.defaultSelected ?? false
      }
      return
    }

    if (option.componentType === 'radio-group') {
      defaultValues[option.key] = {
        key: 'radio-group',
        value: option.defaultValue ?? ''
      }
      return
    }

    if (option.componentType === 'checkbox-group') {
      defaultValues[option.key] = {
        key: 'checkbox-group',
        value: option.checkbox.map((item) => item.defaultSelected ?? false)
      }
      return
    }

    if (option.componentType === 'input-group') {
      defaultValues[option.key] = {
        key: 'input-group',
        value: option.data || []
      }
      return
    }

    if (option.componentType === 'accordion') {
      if (isAccordion) return
      defaultValues[option.key] = {
        key: 'accordion',
        value: option.children?.map((item) => {
          return initDefaultValues(item.children as ComponentConfig[] || [], true)
        }) ?? []
      }
      return
    }

    if (option.componentType === 'accordion-pro') {
      if (!isAccordion) return
      defaultValues[option.key] = {
        key: 'accordion-pro',
        value: option.data?.map((item) => ({ value: item })) ?? []
      }
      return
    }

    console.error(`[不支持的组件] ${option.componentType} 组件未实现默认值初始化`)
  })
  console.log('defaultValues:', defaultValues)
  return defaultValues
}
