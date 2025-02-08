import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Spinner } from '@heroui/spinner'
import { Checkbox } from '@heroui/checkbox'
import { toast } from 'react-hot-toast'
import { FaGithub, FaNpm } from 'react-icons/fa6'
import { IoRefreshOutline, IoCloudUploadOutline, IoCheckmarkCircle } from 'react-icons/io5'
import { request } from '@/lib/request'
import { useRequest } from 'ahooks'
import type { PluginLists } from 'node-karin'

interface UpdateInfo extends PluginLists {
  currentVersion?: string
  latestVersion?: string
  currentHash?: string
  updateLog?: string
  updateCount?: number
  hasUpdate: boolean
}

interface UpdateResult {
  name: string
  status: 'ok' | 'failed'
  message: string
  currentVersion?: string
  latestVersion?: string
  commit?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function UpdateListModal ({ isOpen, onClose }: Props) {
  const [selectedPlugins, setSelectedPlugins] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState(false)

  const { data: plugins = [], loading, refresh } = useRequest<UpdateInfo[], any>(
    () => request.serverPost('/api/v1/plugin/updates'),
    {
      ready: isOpen,
      refreshDeps: [isOpen],
      onSuccess: (data) => {
        // 在请求成功后，默认选中所有可更新的插件
        const updatablePlugins = data.filter(p => p.hasUpdate).map(plugin => plugin.name)
        setSelectedPlugins(new Set(updatablePlugins))
      }
    }
  )

  const handleSelect = (plugin: UpdateInfo) => {
    const newSelected = new Set(selectedPlugins)
    if (newSelected.has(plugin.name)) {
      newSelected.delete(plugin.name)
      console.log(`取消选择插件: ${plugin.name}`)
    } else {
      newSelected.add(plugin.name)
      console.log(`选择插件: ${plugin.name}`)
    }
    setSelectedPlugins(newSelected)
    console.log(`当前选中的插件数量: ${newSelected.size}`)
    console.log(`按钮状态: ${newSelected.size === updatableCount ? '取消全选' : '全选'}`)
  }

  const handleSelectAll = () => {
    const allPlugins = plugins.map(plugin => plugin.name)
    console.log(`当前选中的插件数量: ${selectedPlugins.size}, 所有插件数量: ${allPlugins.length}`)
    if (selectedPlugins.size === allPlugins.length) {
      // 如果当前已全选，则取消全选
      console.log('取消全选')
      setSelectedPlugins(new Set())
    } else {
      // 否则全选
      console.log('全选插件:', allPlugins)
      setSelectedPlugins(new Set(allPlugins))
    }
    console.log(`全选后的插件数量: ${selectedPlugins.size}`)
  }

  const handleUpdate = async () => {
    const selectedPluginsArray = Array.from(selectedPlugins)
    console.log('即将更新的插件:', selectedPluginsArray)
    const hasUpdatePlugins = selectedPluginsArray.filter(name =>
      plugins.find(p => p.name === name && p.hasUpdate)
    )

    if (hasUpdatePlugins.length === 0) {
      toast.error('选中的插件中没有需要更新的插件')
      return
    }

    setUpdating(true)
    try {
      const result = await request.serverPost<UpdateResult[], { plugins: string[] }>('/api/v1/plugin/update/batch', {
        plugins: hasUpdatePlugins
      })

      // 处理更新结果
      console.log('更新结果:', result)
      const successCount = result.filter(r => r.status === 'ok').length
      const failedCount = result.length - successCount

      if (failedCount === 0) {
        toast.success(`成功更新 ${successCount} 个插件`)
      } else {
        toast.error(`${successCount} 个插件更新成功，${failedCount} 个插件更新失败`)
      }

      // 触发插件列表更新事件
      window.dispatchEvent(new Event('plugin-list-update'))
      onClose()
    } catch (error) {
      toast.error('更新失败：' + (error as Error).message)
    } finally {
      setUpdating(false)
    }
  }

  // 获取可更新的插件数量
  const updatableCount = plugins.filter(p => p.hasUpdate).length

  // 在渲染部分，动态更新按钮文本
  const allPlugins = plugins.map(plugin => plugin.name)
  const allSelected = selectedPlugins.size === allPlugins.length

  // 在插件列表渲染完成后，更新全选按钮的状态
  useEffect(() => {
    console.log('插件列表更新:', plugins)
    const updatablePlugins = plugins.filter(p => p.hasUpdate).map(plugin => plugin.name)
    console.log(`当前选中的插件数量: ${selectedPlugins.size}, 所有插件数量: ${plugins.length}`)

    // 仅在需要时更新 selectedPlugins
    if (selectedPlugins.size !== updatablePlugins.length) {
      console.log('更新选中状态')
      setSelectedPlugins(new Set(updatablePlugins))
    }
    console.log(`按钮状态: ${selectedPlugins.size === plugins.length ? '取消全选' : '全选'}`)
  }, [plugins])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        base: "max-w-2xl"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">更新管理</h3>
          <p className="text-xs text-default-500">
            {updatableCount > 0 ? `有 ${updatableCount} 个插件可以更新` : '所有插件都是最新版本'}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="flat"
              size="sm"
              onPress={handleSelectAll}
              className="h-7 px-2 min-w-[76px] font-medium"
            >
              {allSelected ? '取消全选' : '全选'}
            </Button>
            <Button
              variant="flat"
              size="sm"
              onPress={refresh}
              isDisabled={loading}
              className="h-7 px-2 min-w-[76px] font-medium"
              startContent={<IoRefreshOutline className="text-base" />}
            >
              刷新
            </Button>
          </div>

          <ScrollShadow className="max-h-[400px]">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Spinner size="lg" color="primary" />
              </div>
            ) : plugins.length > 0 ? (
              <div className="w-full">
                {/* 表头 */}
                <div className="grid grid-cols-6 gap-2 px-3 py-2 bg-default-100 dark:bg-default-50/5 rounded-t-lg text-sm font-medium text-default-600">
                  <div className="col-span-2">插件名称</div>
                  <div className="col-span-2">当前版本</div>
                  <div className="col-span-2">更新状态</div>
                </div>

                {/* 表格内容 */}
                <div className="space-y-1 mt-1">
                  {plugins.map((plugin) => (
                    <div
                      key={plugin.name}
                      onClick={() => handleSelect(plugin)}
                      className={`grid grid-cols-6 gap-2 px-3 py-2 rounded-lg transition-colors ${plugin.name === 'node-karin'
                        ? 'bg-primary-50/20 dark:bg-primary-500/5'
                        : ''
                        } ${selectedPlugins.has(plugin.name)
                          ? 'bg-primary-50/50 dark:bg-primary-500/10 cursor-pointer'
                          : 'hover:bg-default-100/80 dark:hover:bg-default-100/10 cursor-pointer'
                        }`}
                    >
                      {/* 插件名称 */}
                      <div className="col-span-2 flex items-center gap-2">
                        <Checkbox
                          radius="full"
                          size="sm"
                          isSelected={selectedPlugins.has(plugin.name)}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelect(plugin)
                          }}
                        />
                        {plugin.type === 'npm' ? (
                          <FaNpm className={`text-lg ${plugin.name === 'node-karin' ? 'text-primary-500' : 'text-[#CB3837]'}`} />
                        ) : (
                          <FaGithub className="text-lg text-[#24292e]" />
                        )}
                        <span className={`text-sm truncate ${plugin.name === 'node-karin' ? 'font-semibold text-primary-600 dark:text-primary-500' : 'font-medium'}`}>
                          {plugin.name}
                        </span>
                      </div>

                      {/* 版本信息 */}
                      <div className="col-span-2 flex items-center">
                        {plugin.type === 'npm' ? (
                          <span className="text-sm text-default-500">{plugin.currentVersion}</span>
                        ) : (
                          <span className="font-mono text-sm text-default-500">{plugin.currentHash?.substring(0, 7)}</span>
                        )}
                      </div>

                      {/* 更新状态 */}
                      <div className="col-span-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {plugin.hasUpdate ? (
                            plugin.type === 'npm' ? (
                              <span className="text-sm text-primary-500">{plugin.latestVersion}</span>
                            ) : (
                              <span className="text-sm text-warning-500">有 {plugin.updateCount} 个更新</span>
                            )
                          ) : (
                            <div className="flex items-center gap-1 text-success-500">
                              <IoCheckmarkCircle className="text-lg" />
                              <span className="text-sm">最新版本</span>
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          color="primary"
                          variant={selectedPlugins.has(plugin.name) ? "solid" : "flat"}
                          onPress={() => handleSelect(plugin)}
                          className="min-w-[76px]"
                        >
                          {selectedPlugins.has(plugin.name) ? '已选择' : '选择'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-default-900 mb-1">暂无插件</p>
                  <p className="text-xs text-default-600">您还没有安装任何插件</p>
                </div>
              </div>
            )}
          </ScrollShadow>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
          >
            取消
          </Button>
          <Button
            color="primary"
            onPress={handleUpdate}
            isLoading={updating}
            isDisabled={selectedPlugins.size === 0}
            startContent={<IoCloudUploadOutline />}
          >
            更新选中的插件
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 