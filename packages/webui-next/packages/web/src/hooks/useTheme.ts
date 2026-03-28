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

type Theme = typeof ThemeProps.system | typeof ThemeProps.inverse | typeof ThemeProps.light | typeof ThemeProps.dark

export const useTheme = (defaultTheme?: Theme) => { 
  // We don't need the manual try/catch block for JSON parse since useLocalStorageState 
  // handles it, but we need to ensure values are stored as valid JSON strings (e.g. '"system"')
  // when interacting with localStorage directly.
  
  const [theme, setTheme] = useLocalStorageState<Theme>(key.theme, { 
    defaultValue: defaultTheme ?? ThemeProps.system, // 默认使用系统主题 
    deserializer: (value: string) => {
      try {
        return JSON.parse(value)
      } catch {
        return value as Theme
      }
    }
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
    if (theme === ThemeProps.dark) {
      return true
    }
    if (theme === ThemeProps.light) {
      return false
    }
    // inverse 模式下，返回反向系统主题的暗色状态 
    return getInverseSystemTheme() === ThemeProps.dark 
  }, [theme]) 

  const isLight = useMemo(() => { 
    if (theme === ThemeProps.system) { 
      return getSystemTheme() === ThemeProps.light 
    } 
    if (theme === ThemeProps.light) {
      return true
    }
    if (theme === ThemeProps.dark) {
      return false
    }
    // inverse 模式下，返回反向系统主题的亮色状态 
    return getInverseSystemTheme() === ThemeProps.light 
  }, [theme]) 

  const _setTheme = (theme: Theme) => { 
    // ahooks handles localStorage updates automatically through setTheme,
    // so we don't need to manually call localStorage.setItem here anymore
    // which was causing the JSON format mismatch
    
    // 根据主题模式应用相应的颜色 
    let appliedTheme;
    if (theme === ThemeProps.system) {
      appliedTheme = getSystemTheme()
    } else if (theme === ThemeProps.inverse) {
      appliedTheme = getInverseSystemTheme()
    } else {
      appliedTheme = theme
    }
    
    // HeroUI v3 uses the data-theme attribute and HTML class for styling
    document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark) 
    document.documentElement.classList.add(appliedTheme) 
    document.documentElement.setAttribute('data-theme', appliedTheme)

    setTheme(theme) 
  } 

  const setSystemTheme = () => _setTheme(ThemeProps.system) 
  const setInverseTheme = () => _setTheme(ThemeProps.inverse) 
  const setDarkTheme = () => _setTheme(ThemeProps.dark)
  const setLightTheme = () => _setTheme(ThemeProps.light)

  const toggleTheme = () => { 
    if (theme === ThemeProps.system || theme === ThemeProps.light) { 
      setDarkTheme() 
    } else { 
      setLightTheme() 
    } 
  } 

  useEffect(() => { 
    _setTheme(theme ?? ThemeProps.system) 

    // 监听系统主题变化 
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)') 
    const handleChange = () => { 
      if (theme !== ThemeProps.system && theme !== ThemeProps.inverse) return;
      
      // 无论是系统模式还是反向模式，都需要重新应用主题 
      const appliedTheme = theme === ThemeProps.system ? getSystemTheme() : getInverseSystemTheme() 
      document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark) 
      document.documentElement.classList.add(appliedTheme) 
      document.documentElement.setAttribute('data-theme', appliedTheme)
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
    setDarkTheme,
    setLightTheme,
    toggleTheme, 
    setTheme: _setTheme,
    isSystem: theme === ThemeProps.system, 
    isInverse: theme === ThemeProps.inverse, 
  } 
} 
