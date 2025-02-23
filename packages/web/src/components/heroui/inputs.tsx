import { Input as HeroInput } from '@heroui/input'
import { createValidator } from './utils'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import type { JSX } from 'react'
import type { InputProps, InputGroupProps } from 'node-karin'

/**
 * 生成div的className
 * @param props - 输入框属性
 * @returns div的className
 */
const generateDivClassName = (props: InputProps): string => {
  if (props.className && typeof props.className === 'string') return props.className
  if (props.width || props.height) return `w-${props.width || 200}px h-${props.height || 40}px`
  return 'inline-flex px-2 mb-2 mt-2'
}

/**
 * 渲染输入框组件
 * @param props - 输入框属性
 * @returns 渲染后的输入框组件
 */
export const createInput = (props: InputProps): JSX.Element => {
  const { componentType: _, className, componentClassName, key, ...options } = props
  const validator = props.rules ? createValidator(props.rules) : undefined

  return (
    <div className={generateDivClassName(props)} key={`div-${key}`}>
      <HeroInput
        key={key}
        {...options}
        name={key}
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
 * 渲染输入框组 组件
 * @param props - 输入框组属性
 * @returns 渲染后的输入框组组件
 */
export const createInputGroup = (props: InputGroupProps) => {
  const { key, template, data } = props

  // 使用 key 作为组件实例的唯一标识
  const instanceId = useRef(key)

  // 确保初始数据格式正确
  const initialData = (data || []).map(item =>
    typeof item === 'string' ? item : String(item)
  )

  const [groupValue, setGroupValue] = useState<string[]>(initialData)
  const containerRef = useRef<HTMLDivElement>(null)

  const { componentType: __, key: ___, componentClassName, ...templateOptions } = template
  const validator = template.rules ? createValidator(template.rules) : undefined

  /** 单行最多允许多少个输入框 */
  const itemsPerRow = props.itemsPerRow || 5
  /** 最大显示行数 */
  const maxRows = props.maxRows || 5
  /** 最大输入框数量 */
  const maxInputs = props.maxInputs ?? 100

  const [columns, setColumns] = useState('1fr')

  // 当 data prop 变化时更新状态
  useEffect(() => {
    if (data) {
      setGroupValue(data)
    }
  }, [data])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')

    const updateColumns = (e: MediaQueryListEvent | MediaQueryList) => {
      setColumns(e.matches ? `repeat(${itemsPerRow}, 1fr)` : '1fr')
    }

    updateColumns(mediaQuery)
    mediaQuery.addEventListener('change', updateColumns)

    return () => mediaQuery.removeEventListener('change', updateColumns)
  }, [itemsPerRow])

  // 在数据更新后执行滚动
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [groupValue.length])

  // 处理输入框值变化
  const handleInputChange = (value: string, index: number) => {
    setGroupValue(prev => {
      const newValues = [...prev]
      newValues[index] = value
      return newValues
    })
  }

  // 添加新输入框
  const handleAddInput = () => {
    if (maxInputs !== 0 && groupValue.length >= maxInputs) {
      toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
      return
    }
    setGroupValue(prev => [...prev, ''])
  }

  // 删除输入框
  const handleDeleteInput = (index: number) => {
    setGroupValue(prev => {
      const newValues = [...prev]
      newValues.splice(index, 1)
      return newValues
    })
    toast.success('已删除一个输入框')
  }

  return (
    <div
      key={instanceId.current}
      className={
        props.className ||
        'w-full bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 transition-colors'
      }
    >
      <input
        type='hidden'
        name={instanceId.current}
        value={JSON.stringify(groupValue)}
      />

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-default-500 text-md'>{props.label}</span>
          {props.description && (
            <p className='text-sm text-gray-500'>{props.description}</p>
          )}
        </div>
        <div className='flex items-center gap-1.5 self-end sm:self-auto'>
          <span className='text-sm text-gray-500'>
            {groupValue.length}{maxInputs !== 0 ? `/${maxInputs}` : ''}
          </span>
          <Button
            key={`${instanceId.current}-add-input`}
            variant='solid'
            color='primary'
            size='sm'
            onPress={handleAddInput}
            className='flex items-center gap-1 px-2 h-7 min-w-[60px]'
            disabled={maxInputs !== 0 && groupValue.length >= maxInputs}
          >
            添加
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className='grid gap-4 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl min-h-[100px] transition-colors'
        style={{
          maxHeight: `calc((60px * ${maxRows}) + (1rem * ${maxRows}))`,
          gridTemplateColumns: columns,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {groupValue.map((value, index) => {
          const itemKey = `${instanceId.current}-${index}`
          return (
            <div key={itemKey} className='grid grid-cols-[1fr,auto] items-center gap-1'>
              <HeroInput
                {...templateOptions}
                key={`input-${itemKey}`}
                value={value}
                className={`${componentClassName || 'w-full'}`}
                onValueChange={(val) => handleInputChange(val, index)}
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
                key={`delete-${itemKey}`}
                onPress={() => handleDeleteInput(index)}
                className='hover:bg-red-50 transition-colors duration-200 p-1 min-w-0 h-7 w-7 rounded-full'
                aria-label='删除输入框'
              >
                <IoCloseCircle size={16} />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
