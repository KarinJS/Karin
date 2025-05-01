import { Link } from '@heroui/link'
import { Button } from '@heroui/button'
import { toast } from 'react-hot-toast'
import { useState, useCallback, useMemo } from 'react'
import { pluginAdminRequest } from '@/request/plugins'
import { IoCloudDownloadOutline } from 'react-icons/io5'
import TaskLogModal from '@/components/dependencies/TaskLogModal'
import { Modal, ModalContent } from '@heroui/modal'
import { Card } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { FaUser } from 'react-icons/fa6'

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
   * 处理安装按钮点击
   */
  const handleInstall = useCallback(async () => {
    try {
      setIsInstalling(true)
      setTaskId('')
      setInitialLogs([])

      const params: PluginAdminMarketInstall = plugin.local.type === 'app'
        ? {
          name: `插件市场: 安装${plugin.local.name}`,
          type: 'install',
          source: 'market',
          pluginType: plugin.local.type,
          target: plugin.local.name,
          urls: [],
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

      // 使用已有的插件管理API
      const response = await pluginAdminRequest(params)

      if (!response.success) {
        console.error('安装插件失败:', response)
        toast.error(`安装插件失败: ${response.message || '未知错误'}`)
        return
      }

      // 设置任务信息
      const taskId = response.taskId || ''
      setTaskId(taskId)
      setInitialLogs([
        ...logs,
        '任务创建成功!',
        `任务ID: ${taskId}`,
        '正在连接任务执行日志...',
      ])

      // 打开日志模态框
      setIsLogModalOpen(true)

      // 关闭安装确认模态框
      setIsOpen(false)
    } catch (error: any) {
      console.error('安装插件失败:', error)
      toast.error(`安装插件失败: ${error?.message || '未知错误'}`)
    } finally {
      setIsInstalling(false)
    }
  }, [plugin])

  /**
   * 处理日志模态框关闭
   */
  const handleLogModalClose = useCallback(() => {
    setIsLogModalOpen(false)
    setTaskId('')
    setInitialLogs([])
    // 通知插件列表更新
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
                    <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-100/50 to-primary-200/50 dark:from-primary-900/50 dark:to-primary-800/50 p-4 transition-all hover:shadow-md'>
                      <div className='relative z-10'>
                        <div className='text-xs font-medium text-default-400 mb-1'>版本</div>
                        <div className='text-sm font-semibold text-default-600'>
                          v{plugin.local.version || 'latest'}
                        </div>
                      </div>
                      <div className='absolute right-2 top-2 text-primary-300/40 dark:text-primary-600/30'>
                        <IoCloudDownloadOutline size={24} />
                      </div>
                    </div>

                    {/* 类型信息 */}
                    <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-success-100/50 to-success-200/50 dark:from-success-900/50 dark:to-success-800/50 p-4 transition-all hover:shadow-md'>
                      <div className='relative z-10'>
                        <div className='text-xs font-medium text-default-400 mb-1'>类型</div>
                        <div className='text-sm font-semibold text-default-600 capitalize'>
                          {plugin.local.type}
                        </div>
                      </div>
                      <div className='absolute right-2 top-2 text-success-300/40 dark:text-success-600/30'>
                        <FaUser size={24} />
                      </div>
                    </div>

                    {/* 主页链接 */}
                    <div className='group relative overflow-hidden rounded-xl bg-gradient-to-br from-warning-100/50 to-warning-200/50 dark:from-warning-900/50 dark:to-warning-800/50 p-4 transition-all hover:shadow-md'>
                      <div className='relative z-10'>
                        <div className='text-xs font-medium text-default-400 mb-1'>主页</div>
                        {plugin.local.home
                          ? (
                            <Link
                              href={plugin.local.home}
                              isExternal
                              className='text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors'
                            >
                              访问主页
                            </Link>
                          )
                          : (
                            <span className='text-sm font-semibold text-default-600'>暂无</span>
                          )}
                      </div>
                      <div className='absolute right-2 top-2 text-warning-300/40 dark:text-warning-600/30'>
                        <IoCloudDownloadOutline size={24} />
                      </div>
                    </div>
                  </div>
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
