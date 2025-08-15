import { ComponentProps } from './base'

export interface SelectItemProps extends ComponentProps {
  componentType: 'select-item'
  label: string
  value: string | number
  isDisabled?: boolean
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
  items: SelectItemProps[]
  value?: string | string[]
  defaultValue?: string | string[]
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
  disableAnimation?: boolean
}
