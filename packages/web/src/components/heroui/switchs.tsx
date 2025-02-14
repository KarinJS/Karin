import { Switch as HeroSwitch } from '@heroui/switch'
import type { JSX } from 'react'
import type { Result } from './types'
import type { SwitchProps } from 'node-karin'

/**
 * 渲染开关组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @param onValueChange - 值变化回调
 * @returns 渲染后的输入框组件
 */
export const Switch = (
  props: SwitchProps,
  result: Result<'switch'>,
  onValueChange?: (value: boolean) => void
): JSX.Element => {
  const { componentType: _, key, startText, endText, className, ...options } = props

  if (!onValueChange) {
    result[key] = props.defaultSelected ?? false
  }

  return (
    <div className={className || 'flex items-center gap-2'}>
      {startText && <span>{startText}</span>}
      <HeroSwitch
        key={key}
        {...options}
        defaultSelected={props.defaultSelected}
        onValueChange={onValueChange || ((value) => {
          result[key] = value
        })}
      />
      {endText && <span>{endText}</span>}
    </div>
  )
}