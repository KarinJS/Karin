import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ScrollShadow,
  Divider,
} from "@heroui/react"
import { ExternalLink, LayoutGrid, CheckCircle2, Package, Command, Hash } from 'lucide-react'
import { mockPlugins } from '../../mocks/plugins'
import { SidebarItem } from './SidebarItem'

interface PluginSidebarProps {
  activeFilter: string
  setActiveFilter: (id: string) => void
}

export const PluginSidebar = ({ activeFilter, setActiveFilter }: PluginSidebarProps) => {
  const { t } = useTranslation()

  // Extract unique tags for sidebar
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    mockPlugins.forEach(p => p.tags?.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const installedCount = useMemo(() => {
    return mockPlugins.filter(p => p.installed).length
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold font-serif-sc text-slate-900 dark:text-slate-100 px-1">
          {t('plugins.title', 'Market')}
        </h2>
        <p className="text-xs text-slate-400 dark:text-zinc-500 px-1 mt-1 font-medium tracking-wide uppercase">
          {t('plugins.extension_store', 'Extension Store')}
        </p>
      </div>

      <ScrollShadow className="flex-1 px-4 py-2 space-y-6">
        {/* Main Groups */}
        <div className="space-y-1">
          <SidebarItem
            id="all"
            label={t('plugins.tabs.all', 'Discover')}
            icon={LayoutGrid}
            count={mockPlugins.length}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <SidebarItem
            id="installed"
            label={t('plugins.tabs.installed', 'Installed')}
            icon={CheckCircle2}
            count={installedCount}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        <Divider className="bg-slate-100 dark:bg-zinc-800" />

        {/* Types */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('plugins.sources', 'Sources')}</div>
          <SidebarItem
            id="npm"
            label={t('plugins.tabs.npm', 'NPM Registry')}
            icon={Package}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <SidebarItem
            id="url"
            label={t('plugins.tabs.direct', 'Direct Link')}
            icon={Command}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        <Divider className="bg-slate-100 dark:bg-zinc-800" />

        {/* Tags */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('plugins.tags', 'Tags')}</div>
          {allTags.map(tag => (
            <SidebarItem
              key={tag}
              id={tag}
              label={tag.charAt(0).toUpperCase() + tag.slice(1)}
              icon={Hash}
              count={mockPlugins.filter(p => p.tags?.includes(tag)).length}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          ))}
        </div>
      </ScrollShadow>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-zinc-800/50">
        <div className="p-3 bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10 text-white">
            <div className="text-xs font-medium opacity-80 mb-1">{t('plugins.developer', 'Developer?')}</div>
            <div className="text-sm font-bold flex items-center gap-1 cursor-pointer hover:underline">
              {t('plugins.publish', 'Publish Plugin')} <ExternalLink size={12} />
            </div>
          </div>
          <Box className="absolute -bottom-2 -right-2 text-white/20 w-16 h-16 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>
      </div>
    </div>
  )
}

// Helper component for the decorative icon
const Box = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" style={{ width: 'inherit', height: 'inherit' }}>
    <path d="M12 2l5 3v7h-2v-5.86L12 4.14 7 7.14V14H5V5l7-3z" />
  </svg>
)
