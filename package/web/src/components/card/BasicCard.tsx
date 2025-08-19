import type { BaseCardProps } from './types'
import { Tooltip } from '@heroui/tooltip'

/**
 * 基础卡片组件属性接口
 */
export interface BasicCardProps extends BaseCardProps {
  /** 卡片标题 */
  title: string
}

/**
 * 通用基础卡片组件
 * 用于显示带有图标和标题的信息
 */
const BasicCard = ({
  title,
  description,
  icon,
  iconDot,
  gradient,
  border,
  iconBg,
  textColor,
  ringColor,
  isActive,
  onClick,
  tooltip,
}: BasicCardProps) => {
  const cardContent = (
    <div
      onClick={onClick}
      className={`
        ${gradient}
        rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm ${border}
        transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
        select-none
        ${isActive ? `ring-2 ${ringColor} ring-offset-1 ring-offset-background` : ''}
      `}
    >
      <div className='flex items-center gap-2 md:gap-3'>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${iconBg} flex items-center justify-center ${textColor}`}>
          <div className='relative'>
            {icon}
            {iconDot}
          </div>
        </div>
        <div>
          <div className='text-lg md:text-x2 font-medium'>{title}</div>
          <div className='text-xs md:text-sm text-default-500'>{description}</div>
        </div>
      </div>
    </div>
  )

  if (tooltip) {
    return (
      <Tooltip content={tooltip} placement='top' showArrow>
        {cardContent}
      </Tooltip>
    )
  }

  return cardContent
}

export default BasicCard
