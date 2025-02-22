import {
  Accordion as HeroAccordion,
  AccordionItem as HeroAccordionItem
} from '@heroui/accordion'
import { createInput, createInputGroup } from './inputs'
import { createSwitch } from './switchs'
import { createDivider } from './dividers'
import { createRadioGroup } from './radioGroups'
import { createCheckboxGroup } from './checkboxs'
import type { JSX } from 'react'
import type { AccordionProps, AccordionKV } from 'node-karin'

/**
 * 渲染手风琴组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @returns 渲染后的输入框组件
 */
export const Accordion = (
  props: AccordionProps,
  result: Record<string, any>
): JSX.Element => {
  let { componentType: _, key, className, children, label, ...options } = props
  if (!Array.isArray(children)) children = []
  result[key] = []

  children.forEach((item) => {
    if (item.componentType !== 'accordion-item' || !Array.isArray(item.children)) return
    const kv: Record<string, unknown> = {}
    item.children.forEach((child) => {
      if (child.componentType === 'input') {
        kv[child.key] = child.defaultValue ?? ''
        return
      }
      if (child.componentType === 'switch') {
        kv[child.key] = child.defaultSelected ?? false
        return
      }
      if (child.componentType === 'radio-group') {
        kv[child.key] = child.defaultValue ?? ''
        return
      }
      if (child.componentType === 'checkbox-group') {
        kv[child.key] = {}
        child.checkbox.forEach((item) => {
          (kv[child.key] as Record<string, boolean>)[item.key] = item.defaultSelected ?? false
        })
        return
      }
      if (child.componentType === 'input-group') {
        kv[child.key] = child.data
      }
    })
    result[key].push(kv as AccordionKV)
  })

  return (
    <div className={className || 'flex flex-col gap-4 w-full'}>
      <div className='flex justify-between items-center'>
        <span className='text-default-500 text-md'>{label}</span>
      </div>
      <HeroAccordion
        key={key}
        className='border border-default-200 rounded-lg p-1'
        {...options}
        keepContentMounted
      >
        {children.map(({ componentType, key: childrenKey, children: itemChildren, ...item }, index) => {
          if (
            componentType !== 'accordion-item' ||
            !Array.isArray(itemChildren)
          ) return null
          return (
            <HeroAccordionItem
              key={childrenKey}
              {...item}
            >
              <div className='flex flex-col gap-4'>
                {itemChildren.map((options) => {
                  if (options.componentType === 'input') {
                    return createInput(options, {}, (value) => {
                      result[key][index][options.key] = value
                    })
                  }

                  if (options.componentType === 'switch') {
                    return createSwitch(options, {}, (value) => {
                      result[key][index][options.key] = value
                    })
                  }

                  if (options.componentType === 'radio-group') {
                    return createRadioGroup(options, {}, (value) => {
                      result[key][index][options.key] = value
                    })
                  }

                  if (options.componentType === 'checkbox-group') {
                    result[key][index][options.key] = {}
                    return createCheckboxGroup(options, {}, (subKey, value) => {
                      result[key][index][options.key][subKey] = value
                    })
                  }

                  if (options.componentType === 'divider') {
                    return createDivider(options)
                  }

                  if (options.componentType === 'input-group') {
                    return createInputGroup(options, {}, (i, value, type) => {
                      if (type === 'add') {
                        result[key][index][options.key][i] = value
                        result[key][index][options.key] = result[key][index][options.key].map(String)
                      } else {
                        result[key][index][options.key].splice(i, 1)
                      }
                    }, result[key][index][options.key])
                  }
                })}
              </div>
            </HeroAccordionItem>
          )
        })}
      </HeroAccordion>
    </div>
  )
}
