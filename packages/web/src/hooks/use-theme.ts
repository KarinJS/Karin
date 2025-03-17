// originally written by @imoaazahmed, edited by @bietiaop

import { useEffect, useMemo } from 'react'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key'

const ThemeProps = {
  key: 'theme',
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const

type Theme = typeof ThemeProps.light | typeof ThemeProps.dark | typeof ThemeProps.system

export const useTheme = (defaultTheme?: Theme) => {
  try {
    JSON.parse(localStorage.getItem(ThemeProps.key) ?? '')
  } catch {
    localStorage.setItem(ThemeProps.key, ThemeProps.light)
  }
  const [theme, setTheme] = useLocalStorageState<Theme>(key.theme, {
    defaultValue: defaultTheme ?? ThemeProps.system, // 默认使用系统主题
  })

  // 获取系统主题偏好
  const getSystemTheme = (): typeof ThemeProps.light | typeof ThemeProps.dark => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeProps.dark
      : ThemeProps.light
  }

  const isDark = useMemo(() => {
    if (theme === ThemeProps.system) {
      return getSystemTheme() === ThemeProps.dark
    }
    return theme === ThemeProps.dark
  }, [theme])

  const isLight = useMemo(() => {
    if (theme === ThemeProps.system) {
      return getSystemTheme() === ThemeProps.light
    }
    return theme === ThemeProps.light
  }, [theme])

  const _setTheme = (theme: Theme) => {
    localStorage.setItem(ThemeProps.key, theme)
    document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark)

    // 如果是系统主题，则应用系统当前的主题颜色
    const appliedTheme = theme === ThemeProps.system ? getSystemTheme() : theme
    document.documentElement.classList.add(appliedTheme)

    setTheme(theme)
  }

  const setLightTheme = () => _setTheme(ThemeProps.light)
  const setDarkTheme = () => _setTheme(ThemeProps.dark)
  const setSystemTheme = () => _setTheme(ThemeProps.system)

  const toggleTheme = () => {
    if (theme === ThemeProps.dark) {
      setLightTheme()
    } else if (theme === ThemeProps.light) {
      setSystemTheme()
    } else {
      setDarkTheme()
    }
  }

  useEffect(() => {
    _setTheme(theme ?? ThemeProps.system)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === ThemeProps.system) {
        document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark)
        document.documentElement.classList.add(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return {
    theme,
    isDark,
    isLight,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme,
    isSystem: theme === ThemeProps.system
  }
}
