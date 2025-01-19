// originally written by @imoaazahmed, edited by @bietiaop

import { useEffect, useMemo } from 'react'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key'

const ThemeProps = {
  key: 'theme',
  light: 'light',
  dark: 'dark',
} as const

type Theme = typeof ThemeProps.light | typeof ThemeProps.dark

export const useTheme = (defaultTheme?: Theme) => {
  try {
    JSON.parse(localStorage.getItem(ThemeProps.key) ?? '')
  } catch {
    localStorage.setItem(ThemeProps.key, ThemeProps.light)
  }
  const [theme, setTheme] = useLocalStorageState<Theme>(key.theme, {
    defaultValue: defaultTheme ?? ThemeProps.light,
  })

  const isDark = useMemo(() => {
    return theme === ThemeProps.dark
  }, [theme])

  const isLight = useMemo(() => {
    return theme === ThemeProps.light
  }, [theme])

  const _setTheme = (theme: Theme) => {
    localStorage.setItem(ThemeProps.key, theme)
    document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark)
    document.documentElement.classList.add(theme)
    setTheme(theme)
  }

  const setLightTheme = () => _setTheme(ThemeProps.light)

  const setDarkTheme = () => _setTheme(ThemeProps.dark)

  const toggleTheme = () => (theme === ThemeProps.dark ? setLightTheme() : setDarkTheme())

  useEffect(() => {
    _setTheme(theme ?? ThemeProps.light)
  }, [])

  return { theme, isDark, isLight, setLightTheme, setDarkTheme, toggleTheme }
}
