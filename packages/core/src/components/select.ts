import type { SelectProps } from '@/types/components'

const createSelect = (
  key: string,
  config: Partial<Omit<SelectProps, 'key' | 'componentType'>> = {}
): SelectProps => ({
  ...config,
  key,
  componentType: 'select',
  options: config.options || []
})

export const select = {
  create: (key: string, options: Omit<SelectProps, 'key' | 'componentType'>) => createSelect(key, options),
  default: (key: string, config: Partial<Omit<SelectProps, 'key' | 'componentType'>> = {}) => createSelect(key, {
    options: [],
    ...config,
  })
}
