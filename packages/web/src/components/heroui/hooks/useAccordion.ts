import { useState, useCallback } from 'react'
import type { UseAccordionResult, AccordionKV } from '../types/accordion'
import { createInitialAccordionState } from '../utils/accordion'

export const useAccordion = (key: string): UseAccordionResult => {
  const [result, setResult] = useState<Record<string, AccordionKV[]>>({ [key]: [] })

  const onInputChange = useCallback((itemKey: string, value: any) => {
    setResult(prev => ({
      ...prev,
      [key]: prev[key].map(item =>
        item.key === itemKey ? { ...item, value } : item
      )
    }))
  }, [key])

  const onSwitchChange = useCallback((itemKey: string, value: boolean) => {
    setResult(prev => ({
      ...prev,
      [key]: prev[key].map(item =>
        item.key === itemKey ? { ...item, selected: value } : item
      )
    }))
  }, [key])

  const onRadioChange = useCallback((itemKey: string, value: string) => {
    setResult(prev => ({
      ...prev,
      [key]: prev[key].map(item =>
        item.key === itemKey ? { ...item, value } : item
      )
    }))
  }, [key])

  const onCheckboxChange = useCallback((itemKey: string, subKey: string, value: boolean) => {
    setResult(prev => ({
      ...prev,
      [key]: prev[key].map(item => {
        if (item.key !== itemKey) return item
        return {
          ...item,
          [subKey]: value
        }
      })
    }))
  }, [key])

  return {
    result,
    handlers: {
      onInputChange,
      onSwitchChange,
      onRadioChange,
      onCheckboxChange
    }
  }
} 