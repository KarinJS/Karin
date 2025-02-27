import { Switch as HeroSwitch } from '@heroui/switch'
import type { JSX } from 'react'
import type { SwitchProps } from 'node-karin'
import type { FormRegister } from '../config/render'

/**
 * 渲染开关组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @returns 渲染后的输入框组件
 */
export const createSwitch = (
  props: SwitchProps,
  register: FormRegister
): JSX.Element => {
  const {
    componentType: _,
    key,
    startText,
    endText,
    className,
    componentClassName,
    defaultSelected,
    ...options
  } = props

  return (
    <div className='flex flex-col gap-1 p-2 ' key={`div-${key}`}>
      {props.label && <label className='block text-sm font-medium text-gray-700'>{props.label}</label>}
      <div className='flex items-center gap-2'>
        {startText && <span>{startText}</span>}
        <HeroSwitch
          key={key}
          {...options}
          className={componentClassName}
          defaultSelected={defaultSelected ?? false}
          {...register(`${key}.value`)}
        >
          {endText}
        </HeroSwitch>
      </div>
      {props.description && <span className='text-xs text-gray-500'>{props.description}</span>}
    </div>
  )
}
