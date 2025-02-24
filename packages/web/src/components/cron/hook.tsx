import { useState } from 'react'

interface TabState {
  type: 'every' | 'specific' | 'range' | 'cycle'
  specific: string[]
  rangeStart: number
  rangeEnd: number
  cycleStart: number
  cycleStep: number
}

interface CronState {
  second: TabState
  minute: TabState
  hour: TabState
  day: TabState
  month: TabState
  week: TabState
}

const defaultTabState: TabState = {
  type: 'every',
  specific: [],
  rangeStart: 0,
  rangeEnd: 0,
  cycleStart: 0,
  cycleStep: 1
}

const parseCronExpression = (cronExpression?: string): CronState => {
  if (!cronExpression) {
    return {
      second: { ...defaultTabState },
      minute: { ...defaultTabState },
      hour: { ...defaultTabState },
      day: { ...defaultTabState },
      month: { ...defaultTabState },
      week: { ...defaultTabState }
    }
  }

  const parts = cronExpression.split(' ')
  const [second, minute, hour, day, month, week] = parts

  const parseValue = (value: string): TabState => {
    if (value === '*') {
      return { ...defaultTabState, type: 'every' }
    }
    if (value.includes(',')) {
      return {
        ...defaultTabState,
        type: 'specific',
        specific: value.split(',').map(num => String(num))
      }
    }
    if (value.includes('-')) {
      const [start, end] = value.split('-').map(Number)
      return {
        ...defaultTabState,
        type: 'range',
        rangeStart: start,
        rangeEnd: end
      }
    }
    if (value.includes('/')) {
      const [start, step] = value.split('/').map(Number)
      return {
        ...defaultTabState,
        type: 'cycle',
        cycleStart: start,
        cycleStep: step
      }
    }
    return { ...defaultTabState }
  }

  return {
    second: parseValue(second),
    minute: parseValue(minute),
    hour: parseValue(hour),
    day: parseValue(day),
    month: parseValue(month),
    week: parseValue(week)
  }
}

export function useCronState (initialValue?: string) {
  const [state, setState] = useState<CronState>(() => parseCronExpression(initialValue))

  const validateTabState = (tab: TabState): boolean => {
    switch (tab.type) {
      case 'specific':
        return tab.specific.length > 0
      case 'range':
        return tab.rangeEnd >= tab.rangeStart
      case 'cycle':
        return tab.cycleStep > 0
      default:
        return true
    }
  }

  const generateCron = () => {
    const parts = ['second', 'minute', 'hour', 'day', 'month', 'week'].map(key => {
      const tab = state[key as keyof CronState]
      if (!validateTabState(tab)) {
        return '*'
      }

      switch (tab.type) {
        case 'every':
          return '*'
        case 'specific':
          return tab.specific.length > 0 ? tab.specific.map(Number).join(',') : '*'
        case 'range':
          return tab.rangeEnd >= tab.rangeStart
            ? `${tab.rangeStart}-${tab.rangeEnd}`
            : '*'
        case 'cycle':
          return tab.cycleStep > 0
            ? `${tab.cycleStart}/${tab.cycleStep}`
            : '*'
        default:
          return '*'
      }
    })
    return parts.join(' ')
  }

  return {
    state,
    setState,
    generateCron,
    validateTabState
  }
}
