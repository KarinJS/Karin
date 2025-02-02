import { useState } from 'react'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { useDisclosure } from '@heroui/modal'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { FaDownload, FaTrash, FaList } from 'react-icons/fa6'
import { Link } from '@heroui/link'
import type { KarinBase } from '@/types/plugins'
import { PluginAppsModal } from './plugin_apps_modal'

interface Props {
  plugin: KarinBase<'all'>[number]
  installed?: boolean
}

export function DownloadPluginButton ({ plugin, installed }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isAppsOpen, setIsAppsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { loading: downloadLoading, run: downloadPlugin } = useRequest<any, [void]>(
    () =>
      request.serverPost('/api/v1/plugin/download', {
        name: plugin.name,
        version: plugin.version,
      }),
    {
      manual: true,
    },
  )

  const { loading: uninstallLoading, run: uninstallPlugin } = useRequest<any, [void]>(
    () =>
      request.serverPost('/api/v1/plugin/uninstall', {
        name: plugin.name,
      }),
    {
      manual: true,
    },
  )

  const handleInstall = async () => {
    try {
      setIsLoading(true)
      await downloadPlugin()
      onClose()
    } catch (error) {
      console.error('安装失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowApps = () => {
    console.log('Showing apps for plugin:', plugin.name)
    setIsAppsOpen(true)
  }

  const renderButtons = () => {
    if (installed) {
      return (
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="light"
            size="sm"
            isLoading={uninstallLoading}
            startContent={<FaTrash />}
            onClick={() => uninstallPlugin()}
          >
            卸载
          </Button>
          {plugin.type === 'app' && (
            <Button
              color="primary"
              variant="light"
              size="sm"
              startContent={<FaList />}
              onClick={handleShowApps}
            >
              应用列表
            </Button>
          )}
        </div>
      )
    }

    return (
      <Button
        size="sm"
        color={installed ? "default" : "primary"}
        variant={installed ? "light" : "solid"}
        onPress={onOpen}
        isDisabled={installed}
      >
        {installed ? "已安装" : "安装"}
      </Button>
    )
  }

  return (
    <>
      {renderButtons()}

      {/* 安装确认弹窗 */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        classNames={{
          base: "border border-default-200",
          header: "border-b border-default-200",
          body: "py-6",
          footer: "border-t border-default-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">
              安装确认
            </h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-24 text-default-500 text-sm">插件名称</div>
                <div className="text-sm font-mono bg-default-100 px-2 py-0.5 rounded">
                  {plugin.name}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-24 text-default-500 text-sm">版本</div>
                <div className="text-sm font-mono bg-default-100 px-2 py-0.5 rounded">
                  {plugin.version}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-24 text-default-500 text-sm">描述</div>
                <div className="text-sm text-default-600">
                  {plugin.description}
                </div>
              </div>

              {plugin.author.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-24 text-default-500 text-sm">作者</div>
                  <div className="text-sm text-default-600">
                    {plugin.author.map((author, index) => (
                      <span key={author.name + index}>
                        {author.name}
                        {index !== plugin.author.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plugin.license?.name && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-24 text-default-500 text-sm">开源许可</div>
                  <div className="text-sm text-default-600">
                    {plugin.license.name}
                  </div>
                </div>
              )}

              {plugin.home && plugin.home !== '-' && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-24 text-default-500 text-sm">插件主页</div>
                  <div className="text-sm text-default-600">
                    <Link
                      href={plugin.home}
                      isExternal
                      showAnchorIcon
                      className="text-primary-500 hover:text-primary-600"
                    >
                      {plugin.home}
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-warning-50 text-warning-600 rounded-lg text-sm">
                <p className="font-medium mb-2">免责声明</p>
                <div className="space-y-2">
                  <p>在安装并使用此插件之前，请您仔细阅读并理解以下声明：</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>安装前请自行评估其安全性和适用性</li>
                    <li>使用本插件所产生的任何直接或间接后果，均由用户自行承担</li>
                    <li>我们不对插件的可用性、可靠性和准确性做任何明示或暗示的保证</li>
                    <li>如遇任何技术问题，建议及时与插件开发者联系或停止使用</li>
                  </ul>
                  <p className="mt-2 text-xs">点击"确认安装"即表示您已完全理解并接受上述免责声明的全部内容。</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={onClose}
            >
              取消
            </Button>
            <Button
              color="primary"
              onPress={handleInstall}
              isLoading={isLoading}
            >
              确认安装
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <PluginAppsModal
        isOpen={isAppsOpen}
        onClose={() => setIsAppsOpen(false)}
        pluginName={plugin.name}
      />
    </>
  )
}
