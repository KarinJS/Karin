/** 组件类型 */
export type ComponentType = 'input' |
  'number' |
  'switch' |
  'select' |
  'section' |
  'divider' |
  'title' |
  'array' |
  'colorPicker' |
  'radio' |
  'checkbox'

interface BaseComponent {
  /** 组件类型 */
  type: ComponentType
}

/** 标题 */
export interface TitleComponent extends BaseComponent {
  type: 'title'
  /** 标题文本 */
  text: string
}

/** 文本输入框 */
export interface InputComponent extends BaseComponent {
  type: 'input'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 输入框内容 */
  value?: string
  /** 描述 */
  description?: string
  /** 是否必填 */
  required?: boolean
  /** 默认值 */
  defaultValue?: string
  /** 最小长度 */
  minLength?: number
  /** 最大长度 */
  maxLength?: number
  /** 是否可编辑 */
  editable?: boolean
  /** 是否可删除 */
  removable?: boolean
  /** 尺寸: 大、默认、小，高度分别为 40px、32px 和 24px */
  size?: 'large' | 'middle' | 'small'
  /** 是否允许清空 */
  allowClear?: boolean
  /** 是否显示计数 */
  showCount?: boolean
}

/** 数字输入框 */
export interface NumberComponent extends BaseComponent {
  type: 'number'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 输入框内容 */
  value?: number
  /** 描述 */
  description?: string
  /** 是否必填 */
  required?: boolean
  /** 默认值 */
  defaultValue?: number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 允许鼠标滚轮改变数值 */
  changeOnWheel?: boolean
  /** 尺寸: 大、默认、小，高度分别为 40px、32px 和 24px */
  size?: 'large' | 'middle' | 'small'
}

/** 开关 */
export interface SwitchComponent extends BaseComponent {
  type: 'switch'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 描述 */
  description?: string
  /** 选中时的内容 */
  checkedChildren?: string
  /** 未选中时的内容 */
  unCheckedChildren?: string
  /** 开关大小，可选值：default small */
  size?: 'default' | 'small'
  /** 是否选中 */
  checked?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

/** 下拉框选择器 */
export interface SelectComponent extends BaseComponent {
  type: 'select'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 描述 */
  description?: string
  /** 是否为多选 */
  multiple?: boolean
  /** 是否展开下拉菜单 */
  open?: boolean
  /** 选择框默认文本 */
  placeholder?: string
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 是否显示清除按钮 */
  allowClear?: boolean
  /** 尺寸: 大、默认、小 */
  size?: 'large' | 'middle' | 'small'
  /** 选项 */
  options?: {
    /** 选项文本 */
    label: string
    /** 选项值 */
    value: string | number | boolean
    /** 是否禁用 */
    disabled?: boolean
  }[]
}

/** 分隔符 */
export interface DividerComponent extends BaseComponent {
  type: 'divider'
  /** 是否为虚线 */
  dashed?: boolean
  /** 分割线是虚线、点线还是实线 */
  variant?: 'dashed' | 'dotted' | 'solid'
}

/** 颜色选择器 */
export interface ColorPickerComponent extends BaseComponent {
  type: 'colorPicker'
  /** 显示文本 */
  label?: string
  /** 允许清除选择的颜色 */
  allowClear?: boolean
  /** 默认值 */
  defaultValue?: string
  /** 默认格式 */
  defaultFormat?: 'rgb' | 'hex' | 'hsb'
  /** 颜色格式 默认hex */
  format?: 'rgb' | 'hex' | 'hsb'
  /** 是否展开颜色选择器 */
  open?: boolean
  /** 颜色值 */
  value?: string
  /** 选择器模式，用于配置单色与渐变 */
  mode?: 'single' | 'gradient' | ('single' | 'gradient')[]
  /** 是否禁用透明度选择 */
  disabledAlpha?: boolean
}

/** 单选框 */
export interface RadioComponent extends BaseComponent {
  type: 'radio'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 垂直布局 默认false */
  vertical?: boolean
  /** 选项 */
  options?: {
    /** 选项文本 */
    label: string
    /** 选项值 */
    value: string | number | boolean
    /** 是否选中 */
    checked?: boolean
    /** 是否禁用 */
    disabled?: boolean
  }[]
}

/** 多选框 */
export interface CheckboxComponent extends BaseComponent {
  type: 'checkbox'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 是否垂直布局 默认false */
  vertical?: boolean
  /** 选项 */
  options?: {
    /** 选项文本 */
    label: string
    /** 选项值 */
    value: string | number | boolean
    /** 是否选中 */
    checked?: boolean
    /** 是否禁用 */
    disabled?: boolean
  }[]
}

/** 数组 */
export interface ArrayComponent extends BaseComponent {
  type: 'array'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 子组件 */
  items?: Component[]
}

/** 分组 */
export interface SectionComponent extends BaseComponent {
  type: 'section'
  /** 显示文本 */
  label?: string
  /** 字段名 */
  field?: string
  /** 是否展开 */
  open?: boolean
  /** 子组件 */
  children?: Component[]
}

/** 组件 */
export type Component = TitleComponent | InputComponent | NumberComponent | SwitchComponent | SelectComponent | DividerComponent | ColorPickerComponent | RadioComponent | CheckboxComponent | ArrayComponent | SectionComponent
