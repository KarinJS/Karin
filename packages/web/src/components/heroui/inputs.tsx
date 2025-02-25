import { Input as HeroInput } from '@heroui/input'
import { createValidator } from './utils'
import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { useFieldArray } from 'react-hook-form'

import type { JSX } from 'react'
import type { InputProps, InputGroupProps } from 'node-karin'
import type { FormControl, FormRegister } from '../config/render'

/**
 * 生成div的className
 * @param props - 输入框属性
 * @returns div的className
 */
const generateDivClassName = (props: InputProps): string => {
  if (props.className && typeof props.className === 'string') return props.className
  if (props.width || props.height) return `w-${props.width || 200}px h-${props.height || 40}px`
  return 'inline-flex p-2'
}

/**
 * 渲染输入框组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @returns 渲染后的输入框组件
 */
export const createInput = (props: InputProps, register: FormRegister): JSX.Element => {
  const { componentType: _, className, componentClassName, key, ...options } = props
  const validator = props.rules ? createValidator(props.rules) : undefined

  return (
    <div className={generateDivClassName(props)} key={`div-${key}`}>
      <HeroInput
        key={key}
        {...options}
        {...register(`${key}.value`)}
        className={componentClassName || 'w-[300px]'}
        validate={(value) => {
          if (!value) {
            if (options.isRequired) {
              return '( • ̀ω•́ )✧ 不能为空哦~'
            }

            return true
          }
          return validator?.(value)
        }}
      />
    </div>
  )
}

/**
 * 输入框组组件
 * @param props - 输入框组属性
 * @param register - 表单注册器
 * @param control - 表单控制器
 * @returns 输入框组组件
 */
export const createInputGroup = (
  props: InputGroupProps,
  register: FormRegister,
  control: FormControl
) => {
  const { template, key } = props
  const { componentType: __, key: ___, componentClassName, ...templateOptions } = template
  const validator = template.rules ? createValidator(template.rules) : undefined

  /** 单行最多允许多少个输入框 */
  const itemsPerRow = props.itemsPerRow || 5
  /** 最大显示行数 */
  const maxRows = props.maxRows || 5
  /** 最大输入框数量 */
  const maxInputs = props.maxInputs ?? 100

  const [columns, setColumns] = useState('1fr')

  /** TODO: 我也不知道怎么用啊~ 不会传泛型~ */
  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: `${key}.value`,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')

    const updateColumns = (e: MediaQueryListEvent | MediaQueryList) => {
      setColumns(e.matches ? `repeat(${itemsPerRow}, 1fr)` : '1fr')
    }

    updateColumns(mediaQuery)
    mediaQuery.addEventListener('change', updateColumns)

    return () => mediaQuery.removeEventListener('change', updateColumns)
  }, [itemsPerRow])

  // 添加新输入框
  const handleAddInput = () => {
    if (maxInputs !== 0 && fields.length >= maxInputs) {
      toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
      return
    }
    append('')
  }

  // 删除输入框
  const handleDeleteInput = (index: number) => {
    remove(index)
    toast.success('已删除一个输入框')
  }

  return (
    <div key={key} className={props.className || 'w-full rounded-2xl p-2 transition-colors'}>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-default-500 text-md'>{props.label}</span>
          {props.description && <p className='text-sm text-gray-500'>{props.description}</p>}
        </div>
        <div className='flex items-center gap-1.5 self-end sm:self-auto'>
          <span className='text-sm text-gray-500'>
            {fields.length}
            {maxInputs !== 0 ? `/${maxInputs}` : ''}
          </span>
          <Button
            key={`${key}-add-input`}
            variant='solid'
            color='primary'
            size='sm'
            onPress={handleAddInput}
            className='flex items-center gap-1 px-2 h-7 min-w-[60px]'
            disabled={maxInputs !== 0 && fields.length >= maxInputs}
          >
            添加
          </Button>
        </div>
      </div>

      <div
        className='grid gap-4 p-2 border border-gray-200 dark:border-gray-700 rounded-xl min-h-[100px] transition-colors'
        style={{
          maxHeight: `calc((60px * ${maxRows}) + (1rem * ${maxRows}))`,
          gridTemplateColumns: columns,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {fields.map((field, index) => (
          <div key={field.id} className='grid grid-cols-[1fr,auto] items-center gap-1'>
            <HeroInput
              {...templateOptions}
              className={`${componentClassName || 'w-full'}`}
              {...register(`${key}.value.${index}`)}
              validate={(val) => {
                if (!val) {
                  if (templateOptions.isRequired) {
                    return '( • ̀ω•́ )✧ 不能为空哦~'
                  }
                  return true
                }
                return validator?.(val)
              }}
            />
            <Button
              variant='light'
              color='danger'
              key={`delete-${key}-${index}`}
              onPress={() => handleDeleteInput(index)}
              className='hover:bg-red-50 transition-colors duration-200 p-1 min-w-0 h-7 w-7 rounded-full'
              aria-label='删除输入框'
            >
              <IoCloseCircle size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
