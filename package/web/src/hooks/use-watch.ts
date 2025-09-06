import { useEffect, useRef } from 'react'

/**
 * 监听值变化
 * @param value 值
 * @param callback 回调
 */
export function useWatch<T> (value: T, callback: (value: T, prevValue: T) => void) {
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value) {
      callback(value, prevValue.current)
    }
    prevValue.current = value
  }, [value])
}
