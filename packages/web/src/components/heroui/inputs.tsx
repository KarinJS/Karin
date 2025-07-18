import { Input as HeroInput } from '@heroui/input'
import { createValidator } from './utils'
import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { Controller } from 'react-hook-form'

import type { JSX } from 'react'
import type { InputProps, InputGroupProps } from 'node-karin'
import type { FormControl, FormRegister } from '../config/plugin/render'

/**
 * 生成div的className
 * @param props - 输入框属性
 * @returns div的className
 */
const generateDivClassName = (props: InputProps): string => {
  if (props.className && typeof props.className === 'string') return props.className
  if (props.width || props.height) return `w-${props.width || 200}px h-${props.height || 40}px`
  return 'inline-block p-2'
}

/**
 * 渲染输入框组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @returns 渲染后的输入框组件
 */
export const createInput = (
  props: InputProps,
  register: FormRegister
): JSX.Element => {
  const { componentType: _, className, componentClassName, key, ...options } = props
  const validator = props.rules ? createValidator(props.rules) : undefined

  // 使用useEffect确保输入框不会自动获取焦点
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef) {
      // 确保输入框失去焦点
      inputRef.blur()

      // 在移动设备上，临时设置readOnly以防止键盘弹出
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        inputRef.setAttribute('readonly', 'readonly')
        // 短暂延迟后移除readonly属性，但保持失焦状态
        setTimeout(() => {
          inputRef.removeAttribute('readonly')
          inputRef.blur()
        }, 100)
      }
    }
  }, [inputRef])

  const registerOptions = register(`${key}.value`)

  return (
    <div className={generateDivClassName(props)} key={`div-${key}`}>
      <HeroInput
        {...options}
        {...registerOptions}
        description={
          <p className='text-xs text-default-500 mb-1 break-words w-full max-w-[300px] break-all'>
            {options.description}
          </p>
        }
        className={componentClassName || 'w-full max-w-[300px]'}
        autoFocus={false}
        ref={(el) => {
          el && setInputRef(el) // 防止键盘弹出
          registerOptions.ref?.(el) // 怪怪的...
        }}
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
 * @param control - 表单控制器
 * @param basePath - 基础路径
 * @returns 输入框组组件
 */
export const createInputGroup = (
  props: InputGroupProps,
  control: FormControl,
  basePath?: string
): JSX.Element => {
  const { template, key } = props
  const { componentType: __, key: ___, componentClassName, ...templateOptions } = template
  /** 验证器 */
  const validator = template.rules ? createValidator(template.rules) : undefined

  /** 最大输入框数量 */
  const maxInputs = props.maxInputs ?? 100
  /** 每行输入框数量 */
  const itemsPerRow = props.itemsPerRow || 5
  /** 最大行数 */
  const maxRows = props.maxRows || 5
  /** 字段路径 */
  const name = basePath ? `${basePath}.${key}.value` : `${key}.value`

  const [columns, setColumns] = useState('1fr')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')
    const updateColumns = (e: MediaQueryListEvent | MediaQueryList) => {
      setColumns(e.matches ? `repeat(${itemsPerRow}, 1fr)` : '1fr')
    }
    updateColumns(mediaQuery)
    mediaQuery.addEventListener('change', updateColumns)
    return () => mediaQuery.removeEventListener('change', updateColumns)
  }, [itemsPerRow])

  // TODO: 奇怪的类型问题，懒得管了。。。
  const defaultValue = [] as any

  return (
    <div key={key} className={props.className || 'w-full rounded-2xl p-2 transition-colors'}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value = defaultValue, onChange } }) => {
          const handleAddInput = () => {
            if (maxInputs !== 0 && value.length >= maxInputs) {
              toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
              return
            }
            onChange([...value, ''])
          }

          const handleDeleteInput = (index: number) => {
            const newValues = [...value]
            newValues.splice(index, 1)
            onChange(newValues)
            toast.success('已删除一个输入框')
          }

          const handleInputChange = (index: number, newValue: string) => {
            const newValues = [...value]
            newValues[index] = newValue
            onChange(newValues)
          }

          return (
            <>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2'>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-default-500 text-md'>{props.label}</span>
                  {props.description && <p className='text-sm text-gray-500'>{props.description}</p>}
                </div>
                <div className='flex items-center gap-1.5 self-end sm:self-auto'>
                  <span className='text-sm text-gray-500'>
                    {value.length}
                    {maxInputs !== 0 ? `/${maxInputs}` : ''}
                  </span>
                  <Button
                    variant='solid'
                    color='primary'
                    size='sm'
                    onPress={handleAddInput}
                    className='flex items-center gap-1 px-2 h-7 min-w-[60px]'
                    disabled={maxInputs !== 0 && value.length >= maxInputs}
                  >
                    添加
                  </Button>
                </div>
              </div>

              <div
                className='grid gap-4 p-2 border border-default-200 rounded-xl min-h-[100px] transition-colors'
                style={{
                  maxHeight: `calc((60px * ${maxRows}) + (1rem * ${maxRows}))`,
                  gridTemplateColumns: columns,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {value.length === 0
                  ? (
                    <div className='col-span-full flex flex-col items-center justify-center text-default-400 h-full w-full'>
                      <p className='text-sm'>暂无配置项</p>
                      <p className='text-xs'>点击右上角的 “添加” 按钮开始添加配置</p>
                    </div>
                  )
                  : (
                    value.map((inputValue: string, index: number) => (
                      <div key={index} className='grid grid-cols-[1fr,auto] items-center gap-1'>
                        <HeroInput
                          {...templateOptions}
                          className={`${componentClassName || 'w-full'}`}
                          value={inputValue}
                          onChange={(e) => handleInputChange(index, e.target.value)}
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
                          onPress={() => handleDeleteInput(index)}
                          className='hover:bg-red-50 transition-colors duration-200 p-1 min-w-0 h-7 w-7 rounded-full'
                          aria-label='删除输入框'
                        >
                          <IoCloseCircle size={16} />
                        </Button>
                      </div>
                    ))
                  )}
              </div>
            </>
          )
        }}
      />
    </div>
  )
}
