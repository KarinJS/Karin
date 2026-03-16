import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import type { I18nString } from './types'

/**
 * 解析国际化字符串 (Hook 版本，用于组件内)
 */
export function useI18nString () {
  const { t } = useTranslation()

  return (str: I18nString | undefined): string => {
    if (!str) return ''
    if (typeof str === 'string') {
      // 以 $ 开头的是 i18n key 简写
      if (str.startsWith('$')) {
        return t(str.slice(1))
      }
      return str
    }
    // I18nKey 对象
    return t(str.$i18n, { defaultValue: str.defaultValue || str.$i18n })
  }
}

/**
 * 解析国际化字符串 (非 Hook 版本，用于纯函数)
 */
export function resolveI18n (str: I18nString | undefined): string {
  if (!str) return ''
  if (typeof str === 'string') {
    // 以 $ 开头的是 i18n key 简写
    if (str.startsWith('$')) {
      return i18next.t(str.slice(1))
    }
    return str
  }
  // I18nKey 对象
  return i18next.t(str.$i18n, { defaultValue: str.defaultValue || str.$i18n })
}
