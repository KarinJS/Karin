import { useState, useEffect } from 'react'

/**
 * Cron表达式选项卡状态接口
 * @description 定义了Cron表达式选项卡的各种状态配置
 */
interface TabState {
  /** 选项卡类型：每次执行、指定时间、范围执行或周期执行 */
  type: 'every' | 'specific' | 'range' | 'cycle'
  /** 指定的具体时间点列表 */
  specific: string[]
  /** 范围执行的起始值 */
  rangeStart: number
  /** 范围执行的结束值 */
  rangeEnd: number
  /** 周期执行的起始值 */
  cycleStart: number
  /** 周期执行的步长 */
  cycleStep: number
}

/**
 * Cron表达式完整状态接口
 * @description 包含秒、分、时、日、月、周的完整Cron表达式状态
 */
interface CronState {
  /** 秒配置 */
  second: TabState
  /** 分钟配置 */
  minute: TabState
  /** 小时配置 */
  hour: TabState
  /** 日期配置 */
  day: TabState
  /** 月份配置 */
  month: TabState
  /** 星期配置 */
  week: TabState
}

/**
 * 默认选项卡状态
 * @description 定义了选项卡的默认状态值
 */
const defaultTabState: TabState = {
  type: 'every',
  specific: [],
  rangeStart: 0,
  rangeEnd: 0,
  cycleStart: 0,
  cycleStep: 1,
}

/**
 * 解析Cron表达式字符串
 * @param cronExpression - Cron表达式字符串
 * @returns 解析后的Cron状态对象
 */
const parseCronExpression = (cronExpression?: string): CronState => {
  if (!cronExpression) {
    return {
      second: { ...defaultTabState },
      minute: { ...defaultTabState },
      hour: { ...defaultTabState },
      day: { ...defaultTabState },
      month: { ...defaultTabState },
      week: { ...defaultTabState },
    }
  }

  const parts = cronExpression.split(' ')
  const [second, minute, hour, day, month, week] = parts

  /**
   * 解析单个Cron表达式部分值
   * @param value - 单个表达式部分（如秒、分等）
   * @returns 对应的选项卡状态
   */
  const parseValue = (value: string): TabState => {
    if (value === '*') {
      return { ...defaultTabState, type: 'every' }
    }
    if (value.includes(',')) {
      return {
        ...defaultTabState,
        type: 'specific',
        specific: value.split(',').map(num => String(num)),
      }
    }
    if (value.includes('-')) {
      const [start, end] = value.split('-').map(Number)
      return {
        ...defaultTabState,
        type: 'range',
        rangeStart: start,
        rangeEnd: end,
      }
    }
    if (value.includes('/')) {
      const [start, step] = value.split('/').map(Number)
      return {
        ...defaultTabState,
        type: 'cycle',
        cycleStart: start,
        cycleStep: step,
      }
    }
    /** 处理单个数字的情况 */
    if (!isNaN(Number(value))) {
      return {
        ...defaultTabState,
        type: 'specific',
        specific: [String(value)],
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
    week: parseValue(week),
  }
}

/**
 * Cron表达式状态钩子
 * @description 用于管理Cron表达式的状态和操作
 * @param initialValue - 初始Cron表达式
 * @returns Cron状态管理相关方法和状态
 */
export function useCronState (initialValue?: string) {
  const [state, setState] = useState<CronState>(() => parseCronExpression(initialValue))

  /** 添加对value变化的监听，当传入的cron表达式变化时更新状态 */
  useEffect(() => {
    setState(parseCronExpression(initialValue))
  }, [initialValue])

  /**
   * 验证选项卡状态是否有效
   * @param tab - 要验证的选项卡状态
   * @returns 是否有效
   */
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

  /**
   * 生成Cron表达式字符串
   * @returns 格式化的Cron表达式字符串
   */
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
    validateTabState,
  }
}
