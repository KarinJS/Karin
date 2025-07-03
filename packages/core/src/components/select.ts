import type { SelectItemProps, SelectProps } from '@/types/components'

const createItem = (
  key: string,
  config: Partial<Omit<SelectItemProps, 'key' | 'componentType'>> = {}
): SelectItemProps => ({
  ...config,
  key,
  componentType: 'select-item',
})

const createSelect = (
  key: string,
  config: Partial<Omit<SelectProps, 'key' | 'componentType'>> = {}
): SelectProps => ({
  ...config,
  key,
  componentType: 'select',
  items: config.items || [],
})

export const select = {
  item: (
    key: string,
    options: Omit<SelectItemProps, 'key' | 'componentType'>
  ) => createItem(key, options),

  create: (
    key: string,
    options: Omit<SelectProps, 'key' | 'componentType'>
  ) => createSelect(key, options),

  default: (
    key: string,
    config: Partial<Omit<SelectProps, 'key' | 'componentType'>> = {}
  ) => createSelect(key, { items: [], ...config }),

  required: (
    key: string,
    config: Partial<Omit<SelectItemProps, 'key' | 'componentType'>> = {}
  ) => createItem(key, { ...config, isRequired: true }),

  disabled: (
    key: string,
    config: Partial<Omit<SelectItemProps, 'key' | 'componentType'>> = {}
  ) => createItem(key, { ...config, isDisabled: true }),

  readonly: (
    key: string,
    config: Partial<Omit<SelectItemProps, 'key' | 'componentType'>> = {}
  ) => createItem(key, { ...config, isReadOnly: true }),

  invalid: (
    key: string,
    config: Partial<Omit<SelectItemProps, 'key' | 'componentType'>> = {}
  ) => createItem(key, { ...config, isInvalid: true }),
}
