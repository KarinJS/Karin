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
  const [dataVal, setDataVal] = useState(() => data || [])
  const containerRef = useRef<HTMLDivElement>(null)

  // 添加一个用于存储整个输入组值的状态
  const [groupValue, setGroupValue] = useState<string[]>(data || [])

  const { componentType: __, key: ___, componentClassName, ...templateOptions } = template
  const validator = template.rules ? createValidator(template.rules) : undefined

  /** 单行最多允许多少个输入框 */
  const itemsPerRow = props.itemsPerRow || 3
  /** 最大显示行数 */
  const maxRows = props.maxRows || 3
  /** 最大输入框数量 */
  const maxInputs = props.maxInputs ?? 100

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

  // 在数据更新后执行滚动
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [dataVal.length])

  // 处理输入框值变化
  const handleInputChange = (value: string, index: number) => {
    const newValues = [...groupValue]
    newValues[index] = value
    setGroupValue(newValues)
  }

  // 添加新输入框
  const handleAddInput = () => {
    if (maxInputs !== 0 && dataVal.length >= maxInputs) {
      toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
      return
    }

    setDataVal(prev => [...prev, ''])
    setGroupValue(prev => [...prev, ''])
  }

  // 删除输入框
  const handleDeleteInput = (index: number) => {
    setDataVal(prev => prev.filter((_, i) => i !== index))
    setGroupValue(prev => prev.filter((_, i) => i !== index))
    toast.success('已删除一个输入框')
  }

  return (
    <div
      key={`div-${key}`}
      className={
        props.className ||
        'w-full bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 transition-colors'
      }
    >
      {/* 添加一个隐藏的输入框来存储整个组的值 */}
      <input
        type='hidden'
        name={key}
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
            {dataVal.length}{maxInputs !== 0 ? `/${maxInputs}` : ''}
          </span>
          <Button
            key={`${key}-add-input`}
            variant='solid'
            color='primary'
            size='sm'
            onPress={handleAddInput}
            className='flex items-center gap-1 px-2 h-7 min-w-[60px]'
            disabled={maxInputs !== 0 && dataVal.length >= maxInputs}
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
        {dataVal.map((value, index) => (
          <div key={`${key}-${index}`} className='grid grid-cols-[1fr,auto] items-center gap-1'>
            <HeroInput
              {...templateOptions}
              defaultValue={value}
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
