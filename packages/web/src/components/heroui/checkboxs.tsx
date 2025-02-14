import {
  Checkbox as HeroCheckbox,
  CheckboxGroup as HeroCheckboxGroup
} from '@heroui/checkbox'
import type { JSX } from 'react'
import type { Result } from './types'
import type { CheckboxGroupProps } from 'node-karin'

/**
 * 渲染复选框组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @param onValueChange - 值变化回调
 * @returns 渲染后的输入框组件
 */
export const CheckboxGroup = (
  props: CheckboxGroupProps,
  result: Result<'checkbox'>,
  onValueChange?: (key: string, value: boolean) => void
): JSX.Element => {
  const { componentType: _, key, className, checkbox, ...options } = props
  result[key] = {}
  checkbox.forEach((item) => {
    result[key][item.key] = item.defaultSelected ?? false
  })

  return (
    <div className={className || 'flex items-center gap-2'}>
      <HeroCheckboxGroup
        key={key}
        {...options}
      >
        {checkbox.map(({ componentType: _, key: CheckboxKey, ...item }) => {
          return (
            <HeroCheckbox
              {...item}
              key={CheckboxKey}
              defaultSelected={result[key][CheckboxKey]}
              onValueChange={(value) => {
                if (onValueChange) {
                  onValueChange(CheckboxKey, value)
                } else {
                  result[key][CheckboxKey] = value
                }
              }}
            >
              {item.label}
            </HeroCheckbox>
          )
        })}
      </HeroCheckboxGroup>
    </div>
  )
}