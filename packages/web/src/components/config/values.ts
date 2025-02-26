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
export type Value = InputValue | CheckboxGroupValue | AccordionValue | AccordionProValue

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

    if (option.componentType === 'checkbox-group') {
      const selectedValues = option.defaultValue || []

      defaultValues[option.key] = {
        key: 'checkbox-group',
        value: selectedValues
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
      defaultValues[option.key] = {
        key: 'accordion-pro',
        value: option.data?.map((item) => {
          const formattedItem: Record<string, Value> = {}

          // 获取子组件配置的映射关系
          const childConfigMap: Record<string, ComponentConfig> = {}
          if (option.children?.children && Array.isArray(option.children.children)) {
            option.children.children.forEach(child => {
              childConfigMap[child.key] = child as ComponentConfig
            })
          }

          for (const [key, value] of Object.entries(item)) {
            const childConfig = childConfigMap[key]

            // 根据子组件类型正确格式化值
            if (childConfig?.componentType === 'checkbox-group') {
              // 处理复选框组，直接使用值数组
              formattedItem[key] = {
                key: 'checkbox-group',
                value: Array.isArray(value) ? value : []
              }
            } else {
              // 默认处理为input类型
              formattedItem[key] = {
                key: 'input',
                value: value as string
              }
            }
          }

          return formattedItem
        }) ?? []
      }
      return
    }

    console.error(`[不支持的组件] ${option.componentType} 组件未实现默认值初始化`)
  })
  console.log('defaultValues:', defaultValues)
  return defaultValues
}
