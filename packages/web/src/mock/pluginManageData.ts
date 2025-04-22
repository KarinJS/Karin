/**
 * 插件管理页面的模拟数据
 */

/**
 * 插件类型枚举
 */
export type PluginType = 'git' | 'app' | 'all'

/**
 * 插件更新状态枚举
 */
export type UpdateStatus = 'up-to-date' | 'outdated' | 'pending'

/**
 * 插件项数据结构
 */
export interface PluginItem {
  /** 插件ID `package.json中的名称` */
  id: string
  /** 插件名称 `文件夹根目录名称` */
  name: string
  /** 插件类型 */
  type: Exclude<PluginType, 'all'>
  /** 插件版本 App类型为空 */
  version: string
  /** 插件最新版本短哈希 App类型为空 */
  latestHash: string
}

/**
 * 模拟获取插件列表的异步函数
 * @param type 插件类型过滤条件
 * @returns 返回过滤后的插件列表
 */
export const fetchPluginList = async (type: PluginType = 'all'): Promise<PluginItem[]> => {
  // 模拟网络请求延迟
  // await new Promise(resolve => setTimeout(resolve, 800))

  // 如果类型为all，返回所有插件，否则按类型过滤
  return mockPluginList.filter(plugin => type === 'all' || plugin.type === type)
}

/**
 * 模拟插件数据列表
 */
const mockPluginList: PluginItem[] = [
  {
    id: 'karin-plugin-theme-dark',
    name: 'karin-plugin-theme-dark',
    version: 'a1b2c3d',
    type: 'git',
    latestHash: 'e4f5g6h',
  },
  {
    id: 'karin-plugin-extension-pdf',
    name: 'karin-plugin-extension-pdf',
    version: 'b2c3d4e',
    type: 'git',
    latestHash: 'b2c3d4e',
  },
  {
    id: 'karin-plugin-theme-light',
    name: 'karin-plugin-theme-light',
    version: 'c3d4e5f',
    type: 'git',
    latestHash: 'c3d4e5f',
  },
  {
    id: 'karin-plugin-extension-markdown',
    name: 'karin-plugin-extension-markdown',
    version: 'd4e5f6g',
    type: 'git',
    latestHash: 'h7i8j9k',
  },
  {
    id: 'karin-plugin-git-helper',
    name: 'karin-plugin-git-helper',
    version: 'e5f6g7h',
    type: 'git',
    latestHash: 'e5f6g7h',
  },
  {
    id: 'karin-plugin-code-formatter',
    name: 'karin-plugin-code-formatter',
    version: 'f6g7h8i',
    type: 'git',
    latestHash: 'j9k0l1m',
  },
  {
    id: 'karin-plugin-eslint',
    name: 'karin-plugin-eslint',
    version: 'k1l2m3n',
    type: 'git',
    latestHash: 'k1l2m3n',
  },
  {
    id: 'karin-plugin-prettier',
    name: 'karin-plugin-prettier',
    version: 'm3n4o5p',
    type: 'git',
    latestHash: 'q6r7s8t',
  },
  {
    id: 'karin-plugin-typescript',
    name: 'karin-plugin-typescript',
    version: 'n4o5p6q',
    type: 'git',
    latestHash: 'n4o5p6q',
  },
  {
    id: 'karin-plugin-jest',
    name: 'karin-plugin-jest',
    version: 'o5p6q7r',
    type: 'git',
    latestHash: 'o5p6q7r',
  },
  {
    id: 'karin-plugin-webpack',
    name: 'karin-plugin-webpack',
    version: 'p6q7r8s',
    type: 'git',
    latestHash: 't9u0v1w',
  },
  {
    id: 'karin-plugin-babel',
    name: 'karin-plugin-babel',
    version: 'q7r8s9t',
    type: 'git',
    latestHash: 'q7r8s9t',
  },
  {
    id: 'karin-plugin-rollup',
    name: 'karin-plugin-rollup',
    version: 'r8s9t0u',
    type: 'git',
    latestHash: 'w1x2y3z',
  },
  {
    id: 'karin-plugin-vite',
    name: 'karin-plugin-vite',
    version: 's9t0u1v',
    type: 'git',
    latestHash: 's9t0u1v',
  },
  {
    id: 'karin-plugin-esbuild',
    name: 'karin-plugin-esbuild',
    version: 't0u1v2w',
    type: 'git',
    latestHash: 'y3z4a5b',
  },
  {
    id: 'karin-plugin-swc',
    name: 'karin-plugin-swc',
    version: 'u1v2w3x',
    type: 'git',
    latestHash: 'u1v2w3x',
  },
  {
    id: 'karin-plugin-postcss',
    name: 'karin-plugin-postcss',
    version: 'v2w3x4y',
    type: 'git',
    latestHash: 'c5d6e7f',
  },
  {
    id: 'karin-plugin-sass',
    name: 'karin-plugin-sass',
    version: 'w3x4y5z',
    type: 'git',
    latestHash: 'w3x4y5z',
  },
  {
    id: 'karin-plugin-less',
    name: 'karin-plugin-less',
    version: 'x4y5z6a',
    type: 'git',
    latestHash: 'g7h8i9j',
  },
  {
    id: 'karin-plugin-tailwind',
    name: 'karin-plugin-tailwind',
    version: 'y5z6a7b',
    type: 'git',
    latestHash: 'y5z6a7b',
  },
  // Tool 应用组
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/index.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/app.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/abc.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/def.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/file.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/demo.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/ghi.js',
    version: '',
    type: 'app',
    latestHash: '',
  },

  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/pop.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/poke.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/at.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/image.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example/mp4.js',
    version: '',
    type: 'app',
    latestHash: '',
  },
]
