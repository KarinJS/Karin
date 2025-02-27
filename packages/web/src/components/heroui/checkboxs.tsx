import {
  Checkbox as HeroCheckbox,
  CheckboxGroup as HeroCheckboxGroup
} from '@heroui/checkbox'
import { Controller } from 'react-hook-form'

import type { JSX } from 'react'
import type { CheckboxGroupProps, CheckboxProps } from 'node-karin'
import type { FormControl } from '../config/render'
import type { DefaultValues } from '../config/values'

/**
 * 渲染复选框组件
 * @param props - 输入框属性
 * @param control - 表单控制器
 * @param basePath - 基础路径，用于嵌套场景
 * @returns 渲染后的输入框组件
 */
export const createCheckboxGroup = (
  props: CheckboxGroupProps,
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

  /** 构建完整的字段路径 */
  const fieldPath = basePath ? `${basePath}.${key}.value` : `${key}.value`

  /**
   * 构建复选框子项
   * @param item - 复选框子项
   * @param index - 复选框子项索引
   * @param selectedValues - 选中的值
   * @param onChange - 值变化回调
   * @returns 复选框子项
   */
  const checkboxItems = (
    item: CheckboxProps,
    index: number,
    selectedValues: string[],
    onChange: (value: string[]) => void
  ) => {
    const {
      componentType: _,
      className: __,
      key: checkboxKey,
      componentClassName: checkboxClassName,
      ...checkboxProps
    } = item
    const itemValue = item.value || ''

    return (
      <HeroCheckbox
        key={`${checkboxKey}-${index}`}
        {...checkboxProps}
        className={checkboxClassName}
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
  }

  return (
    <div className={componentClassName || 'flex items-center gap-2 p-2'} key={`div-${fieldPath}`}>
      <Controller<DefaultValues>
        name={fieldPath}
        control={control}
        render={({ field: { value, onChange } }) => {
          /** 默认值 */
          const selectedValues = (Array.isArray(value) ? value : []) as string[]

          return (
            <HeroCheckboxGroup
              key={fieldPath}
              orientation='horizontal'
              {...options}
              className={className}
              value={selectedValues}
            >
              {checkbox.map((item, index) => checkboxItems(
                item,
                index,
                selectedValues,
                onChange
              ))}
            </HeroCheckboxGroup>
          )
        }}
      />
    </div>
  )
}
