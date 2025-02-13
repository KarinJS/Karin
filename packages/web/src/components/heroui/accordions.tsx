import {
  Accordion as HeroAccordion,
  AccordionItem as HeroAccordionItem
} from '@heroui/accordion'
import { Input } from './inputs'
import { Switch } from './switchs'
import { Divider } from './dividers'
import { RadioGroup } from './radioGroups'
import { CheckboxGroup } from './checkboxs'
import type { JSX } from 'react'
import type { Result } from './types'
import type { AccordionProps, AccordionKV } from 'node-karin'
/**
 * 渲染手风琴组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @returns 渲染后的输入框组件
 */
export const Accordion = (
  props: AccordionProps,
  result: Result<'accordion'>
): JSX.Element => {
  let { componentType: _, key, className, children, ...options } = props
  if (!Array.isArray(children)) children = []
  result[key] = []

  children.forEach((item) => {
    if (item.componentType !== 'accordion-item' || !Array.isArray(item.children)) return
    const kv: Record<string, unknown> = {}
    item.children.forEach((child) => {
      if (child.componentType === 'input') {
        kv[child.key] = child.defaultValue
        return
      }
      if (child.componentType === 'switch') {
        kv[child.key] = child.defaultSelected
        return
      }
      if (child.componentType === 'radio-group') {
        kv[child.key] = child.defaultValue
        return
      }
      if (child.componentType === 'checkbox-group') {
        kv[child.key] = {}
        child.checkbox.forEach((item) => {
          (kv[child.key] as Record<string, boolean>)[item.key] = item.defaultSelected ?? false
        })
        return
      }
    })
    result[key].push(kv as AccordionKV)
  })

  return (
    <div className={className || 'flex items-center gap-2'}>
      <HeroAccordion
        key={key}
        {...options}
      >
        {children.map(({ componentType, key: childrenKey, children: itemChildren, ...item }, index) => {
          if (
            componentType !== 'accordion-item'
            || !Array.isArray(itemChildren)
          ) return null
          return (
            <HeroAccordionItem
              key={childrenKey}
              {...item}
              keepContentMounted={true}
            >
              {itemChildren.map((options) => {
                if (options.componentType === 'input') {
                  return Input(options, {}, (value) => {
                    (result[key][index] as Record<string, AccordionKV>)[options.key] = value
                  })
                }

                if (options.componentType === 'switch') {
                  return Switch(options, {}, (value) => {
                    (result[key][index] as Record<string, AccordionKV>)[options.key] = value
                  })
                }

                if (options.componentType === 'radio-group') {
                  return RadioGroup(options, {}, (value) => {
                    (result[key][index] as Record<string, AccordionKV>)[options.key] = value
                  })
                }

                if (options.componentType === 'checkbox-group') {
                  (result[key][index] as Record<string, AccordionKV>)[options.key] = {}
                  return CheckboxGroup(options, {}, (subKey, value) => {
                    ((result[key][index] as Record<string, AccordionKV>
                    )[options.key] as Record<string, boolean>)[subKey] = value
                  })
                }

                if (options.componentType === 'divider') {
                  return Divider(options)
                }
              })}
            </HeroAccordionItem>
          )
        })}
      </HeroAccordion>
    </div>
  )
}


