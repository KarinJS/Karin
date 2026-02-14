import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollShadow, Avatar, Card } from '@heroui/react'
import { Search, Package } from 'lucide-react'
import type { Plugin } from '../../types/plugin'

export interface PluginListSidebarProps {
  /** 插件列表 */
  plugins: Plugin[]
  /** 当前选中的插件ID */
  selectedPluginId: string | null
  /** 选中插件时的回调 */
  onSelectPlugin: (pluginId: string) => void
  /** 标题 */
  title: string
  /** 副标题 */
  subtitle?: string
  /** 搜索占位符 */
  searchPlaceholder?: string
  /** 是否显示底部统计 */
  showFooterStats?: boolean
  /** 自定义统计渲染 */
  renderFooterStats?: (plugins: Plugin[]) => React.ReactNode
  /** 额外的类名 */
  className?: string
}

/**
 * 插件列表侧边栏组件
 * 用于 PluginConfig 和 PluginCustom 页面的共享侧边栏
 */
export function PluginListSidebar ({
  plugins,
  selectedPluginId,
  onSelectPlugin,
  title,
  subtitle,
  searchPlaceholder,
  showFooterStats = false,
  renderFooterStats,
  className = '',
}: PluginListSidebarProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // 确保异步执行，避免同步 setState 警告
    const timer = setTimeout(() => {
        setSearchQuery('')
    }, 0)
    return () => clearTimeout(timer)
  }, [selectedPluginId])

  // 搜索过滤
  const filteredPlugins = useMemo(() => {
    if (!searchQuery) return plugins
    const q = searchQuery.toLowerCase()
    return plugins.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }, [plugins, searchQuery])

  return (
    <Card className={`w-64 h-full shrink-0 glass-panel shadow-none rounded-2xl ${className}`}>
      <div className="h-full flex flex-col">
        {/* 头部 */}
        <div className="p-4 pb-2 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-2 mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 px-2 mb-3">
              {subtitle}
            </p>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-default-400" size={14} />
            <input
              type="search"
              name="plugin-search-nofill"
              autoComplete="new-password"
              data-form-type="other"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-default-100 border border-default-200 focus:outline-none focus:border-primary text-xs transition-colors placeholder:text-default-400"
              placeholder={searchPlaceholder || t('common.search', '搜索...')}
            />
          </div>
        </div>

        {/* 插件列表 */}
        <ScrollShadow className="flex-1 px-3 py-1 scrollbar-hide">
          <div className="space-y-1">
            {filteredPlugins.map(plugin => (
              <button
                key={plugin.id}
                onClick={() => {
                  setSearchQuery('')
                  onSelectPlugin(plugin.id)
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group
                  ${selectedPluginId === plugin.id
                    ? 'bg-white dark:bg-white/10 shadow-sm text-slate-800 dark:text-slate-100 border border-white/50 dark:border-white/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <Avatar
                  src={plugin.icon || plugin.authors.avatarUrl}
                  name={plugin.name.charAt(0).toUpperCase()}
                  size="sm"
                  radius="lg"
                  className={`shrink-0 ${
                    selectedPluginId === plugin.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary'
                      : 'bg-default-100 text-default-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{plugin.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    v{plugin.version}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredPlugins.length === 0 && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">{t('plugins.noPlugins', '没有找到插件')}</p>
            </div>
          )}
        </ScrollShadow>

        {/* 底部统计 */}
        {showFooterStats && (
          <div className="px-5 py-3 border-t border-slate-200/30 dark:border-slate-700/30 shrink-0">
            {renderFooterStats ? (
              renderFooterStats(filteredPlugins)
            ) : (
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>{filteredPlugins.length} 个插件</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default PluginListSidebar
