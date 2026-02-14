import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Link } from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: string
  link?: string
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, content, link }: ConfirmModalProps) => {
  const { t } = useTranslation()
  
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onClose} 
      size="md"
      classNames={{
        base: "bg-white dark:bg-zinc-900",
        header: "border-b border-gray-100 dark:border-gray-800",
        footer: "border-t border-gray-100 dark:border-gray-800"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center text-slate-700 dark:text-slate-100">
               {title}
            </ModalHeader>
            <ModalBody className="py-6">
              <p className="text-sm text-slate-600 dark:text-slate-300">{content}</p>
              {link && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-700">
                  <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    {t('plugins.target_link', 'Target Link')}
                  </div>
                  <div className="flex items-center gap-2 text-primary break-all">
                    <ExternalLink size={14} className="shrink-0" />
                    <span className="text-sm font-mono">{link}</span>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} className="text-slate-500">
                {t('common.cancel', '取消')}
              </Button>
              <Button color="primary" onPress={() => {
                onConfirm()
                onClose()
              }}>
                {t('common.confirm', '确认')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
