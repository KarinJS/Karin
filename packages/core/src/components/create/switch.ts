import type { SwitchProps } from '../types'

/**
 * 创建开关配置
 * @param key 唯一标识符
 * @param config 开关配置（可选）
 */
const createSwitch = (
  key: string,
  config: Partial<Omit<SwitchProps, 'key' | 'componentType'>> = {}
): SwitchProps => ({
  ...config,
  key,
  componentType: 'switch',
})

/**
 * 开关组件
 */
export const switchComponent = {
  /**
   * 创建基础开关
   * @param key 唯一标识符
   * @param options 开关配置
   */
  create: (key: string, options: Omit<SwitchProps, 'key' | 'componentType'> = {}) => createSwitch(key, options),

  /**
   * 自定义开关
   * @param key 唯一标识符
   * @param config 开关配置
   */
  options: (key: string, config: Partial<Omit<SwitchProps, 'key' | 'componentType'>> = {}) => createSwitch(key, {
    startText: '开启',
    endText: '关闭',
    size: 'md',
    color: 'primary',
    isSelected: false,
    defaultSelected: false,
    isReadOnly: false,
    isDisabled: false,
    disableAnimation: false,
    ...config,
  }),
}
