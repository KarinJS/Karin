import type { BaseCardProps } from './types'

/**
 * 统计卡片组件属性接口
 */
export interface StatCardProps extends BaseCardProps {
  /** 显示的数字 */
  count: number
}

/**
 * 通用统计卡片组件
 * 用于显示带有图标和数字的统计信息
 */
const StatCard = ({
  count,
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
}: StatCardProps) => {
  return (
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
          <div className='text-xl md:text-2xl font-light'>{count}</div>
          <div className='text-xs md:text-sm text-default-500'>{description}</div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
