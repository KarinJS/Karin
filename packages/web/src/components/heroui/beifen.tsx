import React from 'react'
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
import type { AccordionProProps, AccordionKV } from 'node-karin'
import { getRandomString } from '@/lib/utils'

/**
 * 渲染手风琴pro组件
 * @param props - 输入框属性
 * @param ref - 组件数据缓存
 * @param result - 传递给后端的对象
 * @returns 渲染后的输入框组件
 */
export const AccordionPro = (
  props: AccordionProProps,
  result: Result<'accordion'>
): JSX.Element => {
  let { componentType: _, key, data, className, children, ...options } = props
  const [forceKey, setForceKey] = React.useState(0)

  const handleDeleteItem = (index: number) => {
    data.splice(index, 1)
    result[key].splice(index, 1)
    setForceKey(prev => prev + 1)
  }

  result[key] = data.map(item => {
    const { title, ...rest } = item
    return rest
  })
  console.log('result:', result)

  const list: JSX.Element[] = []

  if (!Array.isArray(data) || !Array.isArray(children?.children)) return <div>数据错误</div>
  const { children: childrenList, ...childrenOptions } = children

  for (let i = 0; i < data.length; i++) {
    const heroui = childrenList.map((options) => {
      /** 生成随机key */
      const strKey = options.key + getRandomString(5)

      if (options.componentType === 'input') {
        const opt = { ...options, key: strKey, defaultValue: data[i][options.key] || options.defaultValue }
        return Input(opt, {}, (value) => {
          data[i][options.key] = value
          if (!result[key][i]) result[key][i] = {};
          (result[key][i] as Record<string, AccordionKV>)[options.key] = value
        })
      }

      if (options.componentType === 'switch') {
        const opt = { ...options, key: strKey, defaultSelected: data[i][options.key] ?? options.defaultSelected }
        return Switch(opt, {}, (value) => {
          data[i][options.key] = value
          if (!result[key][i]) result[key][i] = {};
          (result[key][i] as Record<string, AccordionKV>)[options.key] = value
        })
      }

      if (options.componentType === 'radio-group') {
        const opt = { ...options, key: strKey, defaultValue: data[i][options.key] ?? options.defaultValue }
        return RadioGroup(opt, {}, (value) => {
          data[i][options.key] = value
          if (!result[key][i]) result[key][i] = {};
          (result[key][i] as Record<string, AccordionKV>)[options.key] = value
        })
      }

      if (options.componentType === 'checkbox-group') {
        const opt = { ...options, key: strKey, checkbox: data[i][options.key] ?? options.checkbox }
        if (!result[key][i]) result[key][i] = {}
        return CheckboxGroup(opt, {}, (subKey, value) => {
          data[i][options.key][subKey] = value
          if (!((result[key][i] as Record<string, AccordionKV>
          )[options.key] as Record<string, boolean>)) {
            ((result[key][i] as Record<string, AccordionKV>
            )[options.key] as Record<string, boolean>) = {}
          }

          ((result[key][i] as Record<string, AccordionKV>
          )[options.key] as Record<string, boolean>)[subKey] = value
        })
      }

      if (options.componentType === 'divider') {
        return Divider(options)
      }
    })

    list.push(
      <HeroAccordionItem
        {...childrenOptions}
        key={key + getRandomString(5)}
        textValue={data[i].title || childrenOptions.title || '默认标题'}
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span>{data[i].title || childrenOptions.title || '默认标题'}</span>
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteItem(i)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDeleteItem(i)
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
          {heroui}
        </div>
      </HeroAccordionItem>
    )
  }

  return (
    <div className={className || 'flex flex-col gap-4 w-full'}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            data.push({
              ...JSON.parse(JSON.stringify(data[0])),
              title: '新卡片' + (data.length + 1)
            })
            setForceKey(prev => prev + 1)
          }}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          添加新卡片
        </button>
      </div>
      <HeroAccordion
        key={`${key}-${forceKey}`}
        {...options}
      >
        {list}
      </HeroAccordion>
    </div>
  )
}


