import React from 'react'
import { Form } from '@heroui/form'
import { Card } from '@heroui/card'
import { request } from '@/lib/request'
import { Button } from '@heroui/button'
import { Avatar } from '@heroui/avatar'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Chip } from '@heroui/chip'
import { Link } from '@heroui/link'
import { toast } from 'react-hot-toast'
import { RenderComponent } from './render'
import { FormProvider, useForm } from 'react-hook-form'
import { ConfigDetailModal, BUTTON_COMMON_STYLES } from './printConfig'
import { DefaultValues, getComponentResult, getComponentValue } from './values'

import type { GetConfigResponse } from 'node-karin'
import { IoSave } from 'react-icons/io5'
import clsx from 'clsx'
import { useLiquidGlassCard, useLiquidGlassButton } from '@/hooks/useLiquidGlass'

/**
 * 动态渲染插件配置组件
 * @param props - 组件属性
 */
export const DashboardPage: React.FC<GetConfigResponse> = ({ options, info }) => {
  const [showJsonModal, setShowJsonModal] = React.useState(false)
  const [isPluginModalOpen, setIsPluginModalOpen] = React.useState(false)
  const methods = useForm({ defaultValues: getComponentValue(options) })

  /**
   * 处理表单提交
   * @param data - 表单数据
   */
  const onSubmit = async (data: DefaultValues) => {
    console.log('完整表单数据:', JSON.stringify(data, null, 2))
    const componentResult = getComponentResult(data)

    try {
      const response = await request.serverPost<Record<string, any>, Record<string, any>>(
        '/api/v1/plugin/config/save',
        {
          name: info.id,
          type: info.type,
          config: componentResult,
        }
      )

      if (response.success) {
        toast.success(response.message || '保存成功')
      } else {
        toast.error(response.message || '保存失败')
        console.error('保存配置失败:', response)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      toast.error(`保存配置失败: ${errorMessage}`)
      console.error('保存配置出错:', error)
    }

    return componentResult
  }

  /**
   * 处理表单结果的函数 - 获取当前表单值并处理
   */
  const handleFormResult = () => {
    const form = document.getElementById('dashboard-form')
    if (form instanceof HTMLFormElement && form.checkValidity()) {
      const currentValues = methods.getValues()
      console.log('当前表单值:', currentValues)
      const data = getComponentResult(currentValues)
      return data
    }
    return null
  }

  const liquidGlassCardRef = useLiquidGlassCard({
    gaussianBlur: 0,
    scale: 20,
    transparency: 0.3,
  })

  const liquidGlassButtonRef = useLiquidGlassButton({
    gaussianBlur: 0,
    scale: 20,
    transparency: 0.3,
  })

  return (
    <div className='space-y-4' key={info.id}>
      <div className='flex pt-4 gap-2 sticky top-0 z-50'>
        <Card
          ref={window.innerWidth <= 768 ? liquidGlassCardRef : undefined}
          shadow='sm'
          className='bg-opacity-5 w-full glass-effect'
          isPressable
          onPress={() => setIsPluginModalOpen(true)}
        >
          {/* 顶部描述区域 - 不包含按钮 */}
          <div className='p-4'>
            {/* 移动端紧凑布局 */}
            <div className='flex md:hidden items-center gap-2'>
              <Avatar
                src={info?.author?.[0]?.avatar || `https://avatar.vercel.sh/${info?.name || 'ikenxuan'}`}
                showFallback
                name={info?.author?.[0]?.name || 'none'}
                size='sm'
                radius='full'
                className='flex-shrink-0 w-8 h-8'
                isBordered
                color='danger'
              />
              <div className='flex-1 min-w-0 text-left'>
                <div className='text-xs font-medium text-default-900 truncate'>
                  {`${info.name || '插件名称'}(${info.id})`}
                </div>
                <div className='text-xs text-default-500 truncate'>
                  {info.description || '这个人很懒，什么都没写...'}
                </div>
              </div>
            </div>

            {/* 大屏幕原有布局 */}
            <div className='hidden md:flex flex-row items-center gap-3'>
              <Avatar
                src={info?.author?.[0]?.avatar || `https://avatar.vercel.sh/${info?.name || 'ikenxuan'}`}
                showFallback
                name={info?.author?.[0]?.name || 'none'}
                size='md'
                radius='full'
                className='flex-shrink-0'
                isBordered
                color='danger'
              />
              <div className='flex flex-col ml-3 flex-grow min-w-0 text-left gap-1'>
                <div className='text-lg font-medium text-default-900 truncate'>
                  {`${info.name || '插件名称'}(${info.id})`}
                </div>
                <div className='text-xs text-default-600 line-clamp-1'>
                  {info.description || '这个人很懒，什么都没写...'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className='flex flex-col gap-2 justify-center'>
          {/* 始终显示顶部的ConfigDetailModal */}
          <div className='hidden sm:block'>
            <ConfigDetailModal
              className='glass-effect'
              showJsonModal={showJsonModal}
              setShowJsonModal={setShowJsonModal}
              handleFormResult={handleFormResult}
            />
          </div>
          <Button
            ref={liquidGlassButtonRef}
            type='submit'
            color='primary'
            variant='flat'
            radius='md'
            size='sm'
            className={`${BUTTON_COMMON_STYLES} px-4 py-2 flex md:text-sm items-center glass-effect`}
            onPress={() => {
              const form = document.getElementById('dashboard-form')
              if (form instanceof HTMLFormElement) return form.requestSubmit()
              console.error('表单元素不存在')
            }}
            startContent={<IoSave className='text-lg' />}
          >
            保存
          </Button>
        </div>
      </div>
      {/* 插件详情Modal */}
      <Modal
        isOpen={isPluginModalOpen}
        onOpenChange={setIsPluginModalOpen}
        size='2xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <div className='flex items-center gap-3'>
                  <Avatar
                    src={info?.author?.[0]?.avatar || `https://avatar.vercel.sh/${info?.name || 'ikenxuan'}`}
                    showFallback
                    name={info?.author?.[0]?.name || 'none'}
                    size='md'
                    radius='full'
                    isBordered
                    color='danger'
                  />
                  <div>
                    <h3 className='text-lg font-semibold'>{info.name || '插件名称'}</h3>
                    <p className='text-sm text-default-500'>ID: {info.id}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className='space-y-4'>
                  {/* 基本信息 */}
                  <div>
                    <h4 className='text-sm font-medium text-default-700 mb-2'>基本信息</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                      <div>
                        <span className='text-default-500'>版本：</span>
                        <span className='text-default-900'>{info.version || '未知'}</span>
                      </div>
                      <div>
                        <span className='text-default-500'>类型：</span>
                        <Chip
                          size='sm'
                          variant='flat'
                          color={info.type === 'git' ? 'primary' : info.type === 'npm' ? 'danger' : 'default'}
                          className='glass-effect'
                        >
                          {info.type || '未知'}
                        </Chip>
                      </div>
                    </div>
                  </div>

                  {/* 描述 */}
                  {info.description && (
                    <div>
                      <h4 className='text-sm font-medium text-default-700 mb-2'>描述</h4>
                      <p className='text-sm text-default-600 leading-relaxed'>
                        {info.description}
                      </p>
                    </div>
                  )}

                  {/* 作者信息 */}
                  {info.author && info.author.length > 0 && (
                    <div>
                      <h4 className='text-sm font-medium text-default-700 mb-2'>作者</h4>
                      {info.author.map((author, index) => (
                        <div
                          key={index}
                          className={clsx(
                            index !== info.author!.length - 1 && 'pb-4'
                          )}
                        >
                          <Card
                            key={index}
                            className='w-full text-left glass-effect bg-primary-100/10'
                            isPressable
                            shadow='sm'
                          >
                            <div className='flex items-center gap-3 py-3 px-4'>
                              <Avatar
                                src={author.avatar}
                                showFallback
                                name={author.name || 'none'}
                                size='sm'
                                radius='full'
                                isBordered
                                color='danger'
                              />
                              <div className='flex-1'>
                                <div className='text-sm font-medium text-default-900'>
                                  {author.name || '未知作者'}
                                </div>
                                {author.home && (
                                  <Link
                                    href={author.home}
                                    size='sm'
                                    isExternal
                                    className='text-xs text-primary-600 hover:text-primary-700'
                                  >
                                    {author.home}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>

                      ))}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <ConfigDetailModal
                  className='glass-effect'
                  showJsonModal={showJsonModal}
                  setShowJsonModal={setShowJsonModal}
                  handleFormResult={handleFormResult}
                />
                <Button color='danger' variant='flat' onPress={onClose} className='glass-effect'>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Card
        shadow='sm'
        className='flex-1 rounded-lg shadow-md mb-2 border border-default-200 overflow-auto no-scrollbar'
      >
        <FormProvider {...methods}>
          <Form
            id='dashboard-form'
            className='flex flex-col w-full'
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className='mb-4 px-4 sm:px-6 py-4 w-full'>
              <RenderComponent
                options={options}
                control={methods.control}
                register={methods.register}
              />
            </div>
          </Form>
        </FormProvider>
      </Card>
    </div>
  )
}
