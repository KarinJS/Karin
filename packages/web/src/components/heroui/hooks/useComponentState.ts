import { useState, useEffect } from 'react'
import type { Result } from '../types'

type ComponentValue = string | boolean | Record<string, boolean> | Record<string, any>[]

/**
 * 通用组件状态管理 Hook
 * @param key - 组件唯一标识
 * @param initialValue - 初始值
 * @param result - 结果对象
 * @param onValueChange - 值变化回调（可选）
 */
export function useComponentState<T extends ComponentValue> (
  key: string,
  initialValue: T,
  result: Result<any>,
  onValueChange?: (value: T) => void
) {
  const [state, setState] = useState<T>(initialValue)

  // 初始化 result
  useEffect(() => {
    if (!onValueChange) {
      result[key] = state
    }
  }, [])

  // 统一的状态更新处理
  const handleValueChange = (newValue: T) => {
    setState(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      result[key] = newValue
    }
  }

  return {
    value: state,
    onChange: handleValueChange
  }
} 