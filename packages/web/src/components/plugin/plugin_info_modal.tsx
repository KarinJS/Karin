import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { Button } from "@heroui/button"
import { Chip } from "@heroui/chip"
import { TbApps } from "react-icons/tb"
import { FaGear } from "react-icons/fa6"
import type { KarinBase } from '@/types/plugins'

interface PluginInfoModalProps {
  isOpen: boolean
  onClose: () => void
  plugin: KarinBase<'all'>[number]
  onUpdate: () => void
  onUninstall: () => void
  onViewApps?: () => void
  onViewConfig: () => void
}

export function PluginInfoModal ({
  isOpen,
  onClose,
  plugin,
  onUpdate,
  onUninstall,
  onViewApps,
  onViewConfig
}: PluginInfoModalProps) {
  const showViewApps = plugin.type.toLowerCase() === 'app' && onViewApps

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      title="插件配置"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{plugin.name}</h3>
          <p className="text-sm text-default-600">{plugin.description}</p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-600">当前版本</span>
              <Chip size="sm" variant="flat" color="primary">
                {plugin.version}
              </Chip>
            </div>
            {plugin.latestVersion && plugin.latestVersion !== plugin.version && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">最新版本</span>
                <Chip size="sm" variant="flat" color="success">
                  {plugin.latestVersion}
                </Chip>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="light"
              onPress={onUpdate}
              isDisabled={!plugin.latestVersion || plugin.latestVersion === plugin.version}
            >
              更新
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={onUninstall}
            >
              卸载
            </Button>
            {showViewApps && (
              <Button
                color="secondary"
                variant="light"
                onPress={onViewApps}
                startContent={<TbApps />}
              >
                查看应用
              </Button>
            )}
            {plugin.type.toLowerCase() !== 'app' && (
              <Button
                color="secondary"
                variant="light"
                onPress={onViewConfig}
                startContent={<FaGear />}
              >
                配置
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 