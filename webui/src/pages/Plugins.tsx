import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Button, 
  Chip, 
  Avatar, 
  ScrollShadow,
  Card,
  CardBody,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination
} from "@heroui/react"
import { 
  Search, 
  Box, 
  Download, 
  ExternalLink, 
  Github, 
  CheckCircle2,
  LayoutGrid,
  Package,
  Command,
  Hash
} from 'lucide-react'
import { mockPlugins } from '../mocks/plugins'
import type { Plugin } from '../types/plugin'
import { clsx } from 'clsx'

  const SidebarItem = ({ 
  id, 
  label, 
  icon: Icon, 
  count, 
  activeFilter, 
  setActiveFilter 
}: { 
  id: string, 
  label: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any, 
  count?: number,
  activeFilter: string,
  setActiveFilter: (id: string) => void 
}) => (
  <button
    onClick={() => setActiveFilter(id)}
    className={clsx(
      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
      activeFilter === id 
        ? "bg-white shadow-sm text-slate-900 dark:bg-zinc-800 dark:text-white dark:shadow-none" 
        : "text-slate-500 hover:bg-white/60 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon size={16} className={clsx(activeFilter === id ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-500")} />}
      <span>{label}</span>
    </div>
    {count !== undefined && (
      <span className={clsx(
        "text-xs px-2 py-0.5 rounded-md transition-colors",
        activeFilter === id 
          ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white" 
          : "bg-slate-100/50 dark:bg-zinc-800 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-500"
      )}>
        {count}
      </span>
    )}
  </button>
)

export function Plugins() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 12
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // Extract unique tags for sidebar
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    mockPlugins.forEach(p => p.tags?.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  // Filter logic
  const filteredPlugins = useMemo(() => {
    return mockPlugins.filter(plugin => {
      // Search filter
      const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Category/Tag filter
      let matchesFilter = true
      if (activeFilter === 'all') matchesFilter = true
      else if (activeFilter === 'installed') matchesFilter = plugin.installed
      else if (activeFilter === 'npm') matchesFilter = plugin.type === 'npm'
      else if (activeFilter === 'custom') matchesFilter = plugin.type === 'custom'
      else matchesFilter = plugin.tags?.includes(activeFilter) || false

      return matchesSearch && matchesFilter
    })
  }, [searchQuery, activeFilter])

  const paginatedPlugins = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return filteredPlugins.slice(start, start + rowsPerPage)
  }, [page, filteredPlugins])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeFilter])

  const handleCardClick = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    onOpen()
  }

  return (
    <div className="h-full w-full flex overflow-hidden bg-[#fcfcfc] dark:bg-[#09090b] font-sans">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
      
      {/* Internal Sidebar */}
      <div className="w-64 shrink-0 flex flex-col border-r border-slate-100 dark:border-zinc-800/50 bg-white/50 dark:bg-transparent backdrop-blur-xl z-20">
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
              count={mockPlugins.filter(p => p.installed).length} 
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
              id="custom" 
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30 dark:bg-black/20 relative">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
         
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
               className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            >
               <AnimatePresence mode='popLayout'>
                  {paginatedPlugins.map((plugin) => (
                    <motion.div
                      key={plugin.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <Card 
                        isPressable
                        onPress={() => handleCardClick(plugin)}
                        className="w-full border-none bg-white/70 dark:bg-zinc-900/70 shadow-sm hover:shadow-lg dark:hover:shadow-black/20 hover:scale-[1.01] transition-all duration-300 h-28 backdrop-blur-md"
                      >
                         <CardBody className="p-0 flex flex-row items-center h-full relative overflow-hidden group/card">
                            {/* Left: Avatar Section */}
                            <div className="w-24 h-full flex items-center justify-center shrink-0 bg-slate-50/50 dark:bg-zinc-900/30 border-r border-slate-100/50 dark:border-zinc-800/50">
                                <Avatar 
                                    radius="full" 
                                    src={plugin.authors[0]?.avatar}
                                    name={plugin.name.charAt(0)}
                                    className={clsx(
                                      "w-14 h-14 text-xl shadow-md transition-transform duration-300 group-hover/card:scale-110",
                                      plugin.type === 'npm' 
                                        ? "bg-linear-to-br from-rose-100 to-orange-50 text-rose-600 dark:from-rose-900/40 dark:to-orange-900/20 dark:text-rose-400" 
                                        : "bg-linear-to-br from-cyan-100 to-blue-50 text-blue-600 dark:from-cyan-900/40 dark:to-blue-900/20 dark:text-blue-400"
                                    )}
                                />
                            </div>

                            {/* Middle: Content */}
                            <div className="flex-1 flex flex-col justify-center px-5 py-3 overflow-hidden min-w-0 h-full relative">
                               {/* Title Row */}
                               <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate pr-2 group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">
                                     {plugin.name}
                                  </h3>
                                  {plugin.installed && (
                                     <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" title={t('plugins.installed', 'Installed')}>
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                     </div>
                                  )}
                               </div>

                               {/* Description */}
                               <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 pr-4 mb-3 h-8">
                                  {plugin.description}
                               </p>

                               {/* Tags & Meta */}
                               <div className="flex items-center justify-between mt-auto">
                                  <div className="flex gap-2">
                                     {plugin.tags?.slice(0, 3).map(tag => (
                                       <span 
                                          key={tag} 
                                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700/50"
                                       >
                                         {tag}
                                       </span>
                                     ))}
                                  </div>
                                  <div className="text-[10px] text-slate-400 px-2 font-mono opacity-0 group-hover/card:opacity-100 transition-opacity">
                                     v{plugin.version}
                                  </div>
                               </div>
                            </div>
                            
                            {/* Right: Actions (Slide in on hover) */}
                            <div className="w-16 h-full absolute right-0 top-0 bottom-0 bg-linear-to-l from-white via-white/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90 flex items-center justify-center opacity-0 group-hover/card:opacity-100 translate-x-full group-hover/card:translate-x-0 transition-all duration-300 z-10">
                               {!plugin.installed ? (
                                 <Button 
                                   isIconOnly
                                   size="sm" 
                                   className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md rounded-full w-10 h-10"
                                   title={t('plugins.install', 'Install')}
                                 >
                                    <Download size={18} />
                                 </Button>
                               ) : (
                                  <Button 
                                    isIconOnly
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    className="rounded-full w-10 h-10"
                                  >
                                    <Box size={18} />
                                  </Button>
                               )}
                            </div>
                         </CardBody>
                      </Card>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </motion.div>

            {filteredPlugins.length > rowsPerPage && (
               <div className="flex justify-center mt-8 pb-8">
                  <Pagination 
                     total={Math.ceil(filteredPlugins.length / rowsPerPage)}
                     page={page}
                     onChange={setPage}
                     showControls
                     variant="light"
                     classNames={{
                        cursor: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                     }}
                  />
               </div>
            )}
         </ScrollShadow>

         {/* Detail Modal */}
         <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            size="2xl"
            backdrop="blur"
            classNames={{
               base: "bg-white dark:bg-zinc-900 shadow-2xl border border-slate-100 dark:border-zinc-800"
            }}
         >
            <ModalContent>
               {(onClose) => selectedPlugin && (
                  <>
                     <ModalHeader className="pt-8 px-8 pb-0">
                        <div className="flex gap-5 w-full">
                           <div className={clsx(
                              "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                              selectedPlugin.type === 'npm' ? "bg-rose-50 dark:bg-rose-900/10 text-rose-500" : "bg-cyan-50 dark:bg-cyan-900/10 text-cyan-500"
                           )}>
                              {selectedPlugin.type === 'npm' ? <Package size={36} /> : <Command size={36} />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedPlugin.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                       <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs h-6">v{selectedPlugin.version}</Chip>
                                       <div className="w-1 h-1 rounded-full bg-slate-300" />
                                       <span className="text-sm text-slate-500">{t('plugins.updated', 'Updated')} 2 days ago</span>
                                    </div>
                                 </div>
                                 <div className="flex gap-2">
                                    <Button isIconOnly size="sm" variant="light" as="a" href={selectedPlugin.repo} target="_blank">
                                       <Github size={20} className="text-slate-400 hover:text-slate-700" />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" as="a" href={selectedPlugin.homepage} target="_blank">
                                       <ExternalLink size={20} className="text-slate-400 hover:text-slate-700" />
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </ModalHeader>
                     <ModalBody className="px-8 py-8">
                        <Divider className="my-2" />
                        <div className="grid grid-cols-3 gap-8">
                           {/* Left Info Column */}
                           <div className="col-span-1 space-y-6">
                              <div>
                                 <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('plugins.author', 'Author')}</div>
                                 <div className="flex items-center gap-2">
                                    <Avatar src={selectedPlugin.authors[0]?.avatar} size="sm" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">{selectedPlugin.authors[0]?.name}</span>
                                 </div>
                              </div>
                              <div>
                                 <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('plugins.license', 'License')}</div>
                                 <div className="text-sm font-medium text-slate-700 dark:text-zinc-200">{selectedPlugin.license || 'MIT'}</div>
                              </div>
                              <div>
                                 <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('plugins.tags', 'Tags')}</div>
                                 <div className="flex flex-wrap gap-1.5">
                                    {selectedPlugin.tags?.map(t => (
                                       <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-md text-xs text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                                          {t}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                              <div>
                                 <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('plugins.downloads', 'Downloads')}</div>
                                 <div className="text-sm font-medium text-slate-700 dark:text-zinc-200">1.2k</div>
                              </div>
                           </div>

                           {/* Right Description Column */}
                           <div className="col-span-2">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">{t('plugins.about', 'About this plugin')}</h3>
                              <p className="text-sm leading-7 text-slate-600 dark:text-zinc-400 font-light text-justify">
                                 {selectedPlugin.description}
                                 <br/><br/>
                                 This section is a placeholder for the full description or README content fetched from the repository. It would ideally support Markdown rendering to display features, usage instructions, and configuration options comprehensively.
                              </p>
                              
                              <div className="mt-6 p-4 bg-slate-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-400 text-sm">
                                 {t('plugins.read_docs', 'Read full documentation')} <ExternalLink size={14} className="ml-1" />
                              </div>
                           </div>
                        </div>
                     </ModalBody>
                     <ModalFooter className="px-8 pb-8 pt-0 justify-between items-center border-t border-transparent">
                        <span className="text-xs text-slate-400 font-mono">{selectedPlugin.id}</span>
                        {!selectedPlugin.installed ? (
                           <Button 
                              size="lg"
                              className="bg-slate-900 dark:bg-white text-white dark:text-black font-semibold shadow-xl shadow-slate-900/10"
                              startContent={<Download size={18} />}
                              onPress={() => { /* install */ onClose() }}
                           >
                              {t('plugins.install', 'Install')}
                           </Button>
                        ) : (
                           <Button size="lg" color="danger" variant="flat" onPress={() => { /* uninstall */ onClose() }}>
                              {t('plugins.uninstall', 'Uninstall')}
                           </Button>
                        )}
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
      </div>
    </div>
  )
}