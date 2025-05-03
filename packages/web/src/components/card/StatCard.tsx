import { ReactNode } from 'react'

/**
 * 统计卡片组件属性接口
 */
export interface StatCardProps {
  /** 卡片标题 */
  title: string
  /** 显示的数字 */
  count: number
  /** 卡片描述文本 */
  description: string
  /** 图标 */
  icon: ReactNode
  /** 图标右上角小点 */
  iconDot?: ReactNode
  /** 背景渐变样式 */
  gradient: string
  /** 边框样式 */
  border: string
  /** 图标背景样式 */
  iconBg: string
  /** 文字颜色样式 */
  textColor: string
  /** 选中时的环形颜色 */
  ringColor: string
  /** 是否处于激活状态 */
  isActive: boolean
  /** 点击事件处理函数 */
  onClick: () => void
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
