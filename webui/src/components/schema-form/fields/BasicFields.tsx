import { useState } from 'react'
import { Input, Textarea, Switch, Select, SelectItem, Tooltip } from '@heroui/react'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useField } from '../FormContext'
import { useI18nString } from '../i18n'
import { Icon } from '../Icon'
import type {
  TextFieldSchema,
  PasswordFieldSchema,
  NumberFieldSchema,
  TextareaFieldSchema,
  SwitchFieldSchema,
  SelectFieldSchema,
  SelectItem as SelectItemType,
} from '../types'

// ============================================
// 文本输入
// ============================================

export function TextField ({ schema }: { schema: TextFieldSchema }) {
  const { value, error, onChange, onBlur } = useField(schema.key)
  const t = useI18nString()

  return (
    <Input
      label={t(schema.label)}
      description={t(schema.description)}
      placeholder={t(schema.placeholder)}
      value={(value as string) || ''}
      onValueChange={onChange}
      onBlur={onBlur}
      isInvalid={!!error}
      errorMessage={error}
      isRequired={schema.required}
      isDisabled={schema.disabled === true}
      maxLength={schema.options?.maxLength}
      isClearable={schema.options?.clearable}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      startContent={schema.prefixIcon && <Icon name={schema.prefixIcon} size={18} className="text-default-400" />}
      endContent={
        schema.tooltip && (
          <Tooltip content={t(schema.tooltip)}>
            <HelpCircle size={16} className="text-default-400 cursor-help" />
          </Tooltip>
        )
      }
    />
  )
}

// ============================================
// 密码输入
// ============================================

export function PasswordField ({ schema }: { schema: PasswordFieldSchema }) {
  const { value, error, onChange, onBlur } = useField(schema.key)
  const t = useI18nString()
  const [showPassword, setShowPassword] = useState(false)
  const showToggle = schema.options?.showToggle !== false

  return (
    <Input
      label={t(schema.label)}
      description={t(schema.description)}
      placeholder={t(schema.placeholder)}
      type={showPassword ? 'text' : 'password'}
      value={(value as string) || ''}
      onValueChange={onChange}
      onBlur={onBlur}
      isInvalid={!!error}
      errorMessage={error}
      isRequired={schema.required}
      isDisabled={schema.disabled === true}
      maxLength={schema.options?.maxLength}
      autoComplete="new-password"
      autoCorrect="off"
      spellCheck="false"
      startContent={schema.prefixIcon && <Icon name={schema.prefixIcon} size={18} className="text-default-400" />}
      endContent={
        showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-default-400 hover:text-default-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )
      }
    />
  )
}

// ============================================
// 数字输入
// ============================================

export function NumberField ({ schema }: { schema: NumberFieldSchema }) {
  const { value, error, onChange, onBlur } = useField(schema.key)
  const t = useI18nString()

  return (
    <Input
      label={t(schema.label)}
      description={t(schema.description)}
      placeholder={t(schema.placeholder)}
      type="number"
      value={value !== undefined && value !== null ? String(value) : ''}
      onValueChange={(v) => onChange(v === '' ? undefined : Number(v))}
      onBlur={onBlur}
      isInvalid={!!error}
      errorMessage={error}
      isRequired={schema.required}
      isDisabled={schema.disabled === true}
      min={schema.options?.min}
      max={schema.options?.max}
      step={schema.options?.step}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      startContent={schema.prefixIcon && <Icon name={schema.prefixIcon} size={18} className="text-default-400" />}
      endContent={
        schema.tooltip && (
          <Tooltip content={t(schema.tooltip)}>
            <HelpCircle size={16} className="text-default-400 cursor-help" />
          </Tooltip>
        )
      }
    />
  )
}

// ============================================
// 多行文本
// ============================================

export function TextareaField ({ schema }: { schema: TextareaFieldSchema }) {
  const { value, error, onChange, onBlur } = useField(schema.key)
  const t = useI18nString()

  return (
    <Textarea
      label={t(schema.label)}
      description={t(schema.description)}
      placeholder={t(schema.placeholder)}
      value={(value as string) || ''}
      onValueChange={onChange}
      onBlur={onBlur}
      isInvalid={!!error}
      errorMessage={error}
      isRequired={schema.required}
      isDisabled={schema.disabled === true}
      maxLength={schema.options?.maxLength}
      minRows={schema.options?.rows || 3}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
    />
  )
}

// ============================================
// 开关
// ============================================

export function SwitchField ({ schema }: { schema: SwitchFieldSchema }) {
  const { value, onChange } = useField(schema.key)
  const t = useI18nString()

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-default-50">
      <div className="flex items-center gap-2">
        <span className="font-medium">{t(schema.label)}</span>
        {schema.tooltip && (
          <Tooltip content={t(schema.tooltip)}>
            <HelpCircle size={14} className="text-default-400 cursor-help" />
          </Tooltip>
        )}
        {schema.description && (
          <span className="text-sm text-default-500">{t(schema.description)}</span>
        )}
      </div>
      <Switch
        isSelected={Boolean(value)}
        onValueChange={onChange}
        color={schema.options?.color || 'primary'}
        isDisabled={schema.disabled === true}
      />
    </div>
  )
}

// ============================================
// 下拉选择
// ============================================

export function SelectField ({ schema }: { schema: SelectFieldSchema }) {
  const { value, error, onChange, onBlur } = useField(schema.key)
  const t = useI18nString()

  const selectedKeys = value !== undefined && value !== null
    ? new Set([String(value)])
    : new Set<string>()

  return (
    <Select
      label={t(schema.label)}
      description={t(schema.description)}
      placeholder={t(schema.placeholder)}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0]
        const item = schema.options.items.find((i: SelectItemType) => String(i.value) === selected)
        onChange(item?.value)
      }}
      onBlur={onBlur}
      isInvalid={!!error}
      errorMessage={error}
      isRequired={schema.required}
      isDisabled={schema.disabled === true}
    >
      {schema.options.items.map((item: SelectItemType) => (
        <SelectItem
          key={String(item.value)}
          description={item.description ? t(item.description) : undefined}
          isDisabled={item.disabled}
          startContent={item.icon && <Icon name={item.icon} size={16} />}
        >
          {t(item.label)}
        </SelectItem>
      ))}
    </Select>
  )
}
