/**
 * @fileoverview Schema-Driven UI 类型定义入口
 * @description 供前后端共同使用的 Schema 类型定义包
 * @module @karinjs/schema-types
 *
 * @example
 * 后端使用示例：
 * ```ts
 * import type { FormSchema, TextFieldSchema, SelectFieldSchema } from '@karinjs/schema-types'
 *
 * const userSettingsSchema: FormSchema = {
 *   version: '1.0',
 *   id: 'user-settings',
 *   title: '用户设置',
 *   fields: [
 *     { key: 'username', type: 'text', label: '用户名', required: true },
 *     {
 *       key: 'theme',
 *       type: 'select',
 *       label: '主题',
 *       options: {
 *         items: [
 *           { label: '浅色', value: 'light' },
 *           { label: '深色', value: 'dark' }
 *         ]
 *       }
 *     }
 *   ]
 * }
 *
 * // 发送给前端
 * res.json(userSettingsSchema)
 * ```
 *
 * @example
 * 前端使用示例：
 * ```tsx
 * import type { FormSchema, FieldSchema } from '@karinjs/schema-types'
 * import { SchemaForm } from './components/schema-form'
 *
 * function SettingsPage() {
 *   const [schema, setSchema] = useState<FormSchema | null>(null)
 *
 *   useEffect(() => {
 *     fetch('/api/settings/schema')
 *       .then(res => res.json())
 *       .then(setSchema)
 *   }, [])
 *
 *   if (!schema) return <Loading />
 *
 *   return <SchemaForm schema={schema} onSubmit={handleSubmit} />
 * }
 * ```
 */

// ============================================
// 基础类型导出
// ============================================

export type {
  // 国际化
  I18nKey,
  I18nString,
  // 图标
  IconName,
  // 条件表达式
  ConditionOperator,
  SimpleCondition,
  AndCondition,
  OrCondition,
  NotCondition,
  ConditionExpression,
  // 验证
  ValidationType,
  ValidationRule,
  // 布局
  ColumnSpan,
  FieldLayout,
  // 选项
  SelectItem,
  // 表格
  TableColumnFormat,
  TableColumn,
  // 颜色和尺寸
  ComponentColor,
  ForegroundColor,
  ComponentSize,
  ExtendedSize,
  ModalSize,
  RadiusType,
  // 变体
  ComponentVariant,
  InputVariant,
  AccordionVariant,
  TabsVariant,
  ChipVariant,
  UnderlineType,
} from './base'

// ============================================
// 字段类型导出
// ============================================

export type {
  // 通用基础
  FieldSchemaBase,
  // 基础输入
  TextFieldOptions,
  TextFieldSchema,
  PasswordFieldOptions,
  PasswordFieldSchema,
  NumberFieldOptions,
  NumberFieldSchema,
  TextareaFieldOptions,
  TextareaFieldSchema,
  SwitchFieldOptions,
  SwitchFieldSchema,
  SelectFieldOptions,
  SelectFieldSchema,
  // 高级输入
  CheckboxFieldOptions,
  CheckboxFieldSchema,
  CheckboxGroupFieldOptions,
  CheckboxGroupFieldSchema,
  RadioGroupFieldOptions,
  RadioGroupFieldSchema,
  AutocompleteFieldOptions,
  AutocompleteFieldSchema,
  SliderMark,
  SliderFieldOptions,
  SliderFieldSchema,
  DatePickerFieldOptions,
  DatePickerFieldSchema,
  DateRangePickerFieldOptions,
  DateRangePickerFieldSchema,
  TimeInputFieldOptions,
  TimeInputFieldSchema,
  ColorPickerFieldOptions,
  ColorPickerFieldSchema,
  ImageUploadFieldOptions,
  ImageUploadFieldSchema,
  FileUploadFieldOptions,
  FileUploadFieldSchema,
  TagsInputFieldOptions,
  TagsInputFieldSchema,
  OtpInputFieldOptions,
  OtpInputFieldSchema,
  RatingFieldOptions,
  RatingFieldSchema,
  // 列表类型
  ListFieldOptions,
  ListFieldSchema,
  ObjectListEditModal,
  ObjectListFieldOptions,
  ObjectListFieldSchema,
  KeyValueFieldOptions,
  KeyValueFieldSchema,
  JsonEditorFieldOptions,
  JsonEditorFieldSchema,
  // 布局组件
  GroupFieldOptions,
  GroupFieldSchema,
  AccordionItem,
  AccordionFieldOptions,
  AccordionFieldSchema,
  TabItem,
  TabsFieldOptions,
  TabsFieldSchema,
  DividerFieldOptions,
  DividerFieldSchema,
  AlertVariant,
  AlertFieldOptions,
  AlertFieldSchema,
  SpacerFieldOptions,
  SpacerFieldSchema,
  ScrollAreaFieldOptions,
  ScrollAreaFieldSchema,
  // 展示组件
  ProgressFormatOptions,
  ProgressFieldOptions,
  ProgressFieldSchema,
  AvatarFieldOptions,
  AvatarFieldSchema,
  BadgePlacement,
  BadgeVariant,
  BadgeFieldOptions,
  BadgeFieldSchema,
  ChipFieldOptions,
  ChipFieldSchema,
  SnippetFieldOptions,
  SnippetFieldSchema,
  LinkFieldOptions,
  LinkFieldSchema,
  UserCardFieldOptions,
  UserCardFieldSchema,
  ImageFieldOptions,
  ImageFieldSchema,
  ButtonActionType,
  ButtonAction,
  ButtonFieldOptions,
  ButtonFieldSchema,
  SkeletonVariant,
  SkeletonFieldOptions,
  SkeletonFieldSchema,
  PaginationVariant,
  PaginationFieldOptions,
  PaginationFieldSchema,
  // 容器组件
  CardShadow,
  CardFieldOptions,
  CardFieldSchema,
  PopoverPlacement,
  TriggerVariant,
  PopoverTriggerFieldOptions,
  PopoverTriggerFieldSchema,
  TooltipColor,
  TooltipFieldOptions,
  TooltipFieldSchema,
  DrawerPlacement,
  DrawerTriggerFieldOptions,
  DrawerTriggerFieldSchema,
  ModalScrollBehavior,
  ModalTriggerFieldOptions,
  ModalTriggerFieldSchema,
  TableSelectionMode,
  TableFieldOptions,
  TableFieldSchema,
  ListboxSelectionMode,
  ListboxVariant,
  ListboxFieldOptions,
  ListboxFieldSchema,
  DropdownItem,
  DropdownSelectionMode,
  DropdownFieldOptions,
  DropdownFieldSchema,
  BreadcrumbItem,
  BreadcrumbsFieldOptions,
  BreadcrumbsFieldSchema,
  // 联合类型
  FieldSchema,
  FieldType,
} from './fields'

// ============================================
// 表单 Schema 导出
// ============================================

export type {
  FormLayout,
  FormColumns,
  SubmitPosition,
  SubmitButtonConfig,
  FormOptions,
  SubmitMethod,
  DataTransform,
  SuccessAction,
  SubmitConfig,
  SchemaVersion,
  FormSchema,
} from './schema'

// ============================================
// 表单上下文导出
// ============================================

export type {
  FormValues,
  FormErrors,
  FormTouched,
  FormContextValue,
  FormSubmitHandler,
  FieldChangeHandler,
  ValidationResult,
  FormValidator,
} from './context'
