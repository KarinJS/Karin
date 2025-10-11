import { ComponentProps } from './base'

/**
 * 下拉选择框
 */
export interface SelectProps extends ComponentProps {
  componentType: 'select'
  /** 标签 */
  label?: string
  /** 占位符 */
  placeholder?: string
  /** 描述 */
  description?: string
  /** 大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 变体 */
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  /** 半径 */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** 标签位置 */
  labelPlacement?: 'inside' | 'outside' | 'outside-left'
  /** 默认值 */
  defaultValue?: string
  /** 值 */
  value?: string
  /** 错误信息 */
  errorMessage?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否必填 */
  isRequired?: boolean
  /** 是否只读 */
  isReadOnly?: boolean
  /** 是否无效 */
  isInvalid?: boolean
  /** 禁用动画 */
  disableAnimation?: boolean
  /** 是否可清除 */
  isClearable?: boolean
  /** 是否加载中 */
  isLoading?: boolean
  /** 是否打开 */
  isOpen?: boolean
  /** 选择模式 */
  selectionMode?: 'single' | 'multiple'
  /** 禁用的键 */
  disabledKeys?: string[]
  /** 开始内容 */
  startContent?: any
  /** 结束内容 */
  endContent?: any
  /** 选择器图标 */
  selectorIcon?: any
  /** 禁用选择器图标旋转 */
  disableSelectorIconRotation?: boolean
  /** 显示滚动指示器 */
  showScrollIndicators?: boolean
  /** 滚动阴影属性 */
  scrollShadowProps?: {
    isEnabled?: boolean
    hideScrollBar?: boolean
    offset?: number
    orientation?: 'horizontal' | 'vertical'
    size?: number
  }
  /** 是否虚拟化 */
  isVirtualized?: boolean
  /** 最大列表框高度 */
  maxListboxHeight?: number
  /** 项目高度 */
  itemHeight?: number
  /** 自定义渲染值函数 */
  renderValue?: (items: SelectItem[]) => any
  /** 下拉选项列表 */
  items: SelectItem[]
}

/**
 * 下拉选项
 */
export interface SelectItem extends ComponentProps {
  componentType: 'select-item'
  /** 值 */
  value: string
  /** 标签 */
  label?: string
  /** 描述 */
  description?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 开始内容 */
  startContent?: any
  /** 结束内容 */
  endContent?: any
  /** 文本值 */
  textValue?: string
}
