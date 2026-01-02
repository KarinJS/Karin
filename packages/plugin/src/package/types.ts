/**
 * karin的插件包类型
 * @description 插件包中的每个符合标准的文件，就是一个单独的 `app`
 * - npm: 从npm安装
 * - apps: 在/karin/plugins/*目录下
 * - dev: 根目录的package.json存在karin字段（开发环境）
 * @note v2.0 移除了 git 类型
 */
export type PluginsTypes = 'apps' | 'npm' | 'dev'

/** 插件的package.json标准类型 */
export interface Package {
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件入口 */
  main: string
  /** package.json exports 字段 */
  exports?: {
    [key: string]: {
      /** 开发模式入口 */
      development?: string
      /** ESM 入口 */
      import?: string
      /** 默认入口 */
      default?: string
      /** CJS 入口 */
      require?: string
      /** 类型定义 */
      types?: string
    } | string
  }
  /** package.json engines 字段 */
  engines?: {
    karin: string
    [key: string]: string
  }
  /** 允许其他自定义字段 */
  [key: string]: unknown
}
