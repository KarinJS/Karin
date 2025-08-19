import { Button } from '@heroui/button'
import { IoSettingsOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@heroui/tooltip'
import { useState } from 'react'
import { Modal, ModalContent } from '@heroui/modal'
import { Card } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { FaUser } from 'react-icons/fa6'
import { Chip } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { Progress } from '@heroui/progress'

import type { PluginMarketResponse } from 'node-karin'

/**
 * 获取插件管理路径
 * @param type 插件类型
 * @returns 管理页面路径
 */
const getManagementPath = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'git':
      return '/plugins/manage?type=git'
    case 'app':
      return '/plugins/manage?type=app'
    case 'npm':
      return '/dependencies?filter=plugins'
    default:
      return '/plugins/manage'
  }
}

/**
 * 已安装插件按钮组件
 * @param plugin 插件信息
 */
export function InstalledPluginButton ({ plugin }: { plugin: PluginMarketResponse }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  /** 处理导航到管理页面 */
  const handleNavigateToManagement = () => {
    setIsNavigating(true)
    // 1.5秒后跳转
    setTimeout(() => {
      const path = getManagementPath(plugin.local.type)
      navigate(path)
      setIsOpen(false)
      setIsNavigating(false)
    }, 1500)
  }

  return (
    <>
      <Tooltip content='插件管理'>
        <Button
          isIconOnly
          variant='light'
          color='primary'
          size='sm'
          onPress={() => setIsOpen(true)}
        >
          <IoSettingsOutline className='text-lg' />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={() => !isNavigating && setIsOpen(false)}
        size='2xl'
        hideCloseButton={isNavigating}
        classNames={{
          base: 'border border-default-200',
          wrapper: 'z-[1000]',
          body: 'p-0',
        }}
      >
        <ModalContent>
          <Card className='w-full border-none shadow-none'>
            {
              isNavigating
                ? (
                  <div className='p-6 flex flex-col items-center justify-center min-h-[200px] relative'>
                    <div className='w-full max-w-[300px] space-y-4'>
                      <div className='text-center space-y-2'>
                        <p className='text-default-600'>
                          即将跳转至
                          <span className='text-primary-500 mx-1'>
                            {plugin.local.type === 'npm' ? '依赖管理' : '插件管理'}
                          </span>
                          页面
                        </p>
                        <p className='text-xs text-default-400'>
                          {getManagementPath(plugin.local.type)}
                        </p>
                      </div>
                      <Progress
                        size='sm'
                        isIndeterminate
                        aria-label='Loading...'
                        className='max-w-md'
                        color='primary'
                      />
                    </div>
                  </div>
                )
                : (
                  <>
                    {/* 渐变背景头部 */}
                    <div className='w-full h-32 bg-gradient-to-br from-primary-100/50 to-primary-200/50 dark:from-primary-900/50 dark:to-primary-800/50 relative overflow-hidden p-6'>
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
                    <div className='p-6 space-y-6'>
                      {/* 插件信息 */}
                      <div className='space-y-4'>
                        <div className='flex flex-col gap-2'>
                          <h4 className='text-sm font-medium text-default-700'>插件描述</h4>
                          <p className='text-sm text-default-600 bg-default-50 p-3 rounded-lg'>
                            {plugin.local.description || '暂无描述'}
                          </p>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                          <Chip
                            variant='flat'
                            size='sm'
                            className='bg-primary-100/50 dark:bg-primary-900/50'
                          >
                            版本: v{plugin.local.version || 'latest'}
                          </Chip>
                          <Chip
                            variant='flat'
                            size='sm'
                            className='bg-success-100/50 dark:bg-success-900/50'
                          >
                            类型: {plugin.local.type}
                          </Chip>
                          {plugin.local.home && (
                            <Chip
                              as='a'
                              href={plugin.local.home}
                              target='_blank'
                              variant='flat'
                              size='sm'
                              className='bg-warning-100/50 dark:bg-warning-900/50 cursor-pointer'
                            >
                              主页
                            </Chip>
                          )}
                        </div>
                      </div>

                      <Divider />

                      {/* 底部按钮 */}
                      <div className='flex justify-end gap-2'>
                        <Button
                          color='default'
                          variant='flat'
                          onPress={() => setIsOpen(false)}
                          isDisabled={isNavigating}
                        >
                          关闭
                        </Button>
                        <Button
                          color='primary'
                          variant='flat'
                          onPress={handleNavigateToManagement}
                          startContent={<IoSettingsOutline />}
                          isLoading={isNavigating}
                        >
                          前往管理
                        </Button>
                      </div>
                    </div>
                  </>
                )
            }
          </Card>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InstalledPluginButton
