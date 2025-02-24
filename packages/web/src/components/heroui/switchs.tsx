import { Switch as HeroSwitch } from '@heroui/switch'
import type { JSX } from 'react'
import type { SwitchProps } from 'node-karin'
import { useState } from 'react'

/**
 * 渲染开关组件
 * @param props - 输入框属性
 * @param result - 传递给后端的对象
 * @param onValueChange - 值变化回调
 * @returns 渲染后的输入框组件
 */
export const createSwitch = (props: SwitchProps): JSX.Element => {
  const {
    componentType: _,
    key,
    startText,
    endText,
    className,
    componentClassName,
    ...options
  } = props

  const [isSelected, setIsSelected] = useState(props.defaultSelected ?? false)

  return (
    <div className='flex flex-col gap-1 m-2 ' key={`div-${key}`}>
      {props.label && <label className='block text-sm font-medium text-gray-700'>{props.label}</label>}
      <div className='flex items-center gap-2'>
        {startText && <span>{startText}</span>}
        <input
          type='hidden'
          name={key}
          value={isSelected.toString()}
        />
        <HeroSwitch
          key={key}
          {...options}
          className={componentClassName}
          onValueChange={setIsSelected}
        >
          {endText}
        </HeroSwitch>
      </div>
      {props.description && <span className='text-xs text-gray-500'>{props.description}</span>}
    </div>
  )
}
