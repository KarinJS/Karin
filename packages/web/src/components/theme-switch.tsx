import { useState, useEffect, ReactNode } from 'react'
import { SwitchProps } from '@heroui/switch'
import clsx from 'clsx'

import { useTheme } from '@/hooks/use-theme'
import { SunFilledIcon, MoonFilledIcon } from '@/components/icons'
import { Button } from '@heroui/button'

import type { FC } from 'react'

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
  children?: ReactNode
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ classNames, children }) => {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className='w-6 h-6' />

  return (
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
          classNames?.wrapper,
        )}
      >
        {theme === 'light' ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
      </div>
      {children}
    </Button>
  )
}
