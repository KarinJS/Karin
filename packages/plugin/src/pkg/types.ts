/**
 * karin的插件包类型
 * @description 插件包中的每个符合标准的文件，就是一个单独的 `app`
 * - npm: 从npm安装
 * - git: 在/karin/plugins目录下 并且package.json存在karin字段
 * - apps: 在/karin/plugins/*目录下 package.json不存在或存在不指定karin字段
 * - dev: 根目录的package.json存在karin字段
 */
export type PluginPackageType = 'npm' | 'git' | 'apps' | 'dev'

/** pkg环境变量类型 */
export interface PackageEnv {
  /** 变量名 */
  key: string
  /** 变量值 */
  value: string
  /** 变量注释 */
  comment: string
}

/** 插件的package.json标准类型 */
export interface Package {
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件入口 */
  main: string
  karin?: {
    /** ts入口 */
    main?: string
    /**
     * 插件app列表
     * @description 适用于直接指定app文件
     * @example
     * ```json
     * {
     *   "karin": {
     *     "app": './dist/index.js',
     *     "app": [
     *       './dist/run.js',
     *       './dist/app.js'
     *     ]
     *   }
     * }
     * ```
     */
    app?: string | string[]
    /**
     * 插件apps目录列表
     * @description 适用于指定apps目录
     * @example
     * ```json
     * {
     *   "karin": {
     *     "apps": "./apps",
     *     "apps": [
     *       "./dist/apps",
     *       "./dist/run"
     *     ]
     *   }
     * }
     * ```
     */
    apps?: string | string[]
    /**
     * web配置文件
     * @description 至于需要web.config作为命名标准
     * @example
     * ```json
     * {
     *   "karin": {
     *     "web": "./dist/web.config.js"
     *   }
     * }
     * ```
     */
    web?: string
    /**
     * 同 `karin.apps`，但此项仅在ts开发模式下生效
     */
    ['ts-apps']?: string | string[]
    /**
     * 同 `karin.web`，但此项仅在ts开发模式下生效
     */
    ['ts-web']?: string
    /** 静态资源目录 */
    static?: string | string[]
    /** 基本文件夹结构 */
    files?: string[]
    /** 环境变量配置 */
    env?: PackageEnv[]
    /** 引擎兼容性 官方的翻译。。。奇奇怪怪的 */
    engines?: {
      /**
       * @description karin版本
       * @example ^0.0.1
       * @example >=0.0.1
       * @example 0.0.1
       * @example 0.0.x
       */
      karin?: string
    }
  }
  [key: string]: any
}

/**
 * 插件的package.json格式化后的标准类型
 */
export interface PackageKarin extends Package {
  karin: {
    main: string
    app: string[],
    apps: string[],
    web: string,
    ['ts-apps']: string[],
    ['ts-web']: string,
    static: string[],
    files: string[],
    env: PackageEnv[],
  }
}
