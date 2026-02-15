import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { 
  ScrollShadow,
  Card,
} from "@heroui/react"
import { Search } from 'lucide-react'
import type { Plugin } from '../types/plugin'
import { 
  BackgroundBlobs,
  PluginCard,
  PluginModal,
  PluginSidebar,
  usePlugins
} from '../components/plugins'

export function Plugins() {
  const { t } = useTranslation()
  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    selectedPlugin,
    setSelectedPlugin,
    filteredPlugins,
    paginatedPlugins,
    rowsPerPage
  } = usePlugins()

  // Handle modal state
  const isOpen = selectedPlugin !== null
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPlugin(null)
    }
  }

  const handleCardClick = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
  }

  return (
    <div className="h-full w-full p-4 flex gap-4 overflow-hidden font-sans">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      
      {/* Sidebar Area */}
      <div className="w-64 h-full shrink-0 z-20">
        <PluginSidebar 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Decoration */}
        <BackgroundBlobs />
        
        {/* Header */}
        <div className="h-20 shrink-0 px-8 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/50 z-10 sticky top-0 bg-[#fcfcfc]/80 dark:bg-[#09090b]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 text-sm font-medium transition-all placeholder:text-slate-400"
                placeholder={t('plugins.search', 'Search plugins...')}
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <ScrollShadow className="flex-1 p-8 scrollbar-hide">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {paginatedPlugins.map((plugin, index) => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  index={index}
                  onCardClick={handleCardClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPlugins.length > rowsPerPage && (
            <div className="flex justify-center mt-8 pb-8">
              <nav className="flex gap-2" aria-label="Pagination">
                {Array.from({ length: Math.ceil(filteredPlugins.length / rowsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      page === i + 1
                        ? 'bg-white shadow-sm text-slate-900 border border-slate-200 dark:bg-zinc-800 dark:text-slate-100 dark:border-zinc-700'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-white hover:shadow-sm hover:text-slate-900'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </ScrollShadow>

        {/* Detail Modal */}
        <PluginModal 
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectedPlugin={selectedPlugin}
        />
      </Card>
    </div>
  )
}