import toast from 'react-hot-toast'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { BiErrorCircle } from 'react-icons/bi'
import { IoCopyOutline } from 'react-icons/io5'

/**
 * 动态渲染错误信息卡片
 * @param title - 错误标题
 * @param error - 错误信息
 * @returns 错误信息卡片
 */
export const createErrorCard = (
  title: string,
  error: Error
) => {
  const handleCopy = () => {
    const content = `message: ${error.message}\nstack: ${error.stack || ''}`
    navigator.clipboard.writeText(content)
    toast.success('复制成功')
  }

  return (
    <Card className='border border-red-200 shadow-sm inline-flex flex-col min-w-[280px] mx-2'>
      <CardBody className='flex flex-col gap-3 flex-wrap relative'>
        <Button
          onPress={handleCopy}
          variant='ghost'
          className='absolute right-2 top-2 hover:bg-gray-100/60 border-0 focus:ring-0'
          size='sm'
          title='复制错误信息'
        >
          <IoCopyOutline className='h-5 w-5 text-gray-500' />
        </Button>

        <div className='flex items-center gap-2 shrink-0'>
          <div className='flex-shrink-0'>
            <BiErrorCircle className='h-5 w-5 text-red-500' />
          </div>
          <h3 className='text-base font-medium text-red-800'>
            {title || '组件渲染错误'}
          </h3>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-gray-700'>message:</span>
          <div className='bg-red-100 p-2 rounded-lg text-xs min-h-[32px] flex items-center'>
            {error.message || 'undefined'}
          </div>
        </div>

        {error.stack && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium text-gray-700'>stack:</p>
            <pre className='whitespace-pre-wrap break-words bg-red-100 p-2 rounded-lg text-xs'>
              {error.stack}
            </pre>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
