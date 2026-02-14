import { useState } from 'react'
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
import { Download, ExternalLink, Github, Package, Command, Check } from 'lucide-react'
import type { Plugin } from '../../types/plugin'
import { clsx } from 'clsx'
import { sanitizeHtml } from '../../utils/html'
import { ConfirmModal } from '../common/ConfirmModal'

interface PluginModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedPlugin: Plugin | null
}

export const PluginModal = ({ isOpen, onOpenChange, selectedPlugin }: PluginModalProps) => {
  const { t } = useTranslation()
  const [confirmData, setConfirmData] = useState<{ url: string, title?: string, content?: string } | null>(null)

  const handleLinkClick = (url: string, type: 'homepage' | 'author' | 'repo') => {
    if (!url) return
    
    // Using translation keys with fallbacks, ensuring messages are in Chinese as requested
    const messages = {
      homepage: {
        title: t('plugins.visit_homepage', '访问主页'),
        content: t('plugins.confirm_visit_homepage', '即将跳转到插件主页，是否继续？')
      },
      author: {
        title: t('plugins.visit_author', '访问作者主页'),
        content: t('plugins.confirm_visit_author', '即将跳转到作者主页，是否继续？')
      },
      repo: {
        title: t('plugins.visit_repo', '访问仓库'),
        content: t('plugins.confirm_visit_repo', '即将跳转到代码仓库，是否继续？')
      }
    }

    setConfirmData({
      url,
      ...messages[type]
    })
  }

  const onConfirm = () => {
    if (confirmData?.url) {
      window.open(confirmData.url, '_blank')
    }
    setConfirmData(null)
  }

  // Helper to check if license is a URL
  const isUrl = (str: string) => {
    try {
      return Boolean(new URL(str))
    } catch {
      return false
    }
  }

  const renderLicense = (license: string) => {
    if (!license) return 'MIT'
    
    // Split by comma or space if multiple licenses might exist (simple handling)
    // For now assuming single string
    if (license.startsWith('http') || isUrl(license)) {
       return (
         <a 
           href={license}
           target="_blank" 
           rel="noopener noreferrer"
           className="text-primary hover:underline decoration-primary underline-offset-2 transition-all flex items-center gap-1"
         >
           {t('plugins.view_license', '查看协议')} <ExternalLink size={12} />
         </a>
       )
    }
    
    return license
  }

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white dark:bg-zinc-900 shadow-2xl border border-slate-100 dark:border-zinc-800 h-[80vh]",
          wrapper: "overflow-hidden"
        }}
      >
        <ModalContent>
          {(onClose) => selectedPlugin && (
            <>
              <ModalHeader className="pt-8 px-8 pb-0 shrink-0">
                <div className="flex gap-5 w-full">
                  <div className={clsx(
                    "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden",
                    "bg-primary-50 dark:bg-primary-900/10 text-primary"
                  )}>
                     {selectedPlugin.icon || selectedPlugin.authors.avatarUrl ? (
                      <img 
                        src={selectedPlugin.icon || selectedPlugin.authors.avatarUrl} 
                        alt={selectedPlugin.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedPlugin.type === 'npm' ? <Package size={36} /> : <Command size={36} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 
                          className="text-2xl font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:underline decoration-slate-300 underline-offset-4 transition-all"
                          onClick={() => handleLinkClick(selectedPlugin.homepage, 'homepage')}
                        >
                          {selectedPlugin.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <Chip size="sm" variant="flat" className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs h-6">v{selectedPlugin.version}</Chip>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-sm text-slate-500">{t('plugins.updated', 'Updated')} {new Date(selectedPlugin.updateTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button isIconOnly size="sm" variant="light" onPress={() => handleLinkClick(selectedPlugin.repo, 'repo')}>
                          <Github size={20} className="text-slate-400 hover:text-slate-700" />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" onPress={() => handleLinkClick(selectedPlugin.homepage, 'homepage')}>
                          <ExternalLink size={20} className="text-slate-400 hover:text-slate-700" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="px-8 py-8">
                <Divider className="my-2" />
                <div className="grid grid-cols-3 gap-8 h-full">
                  {/* Left Info Column */}
                  <div className="col-span-1 space-y-6 shrink-0">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('plugins.author', 'Author')}</div>
                      <button 
                        className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                        onClick={() => handleLinkClick(selectedPlugin.authors.url, 'author')}
                      >
                        <Avatar src={selectedPlugin.authors.avatarUrl} size="sm" />
                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200 group-hover:underline decoration-slate-300 underline-offset-2">
                          {selectedPlugin.authors.name}
                        </span>
                      </button>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('plugins.license', 'License')}</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-zinc-200">
                        {renderLicense(selectedPlugin.license)}
                      </div>
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
                      <div className="text-sm font-medium text-slate-700 dark:text-zinc-200">{selectedPlugin.downloads}</div>
                    </div>
                  </div>

                  {/* Right Description Column */}
                  <div className="col-span-2 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">{t('plugins.about', 'About this plugin')}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 font-light mb-6">
                      {selectedPlugin.description}
                    </p>
                    
                    {selectedPlugin.readme && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">README</h3>
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-zinc-400"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPlugin.readme) }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="px-8 pb-8 pt-0 justify-between items-center border-t border-transparent shrink-0">
                <span className="text-xs text-slate-400 font-mono">{selectedPlugin.id}</span>
                {!selectedPlugin.installed ? (
                  <Button 
                    size="lg"
                    color="primary"
                    className="font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    startContent={<Download size={18} />}
                    onPress={() => { /* install */ onClose() }}
                  >
                    {t('plugins.install', '安装')}
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="flat" 
                    color="success"
                    className="font-medium cursor-default"
                    startContent={<Check size={18} />}
                  >
                    {t('plugins.tabs.installed', '已安装')}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmModal 
        isOpen={!!confirmData}
        onClose={() => setConfirmData(null)}
        onConfirm={onConfirm}
        title={confirmData?.title || ''}
        content={confirmData?.content || ''}
        link={confirmData?.url}
      />
    </>
  )
}
