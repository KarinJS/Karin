import { Component } from './base'
import { ComponentType } from '@/types/components'
import type { AccordionItemProps, AccordionProps } from '@/types/components'
import { input } from './input'
import { divider } from './divider'
import { ComponentsClass } from './all'

class Accordion extends Component<AccordionProps> {
  _config: AccordionProps = { key: '', componentType: ComponentType.ACCORDION }

  constructor (key: string) {
    super(ComponentType.ACCORDION)
    this._config.key = key
  }

  /**
   * 设置标题
   * @param title - 标题文本
   */
  title = (title: string) => {
    this._config.title = title
    return this
  }

  /**
   * 设置子组件
   * @param children - 子组件数组
   */
  children = (children: AccordionItem[]) => {
    const childrens: AccordionItemProps[] = []
    for (const child of children) {
      childrens.push(child.toJSON())
    }
    this._config.children = childrens
    return this
  }

  /**
   * 设置样式变体
   * @param variant - 样式类型
   */
  variant = (variant: AccordionProps['variant']) => {
    this._config.variant = variant
    return this
  }

  /**
   * 设置选择模式
   * @param mode - 选择模式
   * - none: 无
   * - single: 单选
   * - multiple: 多选
   */
  selectionMode = (mode: AccordionProps['selectionMode']) => {
    this._config.selectionMode = mode
    return this
  }

  /**
   * 设置选择行为
   * @param behavior - 选择行为
   * - toggle: 切换
   * - replace: 替换
   */
  selectionBehavior = (behavior: AccordionProps['selectionBehavior']) => {
    this._config.selectionBehavior = behavior
    return this
  }

  /**
   * 设置是否紧凑模式
   * @param isCompact - 是否紧凑
   */
  compact = (isCompact: boolean = true) => {
    this._config.isCompact = isCompact
    return this
  }

  /**
   * 设置是否禁用
   * @param isDisabled - 是否禁用
   */
  disabled = (isDisabled: boolean = true) => {
    this._config.isDisabled = isDisabled
    return this
  }

  /**
   * 设置是否显示分隔线
   * @param show - 是否显示
   */
  showDivider = (show: boolean = true) => {
    this._config.showDivider = show
    return this
  }

  /**
   * 设置是否隐藏指示器
   * @param hide - 是否隐藏
   */
  hideIndicator = (hide: boolean = true) => {
    this._config.hideIndicator = hide
    return this
  }

  /**
   * 设置是否禁用动画
   * @param disable - 是否禁用
   */
  disableAnimation = (disable: boolean = true) => {
    this._config.disableAnimation = disable
    return this
  }

  /**
   * 设置是否禁用指示器动画
   * @param disable - 是否禁用
   */
  disableIndicatorAnimation = (disable: boolean = true) => {
    this._config.disableIndicatorAnimation = disable
    return this
  }

  /**
   * 设置是否不允许空选择
   * @param disallow - 是否不允许
   */
  disallowEmptySelection = (disallow: boolean = true) => {
    this._config.disallowEmptySelection = disallow
    return this
  }

  /**
   * 设置是否保持内容挂载
   * @param keep - 是否保持
   */
  keepContentMounted = (keep: boolean = true) => {
    this._config.keepContentMounted = keep
    return this
  }

  /**
   * 设置是否全宽
   * @param full - 是否全宽
   */
  fullWidth = (full: boolean = true) => {
    this._config.fullWidth = full
    return this
  }

  /**
   * 设置禁用的键
   * @param keys - 禁用的键数组
   */
  disabledKeys = (keys: string[]) => {
    this._config.disabledKeys = keys
    return this
  }

  /**
   * 设置选中项
   * @param keys - 选中的键数组
   */
  selectedKeys = (keys: string[]) => {
    this._config.selectedKeys = keys
    return this
  }

  /**
   * 设置默认选中项
   * @param keys - 默认选中的键数组
   */
  defaultSelectedKeys = (keys: string[]) => {
    this._config.defaultSelectedKeys = keys
    return this
  }

  /**
   * 自定义配置
   * @param options - 配置选项
   */
  options = (options: AccordionProps) => {
    this._config = { ...this._config, ...options }
    return this
  }

  /**
   * 转换为JSON对象
   * @description 手风琴比较特殊 需要子组件也进行转换
   */
  toJSON = (): AccordionProps => {
    if (!this._config.children) this._config.children = []

    return this._config
  }
}

/**
 * 手风琴子组件
 */
export class AccordionItem extends Component<AccordionItemProps> {
  _config: AccordionItemProps = { key: '', componentType: ComponentType.ACCORDION_ITEM }

  constructor (key: string) {
    super(ComponentType.ACCORDION_ITEM)
    this._config.key = key
  }

  /**
   * 设置子组件
   * @param children - 子组件数组
   */
  children = (children: ComponentsClass | ComponentsClass[]) => {
    if (!Array.isArray(children)) children = [children]
    this._config.children = children.map(child => child?.toJSON())
    /** 排除空的 */
    this._config.children = this._config.children.filter(Boolean)
    return this
  }

  /**
   * 设置标题
   * @param title - 标题文本
   */
  title = (title: string) => {
    this._config.title = title
    return this
  }

  /**
   * 设置副标题
   * @param subtitle - 副标题文本
   */
  subtitle = (subtitle: string) => {
    this._config.subtitle = subtitle
    return this
  }

  /**
   * 设置是否显示指示器
   * @param hide - 是否隐藏
   */
  hideIndicator = (hide: boolean = true) => {
    this._config.hideIndicator = hide
    return this
  }

  // /**
  //  * 设置开始内容
  //  * @param content - 开始内容组件
  //  */
  // startContent = (content: Component) => {
  //   this.config.startContent = content
  //   return this
  // }

  // /**
  //  * 设置结束内容
  //  * @param content - 结束内容组件
  //  */
  // endContent = (content: Component) => {
  //   this.config.endContent = content
  //   return this
  // }

  /**
   * 设置是否紧凑模式
   * @param isCompact - 是否紧凑
   */
  compact = (isCompact: boolean = true) => {
    this._config.isCompact = isCompact
    return this
  }

  /**
   * 设置是否禁用
   * @param isDisabled - 是否禁用
   */
  disabled = (isDisabled: boolean = true) => {
    this._config.isDisabled = isDisabled
    return this
  }

  /**
   * 设置是否保持内容挂载
   * @param keep - 是否保持
   */
  keepContentMounted = (keep: boolean = true) => {
    this._config.keepContentMounted = keep
    return this
  }

  /**
   * 设置是否禁用动画
   * @param disable - 是否禁用
   */
  disableAnimation = (disable: boolean = true) => {
    this._config.disableAnimation = disable
    return this
  }

  /**
   * 设置是否禁用指示器动画
   * @param disable - 是否禁用
   */
  disableIndicatorAnimation = (disable: boolean = true) => {
    this._config.disableIndicatorAnimation = disable
    return this
  }

  // /**
  //  * 设置标题组件
  //  * @param component - 标题组件
  //  */
  // headingComponent = (component: string) => {
  //   this.config.headingComponent = component
  //   return this
  // }

  /**
   * 自定义配置
   * @param options - 配置选项
   */
  options = (options: AccordionItemProps) => {
    this._config = { ...this._config, ...options }
    return this
  }

  /**
   * 转换为JSON对象
   * @description 手风琴比较特殊 需要子组件也进行转换
   */
  toJSON = (): AccordionItemProps => {
    return this._config
  }
}

/**
 * 手风琴组件构建器
 */
export const accordion = {
  /**
   * 创建基础手风琴组件
   * @param key - 唯一标识符
   */
  create: (key: string) => new Accordion(key),

  /**
   * 创建默认配置的手风琴组件
   * @param key - 唯一标识符
   */
  default: (key: string) => {
    return new Accordion(key)
      .title('折叠面板')
      .variant('bordered')
      .selectionMode('single')
      .selectionBehavior('toggle')
      .showDivider()
      .fullWidth()
  },

  /**
   * 使用自定义配置创建手风琴组件
   * @param key - 唯一标识符
   * @param options - 配置选项
   */
  options: (key: string, options: AccordionProps) => new Accordion(key).options(options),

  /**
   * 创建手风琴子项
   * @param key - 唯一标识符
   */
  createItem: (key: string) => new AccordionItem(key)
}

console.log(
  accordion
    .default('accordion')
    .children(
      [
        accordion
          .createItem('item1')
          .title('数字输入框')
          .children([input.number('number')]),
        accordion
          .createItem('item2')
          .title('邮箱输入框')
          .children([input.email('email')])
      ]
    )
    .toJSON()
)

/**
 * 手风琴比较特殊 用法一
 * @description 用法详解:
 * - 这里定义了一个组件基类，通过循环渲染数据来在手风琴卡片组中渲染组件
 * - 右上角带添加按钮 点击添加之后会添加一个新的空数据子项手风琴
 * - 每一项手风琴展开之后可以进行编辑、删除
 * - 每一项手风琴都有一个标题 标题可以自定义在渲染数据中 如果不传，则会使用组件key+index
 */
export const test = {
  /** 标题 */
  title: '这是一个手风琴卡片组',
  /** 需要渲染的数据 */
  data: [
    {
      gmail: '123@123.com',
      number: 123
    }
  ],
  /** 组件 */
  component: [
    input.email('email'),
    divider,
    input.number('number'),
  ]
}
