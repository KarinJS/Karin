/**
 * TODO: 后续改为自动化
 */
// import type { KarinPluginType } from '@karinjs/plugins-list'

/**
 * 插件基础类型
 */
export interface KarinPluginBase {
  /** 插件包名 */
  name: string
  /**
   * 插件类型
   * - npm: npm 插件
   * - git: git 插件
   * - app: 单应用插件
   */
  type: 'npm' | 'git' | 'app'
  /** 插件描述 限制 50 长度 */
  description: string
  /** 插件提交到仓库时间 */
  time: string
  /** 插件主页 */
  home: string
  /** 插件许可证 */
  license: {
    /** 许可证名称 */
    name: string
    /** 许可证地址 */
    url: string
  }
  /** 插件作者 */
  author: {
    /** 名字 */
    name: string
    /** 主页 */
    home: string
    /** 头像 仅支持url 如果是github、gitee无需填写 */
    avatar?: string
  }[]
  /** 插件仓库 */
  repo: {
    /** 仓库类型 */
    type: 'github' | 'gitee' | 'gitcode' | 'gitlab' | 'npm'
    /** 仓库地址 */
    url: string
    /** 默认分支 npm类型为空字符串 */
    branch: string
  }[]
}

/**
 * npm 插件类型
 */
export interface KarinNpmPlugin extends KarinPluginBase {
  type: 'npm'
  /** 允许pnpm在安装期间执行脚本的包名列表 */
  allowBuild?: string[]
}

/**
 * git 插件类型
 */
export interface KarinGitPlugin extends KarinPluginBase {
  type: 'git'
}

/**
 * 单应用插件类型
 */
export interface KarinAppPlugin extends KarinPluginBase {
  type: 'app'
  /** app文件直链 */
  files: {
    /** app插件名称 */
    name: string
    /** 文件直链 */
    url: string
    /** 描述 */
    description?: string
  }[]
}

/**
 * 插件市场类型每个插件的类型
 */
export type KarinPluginType = KarinNpmPlugin | KarinGitPlugin | KarinAppPlugin
