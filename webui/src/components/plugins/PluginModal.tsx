import { useTranslation } from 'react-i18next'
import { 
  Button, 
  Chip, 
  Avatar, 
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react"
import { Download, ExternalLink, Github, Package, Command } from 'lucide-react'
import type { Plugin } from '../../types/plugin'
import { clsx } from 'clsx'

interface PluginModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedPlugin: Plugin | null
}

export const PluginModal = ({ isOpen, onOpenChange, selectedPlugin }: PluginModalProps) => {
  const { t } = useTranslation()

  return (
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
                  className="bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
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
  )
}
