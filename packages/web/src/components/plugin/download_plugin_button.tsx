import { TbDownload } from 'react-icons/tb'
import { Button } from '@heroui/button'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal'
import type { OnlinePluginInfo } from '@/types/plugins'

export const DownloadPluginButton = ({ plugin }: { plugin: OnlinePluginInfo<'all'> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleInstall = () => {
    // TODO: 处理安装逻辑
    onClose()
  }

  return (
    <>
      <Button isIconOnly variant="light" size="sm" onPress={onOpen}>
        <TbDownload className="text-lg" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg">安装插件</h3>
            <p className="text-sm text-default-500 font-normal">确认安装 {plugin.name} 插件吗？</p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-sm text-default-600 shrink-0">插件描述：</span>
                <p className="text-sm text-default-500">{plugin.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600">版本号：</span>
                <span className="text-sm text-default-500">
                  {'version' in plugin ? (plugin.version as string) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600">许可证：</span>
                <span className="text-sm text-default-500">{plugin.license.name}</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleInstall}>
              确认安装
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
