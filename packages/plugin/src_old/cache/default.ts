import type { PackageEnv } from '../config'
import type { PluginsTypes } from '../package'
import type {
  CreateAccept,
  CreateButton,
  CreateCommand,
  CreateHandler,
  CreateTask,
  CreateClassPlugin,
} from '../create'

/**
 * 插件类型枚举
 */
export type PluginTypes = 'command' | 'accept' | 'handler' | 'button' | 'task' | 'classPlugin'

/**
 * 插件引擎要求
 */
export interface PluginEngines {
  /** karin 版本要求 */
  version: string
  /** 是否忽略引擎要求 */
  ignoreEngines: boolean
}

/**
 * 依赖缺失项类型
 */
export type MissingDependency = {
  /** 依赖缺失 */
  type: 'import'
  /** 缺失的依赖名称集合 */
  deps: string
} | {
  /** 其他import错误 */
  type: 'error'
  error: unknown
}

/**
 * 插件包元信息缓存类型
 * @example
 * ```ts
 * {
 *   name: 'karin-plugin-example',
 *   abs: 'd:/path/to/plugin',
 *   pkg: 'd:/path/to/package.json'
 * }
 * ```
 */
export interface PackageMetaInfoCache {
  /**
   * 包名
   * @example
   * ```ts
   * 'karin-plugin-example'
   * ```
   */
  name: string
  /**
   * 插件包绝对路径
   * @example
   * ```ts
   * 'd:/Github/Karin/plugins/karin-plugin-example'
   * ```
   */
  abs: string
  /**
   * package.json 绝对路径
   * @example
   * ```ts
   * 'd:/Github/Karin/plugins/karin-plugin-example/package.json'
   * ```
   */
  pkg: string
}

/**
 * 全局统计信息
 * @description 读取的统计数据
 */
export interface PluginStats {
  /** 插件包总数 */
  pkg: number
  /** command 总数 */
  command: number
  /** accept 总数 */
  accept: number
  /** button 总数 */
  button: number
  /** task 总数 */
  task: number
  /** class plugin 总数 */
  classPlugin: number
  /** handler 统计 */
  handler: {
    /** handler key 总数 */
    key: number
    /** handler 函数总数 */
    fnc: number
  }
}

/**
 * 插件全局实例集合
 * @example
 * ```ts
 * {
 *   accept: [],
 *   button: [],
 *   command: [],
 *   task: [],
 *   classPlugin: [],
 *   handler: {}
 * }
 * ```
 */
export interface PluginInstance {
  /**
   * accept 实例列表
   * @example
   * ```ts
   * [acceptInstance1, acceptInstance2]
   * ```
   */
  accept: CreateAccept[]
  /**
   * button 实例列表
   * @example
   * ```ts
   * [buttonInstance1]
   * ```
   */
  button: CreateButton[]
  /**
   * task 实例列表
   * @example
   * ```ts
   * [taskInstance1]
   * ```
   */
  task: CreateTask[]
  /**
   * handler 实例映射表
   * @example
   * ```ts
   * {
   *   'handler.message': [handler1, handler2]
   * }
   * ```
   */
  handler: Record<string, CreateHandler[]>
  /**
   * command 实例列表
   * @example
   * ```ts
   * [commandInstance1, commandInstance2]
   * ```
   */
  command: CreateCommand[]
  /**
   * class plugin 实例列表
   * @example
   * ```ts
   * [pluginInstance1]
   * ```
   */
  class: CreateClassPlugin[]
}

/**
 * 插件全局实例集合
 * @example
 * ```ts
 * {
 *   accept: [],
 *   button: [],
 *   command: [],
 *   task: [],
 *   classPlugin: [],
 *   handler: {}
 * }
 * ```
 */
export interface PluginGlobalInstance extends Omit<PluginInstance, 'command' | 'class'> {
  /**
   * accept 实例列表
   * @example
   * ```ts
   * [acceptInstance1, acceptInstance2]
   * ```
   */
  accept: CreateAccept[]
  /**
   * button 实例列表
   * @example
   * ```ts
   * [buttonInstance1]
   * ```
   */
  button: CreateButton[]
  /**
   * task 实例列表
   * @example
   * ```ts
   * [taskInstance1]
   * ```
   */
  task: CreateTask[]
  /**
   * handler 实例映射表
   * @example
   * ```ts
   * {
   *   'handler.message': [handler1, handler2]
   * }
   * ```
   */
  handler: Record<string, CreateHandler[]>
  /**
   * command 实例集合
   */
  command: {
    /**
     * 热点缓存 `(动态)`
     * @description 仅存储高频使用的 command 实例 classPlugin不参与热点缓存
     * - 加入机制：
     * - 10s内使用次数超过3次
     * - 30s内使用次数超过5次
     * - 1分钟内使用次数超过10次
     * - 2分钟内使用次数超过15次
     * - 满足以上任意条件即加入热点缓存
     *
     * - 特殊情况:
     * - 用户可通过配置文件指定某个命令为热点命令，强制加入、移除热点缓存
     * - 开发者可通过API标记某个命令为热点命令，强制加入、移除热点缓存
     * - 对于10s内达到20次 缓存过期时间默认为120分钟
     *
     * 过期机制：
     * - 缓存过期时间为30分钟
     * - 如果在此期间 重新满足加入条件则累计增加30分钟`(上限120分钟)`
     * `
    */
    hot: Record<string, CreateCommand>
    /**
     * 启用列表 `(已排序 越小越靠前)`
     * @description 存储所有已启用的 command 和 classPlugin 实例，经过优先级排序
     * ```
     */
    enabled: (CreateCommand | CreateClassPlugin)[]
    /**
     * 禁用列表
     * @description 存储所有已禁用的 command 和 classPlugin 实例
     */
    disabled: (CreateCommand | CreateClassPlugin)[]
    /**
     * 原始缓存 `(不排序)`
     * @description 用于在排序时参考使用，避免重复排序影响原始顺序
     */
    raw: {
      /**
       * command 实例列表
       * @example
       * ```ts
       * [commandInstance1, commandInstance2]
       * ```
       */
      command: CreateCommand[]
      /**
       * class plugin 实例列表
       * @example
       * ```ts
       * [pluginInstance1]
       * ```
       */
      class: CreateClassPlugin[]
    }
  }
}

/**
 * 插件文件详细信息
 * @example
 * ```ts
 * {
 *   path: '/root/karin/plugins/karin-plugin-example/index.mjs',
 *   filename: 'test.ts',
 *   instances: {...}
 * }
 * ```
 */
export interface PluginFileInfo {
  /**
   * 文件绝对路径
   * @example
   * ```ts
   * 'd:/Github/Karin/plugins/karin-plugin-example/apps/test.ts'
   * ```
   */
  path: string
  /**
   * 文件名
   * @example
   * ```ts
   * 'test.ts'
   * ```
   */
  filename: string
  /**
   * 该文件的实例集合
   * @example
   * ```ts
   * {
   *   accept: [],
   *   button: [],
   *   command: []
   * }
   * ```
   */
  instances: PluginInstance
}

/**
 * 插件包详细信息
 * @example
 * ```ts
 * {
 *   name: 'karin-plugin-example',
 *   type: 'git',
 *   abs: 'd:/path',
 *   pkg: 'd:/path/package.json',
 *   instances: {...},
 *   files: {...}
 * }
 * ```
 */
export interface PackageInfo {
  /**
   * 包名
   * @example
   * ```ts
   * 'karin-plugin-example'
   * ```
   */
  name: string
  /**
   * 插件类型
   * - npm
   * - git
   * - apps
   * - dev
   */
  type: PluginsTypes
  /**
   * 插件包绝对路径
   * @example
   * ```ts
   * 'd:/Github/Karin/plugins/karin-plugin-example'
   * ```
   */
  abs: string
  /**
   * package.json 绝对路径
   * @example
   * ```ts
   * 'd:/Github/Karin/plugins/karin-plugin-example/package.json'
   * ```
   */
  pkg: string
  /**
   * 插件包主入口文件路径
   * @description 主要用于快速定位插件包的主入口文件
   * @example
   * ```ts
   * '/root/karin/plugins/karin-plugin-example/index.mjs'
   * ```
   * 如果插件包没有主入口文件则为 null
   *
   * 同样可以通过fileToPackage索引快速查询
   */
  main: string | null
  /**
   * 文件信息映射表
   * @example
   * ```ts
   * {
   *   '/root/karin/plugins/karin-plugin-example/index.mjs': {
   *     path: '...',
   *     filename: 'test.ts',
   *     instances: {...}
   *   }
   * }
   * ```
   */
  files: Record<string, PluginFileInfo>
}

/**
 * 插件缓存存储结构
 * @example
 * ```ts
 * {
 *   instances: {...},
 *   stats: {...},
 *   package: {
 *     info: {...},
 *     index: {...}
 *   },
 *   list: {...}
 * }
 * ```
 */
export interface PluginCacheStorage {
  /**
   * 已加载的插件包
   * @description 仅标记名称列表 方便快速检查是否已加载
   * @example
   * ```ts
   * [
   *   'karin-plugin-example',
   *   'karin-plugin-another'
   * ]
   * ```
   */
  loadedPackages: string[]

  /**
   * 全局聚合的插件实例
   * @description 这里的是供全局调用，方便快速获取所有插件实例
   * @example
   * ```ts
   * {
   *   accept: [],
   *   button: [],
   *   command: []
   * }
   * ```
   */
  instances: PluginGlobalInstance
  /** 插件静态资源目录列表
   * @description 在此目录下的资源会被作为静态资源提供给 webui 访问
   * @example
   * ```json
   * {
   *   "public": [
   *     "./dist/public",
   *     "./public"
   *   ]
   * }
   * ```
   * 访问路径为 /[插件包名]/[文件路径]
   * 例如插件包名为 karin-plugin-example
   * public 目录下有一个 index.html 文件
   * 则访问路径为 /karin-plugin-example/index.html
   * public/index.html => http://127.0.0.1:7777/karin-plugin-example/index.html
   */
  public: Record<string, string[]>
  /**
   * 插件数量统计信息
   * @example
   * ```ts
   * {
   *   pkg: 10,
   *   command: 50,
   *   accept: 20
   * }
   * ```
   */
  stats: PluginStats

  /**
   * 插件包映射表
   */
  package: {
    /**
     * 核心包信息映射表
     * @example
     * ```ts
     * {
     *   'karin-plugin-example': {
     *     name: '...',
     *     type: 'git',
     *     ...
     *   }
     * }
     * ```
     */
    info: Record<string, PackageInfo>

    /** 快速查询索引 */
    index: {
      /**
       * 文件路径 -> 包名
       * @example
       * ```ts
       * {
       *   '/root/karin/plugins/karin-plugin-example/index.mjs': 'karin-plugin-example'
       * }
       * ```
       */
      fileToPackage: Record<string, string>
      /**
       * 包名 -> 文件路径数组
       * @example
       * ```ts
       * {
       *   'karin-plugin-example': ['/root/karin/plugins/karin-plugin-example/index.mjs']
       * }
       * ```
       */
      packageToFiles: Record<string, string[]>
    }
  }

  /**
   * 不符合 engines 要求的插件包记录表
   * @example
   * ```ts
   * {
   *   'karin-plugin-example': {
   *     version: '1.0.0',
   *     ignoreEngines: false
   *   }
   * }
   * ```
   */
  engines: Record<string, PluginEngines>

  /**
   * 插件环境变量缓存
   * @example
   * ```ts
   * {
   *   'karin-plugin-example': {
   *     'ENV_KEY': {
   *       value: 'value',
   *       comment: 'This is a comment'
   *     }
   *   }
   * }
   * ```
   */
  envs: Record<string, PackageEnv>

  /**
   * 依赖缺失缓存
   * @description 使用 Record<string, Set<string>> 存储插件文件的缺失依赖
   * - key: 文件绝对路径
   * - value: 缺失的依赖名称集合
   * @example
   * ```ts
   * missingDeps['karin-plugin-example'] = {
   *   'd:/Github/Karin/plugins/karin-plugin-example/index.ts': [
   *     {
   *       type: 'import',
   *       deps: 'dep1'
   *     },
   *     {
   *       type: 'error',
   *       error: new Error('Module not found')
   *     }
   *   ]
   * }
   * ```
   */
  missingDeps: Record<string, Record<string, MissingDependency[]>>

  /** 插件包列表缓存 */
  list: {
    /**
     * npm 插件包列表
     * @example
     * ```ts
     * [
     *   {
     *     name: 'karin-plugin-npm',
     *     abs: '...',
     *     pkg: '...'
     *   }
     * ]
     * ```
     */
    npm: PackageMetaInfoCache[]
    /**
     * git 插件包列表
     * @example
     * ```ts
     * [
     *   {
     *     name: 'karin-plugin-git',
     *     abs: '...',
     *     pkg: '...'
     *   }
     * ]
     * ```
     */
    git: PackageMetaInfoCache[]
    /**
     * apps 插件包列表
     * @example
     * ```ts
     * [
     *   {
     *     name: 'karin-plugin-apps',
     *     abs: '...',
     *     pkg: '...'
     *   }
     * ]
     * ```
     */
    apps: PackageMetaInfoCache[]
    /**
     * dev 插件包列表
     * @example
     * ```ts
     * [
     *   {
     *     name: 'karin-plugin-dev',
     *     abs: '...',
     *     pkg: '...'
     *   }
     * ]
     * ```
     */
    dev: PackageMetaInfoCache[]
    /**
     * 全部插件包列表
     * @example
     * ```ts
     * [
     *   {
     *     type: 'npm',
     *     name: '...',
     *     abs: '...',
     *     pkg: '...'
     *   }
     * ]
     * ```
     */
    all: Array<{
      /** 插件类型 */
      type: PluginsTypes,
    } & PackageMetaInfoCache>
  }
}

/**
 * 创建默认的插件实例集合
 * @returns 默认的插件实例集合对象
 */
export const createInstances = {
  get global (): PluginGlobalInstance {
    return {
      accept: [],
      button: [],
      task: [],
      handler: {},
      command: {
        hot: {},
        enabled: [],
        disabled: [],
        raw: {
          command: [],
          class: [],
        },
      },
    }
  },
  get normal (): PluginInstance {
    return {
      accept: [],
      button: [],
      task: [],
      handler: {},
      command: [],
      class: [],
    }
  },
}

/**
 * 创建默认缓存数据
 * @returns 默认缓存数据对象
 * @example
 * ```ts
 * const cache = defaultCache()
 * // 返回完整的初始化缓存结构
 * ```
 */
export const defaultCache = (): PluginCacheStorage => ({
  loadedPackages: [],
  instances: createInstances.global,
  public: {},
  stats: {
    pkg: 0,
    command: 0,
    accept: 0,
    button: 0,
    task: 0,
    classPlugin: 0,
    handler: {
      key: 0,
      fnc: 0,
    },
  },
  package: {
    info: {},
    index: {
      fileToPackage: {},
      packageToFiles: {},
    },
  },
  engines: {},
  envs: {},
  missingDeps: {},
  list: {
    npm: [],
    git: [],
    apps: [],
    dev: [],
    get all () {
      return [
        ...this.npm.map(item => ({ type: 'npm' as const, ...item })),
        ...this.git.map(item => ({ type: 'git' as const, ...item })),
        ...this.apps.map(item => ({ type: 'apps' as const, ...item })),
        ...this.dev.map(item => ({ type: 'dev' as const, ...item })),
      ]
    },
  },
})
