import React from 'react'
import { Form } from '@heroui/form'
import { Card } from '@heroui/card'
import { request } from '@/lib/request'
import { Button } from '@heroui/button'
import { Avatar } from '@heroui/avatar'
import { toast } from 'react-hot-toast'
import { RenderComponent } from './render'
import { FormProvider, useForm } from 'react-hook-form'
import { ConfigDetailModal, BUTTON_COMMON_STYLES } from './printConfig'
import { DefaultValues, getComponentResult, getComponentValue } from './values'

import type { GetConfigResponse } from 'node-karin'

/**
 * 动态渲染插件配置组件
 * @param props - 组件属性
 */
export const DashboardPage: React.FC<GetConfigResponse> = ({ options, info }) => {
  const [showJsonModal, setShowJsonModal] = React.useState(false)
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
          name: info.id.includes('@') ? info.id.replace(/-/, '/') : info.id,
          type: info.type,
          config: componentResult
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
      const data = getComponentResult(currentValues)
      return data
    }
    return null
  }

  return (
    <div className='flex flex-col w-full h-screen' key={info.id}>
      <Card
        shadow='sm'
        className='border-b mb-1 rounded-lg border-gray-300 dark:border-gray-600'
      >
        <div className='p-4 flex flex-col gap-2'>
          {/* 头部信息区域 */}
          <div className='flex items-center'>
            <Avatar src={info?.author?.[0]?.avatar || `https://avatar.vercel.sh/${info?.name || 'ikenxuan'}`} size='sm' radius='full' />
            <div className='flex flex-col ml-3'>
              <div className='text-sm font-medium text-default-900'>
                {`${info.name || '插件名称'}(${info.id})`}
              </div>
              <div className='text-xs text-default-500'>{info.description || '这个人很懒，什么都没写...'}</div>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className='flex gap-2 justify-center sm:justify-end border-t border-gray-100 dark:border-gray-600 pt-3 mt-2'>
            <ConfigDetailModal
              showJsonModal={showJsonModal}
              setShowJsonModal={setShowJsonModal}
              handleFormResult={handleFormResult}
            />
            <Button
              type='submit'
              color='primary'
              variant='solid'
              radius='md'
              size='sm'
              className={`${BUTTON_COMMON_STYLES}`}
              onPress={() => {
                const form = document.getElementById('dashboard-form')
                if (form instanceof HTMLFormElement) return form.requestSubmit()
                console.error('表单元素不存在')
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Card>
      <Card
        shadow='sm'
        className='flex-1 rounded-lg shadow-md mb-2 border border-gray-200 dark:border-gray-600 overflow-auto'
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
