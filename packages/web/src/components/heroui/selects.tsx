import { Select, SelectItem as HeroSelectItem } from '@heroui/select'
import { Controller } from 'react-hook-form'
import type { JSX, ReactNode } from 'react'
import type { SelectProps, SelectItem } from 'node-karin'
import type { FormControl } from '../config/plugin/render'
import { cn } from '@/lib/utils'
import { Avatar } from '@heroui/avatar'
import { useEffect, useState } from 'react'

/**
 * 渲染下拉选择框组件
 * @param props - 下拉选择框属性
 * @param control - 表单控制器
 * @param basePath - 基础路径
 * @returns 渲染后的下拉选择框组件
 */
export const createSelect = (
  props: SelectProps,
  control: FormControl,
  basePath?: string
): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    items,
    componentClassName,
    selectionMode = 'single',
    renderValue,
    scrollShadowProps,
    ...options
  } = props

  const [resolvedItems, setResolvedItems] = useState<SelectItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)

  useEffect(() => {
    const loadItems = async () => {
      if (items instanceof Promise) {
        setIsLoadingItems(true)
        try {
          const result = await items
          setResolvedItems(result)
        } catch (error) {
          console.error('Failed to load select items:', error)
          setResolvedItems([])
        } finally {
          setIsLoadingItems(false)
        }
      } else {
        setResolvedItems(items)
      }
    }

    loadItems()
  }, [items])

  return (
    <div
      className={cn(
        className,
        'max-w-80',
        'flex gap-2 items-center p-2'
      )}
      key={`div-${key}`}
    >
      <Controller
        name={basePath ? `${basePath}.${key}.value` : `${key}.value`}
        control={control}
        defaultValue={options.defaultValue || (selectionMode === 'multiple' ? [] : '')}
        render={({ field: { value, onChange } }) => {
          // 处理选中的键值
          let selectedKeys: string[] = []

          if (selectionMode === 'multiple') {
            if (Array.isArray(value)) {
              selectedKeys = value.map(v => String(v))
            }
          } else {
            if (value) {
              selectedKeys = [String(value)]
            }
          }

          return (
            <Select
              key={key}
              {...options}
              isVirtualized
              selectionMode={selectionMode}
              selectedKeys={selectedKeys}
              isLoading={isLoadingItems || options.isLoading}
              onSelectionChange={(keys) => {
                if (selectionMode === 'multiple') {
                  const selected = Array.from(keys).map(k => String(k))
                  onChange(selected)
                } else {
                  const selected = Array.from(keys)[0]
                  onChange(selected ? String(selected) : '')
                }
              }}
              renderValue={renderValue ? () => renderValue(resolvedItems) as ReactNode : undefined}
              scrollShadowProps={scrollShadowProps}
              className={componentClassName}
              startContent={options.startContent as ReactNode}
              endContent={options.endContent as ReactNode}
              selectorIcon={options.selectorIcon as ReactNode}
            >
              {resolvedItems.map((item: SelectItem) => (
                <HeroSelectItem
                  key={item.value}
                  textValue={item.textValue || item.label || item.value}
                  isDisabled={item.isDisabled}
                  description={item.description}
                  startContent={item.startContent?.type === 'image'
                    ? (
                      <Avatar size='sm' className='shrink-0' src={item.startContent.value} alt={item.startContent.value} />
                    )
                    : (
                      item.startContent?.value
                    )}
                  endContent={item.endContent?.type === 'image'
                    ? (
                      <Avatar size='sm' className='shrink-0' src={item.endContent.value} alt={item.endContent.value} />
                    )
                    : (
                      item.endContent?.value
                    )}
                >
                  {item.label || item.value}
                </HeroSelectItem>
              ))}
            </Select>
          )
        }}
      />
    </div>
  )
}
