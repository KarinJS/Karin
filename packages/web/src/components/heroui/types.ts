/* eslint-disable @stylistic/indent */
import type {
  InputProps,
  SwitchProps,
  RadioGroupProps,
  CheckboxGroupProps,
  AccordionProps,
  AccordionProProps,
  AccordionItemProps,
  AccordionKV,
  DividerProps,
  InputGroupProps
} from 'node-karin'

interface Cache<T> {
  /** 组件唯一标识 */
  key: string,
  /** 旧值 */
  old: T,
  /** 新值 */
  new: T,
  /** 点击保存后调用的函数 需要转为后端可识别的格式 */
  handler: () => void
}

/**
 * 输入框的缓存类型
 */
export type InputRef = Record<string, Cache<string | undefined>>

/**
 * 开关的缓存类型
 */
export type SwitchRef = Record<string, Cache<boolean>>

/**
 * 单选框的缓存类型
 */
export type RadioRef = Record<string, Cache<string>>

/**
 * 多选框的缓存类型
 */
export type CheckboxRef = Record<string, Cache<boolean>[]>

/**
 * 手风琴的缓存类型
 */
export type AccordionRef = Record<string, Cache<string | boolean | undefined>[]>

/**
 * 输入框组的缓存类型
 */
export type InputGroupRef = Record<string, Cache<string>>

/**
 * 手风琴pro的缓存类型
 */
export type AccordionProRef = AccordionRef

/** 组件数据缓存 */
export type Ref<
  T extends
  'input' |
  'switch' |
  'radio' |
  'checkbox' |
  'accordion' |
  'accordion-pro' |
  'input-group'
> =
  T extends 'input' ? InputRef :
  T extends 'switch' ? SwitchRef :
  T extends 'radio' ? RadioRef :
  T extends 'checkbox' ? CheckboxRef :
  T extends 'accordion' ? AccordionRef :
  T extends 'accordion-pro' ? AccordionProRef :
  T extends 'input-group' ? InputGroupRef :
  never

export type InputResult = Record<string, string | undefined>
export type SwitchResult = Record<string, boolean>
export type RadioResult = Record<string, string>
export type CheckboxResult = Record<string, Record<string, boolean>>
export type AccordionResult = Record<string, AccordionKV[]>
export type InputGroupResult = Record<string, string[]>

export type Result<T extends string> = T extends 'input' ? InputResult
  : T extends 'switch' ? SwitchResult
  : T extends 'radio' ? RadioResult
  : T extends 'checkbox' ? CheckboxResult
  : T extends 'accordion' | 'accordion-pro' ? AccordionResult
  : T extends 'input-group' ? InputGroupResult
  : T extends 'all' ? (
    InputResult &
    SwitchResult &
    RadioResult &
    CheckboxResult &
    AccordionResult &
    InputGroupResult
  )
  : never

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
  InputGroupProps
