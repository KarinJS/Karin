import { Link } from '@heroui/link'
import { Button } from '@heroui/button'
import { toast } from 'react-hot-toast'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { pluginAdminRequest } from '@/request/plugins'
import { IoCloudDownloadOutline } from 'react-icons/io5'
import TaskLogModal from '@/components/dependencies/TaskLogModal'
import { Modal, ModalContent } from '@heroui/modal'
import { Card } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { FaUser } from 'react-icons/fa6'
import { Checkbox } from '@heroui/checkbox'

import type { FC } from 'react'
import type { PluginMarketResponse, PluginAdminMarketInstall } from 'node-karin'

/** 随机生成渐变背景色 */
const getRandomGradient = () => {
  const gradients = [
    'from-blue-500/20 to-purple-500/20',
    'from-green-500/20 to-teal-500/20',
    'from-pink-500/20 to-rose-500/20',
    'from-yellow-500/20 to-orange-500/20',
    'from-indigo-500/20 to-blue-500/20',
    'from-purple-500/20 to-pink-500/20',
    'from-teal-500/20 to-cyan-500/20',
    'from-orange-500/20 to-red-500/20',
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

/**
 * 市场插件安装按钮组件
 *
 * 用于在插件市场中安装插件，包括确认步骤与安装日志显示
 */
export const MarketPluginInstallButton: FC<{ plugin: PluginMarketResponse }> = ({ plugin }) => {
  /** 确认模态框是否打开 */
  const [isOpen, setIsOpen] = useState(false)
  /** 是否正在安装 */
  const [isInstalling, setIsInstalling] = useState(false)
  /** 任务ID */
  const [taskId, setTaskId] = useState<string>('')
  /** 初始日志 */
  const [initialLogs, setInitialLogs] = useState<string[]>([])
  /** 日志模态框是否打开 */
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  /** 随机渐变背景色 */
  const gradientBg = useMemo(() => getRandomGradient(), [isOpen])

  /**
   * 获取app类型插件的文件列表
   * 优先market.files，其次local.files
   */
  let files: {
    name: string
    url: string
    description?: string
  }[] = []
  if (
    plugin.type === 'market' &&
    plugin.market.type === 'app' &&
    Array.isArray(plugin.market.files)
  ) {
    files = plugin.market.files
  }

  /**
   * app类型插件选中的文件url
   */
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  /**
   * 是否允许点击确认安装按钮
   * 初始值设置逻辑：如果是app类型且有文件但未选择时，应禁用
   */
  const [isInstallButtonEnabled, setIsInstallButtonEnabled] = useState(() => {
    const shouldBeDisabled = plugin.local.type === 'app' && files.length > 0 && selectedFiles.length === 0
    return !shouldBeDisabled
  })

  /**
   * 监听文件选择状态和插件类型变化
   */
  useEffect(() => {
    const isEnabled = !(plugin.local.type === 'app' && files.length > 0 && selectedFiles.length === 0)
    setIsInstallButtonEnabled(isEnabled)
  }, [plugin.local.type, files.length, selectedFiles.length])

  /**
   * 处理文件选择变更
   * @param url 变更的文件url
   * @param checked 是否选中
   */
  const handleFileChange = useCallback((url: string, checked: boolean) => {
    setSelectedFiles(prev => {
      const newFiles = checked ? [...prev, url] : prev.filter(f => f !== url)
      return newFiles
    })
  }, [selectedFiles])

  /**
   * 处理安装按钮点击
   */
  const handleInstall = useCallback(async () => {
    try {
      setIsInstalling(true)
      setTaskId('')
      setInitialLogs([])

      /**
       * 构造安装参数
       */
      const params: PluginAdminMarketInstall = plugin.local.type === 'app'
        ? {
          name: `插件市场: 安装${plugin.local.name}`,
          type: 'install',
          source: 'market',
          pluginType: plugin.local.type,
          target: plugin.local.name,
          urls: selectedFiles,
        }
        : {
          name: `插件市场: 安装${plugin.local.name}`,
          type: 'install',
          source: 'market',
          pluginType: plugin.local.type,
          target: plugin.local.name,
        }

      const logs = [
        `开始安装插件: ${plugin.local.name}`,
        `插件类型: ${plugin.local.type}`,
        `插件版本: ${plugin.local.version || 'latest'}`,
        '正在创建任务...',
      ]

      const response = await pluginAdminRequest(params)

      if (!response.success) {
        toast.error(`安装插件失败: ${response.message || '未知错误'}`)
        return
      }

      const taskId = response.taskId || ''
      setTaskId(taskId)
      setInitialLogs([
        ...logs,
        '任务创建成功!',
        `任务ID: ${taskId}`,
        '正在连接任务执行日志...',
      ])

      setIsLogModalOpen(true)

      setIsOpen(false)
    } catch (error: any) {
      toast.error(`安装插件失败: ${error?.message || '未知错误'}`)
    } finally {
      setIsInstalling(false)
    }
  }, [plugin, selectedFiles])

  /**
   * 处理日志模态框关闭
   */
  const handleLogModalClose = useCallback(() => {
    setIsLogModalOpen(false)
    setTaskId('')
    setInitialLogs([])
    window.dispatchEvent(new Event('plugin-list-update'))
  }, [])

  return (
    <>
      <Button
        size='sm'
        variant='flat'
        color='primary'
        className='h-7 bg-primary-500/10 hover:bg-primary-500/20 dark:bg-primary-500/20 dark:hover:bg-primary-500/30'
        startContent={<IoCloudDownloadOutline className='text-base' />}
        onPress={() => setIsOpen(true)}
      >
        安装
      </Button>

      {/* 安装确认模态框 */}
      <Modal
        isOpen={isOpen && !isInstalling}
        onClose={() => setIsOpen(false)}
        size='2xl'
        classNames={{
          base: 'border border-default-200',
          wrapper: 'z-[1000]',
          body: 'p-0',
        }}
      >
        <ModalContent>
          <Card className='w-full border-none shadow-none'>
            {/* 渐变背景头部 */}
            <div className={`w-full h-32 bg-gradient-to-br ${gradientBg} relative overflow-hidden p-6`}>
              <div className='absolute inset-0 backdrop-blur-[2px]' />
              <div className='relative z-10 flex items-start justify-between'>
                <div className='flex items-center gap-4'>
                  <Avatar
                    isBordered
                    size='lg'
                    src={plugin.author?.avatar || 'https://avatar.vercel.sh/plugin'}
                    fallback={<FaUser />}
                    className='bg-default-100 border-white'
                  />
                  <div>
                    <h3 className='text-xl font-semibold text-default-900'>{plugin.local.name}</h3>
                    <p className='text-sm text-default-700'>
                      {plugin.author?.name || '未知作者'} · v{plugin.local.version || 'latest'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className='p-6'>
              {/* 插件详情区 */}
              <div className='mb-8'>
                <div className='relative'>
                  {/* 插件描述 */}
                  <div className='mb-6'>
                    <p className='text-default-600 text-sm leading-relaxed'>
                      {plugin.local.description || '暂无描述'}
                    </p>
                  </div>

                  {/* 插件信息卡片 */}
                  <div className='grid grid-cols-3 gap-3'>
                    {/* 版本信息 */}
                    <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-100/50 to-primary-200/50 dark:from-primary-900/50 dark:to-primary-800/50 p-4 transition-all hover:shadow-md cursor-help'>
                      <div className='relative z-10'>
                        <div className='text-xs text-primary-600/70 dark:text-primary-400/90 mb-1 flex items-center gap-1'>
                          版本
                          <span className='opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-primary-600/50 dark:text-primary-400/50'>
                            (还没写好哦)
                          </span>
                        </div>
                        <div className='text-sm text-primary-700 dark:text-primary-300 flex items-center gap-1.5'>
                          v{plugin.local.version || 'latest'}
                          <span className='opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100'>
                            {plugin.local.version ? '✨' : '🆕'}
                          </span>
                        </div>
                      </div>
                      <div className='absolute right-2 top-2 text-primary-300/40 dark:text-primary-600/30 transition-transform group-hover:rotate-12'>
                        <IoCloudDownloadOutline size={24} />
                      </div>
                      <div className='absolute inset-0 bg-primary-400/0 group-hover:bg-primary-400/5 transition-colors duration-300' />
                    </div>

                    {/* 类型信息 */}
                    <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-success-100/50 to-success-200/50 dark:from-success-900/50 dark:to-success-800/50 p-4 transition-all hover:shadow-md cursor-help'>
                      <div className='relative z-10'>
                        <div className='text-xs text-success-600/70 dark:text-success-400/90 mb-1 flex items-center gap-1'>
                          类型
                          <span className='opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-success-600/50 dark:text-success-400/50'>
                            (敬请期待~)
                          </span>
                        </div>
                        <div className='text-sm text-success-700 dark:text-success-300 flex items-center gap-1.5'>
                          <span className='capitalize'>{plugin.local.type}</span>
                          <span className='opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100'>
                            {plugin.local.type === 'npm' ? '📦' : plugin.local.type === 'app' ? '🚀' : '🔌'}
                          </span>
                        </div>
                      </div>
                      <div className='absolute right-2 top-2 text-success-300/40 dark:text-success-600/30 transition-transform group-hover:rotate-12'>
                        <FaUser size={24} />
                      </div>
                      <div className='absolute inset-0 bg-success-400/0 group-hover:bg-success-400/5 transition-colors duration-300' />
                    </div>

                    {/* 主页链接 */}
                    {plugin.local.home
                      ? (
                        <Link
                          href={plugin.local.home}
                          isExternal
                          className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-warning-100/50 to-warning-200/50 dark:from-warning-900/50 dark:to-warning-800/50 p-4 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                        >
                          <div className='relative z-10'>
                            <div className='text-xs text-warning-600/70 dark:text-warning-400/90 mb-1'>主页</div>
                            <div className='text-sm text-warning-700 dark:text-warning-300 flex items-center gap-1'>
                              访问主页
                              <IoCloudDownloadOutline className='text-xs transition-transform group-hover:translate-x-0.5' />
                            </div>
                          </div>
                          <div className='absolute right-2 top-2 text-warning-300/40 dark:text-warning-600/30 transition-transform group-hover:rotate-12'>
                            <IoCloudDownloadOutline size={24} />
                          </div>
                          <div className='absolute inset-0 bg-warning-400/0 group-hover:bg-warning-400/5 transition-colors duration-300' />
                        </Link>
                      )
                      : (
                        <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-warning-100/50 to-warning-200/50 dark:from-warning-900/50 dark:to-warning-800/50 p-4'>
                          <div className='relative z-10'>
                            <div className='text-xs text-warning-600/70 dark:text-warning-400/90 mb-1'>主页</div>
                            <div className='text-sm text-warning-700 dark:text-warning-300'>
                              暂无
                            </div>
                          </div>
                          <div className='absolute right-2 top-2 text-warning-300/40 dark:text-warning-600/30'>
                            <IoCloudDownloadOutline size={24} />
                          </div>
                        </div>
                      )}
                  </div>

                  {/* app类型插件文件选择区（列表风格） */}
                  {plugin.local.type === 'app' && files.length > 0 && (
                    <>
                      <div style={{ height: 16 }} />
                      <div className='mb-6'>
                        <div className='text-sm font-medium text-default-700 mb-2'>
                          请选择要安装的文件
                        </div>
                        <div className='flex flex-col gap-2'>
                          {files.map(file => {
                            const checked = selectedFiles.includes(file.url)
                            return (
                              <div
                                key={file.url}
                                className={`flex items-center justify-between px-4 py-2 rounded-xl border transition
                                  ${checked
                                    ? 'border-primary-400 bg-primary-50/60 dark:bg-primary-900/20'
                                    : 'border-default-200 bg-default-100/60 dark:bg-default-800/30'}
                                  hover:border-primary-300 hover:bg-primary-50/40 dark:hover:bg-primary-900/10'
                                }`}
                                style={{ minHeight: 44 }}
                                onClick={() => handleFileChange(file.url, !checked)}
                              >
                                <div className='flex flex-col flex-1 min-w-0 cursor-pointer'>
                                  <span className='font-medium text-sm text-default-800 truncate'>{file.name}</span>
                                  {file.description && (
                                    <span className='text-xs text-default-400 mt-0.5 truncate'>{file.description}</span>
                                  )}
                                </div>
                                <Checkbox
                                  isSelected={checked}
                                  onChange={checked => handleFileChange(file.url, Boolean(checked))}
                                  className='ml-4 rounded-full'
                                  size='sm'
                                  onClick={e => e.stopPropagation()}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 底部操作区 */}
              <div className='flex flex-col gap-4'>
                {/* 简短免责声明 */}
                <p className='text-center text-xs text-default-400'>
                  安装即表示您同意承担使用风险并遵守相关开源协议
                </p>

                {/* 按钮组 */}
                <div className='flex justify-end gap-2'>
                  <Button
                    color='default'
                    variant='flat'
                    onPress={() => setIsOpen(false)}
                    className='bg-gradient-to-r from-default-100/80 to-default-200/80 dark:from-default-100/20 dark:to-default-200/20 hover:opacity-80 transition-opacity shadow-sm'
                  >
                    取消
                  </Button>
                  <Button
                    color='primary'
                    variant='flat'
                    onPress={handleInstall}
                    isLoading={isInstalling}
                    startContent={<IoCloudDownloadOutline className='text-base' />}
                    className={`bg-gradient-to-r ${gradientBg.replace('/20', '/70')} hover:opacity-80 transition-opacity shadow-sm`}
                    isDisabled={!isInstallButtonEnabled}
                  >
                    确认安装
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </ModalContent>
      </Modal>

      {/* 任务日志模态框 */}
      <TaskLogModal
        isOpen={isLogModalOpen}
        onClose={handleLogModalClose}
        taskId={taskId}
        taskName={`安装插件: ${plugin.local.name}`}
        initialLogs={initialLogs}
      />
    </>
  )
}

export default MarketPluginInstallButton
