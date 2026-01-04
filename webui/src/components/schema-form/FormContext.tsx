import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { FormContextValue } from './types'

const FormContext = createContext<FormContextValue | null>(null)

/**
 * 获取嵌套对象的值
 */
function getNestedValue (obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

/**
 * 设置嵌套对象的值
 */
function setNestedValue (obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  const result = { ...obj }
  let current = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}
    } else {
      current[key] = { ...(current[key] as Record<string, unknown>) }
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return result
}

interface FormProviderProps {
  children: ReactNode
  initialValues?: Record<string, unknown>
  onChange?: (values: Record<string, unknown>) => void
}

export function FormProvider ({ children, initialValues = {}, onChange }: FormProviderProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouchedState] = useState<Record<string, boolean>>({})

  const setValue = useCallback((key: string, value: unknown) => {
    setValues(prev => {
      const newValues = setNestedValue(prev, key, value)
      onChange?.(newValues)
      return newValues
    })
    // 清除错误
    setErrors(prev => {
      if (prev[key]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = prev
        return rest
      }
      return prev
    })
  }, [onChange])

  const setError = useCallback((key: string, error: string) => {
    setErrors(prev => ({ ...prev, [key]: error }))
  }, [])

  const setTouched = useCallback((key: string) => {
    setTouchedState(prev => ({ ...prev, [key]: true }))
  }, [])

  const getValue = useCallback((key: string) => {
    return getNestedValue(values, key)
  }, [values])

  const getError = useCallback((key: string) => {
    return errors[key]
  }, [errors])

  const contextValue: FormContextValue = {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    getValue,
    getError,
  }

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext () {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

export function useField (key: string) {
  const { getValue, setValue, getError, setTouched, touched } = useFormContext()

  return {
    value: getValue(key),
    error: getError(key),
    touched: touched[key] || false,
    onChange: (value: unknown) => setValue(key, value),
    onBlur: () => setTouched(key),
  }
}
