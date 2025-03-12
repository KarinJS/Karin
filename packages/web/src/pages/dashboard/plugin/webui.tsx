/* eslint-disable @stylistic/indent */
import { useState, useEffect } from 'react'
import { request } from '@/lib/request'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { toast } from 'react-hot-toast'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Alert } from '@heroui/alert'
import {
  IoRefresh,
  IoSearch,
  IoExtensionPuzzle,
  IoCloudDownload,
  IoTrash,
  IoInformationCircle,
  IoCheckmarkCircle,
  IoArrowUp,
  IoCloudOffline
} from 'react-icons/io5'
import {
  GET_WEBUI_PLUGIN_LIST_ROUTER,
  INSTALL_WEBUI_PLUGIN_ROUTER,
  UNINSTALL_WEBUI_PLUGIN_ROUTER,
  GET_WEBUI_PLUGIN_VERSIONS_ROUTER,
  UPDATE_WEBUI_PLUGIN_VERSION_ROUTER
} from '@/lib/router'

interface PluginInfo {
  name: string
  installed: boolean
  description: string
  version?: string
}

interface PluginVersionInfo {
  currentVersion: string | null
  availableVersions: string[]
  hasMoreVersions?: boolean
}

export default function WebUIPluginPage () {
  const [plugins, setPlugins] = useState<PluginInfo[]>([])
  const [filteredPlugins, setFilteredPlugins] = useState<PluginInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [installingPlugin, setInstallingPlugin] = useState<string | null>(null)
  const [uninstallingPlugin, setUninstallingPlugin] = useState<string | null>(null)
  const [updatingPlugin, setUpdatingPlugin] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 版本相关状态
  const [versionModalOpen, setVersionModalOpen] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null)
  const [versionInfo, setVersionInfo] = useState<PluginVersionInfo | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [loadingVersions, setLoadingVersions] = useState(false)

  // 获取插件列表
  const fetchPluginList = async () => {
    try {
      setLoading(true)
      const data = await request.serverGet<PluginInfo[]>(GET_WEBUI_PLUGIN_LIST_ROUTER)
      setPlugins(data)
      setFilteredPlugins(data)
    } catch (error) {
      toast.error('获取插件列表失败')
      console.error('获取插件列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 安装插件
  const installPlugin = async (name: string) => {
    try {
      setInstallingPlugin(name)
      const response = await request.serverPost<{ status: boolean, data: string }, { name: string }>(
        INSTALL_WEBUI_PLUGIN_ROUTER,
        { name },
        { timeout: 200000 }
      )

      if (response.status) {
        toast.success('插件安装成功')
        await fetchPluginList()
      } else {
        toast.error(`安装失败: ${response.data}`)
      }
    } catch (error) {
      toast.error('插件安装失败')
      console.error('插件安装失败:', error)
    } finally {
      setInstallingPlugin(null)
    }
  }

  // 卸载插件
  const uninstallPlugin = async (name: string) => {
    try {
      setUninstallingPlugin(name)
      const response = await request.serverPost<{ status: boolean, data: string }, { name: string }>(
        UNINSTALL_WEBUI_PLUGIN_ROUTER,
        { name },
        { timeout: 200000 }
      )

      if (response.status) {
        toast.success('插件卸载成功，需要重启应用生效')
        await fetchPluginList()
      } else {
        toast.error(`卸载失败: ${response.data}`)
      }
    } catch (error) {
      toast.error('插件卸载失败')
      console.error('插件卸载失败:', error)
    } finally {
      setUninstallingPlugin(null)
    }
  }

  // 获取插件版本信息
  const fetchPluginVersions = async (name: string) => {
    try {
      setLoadingVersions(true)
      setSelectedPlugin(name)
      setVersionModalOpen(true)

      const response = await request.serverPost<PluginVersionInfo, { name: string }>(
        GET_WEBUI_PLUGIN_VERSIONS_ROUTER,
        { name },
        { timeout: 200000 }
      )

      setVersionInfo(response)
      // 默认选择最新版本
      if (response.availableVersions.length > 0) {
        setSelectedVersion(response.availableVersions[0])
      }
    } catch (error) {
      toast.error('获取插件版本信息失败')
      console.error('获取插件版本信息失败:', error)
      setVersionModalOpen(false)
    } finally {
      setLoadingVersions(false)
    }
  }

  // 更新到指定版本
  const updateToVersion = async () => {
    if (!selectedPlugin || !selectedVersion) return

    try {
      setUpdatingPlugin(selectedPlugin)

      const response = await request.serverPost<{ status: boolean, data: string }, { name: string, version: string }>(
        UPDATE_WEBUI_PLUGIN_VERSION_ROUTER,
        { name: selectedPlugin, version: selectedVersion },
        { timeout: 200000 }
      )

      if (response.status) {
        toast.success(`插件更新到 ${selectedVersion} 成功`)
        setVersionModalOpen(false)
        await fetchPluginList()
      } else {
        toast.error(`更新失败: ${response.data}`)
      }
    } catch (error) {
      toast.error('插件更新失败')
      console.error('插件更新失败:', error)
    } finally {
      setUpdatingPlugin(null)
    }
  }

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPlugins(plugins)
      return
    }

    const filtered = plugins.filter(plugin =>
      plugin.name.toLowerCase().includes(query.toLowerCase()) ||
      (plugin.description && plugin.description.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredPlugins(filtered)
  }

  useEffect(() => {
    fetchPluginList()
  }, [])

  // 获取插件图标
  const getPluginIcon = (pluginName: string) => {
    // 根据插件名称返回不同图标，可扩展更多图标映射
    if (pluginName.includes('network-monitor')) {
      return <IoInformationCircle className='text-blue-500' size={24} />
    } else if (pluginName.includes('node-pty')) {
      return <IoExtensionPuzzle className='text-purple-500' size={24} />
    } else {
      return <IoExtensionPuzzle className='text-gray-500' size={24} />
    }
  }

  return (
    <div className='container mx-auto p-4'>
      {/* 页头区域 */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2'>
          <IoExtensionPuzzle className='text-primary text-2xl' />
          <h1 className='text-2xl font-semibold'>WebUI 插件管理</h1>
        </div>
        <div className='flex gap-2'>
          <Input
            placeholder='搜索插件...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-64'
            startContent={<IoSearch />}
            isClearable
            onClear={() => handleSearch('')}
          />
          <Button
            isIconOnly
            color='primary'
            onPress={fetchPluginList}
            isDisabled={loading}
            aria-label='刷新列表'
          >
            <IoRefresh className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* 说明文字 - 使用Alert组件 */}
      <Alert
        className='mb-6 text-sm'
        variant='flat'
        color='primary'
      >
        管理和安装 Karin WebUI 插件与扩展功能，为您的 WebUI 添加更多实用工具。安装后即可生效，卸载后需要重启应用。
      </Alert>

      {/* 插件列表区域 */}
      {loading
        ? (
          <div className='flex justify-center items-center h-60'>
            <Spinner size='lg' />
          </div>
        )
        : filteredPlugins.length === 0
          ? (
            <div className='flex flex-col justify-center items-center h-60 text-gray-500'>
              <IoCloudOffline className='text-gray-400 text-5xl mb-3' />
              <span>没有找到符合条件的插件</span>
            </div>
          )
          : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredPlugins.map((plugin) => (
                <Card
                  key={plugin.name}
                  className='border border-gray-200 hover:shadow-md transition-shadow'
                  shadow='sm'
                >
                  <CardHeader className='flex gap-3 items-center border-b border-gray-200 px-5 py-4'>
                    <div className='p-2 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex-shrink-0'>
                      {getPluginIcon(plugin.name)}
                    </div>
                    <div className='flex-grow'>
                      <h3 className='text-lg font-medium'>{formatPluginName(plugin.name)}</h3>
                      <div className='text-xs text-gray-500 mt-0.5'>{plugin.name}</div>
                    </div>
                    <div className='flex items-center gap-1 flex-shrink-0'>
                      {plugin.installed && plugin.version && (
                        <span className='text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 mr-1 whitespace-nowrap'>v{plugin.version}</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap ${plugin.installed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'}`}
                      >
                        {plugin.installed
                          ? <><IoCheckmarkCircle /> 已安装</>
                          : <>未安装</>}
                      </span>
                    </div>
                  </CardHeader>

                  <CardBody className='px-5 py-4'>
                    <p className='text-sm text-gray-700'>{plugin.description || '暂无描述信息'}</p>
                  </CardBody>

                  <CardFooter className='border-t border-gray-200 px-5 py-4 flex gap-2'>
                    {plugin.installed
                      ? (
                        <>
                          <Button
                            color='danger'
                            variant='flat'
                            onPress={() => uninstallPlugin(plugin.name)}
                            isLoading={uninstallingPlugin === plugin.name}
                            isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                            className='flex-1'
                            startContent={<IoTrash />}
                          >
                            {uninstallingPlugin === plugin.name ? '正在卸载...' : '卸载'}
                          </Button>
                          <Button
                            color='primary'
                            variant='flat'
                            onPress={() => fetchPluginVersions(plugin.name)}
                            isLoading={loadingVersions && selectedPlugin === plugin.name}
                            isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                            startContent={<IoArrowUp />}
                          >
                            版本管理
                          </Button>
                        </>
                      )
                      : (
                        <Button
                          color='primary'
                          onPress={() => installPlugin(plugin.name)}
                          isLoading={installingPlugin === plugin.name}
                          isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                          className='w-full'
                          startContent={<IoCloudDownload />}
                        >
                          {installingPlugin === plugin.name ? '正在安装...' : '安装插件'}
                        </Button>
                      )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

      {/* 版本选择模态框 */}
      <Modal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        aria-labelledby='version-modal-title'
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-2' id='version-modal-title'>
            <IoArrowUp className='text-primary' aria-hidden='true' />
            版本管理 - {formatPluginName(selectedPlugin || '')}
          </ModalHeader>
          <ModalBody>
            {loadingVersions
              ? (
                <div className='flex justify-center items-center py-8'>
                  <Spinner />
                </div>
              )
              : versionInfo
                ? (
                  <div className='space-y-4'>
                    {/* 当前版本信息 */}
                    <div className='bg-gray-50 px-4 py-3 rounded-lg border border-gray-200'>
                      <div className='grid grid-cols-2 gap-2'>
                        <div>
                          <p className='text-xs text-gray-500'>插件名称</p>
                          <p className='text-sm'>{selectedPlugin}</p>
                        </div>
                        {versionInfo.currentVersion && (
                          <div>
                            <p className='text-xs text-gray-500'>当前版本</p>
                            <p className='text-sm'>{versionInfo.currentVersion}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 缓存提示信息 */}
                    <div className='mb-3 text-xs text-gray-500 flex items-center gap-1 bg-gray-50 p-2 rounded-lg border border-gray-200'>
                      <IoInformationCircle className='text-blue-500 flex-shrink-0' />
                      <span>版本信息有2分钟缓存，初次获取可能需要较长时间</span>
                    </div>

                    {/* 选择版本区域 */}
                    <div>
                      <p className='text-sm mb-2 flex items-center gap-1 text-gray-700'>
                        <IoArrowUp className='text-sm text-blue-500' />
                        选择要更新的版本
                      </p>

                      {/* 版本选择器 */}
                      <div className='flex gap-2 mb-1'>
                        <Input
                          placeholder='输入版本号'
                          value={selectedVersion}
                          isRequired
                          onChange={(e) => setSelectedVersion(e.target.value)}
                          className='flex-1'
                          aria-label='手动输入版本号'
                        />
                        <Select
                          placeholder='选择版本'
                          className='w-40'
                          onChange={(e) => setSelectedVersion(e.target.value)}
                          selectedKeys={selectedVersion ? [selectedVersion] : []}
                          aria-label='选择插件版本'
                        >
                          {versionInfo.availableVersions.map((version) => (
                            <SelectItem key={version}>
                              {version === versionInfo.currentVersion ? `${version} (当前)` : version}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      {/* 提示信息 */}
                      {versionInfo.hasMoreVersions && (
                        <p className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                          <IoInformationCircle className='text-blue-500' />
                          仅显示最近20个版本，您可以在输入框中直接输入其他版本号
                        </p>
                      )}
                    </div>
                  </div>
                )
                : (
                  <div className='text-center py-8 text-gray-500 flex flex-col items-center'>
                    <IoCloudOffline className='text-gray-400 text-3xl mb-2' />
                    无法获取版本信息
                  </div>
                )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant='flat'
              onPress={() => setVersionModalOpen(false)}
            >
              取消
            </Button>
            <Button
              color='primary'
              onPress={updateToVersion}
              isLoading={!!updatingPlugin}
              isDisabled={!versionInfo || !selectedVersion || selectedVersion === versionInfo.currentVersion}
              startContent={<IoArrowUp aria-hidden='true' />}
            >
              {updatingPlugin ? '正在更新...' : '更新到此版本'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

// 格式化插件名称显示
function formatPluginName (name: string): string {
  // 去掉@karinjs/前缀，美化显示
  return name.replace('@karinjs/', '')
    .replace('plugin-webui-', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
