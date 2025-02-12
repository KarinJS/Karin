import { Input } from './inputs'
import { createResult } from './utils'
import { Switch } from './switchs'
import { CheckboxGroup } from './checkboxs'
import { RadioGroup } from './radioGroups'
import { Accordion } from './accordions'
import { AccordionPro } from './accordions-pro'

import type { JSX } from 'react'
import type { ComponentConfig, Result } from './types'

/**
 * 动态渲染组件
 * @param options - 后端返回的组件配置
 * @param initialValues - 初始值
 * @returns 组件列表
 */
export default function DynamicRender (
  options: ComponentConfig[],
  initialValues: Record<string, any> = {}
) {
  const list: JSX.Element[] = []
  const result = createResult(initialValues)

  options.forEach(item => {
    let element: JSX.Element | null = null

    if (item.componentType === 'input') {
      element = Input(item, result as Result<'input'>)
    }

    if (item.componentType === 'switch') {
      element = Switch(item, result as Result<'switch'>)
    }

    if (item.componentType === 'checkbox-group') {
      element = CheckboxGroup(item, result as Result<'checkbox'>)
    }

    if (item.componentType === 'radio-group') {
      element = RadioGroup(item, result as Result<'radio'>)
    }

    if (item.componentType === 'accordion') {
      element = Accordion(item, result as Result<'accordion'>)
    }

    if (item.componentType === 'accordion-pro') {
      element = AccordionPro(item, result as Result<'accordion-pro'>)
    }

    if (element) {
      list.push(element)
    }
  })

  return { list, result }
}
