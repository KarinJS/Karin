import type { DefineComponentConfig, DefineConfig, DefinePageConfig } from '@/types'

/**
 * 定义插件 WebUI 配置。
 *
 * `defineConfig` 只做类型约束并原样返回配置对象，运行时不会改写配置。
 * 插件可以选择使用 Karin 内置表单组件渲染配置页，也可以通过 `page`
 * 接入一个由插件自己提供的 Web 页面。自定义页面模式需要自行处理保存逻辑。
 *
 * @typeParam T - 保存配置时 `save(config)` 收到的配置数据类型。不传泛型时默认按普通对象处理。
 * @param config - 插件 WebUI 配置。
 * @returns 原样返回传入的配置对象。
 *
 * @example 内置组件配置
 * ```ts
 * import { defineConfig } from 'node-karin'
 *
 * export default defineConfig<MyConfig>({
 *   info: { id: 'my-plugin', name: '我的插件' },
 *   components: () => [],
 *   save: async (config) => ({ success: true, message: '保存成功' })
 * })
 * ```
 *
 * @example 自定义页面配置
 * ```ts
 * import { defineConfig } from 'node-karin'
 *
 * export default defineConfig({
 *   info: { id: 'my-plugin', name: '我的插件' },
 *   page: {
 *     url: '/my-plugin/',
 *     title: '我的插件配置'
 *   }
 * })
 * ```
 */
/**
 * 定义一个使用插件自定义页面渲染的 WebUI 配置。
 *
 * @param config - 带 `page` 字段的插件 WebUI 配置。
 * @returns 原样返回传入的配置对象。
 */
export function defineConfig (config: DefinePageConfig): DefinePageConfig
/**
 * 定义一个使用 Karin 内置组件渲染的 WebUI 配置。
 *
 * @typeParam T - `save(config)` 的配置数据类型。
 * @param config - 带 `components` 字段的插件 WebUI 配置。
 * @returns 原样返回传入的配置对象。
 */
export function defineConfig<T = Record<string, unknown>> (config: DefineComponentConfig<T>): DefineComponentConfig<T>
export function defineConfig<T = Record<string, unknown>> (
  config: DefineConfig<T>
): DefineConfig<T> {
  return config
}

export type {
  DefineComponentConfig,
  DefineConfig,
  DefinePageConfig,
  WebConfigPage,
  WebConfigPageFactory,
} from '@/types'
