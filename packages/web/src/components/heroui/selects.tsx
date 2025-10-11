import { Select, SelectItem as HeroSelectItem } from '@heroui/select'
import { Controller } from 'react-hook-form'
import type { JSX } from 'react'
import type { SelectProps } from 'node-karin'
import type { FormControl } from '../config/plugin/render'

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
    ...options
  } = props

  return (
    <div className={className || 'flex items-center gap-2 p-2'} key={`div-${key}`}>
      <Controller
        name={basePath ? `${basePath}.${key}.value` : `${key}.value`}
        control={control}
        defaultValue={options.defaultValue || ''}
        render={({ field: { value, onChange } }) => (
          <Select
            key={key}
            {...options}
            selectedKeys={value ? [value as string] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string
              onChange(selected)
            }}
            className={componentClassName}
          >
            {items.map(({ componentType: _, key: itemKey, componentClassName, value, label, description, isDisabled }, index) => (
              <HeroSelectItem
                key={`select-item-${itemKey}-${index}`}
                value={value}
                textValue={label || value}
                className={componentClassName}
                isDisabled={isDisabled}
              >
                {label || value}
              </HeroSelectItem>
            ))}
          </Select>
        )}
      />
    </div>
  )
}
