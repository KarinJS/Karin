import { Input as HeroInput } from '@heroui/input'
import { createValidator } from './utils'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import type { JSX } from 'react'
import type { Result } from './types'
import type { InputProps, InputGroupProps } from 'node-karin'

/**
 * 渲染输入框组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @param onValueChange - 值变化回调
 * @returns 渲染后的输入框组件
 */
export const Input = (
  props: InputProps,
  result: Result<'input'>,
  onValueChange?: (value: string) => void
): JSX.Element => {
  const { componentType: _, key, className, ...options } = props
  const validator = props.rules ? createValidator(props.rules) : undefined

  if (!onValueChange) {
    result[key] = options.defaultValue ?? ''
  }


  return (
    <div className={className || `w-${props.width || 200}px h-${props.height || 40}px`}>
      <HeroInput
        key={key}
        {...options}
        className="w-full"
        validate={(value) => {
          if (!value) {
            if (options.isRequired) {
              return '( • ̀ω•́ )✧ 不能为空哦~'
            }

            return true
          }
          return validator?.(value)
        }}
        onValueChange={onValueChange || ((value) => {
          result[key] = value
        })}
      />
    </div>
  )
}

/**
 * 渲染输入框组 组件
 */
export const InputGroup = (
  props: InputGroupProps,
  result: Result<'input-group'>,
  onValueChange?: (index: number, value: string, type: 'add' | 'del') => void,
  cache?: string[],
) => {
  const { key, template, data } = props
  const { componentType: __, key: ___, ...templateOptions } = template
  const validator = template.rules ? createValidator(template.rules) : undefined

  if (!onValueChange) {
    result[key] = data.map(item => {
      if (typeof item !== 'string') {
        return String(item)
      }
      return item ?? ''
    })
  }

  const [dataVal, setDataVal] = useState(() => result[key] || cache || [])

  // 同步到result
  useEffect(() => {
    if (!onValueChange) {
      result[key] = dataVal
    }
  }, [dataVal])

  const containerRef = useRef<HTMLDivElement>(null)

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

  // 添加新输入框
  const handleAddInput = () => {
    if (maxInputs !== 0 && dataVal.length >= maxInputs) {
      toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
      return
    }

    setDataVal(prev => [...prev, ''])
    if (onValueChange) {
      onValueChange(dataVal.length, '', 'add')
    } else {
      result[key] = [...result[key], '']
    }
  }

  // 删除输入框
  const handleDeleteInput = (index: number) => {
    if (onValueChange) {
      onValueChange(index, '', 'del')
    } else {
      result[key].splice(index, 1)
    }

    setDataVal(prev => prev.filter((_, i) => i !== index))
    toast.success(`已删除一个输入框`)
  }

  return (
    <div className={props.className || "w-full bg-white rounded-xl shadow-xl border border-gray-200 p-4 sm:p-6"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-gray-800">{props.label}</span>
          {props.description && (
            <p className="text-sm text-gray-500">{props.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-sm text-gray-500">
            {dataVal.length}{maxInputs !== 0 ? `/${maxInputs}` : ''}
          </span>
          <Button
            key={`${key}-add-input`}
            variant="solid"
            color="primary"
            size="sm"
            onPress={handleAddInput}
            className="flex items-center gap-1 px-2 h-7 min-w-[60px]"
            disabled={maxInputs !== 0 && dataVal.length >= maxInputs}
          >
            添加
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="grid gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[100px]"
        style={{
          maxHeight: `calc((60px * ${maxRows}) + (1rem * ${maxRows}))`,
          gridTemplateColumns: columns,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {dataVal.map((value, index) => (
          <div key={`${key}-${index}`} className="grid grid-cols-[1fr,auto] items-center gap-1">
            <HeroInput
              {...templateOptions}
              value={value}
              className="w-full"
              validate={(val) => {
                if (!val) {
                  if (templateOptions.isRequired) {
                    return '( • ̀ω•́ )✧ 不能为空哦~'
                  }
                  return true
                }
                return validator?.(val)
              }}
              onValueChange={(value) => {
                if (onValueChange) {
                  onValueChange(index, value, 'add')
                } else {
                  result[key][index] = value
                }

                setDataVal(prev => {
                  const newData = [...prev]
                  newData[index] = value
                  return newData
                })
              }}
            />
            <Button
              variant="light"
              color="danger"
              onPress={() => handleDeleteInput(index)}
              className="hover:bg-red-50 transition-colors duration-200 p-1 min-w-0 h-7 w-7 rounded-full"
              aria-label="删除输入框"
            >
              <IoCloseCircle size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

