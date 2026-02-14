import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Tooltip } from '@heroui/react'
import { ExternalLink, Package } from 'lucide-react'
import { mockPlugins } from '../mocks/plugins'
import { PluginListSidebar } from '../components/plugins/PluginListSidebar'

export function PluginCustom () {
  const { t } = useTranslation()
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null)

  // 仅已安装的插件才有自定义页面
  const installedPlugins = useMemo(() => {
    return mockPlugins.filter(p => p.installed)
  }, [])

  const selectedPlugin = useMemo(() => {
    return installedPlugins.find(p => p.id === selectedPluginId) ?? null
  }, [selectedPluginId, installedPlugins])

  // 模拟 iframe 地址（实际应从插件配置中获取）
  // 为了演示效果，这里映射一些真实网站
  const getPluginPageUrl = (pluginId: string) => {
    const demoUrls: Record<string, string> = {
      'karin-plugin-example': 'https://react.dev/',
      'karin-plugin-music': 'https://music.163.com/',
      'custom-script-weather': 'https://m.tianqi.com/',
      'karin-plugin-admin': 'https://ant.design/components/overview-cn/',
      'karin-plugin-image': 'https://unsplash.com/',
      'direct-link-game': 'https://poki.cn/',
    }
    return demoUrls[pluginId] || `/api/plugin/${pluginId}/page`
  }

  return (
    <div className="h-full w-full p-4 flex gap-4 overflow-hidden">
      {/* 左侧导航卡片 */}
      <PluginListSidebar
        plugins={installedPlugins}
        selectedPluginId={selectedPluginId}
        onSelectPlugin={setSelectedPluginId}
        title={t('pluginCustom.title', '插件页面')}
        subtitle={t('pluginCustom.subtitle', '查看插件自定义页面')}
        searchPlaceholder={t('pluginCustom.search', '搜索插件...')}
        showFooterStats
        renderFooterStats={() => (
          <div className="flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500">
            <span>{installedPlugins.length} 个已安装插件</span>
          </div>
        )}
      />

      {/* 右侧内容卡片 - Iframe */}
      <Card className="flex-1 h-full glass-panel shadow-none rounded-2xl overflow-hidden flex flex-col min-w-0">
        {selectedPlugin ? (
          <>
            {/* Iframe Header */}
            <div className="shrink-0 h-12 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {selectedPlugin.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  v{selectedPlugin.version}
                </span>
              </div>
              <Tooltip content={t('pluginCustom.openInNew', '在新标签页打开')} placement="left">
                <button
                  className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  onClick={() => window.open(getPluginPageUrl(selectedPlugin.id), '_blank')}
                >
                  <ExternalLink size={14} />
                </button>
              </Tooltip>
            </div>

            {/* Iframe */}
            <div className="flex-1 bg-white dark:bg-zinc-950 rounded-b-2xl overflow-hidden">
              <iframe
                key={selectedPlugin.id}
                src={getPluginPageUrl(selectedPlugin.id)}
                className="w-full h-full border-0"
                title={selectedPlugin.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/30 dark:border-slate-700/30 flex items-center justify-center">
                <Package size={36} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">
                {t('pluginCustom.selectPlugin', '选择一个插件')}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
                {t('pluginCustom.selectPluginDesc', '从左侧列表中选择一个插件以查看其自定义页面')}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
