import { Switch as HeroSwitch } from '@heroui/switch'
import { cn } from '@/lib/utils'
import type { JSX } from 'react'
import type { SwitchProps } from 'node-karin'
import type { FormRegister } from '../config/plugin/render'

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
    className,
    componentClassName,
    defaultSelected,
    ...options
  } = props

  return (
    <div className={className || 'inline-block p-1'}>
      <HeroSwitch
        key={key}
        {...options}
        className={cn(
          'inline-flex flex-row-reverse items-center',
          'cursor-pointer rounded-lg border',
          'border-gray-200',
          `data-[selected=true]:border-${options.color || 'primary'}`,
          'p-4',
          'hover:bg-gray-50',
          'w-[320px]',
          className
        )}
        defaultSelected={defaultSelected ?? false}
        {...register(`${key}.value`)}
      >
        <div className='flex-shrink'>
          {props.label && (
            <p className='font-medium text-base mb-2'>{props.label}</p>
          )}
          {props.description && (
            <p className='text-xs text-gray-500'>{props.description}</p>
          )}
        </div>
      </HeroSwitch>
    </div>
  )
}
