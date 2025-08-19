import React, { useState, useEffect, ReactNode, useMemo } from 'react'
import { SwitchProps } from '@heroui/switch'
import clsx from 'clsx'

import { useTheme } from '@/hooks/use-theme'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@heroui/button'
import { Tooltip } from '@heroui/tooltip'

type Theme = 'system' | 'inverse'

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
  children?: ReactNode | ((props: { theme: Theme; isDark: boolean }) => ReactNode)
  tooltip?: string | ReactNode
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ classNames, children, tooltip }) => {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, toggleTheme, isDark } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 动态计算 tooltip 内容，响应 theme 变化
  const dynamicTooltip = useMemo(() => {
    if (tooltip) return tooltip
    return isDark ? '浅色模式' : '深色模式'
  }, [tooltip, isDark])

  if (!isMounted) return <div className='w-6 h-6' />

  const buttonElement = (
    <Button
      onPress={toggleTheme}
      radius='full'
      variant='light'
      color='primary'
    >
      <div
        className={clsx(
          'w-auto h-auto',
          'bg-transparent',
          'rounded-lg',
          'flex items-center justify-center',
          'group-data-[selected=true]:bg-transparent',
          '!text-default-500',
          'pt-px',
          'px-0',
          'mx-0',
          classNames?.wrapper
        )}
      >
        {/* 根据当前显示的主题（而不是设置的主题模式）来显示图标 */}
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </div>
      {typeof children === 'function' ? children({ theme: theme as Theme, isDark }) : children}
    </Button>
  )

  return (
    <Tooltip content={dynamicTooltip} delay={1} closeDelay={1}>
      {buttonElement}
    </Tooltip>
  )
}
