export type Option = {
  label: string
  value: string | number
  disabled?: boolean
}

/** 组件类型 */
export type FieldType =
  | 'text'
  | 'number'
  | 'switch'
  | 'select'
  | 'object'
  | 'divider'
  | 'array'
  | 'objectArray'
  | 'colorPicker'
  | 'radio'
  | 'checkbox'
  | 'section'
  | 'title'

/** 值类型 */
export type ValueType = 'string' | 'number' | 'boolean' | 'object'

interface BaseField {
  /** 组件类型 */
  type: FieldType
  /** 字段 */
  key: string
  /** 显示文本 */
  label?: string
  /** 是否必填 */
  required?: boolean
  /** 描述 */
  description?: string
}

/** 文本组件 */
export interface TextField extends BaseField {
  type: 'text'
  /** 默认值 */
  defaultValue?: string
}

/** 数字输入框 */
export interface NumberField extends BaseField {
  type: 'number'
  /** 默认值 */
  defaultValue?: number
}

/** 开关 */
export interface SwitchField extends BaseField {
  type: 'switch'
  /** 默认值 */
  defaultValue?: boolean
}

/** 下拉框选择器 */
export interface SelectField extends BaseField {
  type: 'select'
  /** 是否多选 */
  multiple?: boolean
  /** 选项 */
  options?: Option[]
  /** 默认值 */
  defaultValue?: string | number
}

/** 分隔符 */
export interface DividerField extends BaseField {
  type: 'divider'
}

// /** 颜色选择器 */
// export interface ColorPickerField extends BaseField {
//   type: 'colorPicker'
//   /** 显示文本 */
//   label?: string
//   /** 允许清除选择的颜色 */
//   allowClear?: boolean
//   /** 默认值 */
//   defaultValue?: string
//   /** 默认格式 */
//   defaultFormat?: 'rgb' | 'hex' | 'hsb'
//   /** 颜色格式 默认hex */
//   format?: 'rgb' | 'hex' | 'hsb'
//   /** 是否展开颜色选择器 */
//   open?: boolean
//   /** 颜色值 */
//   value?: string
//   /** 选择器模式，用于配置单色与渐变 */
//   mode?: 'single' | 'gradient' | ('single' | 'gradient')[]
//   /** 是否禁用透明度选择 */
//   disabledAlpha?: boolean
// }

/** 单选框 */
export interface RadioField extends BaseField {
  type: 'radio'
  /** 选项 */
  options: Option[]
  /** 默认值 */
  defaultValue?: string | number
}

/** 多选框 */
export interface CheckboxField extends BaseField {
  type: 'checkbox'
  /** 选项 */
  options: Option[]
  /** 默认值 */
  defaultValue?: string[] | number[]
}

/** 数组 */
export interface ArrayField extends BaseField {
  type: 'array'
  /** 值类型 */
  elementType: 'text' | 'number'
  /** 默认值 */
  defaultValue?: string | number
}

/** 对象 */
export interface ObjectField extends BaseField {
  type: 'object'
  /** 子组件配置 */
  fields: FormField[]
}

/** 对象数组 */
export interface ObjectArrayField extends BaseField {
  type: 'objectArray'
  /** 子组件配置 */
  fields: FormField[]
}

/** 分组 */
export interface SectionField extends BaseField {
  type: 'section'
  /** 子组件 */
  children: FormField[]
}

/** 标题 */
export interface TitleField extends BaseField {
  type: 'title'
  /** 显示文本 */
  text: string
}

/** 组件 */
export type FormField =
  | TextField
  | NumberField
  | SwitchField
  | SelectField
  | RadioField
  | CheckboxField
  | ArrayField
  | ObjectField
  | ObjectArrayField
  | SectionField
  | TitleField
  | DividerField
// | ColorPickerField

/**
 * 输入框返回类型
 */
export type InputResult = Record<string, string | undefined>

/**
 * 开关返回类型
 */
export type SwitchResult = Record<string, boolean>

/**
 * 单选框返回类型
 */
export type RadioResult = Record<string, string | undefined>

/**
 * 多选框返回类型
 */
export type CheckboxResult = Record<string, Record<string, boolean>>

/**
 * 手风琴kv类型
 */
export type AccordionKV = string | boolean | Record<string, boolean>

/**
 * 手风琴返回类型
 */
export type AccordionResult = Record<string, AccordionKV[]>

/**
 * 手风琴pro返回类型
 */
export type AccordionProResult = AccordionResult

/**
 * save 方法返回的类型
 */
export type SaveResult = InputResult | SwitchResult | RadioResult | CheckboxResult | AccordionResult | AccordionProResult
