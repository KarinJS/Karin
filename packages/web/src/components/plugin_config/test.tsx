import { Switch } from '@heroui/switch'
import { Divider } from '@heroui/divider'
import { useState, useEffect, createContext, useContext } from 'react'
import { Input, type InputProps } from '@heroui/input'
import { Accordion, AccordionItem, type AccordionItemProps } from '@heroui/accordion'
import { ComponentType } from '@/types/components'

import type { JSX } from 'react'
import type {
  ValidationRule,
  InputProps as ApiInputProps,
  AccordionProps as ApiAccordionProps,
  AccordionItemProps as ApiAccordionItemProps,
  SwitchProps as ApiSwitchProps,
  DividerProps as ApiDividerProps,
  AccordionProProps as ApiAccordionProProps
} from '@/types/components'
import { Children } from '@/types/components/all'

/** 组件配置类型 */
type ComponentConfig = Children | ApiAccordionProps | ApiAccordionProProps | ApiAccordionItemProps | ApiDividerProps

// ==================== 保留原始类型定义 ====================
/** 组件引用值类型 */
type ComponentValue = string | boolean | number | undefined | null

/** 组件引用记录类型 */
type ComponentRef = Record<string, { old: ComponentValue; new: ComponentValue }>

// ==================== 组件渲染部分 ====================
interface BaseComponentProps {
  /** 组件唯一标识 */
  key: string
  /** 组件引用对象 */
  componentRef: ComponentRef
  onValueChange: (key: string, value: ComponentValue) => void
}

// ==================== 通用工具函数 ====================
/**
 * 验证输入值是否符合规则
 * @param value - 需要验证的值
 * @param rule - 验证规则
 * @returns 错误信息或验证通过
 */
function validateValue (value: string, rule: ValidationRule): string | null {
  if (rule.min !== undefined || rule.max !== undefined) {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return rule.error || '请输入有效数字'
    if (rule.min !== undefined && numericValue < rule.min) return rule.error || `最小值不能小于 ${rule.min}`
    if (rule.max !== undefined && numericValue > rule.max) return rule.error || `最大值不能超过 ${rule.max}`
  }

  if (rule.regex) {
    const regExp = rule.regex instanceof RegExp ? rule.regex : new RegExp(rule.regex)
    if (!regExp.test(value)) return rule.error || '格式不符合要求'
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
function createValidator (rules: ValidationRule[]): InputProps['validate'] {
  return (value: string) => {
    for (const rule of rules) {
      const error = validateValue(value, rule)
      if (error) return error
    }
    return true
  }
}

// 创建一个 context 来存储配置
const ConfigContext = createContext<ComponentConfig[]>([])

/**
 * 渲染输入框组件
 */
function renderInput (
  props: ApiInputProps,
  { componentRef, key, onValueChange }: BaseComponentProps,
  configs: ComponentConfig[]
) {
  const { key: inputKey, componentType: _, ...inputProps } = props
  const validator = props.rules ? createValidator([props.rules].flat()) : undefined

  // 从 key 中解析出数据索引和字段名
  const keyParts = key.split('-')
  if (keyParts.length >= 3) {
    const dataIndex = parseInt(keyParts[1])
    const fieldKey = keyParts[2]

    // 获取对应的数据值
    const accordionConfig = configs.find(config =>
      config.componentType === ComponentType.ACCORDION_PRO
    ) as ApiAccordionProProps

    const dataValue = accordionConfig?.data[dataIndex]?.[fieldKey]

    // 设置初始值
    if (!componentRef[key]) {
      componentRef[key] = {
        old: dataValue !== undefined ? dataValue : props.defaultValue,
        new: dataValue !== undefined ? dataValue : props.defaultValue
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
        onValueChange={(value) => {
          onValueChange(key, value)
        }}
      />
    </div>
  )
}

/**
 * 渲染开关组件
 */
function renderSwitch (
  props: ApiSwitchProps,
  { componentRef, key, onValueChange }: BaseComponentProps
) {
  // 从 props 中解构出需要的属性
  const { key: inputKey, componentType: _, startText, endText, ...switchProps } = props

  if (!componentRef[key]) {
    componentRef[key] = {
      old: props.defaultSelected,
      new: props.defaultSelected
    }
  }

  return (
    <div className="flex items-center gap-2">
      {startText && <span>{startText}</span>}
      <Switch
        key={inputKey}
        {...switchProps}
        defaultSelected={componentRef[key]?.old as boolean}
        onValueChange={(value) => {
          onValueChange(key, value)
        }}
      />
      {endText && <span>{endText}</span>}
    </div>
  )
}

/**
 * 渲染高级手风琴组件
 */
function renderAccordionPro (
  props: ApiAccordionProProps,
  { componentRef, key, onValueChange }: BaseComponentProps,
  configs: ComponentConfig[]
) {
  const [items, setItems] = useState([...props.data])
  const { key: accordionKey, data, componentType, children, ...accordionProps } = props

  const handleAddItem = () => {
    const template = JSON.parse(JSON.stringify(props.data[0]))
    Object.keys(template).forEach((key: string) => template[key] = '')
    /** 数据清空 */
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
                { componentRef, key: componentKey, onValueChange },
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
 */
function renderComponent (
  config: ComponentConfig,
  props: BaseComponentProps,
  configs: ComponentConfig[]
): JSX.Element | null {
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

// ==================== 主组件 ====================
interface DynamicComponentRendererProps {
  configs: ComponentConfig[]
}

export function DynamicComponentRenderer ({ configs }: DynamicComponentRendererProps) {
  // 将 componentRef 改为 state，这样可以保持状态更新
  const [componentRef, setComponentRef] = useState<ComponentRef>({})

  // 初始化 componentRef
  useEffect(() => {
    const initialRef: ComponentRef = {}
    configs.forEach(config => {
      if (config.componentType === ComponentType.INPUT) {
        initialRef[config.key] = {
          old: config.defaultValue ?? '',
          new: config.defaultValue ?? ''
        }
      } else if (config.componentType === ComponentType.SWITCH) {
        initialRef[config.key] = {
          old: config.defaultSelected ?? false,
          new: config.defaultSelected ?? false
        }
      }
    })
    setComponentRef(initialRef)
  }, [configs])

  // 更新值的处理函数
  const handleValueChange = (key: string, value: ComponentValue) => {
    console.log('handleValueChange:', key, value)
    setComponentRef(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        new: value
      }
    }))
  }

  return (
    <ConfigContext.Provider value={configs}>
      <div className="relative w-full max-w-2xl px-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => console.log('componentRef:', componentRef)}
          className="absolute -top-8 right-0 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
        >
          输出数据
        </div>
        <div className="flex flex-wrap gap-4 w-full">
          {configs.map(config => (
            <div key={config.key} className="w-full">
              {renderComponent(
                config,
                {
                  key: config.key,
                  componentRef,
                  onValueChange: handleValueChange
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

// 使用示例
export default function App () {
  const data: ComponentConfig[] = [
    {
      componentType: ComponentType.SWITCH,
      key: 'switch',
      color: 'success',
      defaultSelected: false,
      startText: '这是一个测试开关: ',
      endText: ''
    },
    {
      componentType: ComponentType.DIVIDER,
      key: 'divider1',
      orientation: 'vertical',
    },
    {
      componentType: ComponentType.INPUT,
      key: 'email',
      type: 'email',
      label: '邮箱',
      placeholder: '请输入邮箱',
      defaultValue: '123@123.com',
      isRequired: true,
      isClearable: true,
      color: 'primary',
      rules: [
        { regex: '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/', error: '请输入有效的邮箱地址' },
        { minLength: 5, maxLength: 50, error: '邮箱长度应在5-50个字符之间' }
      ]
    },
    {
      componentType: ComponentType.DIVIDER,
      key: 'divider2',
      orientation: 'horizontal',
    },
    {
      componentType: ComponentType.INPUT,
      key: 'number',
      type: 'text',
      label: '数字',
      placeholder: '请输入数字',
      isRequired: true,
      isClearable: true,
      color: 'primary',
      rules: [{ min: 0, max: 100, error: '数字应在0-100之间' }]
    },
    {
      componentType: ComponentType.DIVIDER,
      key: 'divider3',
      orientation: 'horizontal',
    },
    {
      componentType: ComponentType.ACCORDION_PRO,
      key: 'accordion-pro',
      title: '折叠面板',
      variant: 'bordered',
      selectionMode: 'single',
      selectionBehavior: 'toggle',
      showDivider: true,
      fullWidth: true,
      data: [
        {
          title: '这是一个手风琴卡片组',
          number: 234,
          email: '123@123.com',
        },
        {
          title: '这是一个手风琴卡片组',
          number: 345,
          email: '123@123.com',
        },
      ],
      children: [
        {
          componentType: ComponentType.ACCORDION_ITEM,
          key: 'number',
          title: '这是一个手风琴卡片组',
          children: [
            {
              componentType: ComponentType.INPUT,
              key: 'number',
              type: 'text',
              label: '数字',
              placeholder: '请输入数字',
              isRequired: true,
              isClearable: true,
              color: 'primary',
              rules: [{ min: 0, max: 100, error: '数字应在0-100之间' }]
            },
            {
              componentType: ComponentType.INPUT,
              key: 'email',
              type: 'email',
              label: '邮箱',
              placeholder: '请输入邮箱',
              // defaultValue: '123@123.com',
              isRequired: true,
              isClearable: true,
              color: 'primary',
              rules: [
                { regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', error: '请输入有效的邮箱地址' },
                { minLength: 5, maxLength: 50, error: '邮箱长度应在5-50个字符之间' }
              ]
            },
          ]
        }
      ]
    }
  ]

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <DynamicComponentRenderer configs={data} />
    </div>
  )
}