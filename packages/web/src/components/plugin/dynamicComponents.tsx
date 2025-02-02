import { Switch } from '@heroui/switch'
import { Divider } from '@heroui/divider'
import { useState, useEffect, createContext } from 'react'
import { Input, type InputProps } from '@heroui/input'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { ComponentType } from '@/types/components'

import type { JSX } from 'react'
import type { Children } from '@/types/components/all'
import type {
  ValidationRule,
  InputProps as ApiInputProps,
  AccordionProps as ApiAccordionProps,
  AccordionItemProps as ApiAccordionItemProps,
  SwitchProps as ApiSwitchProps,
  DividerProps as ApiDividerProps,
  AccordionProProps as ApiAccordionProProps
} from '@/types/components'

/** 组件配置类型 */
export type ComponentConfig = Children | ApiAccordionProps | ApiAccordionProProps | ApiAccordionItemProps | ApiDividerProps

/** 组件引用值类型 */
type ComponentValue = string | boolean | number | undefined | null

/** 组件引用记录类型 */
type ComponentRef = Record<string, { old: ComponentValue; new: ComponentValue, key: string }>

/** 基础组件属性接口 */
interface BaseComponentProps {
  /** 组件唯一标识 */
  key: string
  /** 父级组件唯一标识 */
  parentKey: string
  /** 组件引用对象 */
  componentRef: ComponentRef
  /**
   * 值变更回调
   * @param key - 组件唯一标识
   * @param value - 组件值
   * @param parentKey - 父级组件唯一标识
   */
  onValueChange: (key: string, value: ComponentValue, parentKey: string) => void
}

/** 动态组件渲染器属性接口 */
interface DynamicComponentRendererProps {
  /** 组件配置数组 */
  configs: ComponentConfig[]
  /** 值变更回调 */
  onChange?: (values: Record<string, any>) => void
}

/** 创建配置上下文 */
const ConfigContext = createContext<ComponentConfig[]>([])

/**
 * 验证输入值是否符合规则
 * @param value - 需要验证的值
 * @param rule - 验证规则
 * @returns 错误信息或验证通过
 */
const validateValue = (value: string, rule: ValidationRule): string | null => {
  if (rule.min !== undefined || rule.max !== undefined) {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return rule.error || '请输入有效数字'
    if (rule.min !== undefined && numericValue < rule.min) return rule.error || `最小值不能小于 ${rule.min}`
    if (rule.max !== undefined && numericValue > rule.max) return rule.error || `最大值不能超过 ${rule.max}`
  }

  if (rule.regex) {
    try {
      const regExp = typeof rule.regex === 'string'
        ? new RegExp(rule.regex.replace(/^\/|\/$/g, ''))
        : rule.regex
      if (!regExp.test(value)) return rule.error || '格式不符合要求'
    } catch (e) {
      console.error('Invalid regex:', rule.regex)
      return '无效的验证规则'
    }
  }

  if (rule.minLength && value.length < rule.minLength) {
    return rule.error || `内容长度不能少于 ${rule.minLength} 个字符`
  }
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.error || `内容长度不能超过 ${rule.maxLength} 个字符`
  }

  return null
}

/**
 * 创建验证处理器
 * @param rules - 验证规则数组
 * @returns 验证处理函数
 */
const createValidator = (rules: ValidationRule[]): InputProps['validate'] => {
  return (value: string) => {
    for (const rule of rules) {
      const error = validateValue(value, rule)
      if (error) return error
    }
    return true
  }
}

/**
 * 渲染输入框组件
 * @param props - 输入框属性
 * @param baseProps - 基础组件属性
 * @param configs - 组件配置数组
 * @returns 渲染后的输入框组件
 */
const renderInput = (
  props: ApiInputProps,
  { componentRef, key, onValueChange, parentKey }: BaseComponentProps,
  configs: ComponentConfig[]
): JSX.Element => {
  const { key: inputKey, componentType: _, ...inputProps } = props
  const validator = props.rules ? createValidator([props.rules].flat()) : undefined

  const keyParts = key.split('-')
  if (keyParts.length >= 3) {
    const dataIndex = parseInt(keyParts[1])
    const fieldKey = keyParts[2]

    const accordionConfig = configs.find(config =>
      config.componentType === ComponentType.ACCORDION_PRO
    ) as ApiAccordionProProps

    const dataValue = accordionConfig?.data[dataIndex]?.[fieldKey]

    if (!componentRef[key]) {
      componentRef[key] = {
        old: dataValue !== undefined ? dataValue : props.defaultValue,
        new: dataValue !== undefined ? dataValue : props.defaultValue,
        key
      }
    }
  }

  return (
    <div className={`w-${props.width || 200}px h-${props.height || 40}px`}>
      <Input
        key={inputKey}
        {...inputProps}
        className="w-full"
        validate={validator}
        defaultValue={componentRef[key]?.old?.toString()}
        onValueChange={(value) => onValueChange(
          key,
          inputProps.type === 'number' ? Number(value) : value,
          parentKey
        )}
      />
    </div>
  )
}

/**
 * 渲染开关组件
 * @param props - 开关属性
 * @param baseProps - 基础组件属性
 * @returns 渲染后的开关组件
 */
const renderSwitch = (
  props: ApiSwitchProps,
  { componentRef, key, onValueChange, parentKey }: BaseComponentProps
): JSX.Element => {
  const { key: inputKey, componentType: _, startText, endText, ...switchProps } = props

  if (!componentRef[key]) {
    componentRef[key] = {
      old: props.defaultSelected,
      new: props.defaultSelected,
      key
    }
  }

  return (
    <div className="flex items-center gap-2">
      {startText && <span>{startText}</span>}
      <Switch
        key={inputKey}
        {...switchProps}
        defaultSelected={componentRef[key]?.old as boolean}
        onValueChange={(value) => onValueChange(key, value, parentKey)}
      />
      {endText && <span>{endText}</span>}
    </div>
  )
}

/**
 * 渲染高级手风琴组件
 * @param props - 手风琴属性
 * @param baseProps - 基础组件属性
 * @param configs - 组件配置数组
 * @returns 渲染后的手风琴组件
 */
const renderAccordionPro = (
  props: ApiAccordionProProps,
  { componentRef, key, onValueChange }: BaseComponentProps,
  configs: ComponentConfig[]
): JSX.Element => {
  const [items, setItems] = useState([...props.data])
  const { key: accordionKey, data, componentType, children, ...accordionProps } = props

  const handleAddItem = () => {
    const template = JSON.parse(JSON.stringify(props.data[0]))
    Object.keys(template).forEach((key: string) => template[key] = '')
    const newItem = {
      ...template,
      title: `${props.title} ${items.length + 1}`
    }
    setItems(prev => [...prev, newItem])
  }

  const handleDeleteItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddItem}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          添加新卡片
        </button>
      </div>
      <Accordion key={accordionKey} {...accordionProps}>
        {items.map((item, cardIndex) => {
          const list: JSX.Element[] = []

          children?.forEach((childConfig) => {
            const { componentType: _, children: grandChildren, ...itemProps } = childConfig
            if (_ !== ComponentType.ACCORDION_ITEM) return

            grandChildren?.forEach((child) => {
              if (!child) return
              const componentKey = `${key}-${cardIndex}-${child.key}`
              const options = child.componentType === ComponentType.INPUT
                ? { defaultValue: item[child.key] ?? child.defaultValue }
                : {}
              const result = renderComponent(
                { ...child, key: componentKey, ...options },
                { componentRef, key: componentKey, onValueChange, parentKey: key },
                configs
              )
              if (!result) return
              list.push(
                <div key={componentKey}>
                  {result}
                </div>
              )
            })
          })

          return (
            <AccordionItem
              key={`${key}-${item.id || cardIndex}`}
              textValue={item.title}
              title={
                <div className="flex justify-between items-center w-full pr-4">
                  <span>{item.title}</span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteItem(cardIndex)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteItem(cardIndex)
                      }
                    }}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    删除
                  </div>
                </div>
              }
            >
              <div className="flex flex-col gap-4">
                {list}
              </div>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

/**
 * 组件渲染分发器
 * @param config - 组件配置
 * @param props - 基础组件属性
 * @param configs - 组件配置数组
 * @returns 渲染后的组件
 */
const renderComponent = (
  config: ComponentConfig,
  props: BaseComponentProps,
  configs: ComponentConfig[]
): JSX.Element | null => {
  const { componentType } = config

  switch (componentType) {
    case ComponentType.INPUT:
      return renderInput(config, props, configs)
    case ComponentType.SWITCH:
      return renderSwitch(config, props)
    case ComponentType.DIVIDER: {
      const { componentType: _, key, ...dividerProps } = config
      return <Divider key={key} {...dividerProps} />
    }
    case ComponentType.ACCORDION: {
      const { componentType: _, children, key, ...accordionProps } = config
      return (
        <Accordion key={key} {...accordionProps}>
          {(children || []).map(child => {
            const { componentType: __, key: childKey, ...childProps } = child
            return (
              <AccordionItem key={childKey} {...childProps}>
                {renderComponent(child, props, configs)}
              </AccordionItem>
            )
          })}
        </Accordion>
      )
    }
    case ComponentType.ACCORDION_ITEM: {
      const { componentType: _, key: itemKey, children, ...itemProps } = config
      return (
        <AccordionItem key={itemKey} {...itemProps}>
          <div className="flex flex-col gap-4">
            {children?.map((child, index) => {
              const childKey = `${itemKey}-${child.key}-${index}`
              return renderComponent(
                { ...child, key: childKey },
                { ...props, key: childKey },
                configs
              )
            })}
          </div>
        </AccordionItem>
      )
    }
    case ComponentType.ACCORDION_PRO:
      return renderAccordionPro(config, props, configs)
    default:
      return null
  }
}

/**
 * 获取组件的父key
 * @param config - 组件配置
 * @param parentConfig - 父组件配置
 * @returns 父组件的key
 */
const getParentKey = (config: ComponentConfig, parentConfig?: ComponentConfig): string => {
  if (!parentConfig) return config.key
  if (parentConfig.componentType === ComponentType.ACCORDION_PRO) {
    return parentConfig.key
  }
  return config.key
}

/**
 * 类型守卫：检查是否为带有children属性的组件配置
 */
const hasChildren = (config: ComponentConfig): config is ComponentConfig & { children: ComponentConfig[] } => {
  return Array.isArray((config as any).children)
}

/**
 * 类型守卫：检查是否为AccordionPro组件配置
 */
const isAccordionPro = (config: ComponentConfig): config is ApiAccordionProProps => {
  return config.componentType === ComponentType.ACCORDION_PRO && Array.isArray((config as any).data)
}

/**
 * 初始化组件引用
 * @param config - 组件配置
 * @param parentConfig - 父组件配置
 * @returns 组件引用对象
 */
const initializeComponentRef = (config: ComponentConfig, parentConfig?: ComponentConfig): ComponentRef => {
  const ref: ComponentRef = {}
  const parentKey = getParentKey(config, parentConfig)

  // 处理基础组件类型
  switch (config.componentType) {
    case ComponentType.INPUT:
      ref[config.key] = {
        old: config.defaultValue ?? '',
        new: config.defaultValue ?? '',
        key: parentKey
      }
      break
    case ComponentType.SWITCH:
      ref[config.key] = {
        old: config.defaultSelected ?? false,
        new: config.defaultSelected ?? false,
        key: parentKey
      }
      break
  }

  // 处理子组件
  if (hasChildren(config)) {
    config.children.forEach(child => {
      Object.assign(ref, initializeComponentRef(child, config))
    })
  }

  // 处理手风琴Pro的数据项
  if (isAccordionPro(config)) {
    config.data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== 'title') {
          const componentKey = `${config.key}-${index}-${key}`
          ref[componentKey] = {
            old: value,
            new: value,
            key: config.key
          }
        }
      })
    })
  }

  return ref
}

/**
 * 动态组件渲染器
 * @param props - 组件属性
 * @returns 渲染后的组件
 */
export const DynamicComponentRenderer = ({
  configs,
  onChange
}: DynamicComponentRendererProps): JSX.Element => {
  const [componentRef, setComponentRef] = useState<ComponentRef>({})

  useEffect(() => {
    const initialRef: ComponentRef = {}
    configs.forEach(config => {
      Object.assign(initialRef, initializeComponentRef(config))
    })
    setComponentRef(initialRef)
  }, [configs])

  const handleValueChange = (key: string, value: ComponentValue, parentKey: string) => {
    setComponentRef(prev => {
      const newRef = {
        ...prev,
        [key]: {
          ...prev[key],
          new: value,
          key: parentKey
        }
      }

      // 当值变更时，构建并触发onChange回调
      const result: Record<string, any> = {}
      Object.entries(newRef).forEach(([k, value]) => {
        if (k === value.key) {
          result[k] = value.new
          return
        }

        const key = value.key
        if (!result[key]) result[key] = []
        const [_, index, subKey] = k.split('-')
        if (!result[key]?.[index]) result[key][index] = {}
        result[key][index][subKey] = value.new
      })
      onChange?.(result)

      return newRef
    })
  }

  return (
    <ConfigContext.Provider value={configs}>
      <div className="w-full">
        <div className="flex flex-wrap gap-4 w-full">
          {configs.map(config => (
            <div key={config.key} className="w-full">
              {renderComponent(
                config,
                {
                  key: config.key,
                  componentRef,
                  onValueChange: handleValueChange,
                  parentKey: config.key
                },
                configs
              )}
            </div>
          ))}
        </div>
      </div>
    </ConfigContext.Provider>
  )
}
