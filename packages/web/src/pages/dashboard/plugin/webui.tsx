/* eslint-disable @stylistic/indent */
/* eslint-disable @stylistic/multiline-ternary */
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
import { Tabs, Tab } from '@heroui/tabs'
import {
  IoRefresh,
  IoSearch,
  IoExtensionPuzzle,
  IoCloudDownload,
  IoTrash,
  IoInformationCircle,
  IoCheckmarkCircle,
  IoArrowUp,
  IoCloudOffline,
  IoGrid,
  IoList
} from 'react-icons/io5'
import {
  GET_WEBUI_PLUGIN_LIST_ROUTER,
  INSTALL_WEBUI_PLUGIN_ROUTER,
  UNINSTALL_WEBUI_PLUGIN_ROUTER,
  GET_WEBUI_PLUGIN_VERSIONS_ROUTER,
  UPDATE_WEBUI_PLUGIN_VERSION_ROUTER
} from '@/lib/router'
import { Chip } from '@heroui/chip'
import { Tooltip } from '@heroui/tooltip'
import useDialog from '@/hooks/use-dialog'

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<string>('all')
  const dialog = useDialog()

  // 版本相关状态
  const [versionModalOpen, setVersionModalOpen] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null)
  const [versionInfo, setVersionInfo] = useState<PluginVersionInfo | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [loadingVersions, setLoadingVersions] = useState(false)

  /** 获取插件列表 */
  const fetchPluginList = async () => {
    try {
      setLoading(true)
      const data = await request.serverGet<PluginInfo[]>(GET_WEBUI_PLUGIN_LIST_ROUTER)
      setPlugins(data)
      filterPlugins(data, searchQuery, activeTab)
    } catch (error) {
      toast.error('获取插件列表失败')
      console.error('获取插件列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  /** 安装插件 */
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

  /** 卸载插件 */
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

  /** 获取插件版本信息 */
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
      } else {
        // 如果没有可用版本，设置为空字符串
        setSelectedVersion('')
      }
    } catch (error) {
      toast.error('获取插件版本信息失败')
      console.error('获取插件版本信息失败:', error)
      // 重置相关状态，防止状态不一致
      setVersionInfo(null)
      setSelectedVersion('')
      // 延迟关闭模态框，确保状态已更新
      setTimeout(() => {
        setVersionModalOpen(false)
      }, 100)
    } finally {
      setLoadingVersions(false)
    }
  }

  /** 更新到指定版本 */
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

  /** 处理搜索和过滤 */
  const filterPlugins = (pluginList: PluginInfo[], query: string, tab: string) => {
    let filtered = [...pluginList]

    // 先按标签过滤
    if (tab === 'installed') {
      filtered = filtered.filter(plugin => plugin.installed)
    } else if (tab === 'available') {
      filtered = filtered.filter(plugin => !plugin.installed)
    }

    // 再按搜索词过滤
    if (query.trim()) {
      filtered = filtered.filter(plugin =>
        plugin.name.toLowerCase().includes(query.toLowerCase()) ||
        (plugin.description && plugin.description.toLowerCase().includes(query.toLowerCase()))
      )
    }

    setFilteredPlugins(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterPlugins(plugins, query, activeTab)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    filterPlugins(plugins, searchQuery, tab)
  }

  useEffect(() => {
    fetchPluginList()
  }, [])

  /** 获取插件图标 */
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

  /** 渲染网格视图的插件卡片 */
  const renderGridCard = (plugin: PluginInfo) => (
    <Card
      key={plugin.name}
      className='border border-default-200 hover:shadow-md transition-all h-full'
      shadow='sm'
    >
      <CardHeader className='flex gap-3 items-center border-b border-default-200 px-4 py-3'>
        <div className='p-2 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex-shrink-0'>
          {getPluginIcon(plugin.name)}
        </div>
        <div className='flex-grow min-w-0'>
          <Tooltip content={plugin.name}>
            <h3 className='text-lg font-medium truncate'>{formatPluginName(plugin.name)}</h3>
          </Tooltip>
          <div className='text-xs text-gray-500 mt-0.5 truncate'>{plugin.name}</div>
        </div>
        <div className='flex items-center gap-1 flex-shrink-0'>
          {plugin.installed && plugin.version && (
            <Chip color='primary' variant='flat' className='mr-1'>v{plugin.version}</Chip>
          )}
          {plugin.installed
            ? <Chip color='success' variant='flat' startContent={<IoCheckmarkCircle size={14} />}>已安装</Chip>
            : <Chip color='default' variant='flat'>未安装</Chip>}
        </div>
      </CardHeader>

      <CardBody className='px-4 py-3 flex-grow'>
        <p className='text-sm text-default-700 line-clamp-3'>{plugin.description || '暂无描述信息'}</p>
      </CardBody>

      <CardFooter className='border-t border-default-200 px-4 py-3 flex gap-2'>
        {plugin.installed
          ? (
            <>
              <Button
                color='danger'
                variant='flat'
                // onPress={() => uninstallPlugin(plugin.name)}
                onPress={async () => {
                  dialog.confirm({
                    title: `卸载 ${plugin.name}`,
                    content: '确认卸载吗',
                    onConfirm: async () => {
                      try {
                        uninstallPlugin(plugin.name)
                      } catch (e) {
                        toast.error('卸载失败')
                      }
                    },
                  })
                }}
                isLoading={uninstallingPlugin === plugin.name}
                isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                className='flex-1'
                startContent={<IoTrash size={16} />}
                size='sm'
              >
                {uninstallingPlugin === plugin.name ? '卸载中' : '卸载'}
              </Button>
              <Button
                color='primary'
                variant='flat'
                onPress={() => fetchPluginVersions(plugin.name)}
                isLoading={loadingVersions && selectedPlugin === plugin.name}
                isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                startContent={<IoArrowUp size={16} />}
                size='sm'
              >
                版本
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
              startContent={<IoCloudDownload size={16} />}
              size='sm'
            >
              {installingPlugin === plugin.name ? '安装中' : '安装'}
            </Button>
          )}
      </CardFooter>
    </Card>
  )

  /** 渲染列表视图的插件项 */
  const renderListItem = (plugin: PluginInfo) => (
    <Card
      key={plugin.name}
      className='border border-default-200 hover:shadow-sm transition-all mb-3'
      shadow='none'
    >
      {/* 调整内容区域的布局和间距 */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4'>
        <div className='flex items-start gap-4 flex-grow min-w-0'>
          {/* 图标部分保持不变 */}
          <div className='p-2 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex-shrink-0'>
            {getPluginIcon(plugin.name)}
          </div>

          {/* 调整信息布局 */}
          <div className='flex flex-col flex-grow min-w-0 gap-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <Tooltip content={plugin.name}>
                <h3 className='text-base font-medium'>{formatPluginName(plugin.name)}</h3>
              </Tooltip>
              <div className='flex items-center gap-2 flex-wrap'>
                {plugin.installed && plugin.version && (
                  <Chip color='primary' variant='flat' size='sm'>v{plugin.version}</Chip>
                )}
                {plugin.installed
                  ? <Chip color='success' variant='flat' size='sm' startContent={<IoCheckmarkCircle size={12} />}>已安装</Chip>
                  : <Chip color='default' variant='flat' size='sm'>未安装</Chip>}
              </div>
            </div>
            <div className='text-xs text-gray-500'>{plugin.name}</div>
            <p className='text-sm text-default-700 line-clamp-2 mt-1'>{plugin.description || '暂无描述信息'}</p>
          </div>
        </div>

        {/* 按钮组靠右对齐 */}
        <div className='flex gap-2 sm:flex-shrink-0 w-full sm:w-auto justify-end'>
          {plugin.installed
            ? (
              <>
                <Button
                  color='danger'
                  variant='flat'
                  onPress={() => uninstallPlugin(plugin.name)}
                  isLoading={uninstallingPlugin === plugin.name}
                  isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                  startContent={<IoTrash size={16} />}
                  size='sm'
                >
                  {uninstallingPlugin === plugin.name ? '卸载中' : '卸载'}
                </Button>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={() => fetchPluginVersions(plugin.name)}
                  isLoading={loadingVersions && selectedPlugin === plugin.name}
                  isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                  startContent={<IoArrowUp size={16} />}
                  size='sm'
                >
                  版本
                </Button>
              </>
            )
            : (
              <Button
                color='primary'
                onPress={() => installPlugin(plugin.name)}
                isLoading={installingPlugin === plugin.name}
                isDisabled={!!installingPlugin || !!uninstallingPlugin || !!updatingPlugin}
                startContent={<IoCloudDownload size={16} />}
                size='sm'
              >
                {installingPlugin === plugin.name ? '安装中' : '安装'}
              </Button>
            )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className='container mx-auto px-4 py-6 max-w-7xl'>
      {/* 页头区域 */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <div className='p-2 rounded-full bg-gradient-to-br from-primary-50 to-primary-100'>
            <IoExtensionPuzzle className='text-primary text-xl' />
          </div>
          <h1 className='text-xl sm:text-2xl font-semibold'>WebUI 插件管理</h1>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
          <Input
            placeholder='搜索插件...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full sm:w-64'
            size='sm'
            startContent={<IoSearch className='text-default-400' />}
            isClearable
            onClear={() => handleSearch('')}
          />
          <div className='flex gap-2'>
            <Button
              size='sm'
              color='primary'
              variant='flat'
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              startContent={viewMode === 'grid' ? <IoList /> : <IoGrid />}
            >
              切换视图
            </Button>
            <Button
              size='sm'
              color='primary'
              onPress={fetchPluginList}
              isDisabled={loading}
              startContent={<IoRefresh className={loading ? 'animate-spin' : ''} />}
            >
              刷新列表
            </Button>
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <Alert
        className='mb-4 text-sm'
        variant='flat'
        color='primary'
      >
        <div className='flex items-center'>
          管理和安装 Karin WebUI 插件与扩展功能，为您的 WebUI 添加更多实用工具。安装后即可生效，<span className='font-bold'>卸载后需要重启应用。</span>
        </div>
      </Alert>

      {/* 过滤标签页 */}
      <div className='mb-6'>
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => handleTabChange(key as string)}
          variant='light'
          color='primary'
          size='sm'
          classNames={{
            base: 'w-full',
            tabList: 'gap-2 w-full relative rounded-lg p-1 border border-default-200 bg-default-50',
            cursor: 'bg-default-100 shadow-md',
            tab: 'max-w-fit px-4 h-8 data-[selected=true]:text-primary'
          }}
        >
          <Tab
            key='all'
            title={
              <div className='flex items-center gap-1'>
                <IoExtensionPuzzle className='text-default-700' size={16} />
                <span className='text-default-700'>全部插件</span>
                <Chip size='sm' color='default' variant='flat' className='ml-1'>{plugins.length}</Chip>
              </div>
            }
          />
          <Tab
            key='installed'
            title={
              <div className='flex items-center gap-1'>
                <IoCheckmarkCircle className='text-default-700' size={16} />
                <span className='text-default-700'>已安装</span>
                <Chip size='sm' color='success' variant='flat' className='ml-1'>
                  {plugins.filter(p => p.installed).length}
                </Chip>
              </div>
            }
          />
          <Tab
            key='available'
            title={
              <div className='flex items-center gap-1'>
                <IoCloudDownload className='text-default-700' size={16} />
                <span className='text-default-700'>可安装</span>
                <Chip size='sm' color='primary' variant='flat' className='ml-1'>
                  {plugins.filter(p => !p.installed).length}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </div>

      {/* 插件列表区域 */}
      {loading
        ? (
          <div className='flex justify-center items-center h-60'>
            <Spinner label='处理中...' size='lg' />
          </div>
        )
        : filteredPlugins.length === 0
          ? (
            <div className='flex flex-col justify-center items-center h-60 text-gray-500'>
              <div className='p-4 rounded-full bg-default-100 mb-4'>
                <IoCloudOffline className='text-gray-400 text-4xl' />
              </div>
              <span className='text-lg'>没有找到符合条件的插件</span>
              <p className='text-sm text-gray-400 mt-2'>尝试更改搜索条件或刷新列表</p>
            </div>
          )
          : viewMode === 'grid'
            ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredPlugins.map(renderGridCard)}
              </div>
            )
            : (
              <div className='space-y-3'>
                {filteredPlugins.map(renderListItem)}
              </div>
            )}

      {/* 版本选择模态框 */}
      <Modal
        isOpen={versionModalOpen}
        onClose={() => {
          setVersionModalOpen(false)
          // 关闭时重置状态
          setVersionInfo(null)
          setSelectedVersion('')
        }}
        aria-labelledby='version-modal-title'
        classNames={{
          base: 'max-w-md mx-auto',
          header: 'border-b border-default-200',
          footer: 'border-t border-default-200'
        }}
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-2' id='version-modal-title'>
            <div className='p-1.5 rounded-full bg-primary-50'>
              <IoArrowUp className='text-primary' size={16} aria-hidden='true' />
            </div>
            <span className='text-base'>版本管理 - {formatPluginName(selectedPlugin || '')}</span>
          </ModalHeader>
          <ModalBody>
            {loadingVersions ? (
              <div className='flex justify-center items-center py-8'>
                <Spinner label='处理中...' />
              </div>
            ) : versionInfo ? (
              <div className='space-y-4'>
                {/* 当前版本信息 */}
                <div className='bg-default-50 px-4 py-3 rounded-lg border border-default-200'>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <p className='text-xs text-default-600'>插件名称</p>
                      <p className='text-sm font-medium truncate'>{selectedPlugin}</p>
                    </div>
                    {versionInfo.currentVersion && (
                      <div>
                        <p className='text-xs text-default-600'>当前版本</p>
                        <p className='text-sm font-medium'>{versionInfo.currentVersion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 缓存提示信息 */}
                <Alert
                  className='text-sm'
                  variant='flat'
                  color='primary'
                >
                  版本信息有2分钟缓存，初次获取可能需要较长时间
                </Alert>

                {/* 选择版本区域 */}
                <div>
                  <p className='text-sm mb-2 flex items-center gap-1 text-default-700'>
                    <IoArrowUp className='text-sm text-blue-500' />
                    选择要更新的版本
                  </p>

                  {/* 版本选择器 */}
                  <div className='flex flex-col gap-2'>
                    <Select
                      placeholder='选择版本'
                      isRequired
                      className='w-full'
                      onChange={(e) => setSelectedVersion(e.target.value)}
                      selectedKeys={selectedVersion ? [selectedVersion] : []}
                      aria-label='选择插件版本'
                      size='lg'
                      color='primary'
                      value={selectedVersion}
                    >
                      {versionInfo.availableVersions.map((version) => (
                        <SelectItem key={version} textValue={version}>
                          <div className='flex items-center justify-between'>
                            <span>{version}</span>
                            {version === versionInfo.currentVersion && (
                              <Chip color='success' variant='flat'>
                                当前
                              </Chip>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>

                    <div className='flex items-center my-2'>
                      <div className='flex-grow h-px bg-default-200' />
                      <span className='mx-2 text-xs text-default-400'>或手动选择版本</span>
                      <div className='flex-grow h-px bg-default-200' />
                    </div>

                    <Input
                      placeholder='请输入版本号'
                      value={selectedVersion}
                      isRequired
                      onChange={(e) => setSelectedVersion(e.target.value)}
                      className='w-full'
                    />
                  </div>

                  {/* 提示信息 */}
                  {versionInfo.hasMoreVersions && (
                    <p className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                      <IoInformationCircle className='text-blue-500' size={14} />
                      仅显示最近20个版本，您可以在输入框中直接输入其他版本号
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500 flex flex-col items-center'>
                <div className='p-3 rounded-full bg-default-100 mb-3'>
                  <IoCloudOffline className='text-gray-400 text-2xl' />
                </div>
                <span>无法获取版本信息</span>
                <Button
                  color='primary'
                  variant='flat'
                  size='sm'
                  className='mt-4'
                  onPress={() => fetchPluginVersions(selectedPlugin || '')}
                >
                  重试
                </Button>
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
              startContent={<IoArrowUp aria-hidden='true' size={16} />}
            >
              {updatingPlugin ? '正在更新...' : '更新到此版本'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

/** 格式化插件名称显示 */
function formatPluginName (name: string): string {
  // 去掉@karinjs/前缀，美化显示
  return name.replace('@karinjs/', '')
    .replace('plugin-webui-', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
