/**
 * @fileoverview 字段入口导出
 * @description 整合所有字段类型并导出 FieldSchema 联合类型
 * @module @karinjs/schema-types/fields
 */

// 导入类型用于联合类型定义
import type {
  TextFieldSchema,
  PasswordFieldSchema,
  NumberFieldSchema,
  TextareaFieldSchema,
  SwitchFieldSchema,
  SelectFieldSchema,
} from './basic'

import type {
  CheckboxFieldSchema,
  CheckboxGroupFieldSchema,
  RadioGroupFieldSchema,
  AutocompleteFieldSchema,
  SliderFieldSchema,
  DatePickerFieldSchema,
  DateRangePickerFieldSchema,
  TimeInputFieldSchema,
  ColorPickerFieldSchema,
  ImageUploadFieldSchema,
  FileUploadFieldSchema,
  TagsInputFieldSchema,
  OtpInputFieldSchema,
  RatingFieldSchema,
} from './input'

import type {
  ListFieldSchema,
  ObjectListFieldSchema,
  KeyValueFieldSchema,
  JsonEditorFieldSchema,
} from './list'

import type {
  GroupFieldSchema,
  AccordionFieldSchema,
  TabsFieldSchema,
  DividerFieldSchema,
  AlertFieldSchema,
  SpacerFieldSchema,
  ScrollAreaFieldSchema,
} from './layout'

import type {
  ProgressFieldSchema,
  AvatarFieldSchema,
  BadgeFieldSchema,
  ChipFieldSchema,
  SnippetFieldSchema,
  LinkFieldSchema,
  UserCardFieldSchema,
  ImageFieldSchema,
  ButtonFieldSchema,
  SkeletonFieldSchema,
  PaginationFieldSchema,
} from './display'

import type {
  CardFieldSchema,
  PopoverTriggerFieldSchema,
  TooltipFieldSchema,
  DrawerTriggerFieldSchema,
  ModalTriggerFieldSchema,
  TableFieldSchema,
  ListboxFieldSchema,
  DropdownFieldSchema,
  BreadcrumbsFieldSchema,
} from './container'

// 导出通用基础
export * from './common'

// 导出基础字段
export * from './basic'

// 导出高级输入字段
export * from './input'

// 导出列表字段
export * from './list'

// 导出布局字段
export * from './layout'

// 导出展示字段
export * from './display'

// 导出容器字段
export * from './container'

/**
 * 字段 Schema 联合类型
 * @description 所有字段类型的联合，用于类型推断和字段定义
 *
 * 字段分类：
 * - **基础输入**: text, password, number, textarea, switch, select
 * - **高级输入**: checkbox, checkbox-group, radio-group, autocomplete, slider,
 *   date-picker, date-range-picker, time-input, color-picker, image-upload,
 *   file-upload, tags-input, otp-input, rating
 * - **列表类型**: list, object-list, key-value, json-editor
 * - **布局组件**: group, accordion, tabs, divider, alert, spacer, scroll-area
 * - **展示组件**: progress, avatar, badge, chip, snippet, link, user-card,
 *   image, button, skeleton, pagination
 * - **容器组件**: card, popover-trigger, tooltip-wrapper, drawer-trigger,
 *   modal-trigger, table, listbox, dropdown, breadcrumbs
 */
export type FieldSchema =
  // 基础输入
  | TextFieldSchema
  | PasswordFieldSchema
  | NumberFieldSchema
  | TextareaFieldSchema
  | SwitchFieldSchema
  | SelectFieldSchema
  // 高级输入
  | CheckboxFieldSchema
  | CheckboxGroupFieldSchema
  | RadioGroupFieldSchema
  | AutocompleteFieldSchema
  | SliderFieldSchema
  | DatePickerFieldSchema
  | DateRangePickerFieldSchema
  | TimeInputFieldSchema
  | ColorPickerFieldSchema
  | ImageUploadFieldSchema
  | FileUploadFieldSchema
  | TagsInputFieldSchema
  | OtpInputFieldSchema
  | RatingFieldSchema
  // 列表类型
  | ListFieldSchema
  | ObjectListFieldSchema
  | KeyValueFieldSchema
  | JsonEditorFieldSchema
  // 布局组件
  | GroupFieldSchema
  | AccordionFieldSchema
  | TabsFieldSchema
  | DividerFieldSchema
  | AlertFieldSchema
  | SpacerFieldSchema
  | ScrollAreaFieldSchema
  // 展示组件
  | ProgressFieldSchema
  | AvatarFieldSchema
  | BadgeFieldSchema
  | ChipFieldSchema
  | SnippetFieldSchema
  | LinkFieldSchema
  | UserCardFieldSchema
  | ImageFieldSchema
  | ButtonFieldSchema
  | SkeletonFieldSchema
  | PaginationFieldSchema
  // 容器组件
  | CardFieldSchema
  | PopoverTriggerFieldSchema
  | TooltipFieldSchema
  | DrawerTriggerFieldSchema
  | ModalTriggerFieldSchema
  | TableFieldSchema
  | ListboxFieldSchema
  | DropdownFieldSchema
  | BreadcrumbsFieldSchema

/**
 * 字段类型字符串字面量
 * @description 所有支持的字段类型名称
 */
export type FieldType = FieldSchema['type']
