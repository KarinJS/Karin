import { Radio as HeroRadio, RadioGroup as HeroRadioGroup } from '@heroui/radio'
import type { JSX } from 'react'
import type { RadioGroupProps } from 'node-karin'
import type { FormRegister } from '../config/render'

/**
 * 渲染单选框组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @returns 渲染后的输入框组件
 */
export const createRadioGroup = (
  props: RadioGroupProps,
  register: FormRegister
): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    radio,
    componentClassName,
    ...options
  } = props

  return (
    <div className={className || 'flex items-center gap-2 p-2'} key={`div-${key}`}>
      <HeroRadioGroup
        key={key}
        orientation='horizontal'
        {...options}
        name={key}
        className={componentClassName}
      >
        {radio.map(({ componentType: _, key, componentClassName, ...item }) => (
          <HeroRadio
            key={key}
            {...item}
            {...register(key)}
            className={componentClassName}
          >
            {item.label}
          </HeroRadio>
        ))}
      </HeroRadioGroup>
    </div>
  )
}
