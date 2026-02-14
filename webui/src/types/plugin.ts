/**
 * 插件类型
 */
export type PluginType = 'npm' | 'url'

/**
 * 插件接口
 */
export interface PluginBase {
  /**
   * 插件 ID
   * @description karin-plugin-example
   */
  id: string
  /**
   * 插件名称
   * @description karin-plugin-example
   */
  name: string
  /**
   * 插件描述
   * @description 一个简单的 Karin 插件示例，展示了基础功能。
   */
  description: string
  /**
   * 插件类型   
   */
  type: PluginType
  /**
   * 插件版本
   *
   * @description
   * karin 仅识别以下语义化版本号格式(基于SemVer约定的子集)：
   *
   * 支持的发布阶段：
   *
   * 1️⃣ 正式版本(Release)
   *    - 用于生产环境发布
   *    - 无任何后缀
   *    - 格式：
   *      x.y.z
   *
   * 2️⃣ 开发版本(dev)
   *    - 用于 CI / PR 自动构建 / 本地测试
   *    - 不保证稳定性
   *    - 格式：
   *      x.y.z-dev.n
   *
   * 3️⃣ 测试版本(beta)
   *    - 功能基本完整，对外测试
   *    - 可能仍存在 API 或行为变更
   *    - 格式：
   *      x.y.z-beta.n
   *
   * 4️⃣ 发布候选(rc)
   *    - 预发布最终验证版本
   *    - 若无重大问题将直接转为正式版
   *    - 格式：
   *      x.y.z-rc.n
   *
   * 稳定性排序(由低到高)：
   * dev < beta < rc < release
   *
   * @example
   * ```bash
   * # 正式发布
   * 1.0.0
   *
   * # 开发构建(CI / 自动打包)
   * 1.0.0-dev.1
   *
   * # 公测版本
   * 1.0.0-beta.2
   *
   * # 发布候选
   * 1.0.0-rc.1
   * ```
   */
  version: string
  /**
   * 插件作者信息
   */
  authors: {
    /**
     * 插件作者名称
     * @description 如果是多个作者，请使用 & 进行分隔
     * @example
     * ```sh
     * Alice & Bob & Charlie
     * ```
     */
    name: string
    /**
     * 插件作者主页链接
     * @example
     * ```sh
     * https://github.com/alice
     * ```
     */
    url: string
    /**
     * 插件作者头像链接
     * @example
     * ```sh
     * https://github.com/alice.png
     * ```
     */
    avatarUrl: string
  }
  /**
   * 插件许可证
   * @description 插件的许可证类型，接受类型名称、URL
   * @example
   * ```sh
   * # 类型名称
   * MIT
   * 
   * # 插件的开源许可证链接
   * https://opensource.org/licenses/MIT
   * ```
   */
  license: string
  /**
   * 插件主页
   * @description 插件的主页链接
   * @example
   * ```sh
   * https://github.com/karin-plugin-example
   * ```
   */
  homepage: string
  /**
   * 插件仓库链接
   * @description 插件的代码仓库地址
   * @example
   * ```sh
   * https://github.com/karin-plugin-example
   * ```
   */
  repo: string
  /**
   * 插件标签
   * @description 用于对插件进行分类和搜索
   * @example
   * ```sh
   * ["utility", "theme"]
   * ```
   */
  tags: string[]
  /**
   * 插件图标
   * @description 插件的图标链接
   * @description 如果未提供，将使用作者头像作为默认图标
   * @example
   * ```sh
   * https://github.com/karin-plugin-example.png
   * ```
   */
  icon?: string
  /**
   * 插件说明文档
   */
  readme: string
  /**
   * 插件下载量
   */
  downloads: number
  /**
   * 插件更新时间
   * @description 插件的最后更新时间，格式为 ISO 8601 字符串
   * @example
   * ```sh
   * 2026-02-09T07:47:24.781Z
   * ```
   */
  updateTime: string
  /**
   * 插件安装相关信息
   */
  /**
   * 插件是否已安装
   */
  installed: boolean,
}

/**
 * npm类型的插件包
 */
export interface PluginNpm extends PluginBase {
  type: 'npm'
}

/**
 * url类型的插件包
 */
export interface PluginUrl extends PluginBase {
  type: 'url'
  /**
   * 插件的下载列表
   */
  urls: {
    /**
     * 下载链接
     * @example
     * ```sh
     * https://example.com/plugin.ts
     * https://example.com/plugin.mts
     * https://example.com/plugin.js
     * https://example.com/plugin.mjs
     * ```
     */
    url: string
    /**
     * url插件名称
     * @example
     * ```sh
     * 抖音直链解析
     * ```
     */
    name: string
    /**
     * url插件描述
     * @example
     * ```sh
     * 这是一个用于解析抖音直链的插件。
     * ```
     */
    description: string

  }
}

/**
 * 插件类型联合
 */
export type Plugin = PluginNpm | PluginUrl