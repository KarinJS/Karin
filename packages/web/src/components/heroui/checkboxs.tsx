import {
  Checkbox as HeroCheckbox,
  CheckboxGroup as HeroCheckboxGroup
} from '@heroui/checkbox'
import type { JSX } from 'react'
import type { Result } from './types'
import type { CheckboxGroupProps } from 'node-karin'
import { useComponentState } from './hooks/useComponentState'

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

  // 初始化选中状态
  const initialState: Record<string, boolean> = {}
  checkbox.forEach((item) => {
    initialState[item.key] = item.defaultSelected ?? false
  })

  const { value: selectedState, onChange: handleStateChange } = useComponentState(
    key,
    initialState,
    result,
    onValueChange ?
      undefined : // 如果有外部 onValueChange，我们使用自定义的处理逻辑
      (newState: Record<string, boolean>) => result[key] = newState
  )

  // 处理单个复选框的变化
  const handleValueChange = (checkboxKey: string, value: boolean) => {
    const newState = { ...selectedState, [checkboxKey]: value }
    handleStateChange(newState)
    onValueChange?.(checkboxKey, value)
  }

  return (
    <div className={className || 'flex items-center gap-2'}>
      <HeroCheckboxGroup key={key} {...options}>
        {checkbox.map(({ key: checkboxKey, ...item }) => (
          <HeroCheckbox
            {...item}
            key={checkboxKey}
            isSelected={selectedState[checkboxKey]}
            onValueChange={(value) => handleValueChange(checkboxKey, value)}
          />
        ))}
      </HeroCheckboxGroup>
    </div>
  )
}