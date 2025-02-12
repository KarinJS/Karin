import { Input as HeroInput } from '@heroui/input'
import type { JSX } from 'react'
import type { Result } from './types'
import type { InputProps } from 'node-karin'
import { useComponentState } from './hooks/useComponentState'
import { createValidator } from './utils'

/**
 * 渲染输入框组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @param onValueChange - 值变化回调
 * @returns 渲染后的输入框组件
 */
export const Input = (
  props: InputProps,
  result: Result<'input'>,
  onValueChange?: (value: string) => void
): JSX.Element => {
  const { componentType: _, key, className, defaultValue, ...options } = props
  const validator = props.rules ? createValidator(props.rules) : undefined

  const { value, onChange: handleValueChange } = useComponentState(
    key,
    defaultValue ?? '',
    result,
    onValueChange
  )

  return (
    <div className={className || `w-${props.width || 200}px h-${props.height || 40}px`}>
      <HeroInput
        key={key}
        {...options}
        value={value}
        className="w-full"
        validate={validator}
        onValueChange={handleValueChange}
      />
    </div>
  )
}