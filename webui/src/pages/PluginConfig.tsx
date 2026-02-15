import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Avatar, Card, Breadcrumbs, BreadcrumbItem, Chip } from '@heroui/react'
import { Settings, Puzzle, FileSliders } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { mockPlugins } from '../mocks/plugins'
import { pluginConfigSchemas, pluginConfigData } from '../mocks/pluginConfigs'
import { SchemaForm } from '../components/schema-form'
import { PluginListSidebar } from '../components/plugins/PluginListSidebar'

/**
 * 插件配置页面
 * 左侧侧边栏选择已安装的插件，右侧使用 Schema 驱动的表单渲染配置
 * 部分插件没有配置 Schema，会显示空状态提示
 * 支持通过 URL 参数 ?plugin=xxx 快捷跳转到指定插件配置
 */
export function PluginConfig () {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null)

  // 仅已安装的插件才能配置
  const installedPlugins = useMemo(() => {
    return mockPlugins.filter(p => p.installed)
  }, [])

  // 通过 URL 参数快捷跳转到指定插件
  useEffect(() => {
    const pluginIdFromUrl = searchParams.get('plugin')
    if (pluginIdFromUrl) {
      const found = installedPlugins.find(p => p.id === pluginIdFromUrl)
      if (found) {
        const timer = setTimeout(() => setSelectedPluginId(pluginIdFromUrl), 0)
        return () => clearTimeout(timer)
      } else {
        toast.error(t('pluginConfig.pluginNotFound', '未找到指定插件或插件未安装'))
      }
    }
  }, [searchParams, installedPlugins, t])

  const selectedPlugin = useMemo(() => {
    return installedPlugins.find(p => p.id === selectedPluginId) ?? null
  }, [selectedPluginId, installedPlugins])

  // 获取选中插件的 Schema 和数据
  const selectedSchema = selectedPluginId ? pluginConfigSchemas[selectedPluginId] : null
  const selectedData = selectedPluginId ? pluginConfigData[selectedPluginId] ?? {} : {}

  const hasConfig = (pluginId: string) => !!pluginConfigSchemas[pluginId]

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log(`保存插件 [${selectedPluginId}] 配置:`, data)
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success('配置保存成功！')
  }

  return (
    <div className="w-full h-full p-4 flex gap-4">
      {/* 左侧导航卡片 */}
      <PluginListSidebar
        plugins={installedPlugins}
        selectedPluginId={selectedPluginId}
        onSelectPlugin={setSelectedPluginId}
        title={t('pluginConfig.title', '插件配置')}
        subtitle={t('pluginConfig.subtitle', '管理已安装插件的参数')}
        searchPlaceholder={t('pluginConfig.search', '搜索插件...')}

        showFooterStats
        renderFooterStats={() => (
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>{installedPlugins.length} 个插件</span>
            <span>{installedPlugins.filter(p => hasConfig(p.id)).length} 个可配置</span>
          </div>
        )}
      />

      {/* 右侧内容卡片 */}
      <Card className="flex-1 h-full glass-panel shadow-none rounded-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {selectedPlugin ? (
            <>
              {/* 顶部面包屑和标题区域 */}
              <div className="shrink-0 px-8 py-6 border-b border-slate-200/50">
                <Breadcrumbs size="sm" className="mb-2">
                  <BreadcrumbItem className="text-slate-500">Karin</BreadcrumbItem>
                  <BreadcrumbItem className="text-slate-500">
                    {t('pluginConfig.title', '插件配置')}
                  </BreadcrumbItem>
                  <BreadcrumbItem className="text-slate-800">
                    {selectedPlugin.name}
                  </BreadcrumbItem>
                </Breadcrumbs>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/50 shadow-sm border border-white/50 rounded-lg">
                    <Avatar
                      src={selectedPlugin.icon || selectedPlugin.authors.avatarUrl}
                      name={selectedPlugin.name.charAt(0).toUpperCase()}
                      size="sm"
                      radius="lg"
                      className="bg-primary-50 text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-slate-800 truncate">
                        {selectedPlugin.name}
                      </h1>
                      <Chip size="sm" variant="flat" color="default" className="shrink-0">
                        v{selectedPlugin.version}
                      </Chip>
                      {selectedSchema && (
                        <Chip size="sm" variant="flat" color="primary" className="shrink-0">
                          可配置
                        </Chip>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {selectedPlugin.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPlugin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedSchema ? (
                      <SchemaForm
                        schema={selectedSchema}
                        initialData={selectedData}
                        onSubmit={handleSubmit}
                      />
                    ) : (
                      /* 无配置 Schema 的空状态 */
                      <div className="flex items-center justify-center h-full min-h-100">
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100/50 border border-slate-200/30 flex items-center justify-center">
                            <Settings size={36} className="text-slate-300" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-600 mb-2">
                            {t('pluginConfig.noConfig', '暂无配置项')}
                          </h3>
                          <p className="text-sm text-slate-400 max-w-xs mx-auto">
                            {t(
                              'pluginConfig.noConfigDesc',
                              '该插件未提供配置 Schema，无需额外配置即可使用。'
                            )}
                          </p>
                          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <Puzzle size={14} />
                            <span>{t('pluginConfig.pluginReady', '插件已就绪，开箱即用')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* 未选择插件的空状态 */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100/50 border border-slate-200/30 flex items-center justify-center">
                  <FileSliders size={36} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">
                  {t('pluginConfig.selectPlugin', '选择一个插件')}
                </h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  {t(
                    'pluginConfig.selectPluginDesc',
                    '从左侧列表中选择一个已安装的插件以管理其配置'
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
