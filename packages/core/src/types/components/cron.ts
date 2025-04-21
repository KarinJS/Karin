import { ComponentProps } from './base'

/**
 * Cron表达式编辑器组件属性
 */
export interface CronProps extends ComponentProps {
  componentType: 'cron'
  /** defaultValue */
  defaultValue?: string
}
