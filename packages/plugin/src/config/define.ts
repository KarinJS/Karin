import type { ComponentConfig } from '@karinjs/components'
import type { PluginMeta, WebConfigSaveResponse } from './types'

/**
 * karin.config.mjs环境变量配置
 * @example
 * ```ts
 * {
 *   "KEY": {
 *     "value": "value",
 *     "comment": "这是一个注释"
 *   }
 * }
 * ```
 */
export type PackageEnv = Record<string, {
  /** 变量值 */
  value: string
  /** 变量注释 */
  comment: string
}>

/**
 * karin.config.ts 配置类型
 */
export interface DefineConfig {
  /**
   * 插件包元信息
   */
  meta?: PluginMeta & {
    /**
     * 插件主页
     * @description 如果提供则前端会显示一个跳转按钮
     * @example
     * ```json
     * "home": "https://example.com"
     * ```
     */
    home?: string
  }
  /**
   * 插件入口
   * @description 支持文件、目录、环境的多维度入口配置
   * - 详情可参考下面的示例或者点击下方的链接查看文档
   * - docs: {@link https://karinjs.com/guide/plugins/entry}
   * @example
   * ```json
   * {
   *   // 指定单个app入口文件、目录
   *   "entry": "src/apps",
   *   "entry": "src/apps/index.ts",
   *   // 指定多个入口文件、目录
   *   "entry": [
   *     "src/apps",
   *     "src/app-a/index.ts"
   *   ],
   *  // 根据环境加载入口文件
   *  "entry": {
   *    "type": "dev", // 开发环境
   *    // path 同样支持的单个、多个路径
   *    "path": "src/index.ts",
   *    "path": [
   *     "src/apps",
   *     "src/app-a/index.ts"
   *   ]
   *  },
   *  "entry": {
   *   "type": "prod", // 生产环境
   *   "path": "src/index.ts",
   *   "path": [
   *     "src/apps",
   *     "src/app-a/index.ts"
   *   ]
   *  }
   * ```
   */
  entry?: string | string[] | {
    /**
     * 插件入口类型
     * @description 根据环境加载
     * - dev: 开发环境
     * - prod: 生产环境
     */
    type: 'dev' | 'prod',
    /**
     * @description 文件路径
     * @example
     * ```json
     * {
     *   "type": "dev", // 开发环境
     *   "path": "src/index.ts"
     * } // 指定单个
     *
     * {
     *   "type": "prod", // 生产环境
     *   "path": ["src/index.ts", "src/another.ts"]
     * } // 指定多个
     * ```
     */
    path: string | string[]
  }[]
  /** 插件静态资源目录列表
   * @description 在此目录下的资源会被作为静态资源提供给 webui 访问
   * @example
   * ```json
   * {
   *   "public": "./public",
   *   "public": [
   *     "./dist/public",
   *     "./public"
   *   ]
   * }
   * // 访问路径为 /[插件包名]/[文件路径]
   * // 例如插件包名为 karin-plugin-example
   * // public 目录下有一个 index.html 文件
   * // 则访问路径为 /karin-plugin-example/index.html
   * // public/index.html => http://127.0.0.1:7777/karin-plugin-example/index.html
   * ```
   */
  public?: string | string[]
  /**
   * 需要在 /@karinjs/[插件包名] 创建的文件夹
   * @description 会在插件初始化之前创建
   * @default ['config','data']
   * @since 在2.0中，将去除 `resource` `resources` 默认值
   * @example
   * ```json
   * {
   *   "files": [
   *     "data",
   *     "logs"
   *   ]
   * }
   * ```
   */
  files?: string[]
  /**
   * 插件环境变量
   * @description 会注入到 process.env 和 .env 文件中
   * @example
   * ```json
   * {
   *   "MY_ENV": "value",
   *   "ANOTHER_ENV": {
   *     "value": "another_value",
   *     "comment": "这是另一个环境变量"
   *   }
   * }
   * ```
   */
  env?: Record<string, string> | PackageEnv
  /** webui相关配置 */
  components?: {
    /**
     * 插件前端的组件配置
     * @description 一般用于 webui 中插件配置页面
     */
    config?: () => ComponentConfig[] | Promise<ComponentConfig[]>
    /**
     * 保存配置
     * @param config 配置
     * @returns 保存结果
     */
    save?: <T = unknown>(config: T) => WebConfigSaveResponse | Promise<WebConfigSaveResponse>
    /**
     * 自定义组件配置
     * @description 未完成
     */
    customComponent?: () => unknown
  },
  /**
   * 是否忽略引擎版本检查
   * @default false
   */
  ignoreEngines?: boolean
  /**
   * 插件钩子
   */
  hooks?: {
    /**
     * 准备加载插件
     */
    'load:before': () => void | Promise<void>,
    /**
     * 插件加载完成
     */
    'load:done': () => void | Promise<void>,
    /**
     * 插件新增前
     * @param file 新增的文件路径
     * @example
     * ```json
     * file: 'src/index.ts'
     * ```
     */
    'add:before': (file: string) => void | Promise<void>,
    /**
     * 插件新增完成
     * @param file 新增的文件路径
     * @example
     * ```json
     * file: 'src/index.ts'
     * ```
     */
    'add:done': (file: string) => void | Promise<void>,
    /**
     * 插件卸载前
     * @param file 卸载的文件路径
     * @example
     * ```json
     * file: 'src/index.ts'
     * ```
     */
    'unlink:before': (file: string) => void | Promise<void>,
    /**
     * 插件卸载完成
     * @param file 卸载的文件路径
     * @example
     * ```json
     * file: 'src/index.ts'
     * ```
     */
    'unlink:done': (file: string) => void | Promise<void>,
    /**
     * 触发变动，准备执行重载
     * @param file 变动的文件路径
     * @example
     * ```json
     * file: 'src/index.ts'
     * ```
     */
    'change:before': (file: string) => void | Promise<void>,
    /**
     * 触发变动，执行重载完成
     * @param file 变动的文件路径
     * @example
     * ```json
     * file: 'src/index.ts'
     * ```
     */
    'change:done': (file: string) => void | Promise<void>,
  },
  hmr?: {

  }
}

/**
 * 创建 karin.config.mjs 配置
 * @param config 配置
 * @see {@link DefineConfig}
 * @returns 配置
 */
export const defineKarinConfig = (
  config: DefineConfig
): DefineConfig => {
  return config
}
