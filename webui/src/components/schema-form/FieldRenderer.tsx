import type { FieldSchema } from './types'
import {
  TextField,
  PasswordField,
  NumberField,
  TextareaField,
  SwitchField,
  SelectField,
} from './fields/BasicFields'
import {
  ListField,
  ObjectListField,
} from './fields/ListFields'
import {
  AccordionField,
  TabsField,
  DividerField,
  AlertField,
  GroupField,
} from './fields/LayoutFields'
import {
  CheckboxField,
  CheckboxGroupField,
  RadioGroupField,
  AutocompleteField,
  SliderField,
  ColorPickerField,
  TagsInputField,
  OtpInputField,
  RatingField,
} from './fields/InputFields'
import {
  ProgressField,
  AvatarField,
  ChipField,
  LinkField,
  UserCardField,
  SnippetField,
  ImageField,
  ButtonField,
  SpacerField,
  SkeletonField,
} from './fields/DisplayFields'
import {
  CardField,
  PopoverTriggerField,
  TooltipWrapperField,
  ModalTriggerField,
  DrawerTriggerField,
  ScrollAreaField,
  ListboxField,
  DropdownField,
  BreadcrumbsField,
  PaginationField,
  TableField,
} from './fields/ContainerFields'

interface FieldRendererProps {
  schema: FieldSchema
}

export function FieldRenderer ({ schema }: FieldRendererProps) {
  // 检查 hidden 条件（简化版，只支持布尔值）
  if (schema.hidden === true) {
    return null
  }

  switch (schema.type) {
    // === 基础输入 ===
    case 'text':
      return <TextField schema={schema} />

    case 'password':
      return <PasswordField schema={schema} />

    case 'number':
      return <NumberField schema={schema} />

    case 'textarea':
      return <TextareaField schema={schema} />

    case 'switch':
      return <SwitchField schema={schema} />

    case 'select':
      return <SelectField schema={schema} />

    // === 列表类 ===
    case 'list':
      return <ListField schema={schema} />

    case 'object-list':
      return <ObjectListField schema={schema} />

    // === 高级输入 ===
    case 'checkbox':
      return <CheckboxField schema={schema} />

    case 'checkbox-group':
      return <CheckboxGroupField schema={schema} />

    case 'radio-group':
      return <RadioGroupField schema={schema} />

    case 'autocomplete':
      return <AutocompleteField schema={schema} />

    case 'slider':
      return <SliderField schema={schema} />

    case 'color-picker':
      return <ColorPickerField schema={schema} />

    case 'tags-input':
      return <TagsInputField schema={schema} />

    case 'otp-input':
      return <OtpInputField schema={schema} />

    case 'rating':
      return <RatingField schema={schema} />

    // === 展示类 ===
    case 'progress':
      return <ProgressField schema={schema} />

    case 'avatar':
      return <AvatarField schema={schema} />

    case 'chip':
      return <ChipField schema={schema} />

    case 'link':
      return <LinkField schema={schema} />

    case 'user-card':
      return <UserCardField schema={schema} />

    case 'snippet':
      return <SnippetField schema={schema} />

    case 'image':
      return <ImageField schema={schema} />

    case 'button':
      return <ButtonField schema={schema} />

    case 'spacer':
      return <SpacerField schema={schema} />

    case 'skeleton':
      return <SkeletonField schema={schema} />

    // === 布局类 ===
    case 'accordion':
      return <AccordionField schema={schema} />

    case 'tabs':
      return <TabsField schema={schema} />

    case 'divider':
      return <DividerField schema={schema} />

    case 'alert':
      return <AlertField schema={schema} />

    case 'group':
      return <GroupField schema={schema} />

    // === 容器类 ===
    case 'card':
      return <CardField schema={schema} />

    case 'popover-trigger':
      return <PopoverTriggerField schema={schema} />

    case 'tooltip-wrapper':
      return <TooltipWrapperField schema={schema} />

    case 'modal-trigger':
      return <ModalTriggerField schema={schema} />

    case 'drawer-trigger':
      return <DrawerTriggerField schema={schema} />

    case 'scroll-area':
      return <ScrollAreaField schema={schema} />

    case 'listbox':
      return <ListboxField schema={schema} />

    case 'dropdown':
      return <DropdownField schema={schema} />

    case 'breadcrumbs':
      return <BreadcrumbsField schema={schema} />

    case 'pagination':
      return <PaginationField schema={schema} />

    case 'table':
      return <TableField schema={schema} />

    default:
      console.warn(`Unknown field type: ${(schema as FieldSchema).type}`)
      return (
        <div className="p-4 bg-danger-50 text-danger rounded-lg">
          未知字段类型: {(schema as FieldSchema).type}
        </div>
      )
  }
}
