import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollShadow, Avatar, Tooltip } from '@heroui/react'
import { Search, ExternalLink, Package } from 'lucide-react'
import { mockPlugins } from '../mocks/plugins'

export function PluginCustom () {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null)

  // 仅已安装的插件才有自定义页面
  const installedPlugins = useMemo(() => {
    return mockPlugins
      .filter(p => p.installed)
      .filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [searchQuery])

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
    <div className="h-full w-full flex overflow-hidden bg-default-50">
      {/* Left Sidebar */}
      <div className="w-64 shrink-0 flex flex-col border-r border-divider bg-background/60 backdrop-blur-xl">
        {/* Header */}
        <div className="p-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold text-foreground mb-1">
            {t('pluginCustom.title', '插件页面')}
          </h2>
          <p className="text-xs text-default-400 mb-3">
            {t('pluginCustom.subtitle', '查看插件自定义页面')}
          </p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-default-400" size={14} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-default-100 border border-default-200 focus:outline-none focus:border-primary text-xs transition-colors placeholder:text-default-400"
              placeholder={t('pluginCustom.search', '搜索插件...')}
            />
          </div>
        </div>

        {/* Plugin List */}
        <ScrollShadow className="flex-1 px-3 py-1 scrollbar-hide">
          <div className="space-y-1">
            {installedPlugins.map(plugin => (
              <button
                key={plugin.id}
                onClick={() => setSelectedPluginId(plugin.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group
                  ${selectedPluginId === plugin.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary border border-primary-200 dark:border-primary-800'
                    : 'text-default-600 hover:bg-default-100 border border-transparent'
                  }
                `}
              >
                <Avatar
                  src={plugin.icon || plugin.authors.avatarUrl}
                  name={plugin.name.charAt(0)}
                  size="sm"
                  radius="lg"
                  className={`shrink-0 ${selectedPluginId === plugin.id ? 'bg-primary-100 text-primary' : 'bg-default-100 text-default-500'}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {plugin.name}
                  </div>
                  <div className="text-[10px] text-default-400 truncate">
                    v{plugin.version}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {installedPlugins.length === 0 && (
            <div className="text-center py-10 text-default-400">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">{t('pluginCustom.noPlugins', '没有可用插件')}</p>
            </div>
          )}
        </ScrollShadow>
      </div>

      {/* Right Content - Iframe */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedPlugin ? (
          <>
            {/* Iframe Header */}
            <div className="shrink-0 h-12 px-6 flex items-center justify-between border-b border-divider bg-background/80 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {selectedPlugin.name}
                </span>
                <span className="text-[10px] text-default-400 font-mono">
                  v{selectedPlugin.version}
                </span>
              </div>
              <Tooltip content={t('pluginCustom.openInNew', '在新标签页打开')} placement="left">
                <button
                  className="p-1.5 rounded-lg text-default-400 hover:text-primary hover:bg-primary-50 transition-colors"
                  onClick={() => window.open(getPluginPageUrl(selectedPlugin.id), '_blank')}
                >
                  <ExternalLink size={14} />
                </button>
              </Tooltip>
            </div>

            {/* Iframe */}
            <div className="flex-1 bg-white dark:bg-zinc-950">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-default-100 flex items-center justify-center">
                <Package size={36} className="text-default-300" />
              </div>
              <h3 className="text-lg font-bold text-default-600 mb-2">
                {t('pluginCustom.selectPlugin', '选择一个插件')}
              </h3>
              <p className="text-sm text-default-400 max-w-xs">
                {t('pluginCustom.selectPluginDesc', '从左侧列表中选择一个插件以查看其自定义页面')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
