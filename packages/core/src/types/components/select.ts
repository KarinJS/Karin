import { ComponentProps } from './base'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps extends ComponentProps {
  componentType: 'select'
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  name?: string
  multiple?: boolean
  options: SelectOption[]
  value?: string | string[]
  defaultValue?: string | string[]
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
  disableAnimation?: boolean
}
