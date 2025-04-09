import { ReactNode } from 'react'

interface DependencyCardProps {
  title: string
  count: number
  description: string
  icon: ReactNode
  iconDot?: ReactNode
  gradient: string
  border: string
  iconBg: string
  textColor: string
  ringColor: string
  isActive: boolean
  onClick: () => void
}

const DependencyCard = ({
  count, description, icon, iconDot, gradient, border, iconBg, textColor, ringColor, isActive, onClick,
}: DependencyCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${gradient}
        rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm ${border}
        transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
        ${isActive ? `ring-2 ${ringColor}` : ''}
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

export default DependencyCard
