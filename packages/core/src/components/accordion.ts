import { Children } from '@/types/components/joint'
import type { AccordionItemProps, AccordionProps, AccordionProProps } from '@/types/components'

/**
 * 创建手风琴配置
 * @param key 唯一标识符
 * @param config 手风琴配置（可选）
 */
const createAccordion = (
  key: string,
  config: Partial<Omit<AccordionProps, 'key' | 'componentType'>> = {}
): AccordionProps => ({
  key,
  ...config,
  componentType: 'accordion',
})

/**
 * 创建手风琴Pro配置
 * @param key 唯一标识符
 * @param config 手风琴Pro配置（可选）
 */
const createAccordionPro = (
  key: string,
  config: Partial<Omit<AccordionProProps, 'key' | 'componentType'>> = {}
): AccordionProProps => ({
  ...config,
  key,
  componentType: 'accordion-pro',
  data: config.data || [],
  children: config.children!,
})

/**
 * 创建手风琴子项配置
 * @param key 唯一标识符
 * @param config 手风琴子项配置（可选）
 */
const createAccordionItem = (
  key: string,
  config: Partial<Omit<AccordionItemProps, 'key' | 'componentType'>> = {}
): AccordionItemProps => ({
  key,
  ...config,
  componentType: 'accordion-item',
  children: config.children || [],
})

/**
 * 手风琴组件
 */
export const accordion = {
  /**
   * 创建基础手风琴组件
   * @param key 唯一标识符
   * @param options 手风琴配置
   */
  create: (
    key: string,
    options?: Omit<AccordionProps, 'key' | 'componentType'>
  ) => createAccordion(key, options),

  /**
   * 创建默认配置的手风琴组件
   * @param key 唯一标识符
   */
  default: (key: string) => createAccordion(key, {
    title: '折叠面板',
    variant: 'bordered',
    selectionMode: 'single',
    selectionBehavior: 'toggle',
    showDivider: true,
    fullWidth: true,
  }),

  /**
   * 创建手风琴子项
   * @param key 唯一标识符
   * @param options 手风琴子项配置
   */
  createItem: (
    key: string,
    options?: Omit<AccordionItemProps, 'key' | 'componentType'>
  ) => createAccordionItem(key, options),
}

/**
 * 手风琴Pro组件
 */
export const accordionPro = {
  /**
   * 创建基础手风琴Pro组件
   * @param key 唯一标识符
   * @param data 渲染数据
   * @param options 手风琴Pro配置
   */
  create: (
    key: string,
    data: Record<string, any>[],
    options?: Omit<AccordionProProps, 'key' | 'componentType' | 'data'>
  ) => createAccordionPro(key, {
    ...options,
    data,
  }),
}

/**
 * 手风琴子项组件
 */
export const accordionItem = {
  /**
   * 创建手风琴子项
   * @param key 唯一标识符
   * @param options 手风琴子项配置
   */
  create: (
    key: string,
    options?: Omit<AccordionItemProps, 'key' | 'componentType'>
  ) => createAccordionItem(key, options),

  /**
   * 创建默认配置的手风琴子项
   * @param key 唯一标识符
   * @param title 标题
   * @param children 子组件
   */
  default: (key: string, title: string, children?: Children[]) => createAccordionItem(key, {
    title,
    children,
    isCompact: false,
    hideIndicator: false,
    disableAnimation: false,
    disableIndicatorAnimation: false,
  }),
}
