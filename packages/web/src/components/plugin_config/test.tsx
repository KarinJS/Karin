import { Input, type InputProps } from '@heroui/input'
import { Switch } from '@heroui/switch'
import { ValidationRule } from './input.types'
import { Divider } from '@heroui/divider'
import { Accordion, AccordionItem, type AccordionItemProps } from '@heroui/accordion'
import type { JSX } from 'react'
import {
  type InputProps as InputPropsType,
  type AccordionProps as AccordionPropsType,
  type AccordionItemProps as AccordionItemPropsType,
  type SwitchProps as SwitchPropsType,
  type DividerProps as DividerPropsType,
  ComponentType
} from '@/types/component'
import { useState, useEffect } from 'react'

/** ref类型 */
type RefType = Record<
  string,
  { old: string, new: string } |
  { old: boolean, new: boolean } |
  { old: number, new: number } |
  { old: undefined, new: undefined } |
  { old: null, new: null } |
  { old: undefined, new: string | number | boolean | null }
>

/** 渲染的输入框类型 */
type RenderInputType = Omit<InputPropsType, 'validate'>
/** 渲染的开关类型 */
type RenderSwitchType = Omit<SwitchPropsType, 'validate'>
/** 渲染的分隔线类型 */
type RenderDividerType = Omit<DividerPropsType, 'validate'>
/** 渲染的手风琴类型 */
type RenderAccordionType = Omit<AccordionPropsType, 'validate'>
/** 渲染的手风琴项类型 */
type RenderAccordionItemType = Omit<AccordionItemPropsType, 'validate'>

/**
 * 验证单个规则
 * @param value 输入值
 * @param rule 验证规则
 * @returns 错误信息或 null
 */
const validateRule = (value: string, rule: ValidationRule): string | null => {
  /* 数字验证 */
  if (rule.min !== undefined || rule.max !== undefined) {
    const num = Number(value)
    if (isNaN(num)) return rule.error || '请输入有效数字'
    if (rule.min !== undefined && num < rule.min) return rule.error || `不能小于${rule.min}`
    if (rule.max !== undefined && num > rule.max) return rule.error || `不能大于${rule.max}`
  }

  /* 正则验证 */
  if (rule.regex) {
    const reg = rule.regex instanceof RegExp ? rule.regex : new RegExp(rule.regex)
    if (!reg.test(value)) return rule.error || '格式不正确'
  }

  /* 长度验证 */
  if (rule.minLength && value.length < rule.minLength) {
    return rule.error || `长度不能小于${rule.minLength}`
  }
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.error || `长度不能大于${rule.maxLength}`
  }

  return null
}

/**
 * 处理验证函数
 */
const handleValidate = (data: InputProps, validate: ValidationRule | ValidationRule[]) => {
  if (!validate) return
  if (!Array.isArray(validate)) validate = [validate]

  data.validate = (value: string) => {
    for (const rule of validate) {
      if (typeof rule !== 'object') continue

      const error = validateRule(value, rule)
      if (!error) continue
      data.isInvalid = true
      return error
    }
    data.isInvalid = false
    return true
  }
}

/**
 * 缓存组件数据
 * @param key 组件唯一标识符
 * @param value 组件数据
 * @param ref 组件数据
 */
const cacheComponentData = <T extends string | boolean | number | undefined> (
  key: string,
  value: T,
  ref: RefType
) => {
  if (value === undefined) {
    ref[key] = { old: undefined, new: undefined }
  } else if (typeof value === 'string') {
    ref[key] = { old: value, new: value } as { old: string; new: string }
  } else if (typeof value === 'boolean') {
    ref[key] = { old: value, new: value } as { old: boolean; new: boolean }
  } else if (typeof value === 'number') {
    ref[key] = { old: value, new: value } as { old: number; new: number }
  }

  /** 锁定旧数据 只读 */
  Object.defineProperty(ref[key], 'old', { writable: false })
}

/**
 * 获取组件数据变化
 * @template T 组件值的类型
 * @param key 组件唯一标识符
 * @param ref 组件数据
 * @returns 组件数据变化处理函数
 */
const getOnValueChange = <T extends string | boolean | number> (key: string, ref: RefType) => {
  return (value: T) => {
    console.log(`${key}:`, value)
    ref[key].new = value
  }
}

/**
 * 输入框渲染
 * @param key 组件唯一标识符
 * @param options 组件配置
 * @param ref 组件数据
 * @returns 输入框组件
 */
const renderInput = (key: string, options: RenderInputType, ref: RefType) => {
  return (
    <div key={key} className={`w-${options.width || 200}px h-${options.height || 40}px`}>
      <Input {...options} className="w-full" onValueChange={getOnValueChange<string>(key, ref)} />
    </div>
  )
}

/**
 * 开关渲染
 * @param key 组件唯一标识符
 * @param options 组件配置
 * @param ref 组件数据
 * @returns 开关组件
 */
const renderSwitch = (
  key: string,
  options: Record<string, any>,
  ref: Record<string, any>
) => {
  const { startText, endText, ...switchOptions } = options
  return (
    <div key={key} className="flex items-center gap-2">
      {startText && <span>{startText}</span>}
      <Switch {...switchOptions} onValueChange={getOnValueChange<boolean>(key, ref)} />
      {endText && <span>{endText}</span>}
    </div>
  )
}

/**
 * 分隔线渲染
 * @param index 索引
 * @param options 组件配置
 * @returns 分隔线组件
 */
const renderDivider = (index: number, options: Record<string, any>) => {
  if (options.orientation === 'vertical') {
    return (
      <div key={`divider-${index}`}>
        <Divider
          {...options}
          className={options.transparent ? 'opacity-0' : ''}
        // transparent={options.transparent ? 'true' : 'false'}
        />
      </div>
    )
  } else {
    return (
      <Divider
        key={`divider-${index}`}
        {...options}
        className={options.transparent ? 'opacity-0' : ''}
      // transparent={options.transparent ? 'true' : 'false'}
      />
    )
  }
}

/**
 * 类型判断
 */
const targetType = {
  input: (options: Record<string, any>): options is RenderInputType => {
    return options.componentType === ComponentType.INPUT
  },
  switch: (options: Record<string, any>): options is RenderSwitchType => {
    return options.componentType === ComponentType.SWITCH
  },
  divider: (options: Record<string, any>): options is RenderDividerType => {
    return options.componentType === ComponentType.DIVIDER
  },
  accordion: (options: Record<string, any>): options is RenderAccordionType => {
    return options.componentType === ComponentType.ACCORDION
  },
  accordionItem: (options: Record<string, any>): options is RenderAccordionItemType => {
    return options.componentType === ComponentType.ACCORDION_ITEM
  }
}

/**
 * 手风琴渲染
 * @param key 组件唯一标识符
 * @param data 组件配置
 * @param ref 组件数据
 * @returns 手风琴组件
 */
const renderAccordion = (key: string, data: Record<string, any>, ref: Record<string, any>) => {
  const { title, children, ...accordionOptions } = data
  return (
    <div key={key} className="w-full">
      <Accordion title={title} {...accordionOptions}>
        {children.map((
          { componentType, key, title: itemTitle, validate, ...options }: Record<string, any>,
          index: number
        ) => {
          handleValidate(options, validate)

          /** 输入框 */
          if (targetType.input(options)) {
            cacheComponentData(key, options.defaultValue, ref)
            return (
              <AccordionItem key={`accordion-item-${index}`} className="w-full" title={itemTitle}>
                {renderInput(key, options as RenderInputType, ref)}
              </AccordionItem>
            )
          }

          /** 开关 */
          if (componentType === ComponentType.SWITCH) {
            cacheComponentData(key, options.defaultSelected, ref)
            return (
              <AccordionItem key={`accordion-item-${index}`} className="w-full" title={itemTitle}>
                {renderSwitch(key, options, ref)}
              </AccordionItem>
            )
          }

          /** 分隔线 */
          if (componentType === ComponentType.DIVIDER) {
            return (
              <AccordionItem key={`accordion-item-${index}`} className="w-full" title={itemTitle}>
                {renderDivider(index, options)}
              </AccordionItem>
            )
          }
        })}
      </Accordion>
    </div>
  )
}

/**
 * 手风琴Pro渲染
 * @param key 组件唯一标识符
 * @param options 组件配置
 * @param ref 组件数据
 * @returns 手风琴Pro组件
 */
const renderAccordionPro = (
  key: string,
  options: Record<string, any>,
  ref: Record<string, any>,
  accordionData: any[],
  setAccordionData: (data: any[]) => void
) => {
  const { data: _, children, ...accordionOptions } = options

  /** 渲染完成的手风琴卡片组 */
  const accordionItems: JSX.Element[] = []

  /** 每一次循环都是一个手风琴卡片组 */
  accordionData.forEach((dataItem, i) => {
    /** 手风琴卡片组中的组件 */
    const itemData: JSX.Element[] = []
    children.forEach((val: any) => {
      const { componentType, key, title, validate, ...childrenOptions } = val
      handleValidate(childrenOptions, validate)

      if (componentType === ComponentType.INPUT) {
        /** 获取dataItem中对应key的值 */
        const defaultValue = dataItem[key] ?? childrenOptions.defaultValue
        /** key的组成: 组件唯一标识符-data数据索引 */
        const uniqueKey = `${key}-${i}`

        cacheComponentData(uniqueKey, defaultValue, ref)
        itemData.push(
          renderInput(
            uniqueKey,
            {
              ...childrenOptions,
              defaultValue
            },
            ref
          )
        )
      }
    })

    /** 组成一个手风琴卡片组 */
    accordionItems.push(
      <AccordionItem key={`accordion-item-${i}`} className="w-full" title={dataItem.title}>
        <div className="flex flex-col gap-4">
          {itemData}
        </div>
      </AccordionItem>
    )
  })

  return (
    <div key={key} className="flex flex-col gap-4 w-full">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            /** 创建一个空的数据对象 */
            const emptyData = {
              title: '新的手风琴卡片组',
              number: '',
              gmail: ''
            }
            /** 添加到现有数据中 */
            setAccordionData([...accordionData, emptyData])
          }}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          添加卡片组
        </button>
      </div>
      <Accordion {...accordionOptions}>
        {accordionItems}
      </Accordion>
    </div>
  )
}

/**
 * 动态渲染组件
 * @param data 后端传递的组件数据
 */
const renderComponent = (data: any[]) => {
  /** 创建响应式数据存储手风琴数据 */
  const [accordionData, setAccordionData] = useState<any[]>([])

  /** 首次渲染时初始化手风琴数据 */
  useEffect(() => {
    const accordionProConfig = data.find(item => item.componentType === 'accordion-pro')
    if (accordionProConfig) {
      setAccordionData(accordionProConfig.data)
    }
  }, [])

  /** 组件 */
  const Component: any[] = []

  /** 记录组件数据变化 */
  const ref: Record<string, any> = {}

  /** 监听 resize 事件来触发重新渲染 */
  useEffect(() => {
    const handleResize = () => {
      // 这里需要重新渲染组件的逻辑
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  data.forEach((val, index) => {
    const { componentType, key, validate, ...options } = val
    handleValidate(options, validate)

    /** 输入框 */
    if (targetType.input(options)) {
      cacheComponentData(key, options.defaultValue, ref)
      Component.push(renderInput(key, options, ref))
      return
    }

    /** 开关 */
    if (targetType.switch(options)) {
      cacheComponentData(key, options.defaultSelected, ref)
      Component.push(renderSwitch(key, options, ref))
      return
    }

    /** 分隔线 */
    if (targetType.divider(options)) {
      Component.push(renderDivider(index, options))
      return
    }

    /** 手风琴 */
    if (targetType.accordion(options)) {
      Component.push(renderAccordion(key, options, ref))
      return
    }

    /** 手风琴Pro */
    if (componentType === ComponentType.ACCORDION_PRO) {
      Component.push(renderAccordionPro(key, options, ref, accordionData, setAccordionData))
      return
    }
  })

  /** 回调函数 调用后获取ref */
  const getRef = () => ref

  return { Component, getRef }
}


// 修改App组件的返回部分
export default function App () {
  const data = [
    // {
    //   componentType: 'switch',
    //   key: 'switch',
    //   name: '开关',
    //   color: 'success',
    //   defaultSelected: false,
    //   startText: '这是一个测试开关: ',
    //   endText: ''
    // },
    // {
    //   componentType: 'divider',
    //   orientation: 'vertical',
    //   transparent: false,
    // },
    // {
    //   componentType: 'input',
    //   key: 'email',
    //   type: 'email',
    //   label: '邮箱',
    //   placeholder: '请输入邮箱',
    //   defaultValue: '123@123.com',
    //   isRequired: true,
    //   isClearable: true,
    //   color: 'primary',
    //   validate: [
    //     { regex: '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/', error: '请输入有效的邮箱地址' },
    //     { minLength: 5, maxLength: 50, error: '邮箱长度应在5-50个字符之间' }
    //   ]
    // },
    // {
    //   componentType: 'divider',
    //   orientation: 'horizontal',
    //   transparent: false,
    // },
    // {
    //   componentType: 'input',
    //   key: 'number',
    //   type: 'text',
    //   label: '数字',
    //   placeholder: '请输入数字',
    //   isRequired: true,
    //   isClearable: true,
    //   color: 'primary',
    //   validate: [{ min: 0, max: 100, error: '数字应在0-100之间' }]
    // },
    // {
    //   componentType: 'divider',
    //   orientation: 'horizontal',
    //   transparent: false,
    // },
    {
      componentType: 'accordion-pro',
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
          gmail: '123@123.com',
        },
        {
          title: '这是一个手风琴卡片组',
          number: 345,
          gmail: '123@123.com',
        },
      ],
      children: [
        {
          title: '数字',
          componentType: 'input',
          key: 'number',
          type: 'text',
          label: '数字',
          placeholder: '请输入数字',
          isRequired: true,
          isClearable: true,
          color: 'primary',
          validate: [{ min: 0, max: 100, error: '数字应在0-100之间' }]
        },
        {
          title: '邮箱',
          componentType: 'input',
          key: 'email',
          type: 'email',
          label: '邮箱',
          placeholder: '请输入邮箱',
          defaultValue: '123@123.com',
          isRequired: true,
          isClearable: true,
          color: 'primary',
          validate: [
            { regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', error: '请输入有效的邮箱地址' },
            { minLength: 5, maxLength: 50, error: '邮箱长度应在5-50个字符之间' }
          ]
        },
      ]
    }
  ]

  const { Component, getRef } = renderComponent(data)

  /** 处理测试按钮点击事件 */
  const handleTestClick = () => {
    const result = getRef()
    console.log('组件数据:', result)
  }

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <button
        onClick={handleTestClick}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        type="button"
      >
        测试
      </button>
      <div className="flex flex-wrap gap-4 w-full max-w-2xl px-4">
        {...Component}
      </div>
    </div>
  )
}

