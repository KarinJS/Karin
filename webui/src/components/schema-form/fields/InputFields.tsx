/**
 * 高级输入类字段组件
 */

import React, { useState } from 'react'
import {
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Slider,
  Autocomplete,
  AutocompleteItem,
  Input,
  Button,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@heroui/react'
import { Star } from 'lucide-react'
import { useFormContext } from '../FormContext'
import { resolveI18n } from '../i18n'
import type {
  CheckboxFieldSchema,
  CheckboxGroupFieldSchema,
  RadioGroupFieldSchema,
  AutocompleteFieldSchema,
  SliderFieldSchema,
  ColorPickerFieldSchema,
  TagsInputFieldSchema,
  OtpInputFieldSchema,
  RatingFieldSchema,
  ConditionExpression,
} from '../types'

// Helper: 处理 disabled 可能是布尔值或条件表达式的情况
const getDisabled = (disabled: boolean | ConditionExpression | undefined): boolean => {
  return typeof disabled === 'boolean' ? disabled : false
}

// Checkbox 字段
export const CheckboxField: React.FC<{ schema: CheckboxFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as boolean ?? schema.defaultValue ?? false
  const { color = 'primary', size = 'md' } = schema.options ?? {}

  return (
    <div className="mb-4">
      <Checkbox
        isSelected={value}
        onValueChange={(v) => setValue(schema.key, v)}
        color={color}
        size={size}
        isDisabled={getDisabled(schema.disabled)}
      >
        {resolveI18n(schema.label)}
      </Checkbox>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1 ml-7">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// CheckboxGroup 字段
export const CheckboxGroupField: React.FC<{ schema: CheckboxGroupFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = (getValue(schema.key) as string[]) ?? (schema.defaultValue as string[]) ?? []
  const { items, orientation = 'vertical', color = 'primary' } = schema.options

  return (
    <div className="mb-4">
      <CheckboxGroup
        label={resolveI18n(schema.label)}
        description={schema.description ? resolveI18n(schema.description) : undefined}
        value={value}
        onValueChange={(v) => setValue(schema.key, v)}
        orientation={orientation}
        color={color}
        isDisabled={getDisabled(schema.disabled)}
      >
        {items.map((item) => (
          <Checkbox
            key={String(item.value)}
            value={String(item.value)}
            isDisabled={item.disabled}
          >
            {resolveI18n(item.label)}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  )
}

// RadioGroup 字段
export const RadioGroupField: React.FC<{ schema: RadioGroupFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as string ?? schema.defaultValue ?? ''
  const { items, orientation = 'vertical', color = 'primary' } = schema.options

  return (
    <div className="mb-4">
      <RadioGroup
        label={resolveI18n(schema.label)}
        description={schema.description ? resolveI18n(schema.description) : undefined}
        value={value}
        onValueChange={(v) => setValue(schema.key, v)}
        orientation={orientation}
        color={color}
        isDisabled={getDisabled(schema.disabled)}
      >
        {items.map((item) => (
          <Radio
            key={String(item.value)}
            value={String(item.value)}
            isDisabled={item.disabled}
            description={item.description ? resolveI18n(item.description) : undefined}
          >
            {resolveI18n(item.label)}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}

// Autocomplete 字段
export const AutocompleteField: React.FC<{ schema: AutocompleteFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as string ?? schema.defaultValue ?? ''
  const { items, allowCustomValue = false } = schema.options

  return (
    <div className="mb-4">
      <Autocomplete
        label={resolveI18n(schema.label)}
        description={schema.description ? resolveI18n(schema.description) : undefined}
        placeholder={schema.placeholder ? resolveI18n(schema.placeholder) : undefined}
        selectedKey={value}
        onSelectionChange={(key) => setValue(schema.key, key as string)}
        allowsCustomValue={allowCustomValue}
        isDisabled={getDisabled(schema.disabled)}
        isRequired={schema.required}
        inputProps={{
          autoComplete: 'off',
          autoCorrect: 'off',
          spellCheck: 'false',
        }}
      >
        {items.map((item) => (
          <AutocompleteItem
            key={String(item.value)}
            description={item.description ? resolveI18n(item.description) : undefined}
          >
            {resolveI18n(item.label)}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  )
}

// Slider 字段
export const SliderField: React.FC<{ schema: SliderFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as number ?? schema.defaultValue ?? 0
  const {
    min = 0,
    max = 100,
    step = 1,
    showSteps = false,
    showValue = true,
    color = 'primary',
    marks,
  } = schema.options ?? {}

  return (
    <div className="mb-4">
      <Slider
        label={resolveI18n(schema.label)}
        value={value}
        onChange={(v) => setValue(schema.key, Array.isArray(v) ? v[0] : v)}
        minValue={min}
        maxValue={max}
        step={step}
        showSteps={showSteps}
        color={color as 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'foreground'}
        isDisabled={getDisabled(schema.disabled)}
        marks={marks}
        className="max-w-md"
        renderValue={showValue ? ({ children }) => (
          <output className="text-small font-medium text-default-500 ml-2">
            {children}
          </output>
        ) : undefined}
      />
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// 预设颜色
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#000000', '#71717a', '#ffffff',
]

// ColorPicker 字段
export const ColorPickerField: React.FC<{ schema: ColorPickerFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as string ?? schema.defaultValue ?? '#3b82f6'
  const { presetColors = PRESET_COLORS } = schema.options ?? {}

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-default-700 mb-2">
        {resolveI18n(schema.label)}
      </label>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            variant="flat"
            className="min-w-35 justify-start gap-2"
            isDisabled={getDisabled(schema.disabled)}
          >
            <div
              className="w-5 h-5 rounded border border-default-300"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3">
          <div className="grid grid-cols-5 gap-1 mb-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${value === color ? 'border-primary' : 'border-transparent'
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => setValue(schema.key, color)}
              />
            ))}
          </div>
          <Input
            type="text"
            size="sm"
            value={value}
            onChange={(e) => setValue(schema.key, e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            startContent={
              <input
                type="color"
                value={value}
                onChange={(e) => setValue(schema.key, e.target.value)}
                className="w-5 h-5 cursor-pointer bg-transparent border-0 p-0"
              />
            }
            className="w-full"
          />
        </PopoverContent>
      </Popover>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// TagsInput 字段
export const TagsInputField: React.FC<{ schema: TagsInputFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = (getValue(schema.key) as string[]) ?? (schema.defaultValue as string[]) ?? []
  const [inputValue, setInputValue] = useState('')
  const {
    maxTags,
    allowDuplicates = false,
    color = 'primary',
    size = 'md',
    placeholder,
  } = schema.options ?? {}

  const addTag = () => {
    if (!inputValue.trim()) return
    if (!allowDuplicates && value.includes(inputValue.trim())) return
    if (maxTags && value.length >= maxTags) return

    setValue(schema.key, [...value, inputValue.trim()])
    setInputValue('')
  }

  const removeTag = (index: number) => {
    setValue(schema.key, value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-default-700 mb-2">
        {resolveI18n(schema.label)}
      </label>
      <div className="flex flex-wrap gap-2 p-2 border border-default-200 rounded-lg min-h-10.5">
        {value.map((tag, index) => (
          <Chip
            key={`${tag}-${index}`}
            onClose={() => removeTag(index)}
            variant="flat"
            color={color}
            size={size}
          >
            {tag}
          </Chip>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder ? resolveI18n(placeholder) : '输入后按回车添加'}
          disabled={getDisabled(schema.disabled) || (maxTags !== undefined && value.length >= maxTags)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="flex-1 min-w-30 bg-transparent border-0 outline-none text-sm"
        />
      </div>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// OtpInput 字段
export const OtpInputField: React.FC<{ schema: OtpInputFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as string ?? schema.defaultValue ?? ''
  const { length = 6, type = 'number', size = 'md' } = schema.options ?? {}

  const handleChange = (index: number, char: string) => {
    const chars = value.split('')
    chars[index] = char
    const newValue = chars.join('').slice(0, length)
    setValue(schema.key, newValue)

    // 自动聚焦下一个
    if (char && index < length - 1) {
      const nextInput = document.getElementById(`${schema.key}-otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-default-700 mb-2">
        {resolveI18n(schema.label)}
      </label>
      <div className="flex gap-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            id={`${schema.key}-otp-${index}`}
            type={type === 'number' ? 'tel' : 'text'}
            inputMode={type === 'number' ? 'numeric' : 'text'}
            maxLength={1}
            value={value[index] ?? ''}
            onChange={(e) => handleChange(index, e.target.value)}
            disabled={getDisabled(schema.disabled)}
            autoComplete="one-time-code"
            className={`${sizeClasses[size]} text-center border border-default-300 rounded-lg focus:border-primary focus:outline-none bg-default-100`}
          />
        ))}
      </div>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Rating 字段
export const RatingField: React.FC<{ schema: RatingFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key) as number ?? schema.defaultValue ?? 0
  const {
    max = 5,
    size = 'md',
    color = 'warning',
    allowHalf = false,
    readonly = false,
  } = schema.options ?? {}

  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeMap = { sm: 16, md: 24, lg: 32 }
  const iconSize = sizeMap[size]

  const colorMap: Record<string, string> = {
    default: 'text-default-400',
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }

  const activeColor = colorMap[color] ?? 'text-warning'

  const handleClick = (index: number, isHalf: boolean) => {
    if (readonly || schema.disabled) return
    const newValue = allowHalf && isHalf ? index + 0.5 : index + 1
    setValue(schema.key, newValue)
  }

  const displayValue = hoverValue ?? value

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-default-700 mb-2">
        {resolveI18n(schema.label)}
      </label>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverValue(null)}
      >
        {Array.from({ length: max }).map((_, index) => {
          const filled = displayValue > index
          const halfFilled = allowHalf && displayValue === index + 0.5

          return (
            <button
              key={index}
              type="button"
              className={`relative ${readonly || schema.disabled ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110`}
              onMouseEnter={() => !readonly && !schema.disabled && setHoverValue(index + 1)}
              onClick={() => handleClick(index, false)}
            >
              <Star
                size={iconSize}
                className={filled || halfFilled ? activeColor : 'text-default-300'}
                fill={filled ? 'currentColor' : halfFilled ? 'url(#half)' : 'none'}
              />
            </button>
          )
        })}
        <span className="ml-2 text-sm text-default-500">{value}/{max}</span>
      </div>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}
