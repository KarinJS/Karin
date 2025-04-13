/**
 * 插件管理页面的模拟数据
 */

/**
 * 插件类型枚举
 */
export type PluginType = 'npm' | 'git' | 'app' | 'all'

/**
 * 插件更新状态枚举
 */
export type UpdateStatus = 'up-to-date' | 'outdated' | 'pending'

/**
 * 插件项数据结构
 */
export interface PluginItem {
  /** 插件ID */
  id: string
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件类型 */
  type: Exclude<PluginType, 'all'>
  /** 插件更新状态 */
  updateStatus: UpdateStatus
  /** 可更新版本（如果有） */
  availableVersion?: string
  /** 插件描述 */
  description?: string
  /** 插件作者 */
  author?: string
  /** 插件主页 */
  homepage?: string
}

/**
 * 模拟获取插件列表的异步函数
 * @param type 插件类型过滤条件
 * @returns 返回过滤后的插件列表
 */
export const fetchPluginList = async (type: PluginType = 'all'): Promise<PluginItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  // 如果类型为all，返回所有插件，否则按类型过滤
  return mockPluginList.filter(plugin => type === 'all' || plugin.type === type)
}

/**
 * 模拟插件数据列表
 */
const mockPluginList: PluginItem[] = [
  {
    id: '1',
    name: 'karin-plugin-chat',
    version: '1.2.0',
    type: 'npm',
    updateStatus: 'up-to-date',
    description: '智能聊天插件，提供丰富的对话功能',
    author: '张三',
    homepage: 'https://github.com/karin/chat-plugin',
  },
  {
    id: '2',
    name: 'karin-plugin-translator',
    version: '0.9.5',
    type: 'npm',
    updateStatus: 'outdated',
    availableVersion: '1.0.0',
    description: '多语言翻译插件，支持50+种语言',
    author: '李四',
    homepage: 'https://github.com/karin/translator',
  },
  {
    id: '3',
    name: 'karin-theme-dark',
    version: '2.1.3',
    type: 'git',
    updateStatus: 'up-to-date',
    description: '暗黑主题插件，提供舒适的夜间视觉体验',
    author: '王五',
    homepage: 'https://github.com/karin/dark-theme',
  },
  {
    id: '4',
    name: 'karin-extension-pdf',
    version: '0.8.2',
    type: 'git',
    updateStatus: 'outdated',
    availableVersion: '1.1.0',
    description: 'PDF处理插件，支持PDF文件的解析和生成',
    author: '赵六',
    homepage: 'https://github.com/karin/pdf-extension',
  },
  {
    id: '5',
    name: 'karin-app-calendar',
    version: '3.0.1',
    type: 'app',
    updateStatus: 'up-to-date',
    description: '日历应用插件，帮助管理日程和提醒',
    author: '孙七',
    homepage: 'https://github.com/karin/calendar-app',
  },
  {
    id: '6',
    name: 'karin-app-notes',
    version: '1.5.4',
    type: 'app',
    updateStatus: 'pending',
    description: '笔记应用插件，提供云同步功能',
    author: '周八',
    homepage: 'https://github.com/karin/notes-app',
  },
  {
    id: '7',
    name: 'karin-plugin-markdown',
    version: '2.2.0',
    type: 'npm',
    updateStatus: 'up-to-date',
    description: 'Markdown编辑器插件，支持实时预览',
    author: '吴九',
    homepage: 'https://github.com/karin/markdown-plugin',
  },
  {
    id: '8',
    name: 'karin-plugin-code',
    version: '1.0.1',
    type: 'git',
    updateStatus: 'pending',
    description: '代码编辑器插件，支持多种编程语言',
    author: '郑十',
    homepage: 'https://github.com/karin/code-plugin',
  },
]
