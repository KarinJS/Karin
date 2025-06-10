// originally written by @imoaazahmed, edited by @bietiaop

import { useEffect, useMemo } from 'react'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key'

const ThemeProps = {
  key: 'theme',
  light: 'light',
  dark: 'dark',
  system: 'system',
  inverse: 'inverse',
} as const

type Theme = typeof ThemeProps.system | typeof ThemeProps.inverse

export const useTheme = (defaultTheme?: Theme) => {
  try {
    JSON.parse(localStorage.getItem(ThemeProps.key) ?? '')
  } catch {
    localStorage.setItem(ThemeProps.key, ThemeProps.system)
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

  // 获取反向系统主题
  const getInverseSystemTheme = (): typeof ThemeProps.light | typeof ThemeProps.dark => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeProps.light
      : ThemeProps.dark
  }

  const isDark = useMemo(() => {
    if (theme === ThemeProps.system) {
      return getSystemTheme() === ThemeProps.dark
    }
    // inverse 模式下，返回反向系统主题的暗色状态
    return getInverseSystemTheme() === ThemeProps.dark
  }, [theme])

  const isLight = useMemo(() => {
    if (theme === ThemeProps.system) {
      return getSystemTheme() === ThemeProps.light
    }
    // inverse 模式下，返回反向系统主题的亮色状态
    return getInverseSystemTheme() === ThemeProps.light
  }, [theme])

  const _setTheme = (theme: Theme) => {
    localStorage.setItem(ThemeProps.key, theme)
    document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark)

    // 根据主题模式应用相应的颜色
    const appliedTheme = theme === ThemeProps.system ? getSystemTheme() : getInverseSystemTheme()
    document.documentElement.classList.add(appliedTheme)

    setTheme(theme)
  }

  const setSystemTheme = () => _setTheme(ThemeProps.system)
  const setInverseTheme = () => _setTheme(ThemeProps.inverse)

  const toggleTheme = () => {
    if (theme === ThemeProps.system) {
      setInverseTheme()
    } else {
      setSystemTheme()
    }
  }

  useEffect(() => {
    _setTheme(theme ?? ThemeProps.system)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // 无论是系统模式还是反向模式，都需要重新应用主题
      const appliedTheme = theme === ThemeProps.system ? getSystemTheme() : getInverseSystemTheme()
      document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark)
      document.documentElement.classList.add(appliedTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return {
    theme,
    isDark,
    isLight,
    setSystemTheme,
    setInverseTheme,
    toggleTheme,
    isSystem: theme === ThemeProps.system,
    isInverse: theme === ThemeProps.inverse,
  }
}
