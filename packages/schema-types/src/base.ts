/**
 * @fileoverview Schema-Driven UI 基础类型定义
 * @description 包含国际化、图标、条件表达式、验证规则等基础类型
 * @module @karinjs/schema-types/base
 */

// ============================================
// 国际化支持
// ============================================

/**
 * 国际化键值对象
 * @description 用于支持多语言的字段，使用 i18n 键从语言包中获取翻译
 * @example
 * ```ts
 * const label: I18nKey = {
 *   $i18n: 'common.username',
 *   defaultValue: '用户名'
 * }
 * ```
 */
export interface I18nKey {
  /**
   * i18n 翻译键
   * @description 对应 i18n 语言包中的键路径，如 'common.submit' 或 'form.validation.required'
   */
  $i18n: string

  /**
   * 默认值
   * @description 当翻译键不存在时的回退文本
   */
  defaultValue?: string
}

/**
 * 国际化字符串类型
 * @description 支持普通字符串或国际化键对象
 * @example
 * ```ts
 * // 普通字符串
 * const label1: I18nString = '用户名'
 *
 * // 国际化键
 * const label2: I18nString = { $i18n: 'common.username' }
 * ```
 */
export type I18nString = string | I18nKey

// ============================================
// 图标定义
// ============================================

/**
 * 内置图标名称
 * @description 基于 Lucide Icons 的预定义图标集合
 * @see https://lucide.dev/icons
 */
export type IconName =
  // 通用操作
  | 'globe' | 'wifi' | 'film' | 'help-circle' | 'eye' | 'eye-off'
  | 'settings' | 'user' | 'lock' | 'mail' | 'phone' | 'calendar'
  | 'clock' | 'search' | 'plus' | 'minus' | 'trash' | 'edit'
  | 'check' | 'x' | 'alert-circle' | 'info' | 'alert-triangle'
  // 导航
  | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
  // 文件与数据
  | 'folder' | 'file' | 'database' | 'server' | 'cpu' | 'terminal'
  | 'code' | 'git-branch' | 'package' | 'layers' | 'list' | 'grid'
  // 扩展 (允许自定义图标名)
  | (string & Record<never, never>)

// ============================================
// 条件表达式
// ============================================

/**
 * 条件比较运算符
 * @description 用于字段间的条件判断
 */
export type ConditionOperator =
  | 'eq'       // 等于
  | 'neq'      // 不等于
  | 'gt'       // 大于
  | 'gte'      // 大于等于
  | 'lt'       // 小于
  | 'lte'      // 小于等于
  | 'contains' // 包含（字符串/数组）
  | 'empty'    // 为空
  | 'notEmpty' // 非空

/**
 * 简单条件表达式
 * @description 单个字段的条件判断
 * @example
 * ```ts
 * const condition: SimpleCondition = {
 *   field: 'protocol',
 *   operator: 'eq',
 *   value: 'https'
 * }
 * ```
 */
export interface SimpleCondition {
  /**
   * 要判断的字段路径
   * @description 支持点号分隔的嵌套路径，如 'server.port'
   */
  field: string

  /**
   * 比较运算符
   */
  operator: ConditionOperator

  /**
   * 比较值
   * @description 当 operator 为 'empty' 或 'notEmpty' 时可省略
   */
  value?: unknown
}

/**
 * AND 条件组合
 * @description 所有子条件都必须满足
 * @example
 * ```ts
 * const condition: AndCondition = {
 *   and: [
 *     { field: 'enabled', operator: 'eq', value: true },
 *     { field: 'port', operator: 'gt', value: 0 }
 *   ]
 * }
 * ```
 */
export interface AndCondition {
  and: ConditionExpression[]
}

/**
 * OR 条件组合
 * @description 任一子条件满足即可
 * @example
 * ```ts
 * const condition: OrCondition = {
 *   or: [
 *     { field: 'type', operator: 'eq', value: 'admin' },
 *     { field: 'type', operator: 'eq', value: 'superadmin' }
 *   ]
 * }
 * ```
 */
export interface OrCondition {
  or: ConditionExpression[]
}

/**
 * NOT 条件取反
 * @description 对子条件取反
 * @example
 * ```ts
 * const condition: NotCondition = {
 *   not: { field: 'status', operator: 'eq', value: 'disabled' }
 * }
 * ```
 */
export interface NotCondition {
  not: ConditionExpression
}

/**
 * 条件表达式联合类型
 * @description 支持简单条件和复合条件的嵌套组合
 */
export type ConditionExpression =
  | SimpleCondition
  | AndCondition
  | OrCondition
  | NotCondition

// ============================================
// 验证规则
// ============================================

/**
 * 验证规则类型
 */
export type ValidationType =
  | 'required'  // 必填
  | 'minLength' // 最小长度
  | 'maxLength' // 最大长度
  | 'min'       // 最小值
  | 'max'       // 最大值
  | 'pattern'   // 正则匹配
  | 'email'     // 邮箱格式
  | 'url'       // URL 格式
  | 'ip'        // IP 地址格式
  | 'port'      // 端口范围 (0-65535)
  | 'custom'    // 自定义验证

/**
 * 验证规则
 * @description 定义字段的验证规则
 * @example
 * ```ts
 * const rules: ValidationRule[] = [
 *   { type: 'required', message: '此字段必填' },
 *   { type: 'minLength', value: 3, message: '最少输入3个字符' },
 *   { type: 'pattern', value: '^[a-z]+$', message: '只能输入小写字母' }
 * ]
 * ```
 */
export interface ValidationRule {
  /**
   * 验证类型
   */
  type: ValidationType

  /**
   * 验证参数值
   * @description 根据验证类型不同，可以是数字、字符串、正则表达式等
   * - minLength/maxLength: number
   * - min/max: number
   * - pattern: string (正则表达式)
   * - custom: 自定义验证函数名
   */
  value?: unknown

  /**
   * 验证失败提示消息
   */
  message?: I18nString
}

// ============================================
// 字段布局
// ============================================

/**
 * 列跨度类型
 * @description 字段在网格布局中占据的列数
 */
export type ColumnSpan = 1 | 2 | 3 | 4

/**
 * 字段布局配置
 * @description 控制字段在表单中的布局表现
 * @example
 * ```ts
 * const layout: FieldLayout = {
 *   span: 2,      // 占据 2 列
 *   newLine: true // 强制换行
 * }
 * ```
 */
export interface FieldLayout {
  /**
   * 列跨度
   * @description 字段占据的网格列数，基于表单的 columns 设置
   * @default 1
   */
  span?: ColumnSpan

  /**
   * 是否强制换行
   * @description 为 true 时该字段会从新行开始
   * @default false
   */
  newLine?: boolean
}

// ============================================
// 选项配置
// ============================================

/**
 * 选择项
 * @description 用于 Select、Radio、Checkbox 等选择类组件的选项
 * @example
 * ```ts
 * const items: SelectItem[] = [
 *   { label: 'HTTP', value: 'http', icon: 'globe' },
 *   { label: 'HTTPS', value: 'https', description: '安全连接' },
 *   { label: '禁用选项', value: 'disabled', disabled: true }
 * ]
 * ```
 */
export interface SelectItem {
  /**
   * 显示标签
   */
  label: I18nString

  /**
   * 选项值
   */
  value: string | number

  /**
   * 选项描述
   * @description 显示在标签下方的辅助说明文字
   */
  description?: I18nString

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 选项图标
   */
  icon?: IconName
}

// ============================================
// 表格配置
// ============================================

/**
 * 表格列格式化类型
 */
export type TableColumnFormat =
  | 'default' // 默认文本
  | 'boolean' // 布尔值 (显示为 ✓/✗)
  | 'date'    // 日期格式化
  | 'badge'   // 徽章样式

/**
 * 表格列定义
 * @description 定义表格的列配置
 * @example
 * ```ts
 * const columns: TableColumn[] = [
 *   { field: 'name', title: '名称', width: 200 },
 *   { field: 'status', title: '状态', format: 'badge' },
 *   { field: 'createdAt', title: '创建时间', format: 'date', sortable: true }
 * ]
 * ```
 */
export interface TableColumn {
  /**
   * 数据字段名
   * @description 对应数据对象中的属性名
   */
  field: string

  /**
   * 列标题
   */
  title: I18nString

  /**
   * 列宽度
   * @description 可以是数字(px)或字符串(如 '20%')
   */
  width?: string | number

  /**
   * 是否可排序
   * @default false
   */
  sortable?: boolean

  /**
   * 格式化类型
   * @default 'default'
   */
  format?: TableColumnFormat
}

// ============================================
// 颜色类型
// ============================================

/**
 * 组件颜色类型
 * @description HeroUI 组件的颜色主题
 */
export type ComponentColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'

/**
 * 前景色类型
 * @description 包含 foreground 的颜色类型
 */
export type ForegroundColor = ComponentColor | 'foreground'

// ============================================
// 尺寸类型
// ============================================

/**
 * 标准组件尺寸
 */
export type ComponentSize = 'sm' | 'md' | 'lg'

/**
 * 扩展尺寸（包含更多选项）
 */
export type ExtendedSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Modal 尺寸
 */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'

// ============================================
// 圆角类型
// ============================================

/**
 * 圆角类型
 */
export type RadiusType = 'none' | 'sm' | 'md' | 'lg' | 'full'

// ============================================
// 变体类型
// ============================================

/**
 * 按钮/组件变体
 */
export type ComponentVariant =
  | 'solid'
  | 'bordered'
  | 'light'
  | 'flat'
  | 'faded'
  | 'shadow'
  | 'ghost'

/**
 * 输入框变体
 */
export type InputVariant = 'solid' | 'bordered' | 'light' | 'underlined'

/**
 * Accordion 变体
 */
export type AccordionVariant = 'splitted' | 'bordered' | 'light' | 'shadow'

/**
 * Tabs 变体
 */
export type TabsVariant = 'solid' | 'bordered' | 'light' | 'underlined'

/**
 * Chip 变体
 */
export type ChipVariant = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'dot'

/**
 * 下划线类型
 */
export type UnderlineType = 'none' | 'hover' | 'always' | 'active' | 'focus'
