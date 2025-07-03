import { Select as HeroSelect, SelectItem } from '@heroui/select'
import { Controller } from 'react-hook-form'
import type { JSX } from 'react'
import type { SelectProps } from 'node-karin'
import type { FormControl } from '../config/plugin/render'

export const createSelect = (
  props: SelectProps,
  control: FormControl,
  basePath?: string
): JSX.Element => {
  const {
    componentType: _,
    key,
    items,
    className,
    componentClassName,
    multiple,
    ...rest
  } = props

  const name = basePath ? `${basePath}.${key}.value` : `${key}.value`

  const defaultValue = multiple ? [] : ''

  return (
    <div className={componentClassName || 'p-2'} key={`div-${key}`}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as any}
        render={({ field: { value, onChange } }) => (
          <HeroSelect
            {...rest}
            className={className}
            items={items}
            multiple={multiple}
            selectedKeys={Array.isArray(value) ? value : value ? [value] : []}
            onSelectionChange={(keys) => {
              if (multiple) {
                onChange(Array.from(keys))
              } else {
                const val = Array.from(keys)[0]
                onChange(val ?? '')
              }
            }}
          >
            {(item) => (
              <SelectItem key={item.value} textValue={String(item.value)}>
                {item.label}
              </SelectItem>
            )}
          </HeroSelect>
        )}
      />
    </div>
  )
}
