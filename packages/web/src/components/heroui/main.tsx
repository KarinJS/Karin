import { Input } from './inputs'
import { createResult } from './utils'
import { Switch } from './switchs'
import { CheckboxGroup } from './checkboxs'
import { RadioGroup } from './radioGroups'
import { Accordion } from './accordions'
import { AccordionPro } from './accordions-pro'
import { Divider } from './dividers'

import type { JSX } from 'react'
import type { ComponentConfig, Result } from './types'

interface DynamicComponentRendererProps {
  configs: ComponentConfig[]
  onChange: (result: Result<'all'>) => void
  values?: Record<string, any>
}

/**
 * 动态渲染组件
 * @param options - 后端返回的组件配置
 * @param initialValues - 初始值
 * @returns 组件列表
 */
export function renders (
  options: ComponentConfig[],
  onChange: (result: Result<'all'>) => void,
  initialValues: Record<string, any> = {},
) {
  const list: JSX.Element[] = []
  const result = createResult(initialValues)

  /**
   * 代理 result 对象
   */
  const proxy = new Proxy(result, {
    set: (target, prop, value) => {
      target[prop as keyof typeof target] = value
      onChange(result)
      return true
    },
    get: (target, prop) => {
      console.log('target', typeof target, target)
      console.log('prop', typeof prop, prop)
      onChange(result)
      return target[prop as keyof typeof target]
    }
  })


  options.forEach(item => {
    if (item.componentType === 'input') {
      return list.push(Input(item, proxy as Result<'input'>))
    }

    if (item.componentType === 'switch') {
      return list.push(Switch(item, proxy as Result<'switch'>))
    }

    if (item.componentType === 'checkbox-group') {
      return list.push(CheckboxGroup(item, proxy as Result<'checkbox'>))
    }

    if (item.componentType === 'radio-group') {
      return list.push(RadioGroup(item, proxy as Result<'radio'>))
    }

    if (item.componentType === 'accordion') {
      return list.push(Accordion(item, proxy as Result<'accordion'>))
    }

    if (item.componentType === 'accordion-pro') {
      return list.push(AccordionPro(item, proxy as Result<'accordion-pro'>))
    }

    if (item.componentType === 'divider') {
      return list.push(Divider(item))
    }

    console.log(`[未知组件] ${item}`)
  })

  return { list, result: proxy }
}

/**
 * 动态组件渲染器
 * @param props - 组件属性  
 * @returns 渲染后的组件
 */
export const DynamicRender = (
  { configs, onChange, values = {} }: DynamicComponentRendererProps
) => {
  const { list } = renders(configs, onChange, values)

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 w-full">
        {list.map((item, index) => (
          <div key={`dynamic-component-${index}-${item.key || ''}`} className="w-full">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}