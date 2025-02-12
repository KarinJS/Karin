import { Radio as HeroRadio, RadioGroup as HeroRadioGroup } from '@heroui/radio'
import type { JSX } from 'react'
import type { Result } from './types'
import type { RadioGroupProps } from 'node-karin'
import { useComponentState } from './hooks/useComponentState'

/**
 * 渲染单选框组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @param onValueChange - 值变化回调
 * @returns 渲染后的输入框组件
 */
export const RadioGroup = (
  props: RadioGroupProps,
  result: Result<'radio'>,
  onValueChange?: (value: string) => void
): JSX.Element => {
  const { componentType: _, key, className, radio, ...options } = props

  const { value, onChange: handleValueChange } = useComponentState(
    key,
    props.value || props.defaultValue || '',
    result,
    onValueChange
  )

  return (
    <div className={className || 'flex items-center gap-2'}>
      <HeroRadioGroup
        key={key}
        {...options}
        value={value}
        onValueChange={handleValueChange}
      >
        {radio.map(({ key, label, ...item }) => (
          <HeroRadio key={key} {...item}>
            {label}
          </HeroRadio>
        ))}
      </HeroRadioGroup>
    </div>
  )
}