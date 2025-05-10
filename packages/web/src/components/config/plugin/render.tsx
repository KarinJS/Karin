import { useFieldArray } from 'react-hook-form'
import { createDivider } from '../../heroui/dividers'
import { createSwitch } from '../../heroui/switchs'
import { createRadioGroup } from '../../heroui/radioGroups'
import { createCheckboxGroup } from '../../heroui/checkboxs'
import { createInput, createInputGroup } from '../../heroui/inputs'
import { createCron } from './createCron'
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion'
import { Button } from '@heroui/button'
import { createErrorCard } from '../../heroui/error'
import { useState, useEffect } from 'react'

import type { JSX } from 'react'
import type { DefaultValues, Value } from './values'
import type { Control, UseFormRegister } from 'react-hook-form'
import type { AccordionProProps, AccordionProps, ComponentConfig } from 'node-karin'
import { toast } from 'react-hot-toast'

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
    try {
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
        list.push(createRadioGroup(option, control, basePath))
        return
      }

      if (option.componentType === 'input-group') {
        list.push(createInputGroup(option, control, basePath))
        return
      }

      if (option.componentType === 'checkbox-group') {
        list.push(createCheckboxGroup(option, control, basePath))
        return
      }

      if (option.componentType === 'accordion') {
        list.push(createAccordion(option, register, control))
        return
      }

      if (option.componentType === 'accordion-pro') {
        list.push(createAccordionPro(option, register, control))
        return
      }

      if (option.componentType === 'cron') {
        list.push(createCron(option, control, basePath))
        return
      }

      throw new Error(`未知的组件类型: ${option.componentType}`)
    } catch (error) {
      list.push(createErrorCard('组件渲染错误', error as Error))
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
  const { fields, append, remove } = useFieldArray<DefaultValues>({
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
    data: propData,
    ...options
  } = option

  /**
   * 创建本地data状态，初始化为props中的data
   */
  const [localData, setLocalData] = useState(propData || [])

  /**
   * 当fields变化时，同步更新localData
   */
  useEffect(() => {
    /**
     * 确保fields和localData长度一致
     */
    if (fields.length !== localData.length && propData && propData.length > 0) {
      /**
       * 根据fields的ID匹配localData
       */
      const newLocalData = fields.map((_, index) => {
        /**
         * 尝试找到对应的data项
         */
        if (index < propData.length) {
          return propData[index]
        }
        return localData[index] || { title: '新项目', subtitle: '无描述' }
      })

      setLocalData(newLocalData)
    }
  }, [fields, localData, propData])

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
   * 根据模板生成一个空数据
   */
  const handleAddItem = () => {
    const emptyItem: Record<string, Value> = {}
    template.children.forEach(child => {
      if (child.componentType === 'input') {
        emptyItem[child.key] = { key: 'input', value: '' }
        return
      }
      if (child.componentType === 'input-group') {
        emptyItem[child.key] = { key: 'input-group', value: [''] }
        return
      }
      if (child.componentType === 'checkbox-group') {
        emptyItem[child.key] = { key: 'checkbox-group', value: [] }
        return
      }
      if (child.componentType === 'radio-group') {
        emptyItem[child.key] = { key: 'radio-group', value: '' }
        return
      }
      if (child.componentType === 'switch') {
        emptyItem[child.key] = { key: 'switch', value: false }
      }
    })

    /**
     * 添加新的空项
     */
    append(emptyItem)

    /**
     * 同步更新localData
     */
    setLocalData([...localData, { title: '新项目', subtitle: '无描述' }])
  }

  /**
   * 自定义删除操作，同时更新fields和localData
   * @param index - 要删除的索引
   */
  const handleRemove = (index: number) => {
    /**
     * 删除fields中的项
     */
    remove(index)

    /**
     * 同步删除localData中对应的项
     */
    const newLocalData = [...localData]
    newLocalData.splice(index, 1)
    setLocalData(newLocalData)

    /**
     * 显示删除成功的通知提示
     */
    toast.success('已删除一个子项')
  }

  /**
   * 渲染手风琴pro卡片
   * @param id - 卡片id
   * @param key - 卡片key
   * @param index - 卡片索引
   * @param control - 控制器
   * @param data - 卡片数据
   * @param template - 卡片模板
   * @param createPrefixedRegister - 递归注册器
   */
  const createAccordionProCard = (
    id: string,
    key: string,
    index: number,
    control: FormControl,
    data: any[],
    template: AccordionProProps['children'],
    createPrefixedRegister: (index: number) => FormRegister
  ) => {
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
        key={id}
        title={
          <div className='flex justify-between items-center w-full'>
            <span>{
              data &&
                data[index]
                ? (data[index].title || title || '手风琴默认标题')
                : '手风琴默认标题'
            }
            </span>
            <Button
              size='sm'
              color='danger'
              variant='flat'
              onPress={() => {
                /**
                 * 执行自定义删除操作，同步更新fields和localData
                 */
                handleRemove(index)
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove(index)
                }
              }}
            >
              删除
            </Button>
          </div>
        }
        subtitle={
          data &&
            data[index]
            ? (data[index].subtitle || subtitle || '手风琴默认副标题')
            : '手风琴默认副标题'
        }
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
  }

  return (
    <div className={className || 'flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'} key={key}>
      <div className='flex justify-between items-center'>
        <span className='text-default-500 text-md mt-2'>{label || '手风琴'}</span>
        <Button
          size='sm'
          color='primary'
          variant='flat'
          onPress={handleAddItem}
        >
          添加新卡片
        </Button>
      </div>
      <HeroAccordion
        key={key}
        className={componentClassName || 'border border-default-200 rounded-lg p-1'}
        {...options}
        keepContentMounted
      >
        {/* 渲染手风琴pro卡片 */}
        {fields.map((field, index) => createAccordionProCard(
          field.id,
          key,
          index,
          control,
          localData,
          template,
          createPrefixedRegister
        )).filter(Boolean)}
      </HeroAccordion>
      <div className='h-2' />
    </div>
  )
}
