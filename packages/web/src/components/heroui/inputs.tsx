import { Input as HeroInput } from '@heroui/input'
import { createValidator } from './utils'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import type { JSX } from 'react'
import type { Result } from './types'
import type { InputProps, InputGroupProps } from 'node-karin'

interface InputItem {
  id: string
  value: string
}

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
  onValueChange?: (index: number, value: string) => void
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

  // 初始化inputs状态，从data中读取
  const [inputs, setInputs] = useState<InputItem[]>(() =>
    data.map((value, index) => ({
      id: `${key}-${index}`,
      value: value || ''
    }))
  )

  const containerRef = useRef<HTMLDivElement>(null)

  /** 单行最多允许多少个输入框 */
  const itemsPerRow = props.itemsPerRow || 3
  /** 最大显示行数 */
  const maxRows = props.maxRows || 5
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

  // 在 inputs 更新后执行滚动
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [inputs.length])

  // 添加新输入框
  const handleAddInput = () => {
    if (maxInputs !== 0 && inputs.length >= maxInputs) {
      toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
      return
    }

    const newInput = { id: `${key}-${inputs.length}`, value: '' }
    setInputs(prev => [...prev, newInput])

    const index = inputs.length + 1
    // 更新data和result
    if (!onValueChange) {
      result[key][index] = ''
    } else {
      onValueChange(index, '')
    }
  }

  // 删除输入框
  const handleDeleteInput = (id: string) => {
    const index = inputs.findIndex(item => item.id === id)
    if (index === -1) return

    const newInputs = inputs.filter(item => item.id !== id)
    setInputs(newInputs)

    // 更新data和result
    if (!onValueChange) {
      result[key] = result[key].filter((_, i) => i !== index)
    }

    toast.success(`已删除一个输入框`)
  }

  // 处理输入值变化
  const handleValueChange = (value: string, index: number) => {
    setInputs(prev => {
      const newInputs = [...prev]
      newInputs[index] = { ...newInputs[index], value }
      return newInputs
    })

    console.log(value, index, key)

    if (onValueChange) {
      onValueChange(index, value)
    } else {
      result[key][index] = value
      console.log(result[key])
    }
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
            {inputs.length}{maxInputs !== 0 ? `/${maxInputs}` : ''}
          </span>
          <Button
            variant="solid"
            color="primary"
            size="sm"
            onPress={handleAddInput}
            className="flex items-center gap-1 px-2 h-7 min-w-[60px]"
            disabled={maxInputs !== 0 && inputs.length >= maxInputs}
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
        {inputs.map((input, index) => (
          <div key={input.id} className="grid grid-cols-[1fr,auto] items-center gap-1">
            <HeroInput
              {...templateOptions}
              value={input.value}
              className="w-full"
              validate={(value) => {
                if (!value) {
                  if (templateOptions.isRequired) {
                    return '( • ̀ω•́ )✧ 不能为空哦~'
                  }
                  return true
                }
                return validator?.(value)
              }}
              onValueChange={(value) => handleValueChange(value, index)}
            />
            <Button
              variant="light"
              color="danger"
              onPress={() => handleDeleteInput(input.id)}
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

