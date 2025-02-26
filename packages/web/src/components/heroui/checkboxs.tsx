import {
  Checkbox as HeroCheckbox,
  CheckboxGroup as HeroCheckboxGroup
} from '@heroui/checkbox'
import type { JSX } from 'react'
import type { CheckboxGroupProps } from 'node-karin'
import type { FormControl, FormRegister } from '../config/render'
import { Controller } from 'react-hook-form'
import type { DefaultValues } from '../config/values'

/**
 * 渲染复选框组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @param control - 表单控制器
 * @param basePath - 基础路径，用于嵌套场景
 * @returns 渲染后的输入框组件
 */
export const createCheckboxGroup = (
  props: CheckboxGroupProps,
  register: FormRegister,
  control: FormControl,
  basePath?: string
): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    componentClassName,
    checkbox,
    ...options
  } = props

  // 构建完整的字段路径
  const fieldPath = basePath ? `${basePath}.${key}.value` : `${key}.value`

  return (
    <div className={componentClassName || 'flex items-center gap-2 p-2'} key={`div-${fieldPath}`}>
      <Controller<DefaultValues>
        name={fieldPath}
        control={control}
        render={({ field: { value, onChange } }) => {
          // 确保value是字符串数组
          const selectedValues = (Array.isArray(value) ? value : []) as string[]

          return (
            <HeroCheckboxGroup
              key={fieldPath}
              orientation='horizontal'
              {...options}
              className={className}
              value={selectedValues}
            >
              {checkbox.map((item, index) => {
                const { key: CheckboxKey, componentClassName: __, ...checkboxProps } = item
                const itemValue = item.value || ''

                return (
                  <HeroCheckbox
                    key={`${fieldPath}-${index}`}
                    {...checkboxProps}
                    className={__}
                    isSelected={selectedValues.includes(itemValue)}
                    onValueChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, itemValue]
                        : selectedValues.filter(v => v !== itemValue)
                      onChange(newValues as string[])
                    }}
                  >
                    {item.label}
                  </HeroCheckbox>
                )
              })}
            </HeroCheckboxGroup>
          )
        }}
      />
    </div>
  )
}
