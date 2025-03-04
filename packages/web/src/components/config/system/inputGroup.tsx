/* eslint-disable @stylistic/indent */
import { Input as HeroInput } from '@heroui/input'
import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { Controller } from 'react-hook-form'

import type { JSX } from 'react'
import type { Control } from 'react-hook-form'

/**
 * 输入框组组件
 * @param key - 输入框组键
 * @param defaultValue - 输入框组默认值
 * @param label - 输入框组标签
 * @param description - 输入框组描述
 * @param control - 表单控制器
 * @returns 输入框组组件
 */
export const createInputGroup = (
  name: string,
  defaultValue: string[],
  label: string,
  description: string,
  control: Control<any>
): JSX.Element => {
  const InputGroupComponent = () => {
    /** 最大输入框数量 */
    const maxInputs = 100
    /** 每行输入框数量 */
    const itemsPerRow = 5
    /** 最大行数 */
    const maxRows = 5

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

    return (
      <div key={name} className='w-full rounded-2xl p-2 transition-colors'>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { value = defaultValue, onChange } }) => {
            const handleAddInput = () => {
              if (value.length >= maxInputs) {
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
                    <span className='text-md'>{label}</span>
                    {description && <p className='text-sm text-gray-500'>{description}</p>}
                  </div>
                  <div className='flex items-center gap-1.5 self-end sm:self-auto'>
                    <span className='text-sm text-gray-500'>
                      {value.length}
                      {maxInputs ? `/${maxInputs}` : ''}
                    </span>
                    <Button
                      variant='solid'
                      color='primary'
                      size='sm'
                      onPress={handleAddInput}
                      className='flex items-center gap-1 px-2 h-7 min-w-[60px]'
                      disabled={value.length >= maxInputs}
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
                  {value.length === 0
                    ? (
                      <div className='col-span-full flex flex-col items-center justify-center text-gray-500 h-full'>
                        <p className='text-sm mb-1'>暂无配置项</p>
                        <p className='text-xs'>点击右上角的"添加"按钮开始添加配置</p>
                      </div>
                    )
                    : (
                      value.map((inputValue: string, index: number) => (
                        <div key={index} className='grid grid-cols-[1fr,auto] items-center gap-1'>
                          <HeroInput
                            className='w-full'
                            value={inputValue}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            validate={(val) => {
                              if (!val) {
                                return '( • ̀ω•́ )✧ 不能为空哦~'
                              }
                              return true
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

  return <InputGroupComponent />
}
