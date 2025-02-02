import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { Button } from "@heroui/button"
import { Chip } from "@heroui/chip"
import { TbApps } from "react-icons/tb"
import { FaGear, FaGithub, FaGitter, FaNpm } from "react-icons/fa6"
import { Link } from "@heroui/link"
import type { KarinBase } from '@/types/plugins'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { InstallLogModal } from '@/components/plugin/install_log_modal'

interface PluginInfoModalProps {
  isOpen: boolean
  onClose: () => void
  plugin: KarinBase<'all'>[number]
  onUpdate: () => void
  onUninstall: () => void
  onViewApps?: () => void
  onViewConfig: () => void
}

const getRepoIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'github':
      return <FaGithub className="text-lg" />
    case 'gitee':
      return <FaGitter className="text-lg text-red-500" />
    case 'npm':
      return <FaNpm className="text-lg text-[#CB3837]" />
    default:
      return null
  }
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
  const [isUninstalling, setIsUninstalling] = useState(false)
  const [taskId, setTaskId] = useState<string>('')
  const [hasConfig, setHasConfig] = useState<boolean>(false)
  const [checkingConfig, setCheckingConfig] = useState<boolean>(false)

  const { loading: uninstallLoading, run: handleUninstall } = useRequest<{ taskId: string }, any>(
    async () => {
      if (plugin.type.toLowerCase() === 'app') {
        throw new Error('不支持卸载 App 类型的插件')
      }
      const { taskId } = await request.serverPost<{ taskId: string }, { name: string; type: string }>('/api/v1/plugin/uninstall', {
        name: plugin.name,
        type: plugin.type
      })
      setTaskId(taskId)
      setIsUninstalling(true)
      return { taskId }
    },
    {
      manual: true,
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // 检查配置文件是否存在
  const { loading: configCheckLoading, run: checkConfig } = useRequest(
    async () => {
      const result = await request.serverPost<boolean, { name: string; type: string }>(
        '/api/v1/plugin/config/is-exist',
        {
          name: plugin.name,
          type: plugin.type
        }
      )
      setHasConfig(result)
      return result
    },
    {
      manual: true,
      onError: (error) => {
        toast.error('检查配置文件失败: ' + error.message)
        setHasConfig(false)
      }
    }
  )

  // 组件挂载和插件变化时检查配置
  useEffect(() => {
    if (plugin && plugin.type.toLowerCase() !== 'app') {
      setCheckingConfig(true)
      Promise.resolve(checkConfig()).finally(() => {
        setCheckingConfig(false)
      })
    }
  }, [plugin])

  return (
    <>
      <Modal
        isOpen={isOpen && !isUninstalling}
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">仓库源</span>
                <div className="flex items-center gap-2">
                  {Array.isArray(plugin.repo) && plugin.repo.length > 0 ? (
                    plugin.repo.map((repo, index) => (
                      <Link
                        key={repo.url + index}
                        className="text-default-600 hover:text-default-900 transition-colors inline-flex"
                        href={repo.url}
                        isExternal
                      >
                        {getRepoIcon(repo.type)}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-default-400">-</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">开源许可</span>
                {plugin.license.url ? (
                  <Link
                    className="text-xs text-primary-500 hover:text-primary-600 inline-flex items-center"
                    href={plugin.license.url}
                    isExternal
                    showAnchorIcon
                  >
                    {plugin.license.name}
                  </Link>
                ) : (
                  <span className="text-sm text-default-400">{plugin.license.name || '-'}</span>
                )}
              </div>
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
                onPress={handleUninstall}
                isLoading={uninstallLoading}
                isDisabled={plugin.type.toLowerCase() === 'app'}
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
                  isLoading={checkingConfig}
                  isDisabled={!hasConfig}
                >
                  配置
                </Button>
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <InstallLogModal
        isOpen={isUninstalling}
        onClose={() => {
          setIsUninstalling(false)
          onUninstall()
        }}
        taskId={taskId}
        plugin={plugin}
        task={{
          id: taskId,
          name: plugin.name,
          type: 'uninstall',
          status: 'running',
          minimized: false,
          logs: []
        }}
      />
    </>
  )
} 