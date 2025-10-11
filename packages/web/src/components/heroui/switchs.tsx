import { Switch as HeroSwitch } from '@heroui/switch'
import { cn } from '@/lib/utils'
import type { JSX } from 'react'
import type { SwitchProps } from 'node-karin'
import type { FormRegister } from '../config/plugin/render'
import { useState } from 'react'

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
    isDisabled,
    ...options
  } = props

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const handleContainerClick = (e: React.MouseEvent) => {
    // 如果组件被禁用，不触发开关切换
    if (isDisabled) return
    // 如果点击的是描述区域，不触发开关切换
    if ((e.target as HTMLElement).closest('.description-area')) return
    const switchElement = document.querySelector(`[data-switch-key="${key}"]`) as HTMLElement
    switchElement?.click()
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    // 保留描述展开功能，即使在禁用状态下也允许查看
    e.stopPropagation()
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  return (
    <div className={className || 'inline-flex p-1 w-full sm:w-auto'} key={key}>
      <div
        className={cn(
          'relative p-0 w-full rounded-lg border sm:w-[320px] min-h-[100px] border-default-200',
          isDisabled
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer hover:bg-default-100'
        )}
        onClick={handleContainerClick}
      >
        {/* 标题和描述区域 */}
        <div className='flex flex-col justify-center p-3 pr-14 w-full h-full sm:p-4 sm:pr-16'>
          {props.label && (
            <p className={cn(
              'mb-1 text-sm sm:text-base',
              isDisabled ? 'text-default-400' : 'text-default-900'
            )}
            >
              {props.label}
            </p>
          )}
          {props.description && (
            <div
              className='description-area'
              onClick={handleDescriptionClick}
            >
              <p
                className={cn(
                  'w-full text-xs cursor-pointer',
                  isDisabled ? 'text-default-400' : 'text-default-600',
                  isDescriptionExpanded ? '' : 'truncate',
                  'transition-all duration-200 ease-in-out'
                )}
              >
                {props.description}
              </p>
              <div className={cn(
                'text-xs mt-0.5',
                isDisabled
                  ? `text-${props.color || 'primary'}-300`
                  : `text-${props.color || 'primary'}`
              )}
              >
                {isDescriptionExpanded ? '点击收起' : '点击展开'}
              </div>
            </div>
          )}
        </div>

        {/* 开关控件位于右侧中间 */}
        <div className='absolute right-3 top-1/2 -translate-y-1/2 sm:right-4'>
          <HeroSwitch
            key={key}
            {...options}
            isDisabled={isDisabled}
            data-switch-key={key}
            className={cn(
              isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
              `data-[selected=true]:border-${options.color || 'primary'}`,
              componentClassName
            )}
            defaultSelected={defaultSelected ?? false}
            {...register(`${key}.value`)}
          />
        </div>
      </div>
    </div>
  )
}
