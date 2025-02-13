import { Divider as HeroDivider } from '@heroui/divider'
import type { JSX } from 'react'
import type { DividerProps } from 'node-karin'

/**
 * 渲染分割线组件
 * @param props - 输入框属性
 * @returns 渲染后的输入框组件
 */
export const Divider = (props: DividerProps): JSX.Element => {
  const { componentType: _, key, className, ...options } = props
  return <HeroDivider key={key} {...options} />
}


