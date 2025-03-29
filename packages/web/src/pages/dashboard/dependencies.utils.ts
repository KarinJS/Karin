// 定义依赖项类型
export interface Dependency {
  name: string
  currentVersion: string
  packageJsonVersion: string
  availableVersions: string[]
  isKarinPlugin: boolean
}

// 定义过滤模式类型
export type FilterMode = 'all' | 'plugins' | 'updatable'

// 模拟数据
export const mockDependencies: Dependency[] = [
  {
    name: '@heroui/table',
    currentVersion: '2.2.9',
    packageJsonVersion: '^2.2.9',
    availableVersions: ['2.2.9', '2.2.8', '2.2.7', '2.2.6', '2.2.5', '2.2.4', '2.2.3', '2.2.2', '2.2.1', '2.2.0'],
    isKarinPlugin: false,
  },
  {
    name: '@heroui/button',
    currentVersion: '2.2.9',
    packageJsonVersion: '2.2.9',
    availableVersions: ['2.2.9', '2.2.8', '2.2.7', '2.2.6', '2.2.5'],
    isKarinPlugin: false,
  },
  {
    name: 'karin-plugin-weather',
    currentVersion: '1.2.0',
    packageJsonVersion: '^1.2.0',
    availableVersions: ['1.2.0', '1.1.5', '1.1.0', '1.0.0'],
    isKarinPlugin: true,
  },
  {
    name: 'karin-plugin-translator',
    currentVersion: '0.9.5',
    packageJsonVersion: '~0.9.0',
    availableVersions: ['1.0.0', '0.9.5', '0.9.0', '0.8.0'],
    isKarinPlugin: true,
  },
  {
    name: 'react',
    currentVersion: '19.0.0',
    packageJsonVersion: '^19.0.0',
    availableVersions: ['19.0.0', '18.2.0', '18.1.0', '18.0.0', '17.0.2'],
    isKarinPlugin: false,
  },
  {
    name: 'tailwindcss',
    currentVersion: '3.4.17',
    packageJsonVersion: '^3.4.17',
    availableVersions: ['3.4.17', '3.4.0', '3.3.0', '3.2.0', '3.1.0', '3.0.0'],
    isKarinPlugin: false,
  },
]

// 获取npmjs链接
export const getNpmLink = (packageName: string): string => {
  // 如果是@开头的作用域包，需要特殊处理
  if (packageName.startsWith('@')) {
    const [scope, name] = packageName.split('/')
    return `https://www.npmjs.com/package/${scope}%2F${name}`
  }
  return `https://www.npmjs.com/package/${packageName}`
}

// 版本是否有更新
export const hasUpdate = (dependency: Dependency): boolean => {
  if (!dependency.availableVersions.length) return false
  const latest = dependency.availableVersions[0]
  return latest !== dependency.currentVersion
}
