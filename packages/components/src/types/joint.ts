import type { CronProps } from './cron'
import type { SwitchProps } from './switch'
import type { DividerProps } from './divider'
import type { RadioGroupProps } from './radioGroup'
import type { InputGroupProps, InputProps } from './input'
import type { CheckboxProps, CheckboxGroupProps } from './checkbox'
import type { AccordionItemProps, AccordionProProps, AccordionProps } from './accordion'

export type Children = InputProps
  | SwitchProps
  | DividerProps
  | CheckboxProps
  | CheckboxGroupProps
  | RadioGroupProps
  | InputGroupProps

/** 组件配置类型 */
export type ComponentConfig =
  InputProps |
  SwitchProps |
  RadioGroupProps |
  CheckboxGroupProps |
  AccordionProps |
  AccordionProProps |
  AccordionItemProps |
  DividerProps |
  InputGroupProps |
  CronProps
