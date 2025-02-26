import { useFieldArray } from 'react-hook-form'
import { createDivider } from '../heroui/dividers'
import { createSwitch } from '../heroui/switchs'
import { createRadioGroup } from '../heroui/radioGroups'
import { createCheckboxGroup } from '../heroui/checkboxs'
import { createInput, createInputGroup } from '../heroui/inputs'
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion'

import type { JSX } from 'react'
import type { DefaultValues, Value } from './values'
import type { Control, UseFormRegister } from 'react-hook-form'
import type { AccordionProProps, AccordionProps, ComponentConfig } from 'node-karin'

/**
 * 表单控制器类型
 */
export type FormControl = Control<DefaultValues>

/**
 * 表单注册器类型
 */
export type FormRegister = UseFormRegister<DefaultValues>

/**
 * 动态渲染组件
 */
export const RenderComponent: React.FC<{
  options: ComponentConfig[]
  register: FormRegister
  control: FormControl
  basePath?: string
}> = ({ options, register, control, basePath }) => {
  const list: JSX.Element[] = []

  options.forEach((option) => {
    if (option.componentType === 'divider') {
      list.push(createDivider(option))
      return
    }

    if (option.componentType === 'input') {
      list.push(createInput(option, register))
      return
    }

    if (option.componentType === 'switch') {
      list.push(createSwitch(option, register))
      return
    }

    if (option.componentType === 'radio-group') {
      list.push(createRadioGroup(option, register))
      return
    }

    if (option.componentType === 'input-group') {
      list.push(createInputGroup(option, register, control, basePath))
      return
    }

    if (option.componentType === 'checkbox-group') {
      list.push(createCheckboxGroup(option, register, control, basePath))
      return
    }

    if (option.componentType === 'accordion') {
      list.push(createAccordion(option, register, control))
      return
    }

    if (option.componentType === 'accordion-pro') {
      list.push(createAccordionPro(option, register, control))
    }
  })

  return list
}

/**
 * 渲染手风琴组件
 * @param option - 手风琴配置
 * @param register - 注册器
 * @param control - 控制器
 * @returns 手风琴组件
 */
export const createAccordion = (
  option: AccordionProps,
  register: FormRegister,
  control: FormControl
): JSX.Element => {
  const { fields } = useFieldArray<any>({
    control,
    name: `${option.key}.value`,
  })

  const {
    componentType: _,
    key,
    className,
    componentClassName,
    label,
    children = [],
    ...options
  } = option

  /**
   * 递归注册器
   * @param index - 当前手风琴项的索引
   * @returns 递归注册器
   */
  const createPrefixedRegister = (index: number): FormRegister => {
    return ((name: string) => register(`${key}.value.${index}.${name}`)) as FormRegister
  }

  return (
    <div className={className || 'flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'} key={key}>
      <div className='flex justify-between items-center'>
        <span className='text-default-500 text-md mt-2'>{label || '手风琴'}</span>
      </div>
      <HeroAccordion
        key={key}
        className={componentClassName || 'border border-default-200 rounded-lg p-1'}
        {...options}
        keepContentMounted
      >
        {fields.map((field, index) => {
          const {
            componentType: type,
            key: ___,
            className,
            componentClassName,
            title,
            subtitle,
            children: childrenConfig,
            ...itemOptions
          } = children[index]

          if (type !== 'accordion-item') return null

          return (
            <HeroAccordionItem
              {...itemOptions}
              key={field.id}
              title={title || '手风琴默认标题'}
              subtitle={subtitle || '手风琴默认副标题'}
              className={componentClassName || 'mx-2'}
              textValue={`textValue-${key}-${index}`}
            >
              <div className={className || 'flex flex-col gap-4 p-2'}>
                <RenderComponent
                  options={(childrenConfig || []) as ComponentConfig[]}
                  register={createPrefixedRegister(index)}
                  control={control}
                  basePath={`${key}.value.${index}`}
                />
              </div>
            </HeroAccordionItem>
          )
        }).filter(Boolean)}
      </HeroAccordion>
      <div className='h-2' />
    </div>
  )
}

/**
 * 渲染手风琴pro组件
 * @param option - 手风琴pro配置
 * @param register - 注册器
 * @param control - 控制器
 * @returns 手风琴pro组件
 */
export const createAccordionPro = (
  option: AccordionProProps,
  register: FormRegister,
  control: FormControl
): JSX.Element => {
  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: `${option.key}.value`,
  })

  const {
    componentType: _,
    key,
    className,
    componentClassName,
    label,
    children: template,
    data,
    ...options
  } = option

  /**
   * 递归注册器
   * @param index - 当前手风琴项的索引
   * @returns 递归注册器
   */
  const createPrefixedRegister = (index: number): FormRegister => {
    return ((name: string) => register(`${key}.value.${index}.${name}`)) as FormRegister
  }

  /**
   * 添加新项
   */
  const handleAddItem = () => {
    if (!data || data.length === 0) {
      // 如果没有数据，创建一个空对象
      const emptyItem: Record<string, Value> = {}
      // 遍历子组件配置，为每个子组件创建默认值
      if (template.children && Array.isArray(template.children)) {
        template.children.forEach(child => {
          if (child.componentType === 'input') {
            emptyItem[child.key] = {
              key: 'input',
              value: child.defaultValue || ''
            }
          }
          if (child.componentType === 'checkbox-group') {
            emptyItem[child.key] = {
              key: 'checkbox-group',
              value: []
            }
          }
          if (child.componentType === 'input-group') {
            emptyItem[child.key] = {
              key: 'input-group',
              value: child.data || []
            }
          }
        })
      }
      append(emptyItem)
    } else {
      // 如果有数据，复制第一项的结构
      const firstItemStructure: Record<string, Value> = {}
      if (template.children && Array.isArray(template.children)) {
        template.children.forEach(child => {
          if (child.componentType === 'input') {
            firstItemStructure[child.key] = {
              key: 'input',
              value: ''
            }
          }
          if (child.componentType === 'checkbox-group') {
            firstItemStructure[child.key] = {
              key: 'checkbox-group',
              value: []
            }
          }
          if (child.componentType === 'input-group') {
            firstItemStructure[child.key] = {
              key: 'input-group',
              value: child.data || []
            }
          }
        })
      }
      append(firstItemStructure)
    }
  }

  return (
    <div className={className || 'flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'} key={key}>
      <div className='flex justify-between items-center'>
        <span className='text-default-500 text-md mt-2'>{label || '手风琴'}</span>
        <button
          type='button'
          onClick={handleAddItem}
          className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          添加新卡片
        </button>
      </div>
      <HeroAccordion
        key={key}
        className={componentClassName || 'border border-default-200 rounded-lg p-1'}
        {...options}
        keepContentMounted
      >
        {fields.map((field, index) => {
          const {
            key: ___,
            className,
            componentClassName,
            title,
            subtitle,
            children: childrenConfig,
            ...itemOptions
          } = template

          return (
            <HeroAccordionItem
              {...itemOptions}
              key={field.id}
              title={
                <div className='flex justify-between items-center w-full pr-4'>
                  <span>{data && data[index] ? (data[index].title || title || '手风琴默认标题') : '手风琴默认标题'}</span>
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(index)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        remove(index)
                      }
                    }}
                    className='px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer'
                  >
                    删除
                  </div>
                </div>
              }
              subtitle={data && data[index] ? (data[index].subtitle || subtitle || '手风琴默认副标题') : '手风琴默认副标题'}
              className={componentClassName || 'mx-2'}
              textValue={`textValue-${key}-${index}`}
            >
              <div className={className || 'flex flex-col gap-4 p-2'}>
                <RenderComponent
                  options={(childrenConfig || []) as ComponentConfig[]}
                  register={createPrefixedRegister(index)}
                  control={control}
                  basePath={`${key}.value.${index}`}
                />
              </div>
            </HeroAccordionItem>
          )
        }).filter(Boolean)}
      </HeroAccordion>
      <div className='h-2' />
    </div>
  )
}
