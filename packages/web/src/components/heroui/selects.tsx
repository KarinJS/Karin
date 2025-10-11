import { Select, SelectItem as HeroSelectItem } from '@heroui/select'
import { Controller } from 'react-hook-form'
import type { JSX, ReactNode } from 'react'
import type { SelectProps, SelectItem } from 'node-karin'
import type { FormControl } from '../config/plugin/render'
import { cn } from '@/lib/utils'

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
              selectionMode={selectionMode}
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) => {
                if (selectionMode === 'multiple') {
                  const selected = Array.from(keys).map(k => String(k))
                  onChange(selected)
                } else {
                  const selected = Array.from(keys)[0]
                  onChange(selected ? String(selected) : '')
                }
              }}
              renderValue={renderValue ? () => renderValue(items) as ReactNode : undefined}
              scrollShadowProps={scrollShadowProps}
              className={componentClassName}
              startContent={options.startContent as ReactNode}
              endContent={options.endContent as ReactNode}
              selectorIcon={options.selectorIcon as ReactNode}
            >
              {items.map((item: SelectItem) => (
                <HeroSelectItem
                  key={item.value}
                  textValue={item.textValue || item.label || item.value}
                  isDisabled={item.isDisabled}
                  startContent={item.startContent as ReactNode}
                  endContent={item.endContent as ReactNode}
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
