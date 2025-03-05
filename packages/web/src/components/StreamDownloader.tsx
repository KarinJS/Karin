import { useState } from 'react'
import { Card } from '@heroui/card'
import streamSaver from 'streamsaver'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { IoCloudDownloadOutline } from 'react-icons/io5'

interface StreamDownloaderProps {
  /** 数据写入处理函数 */
  onWrite: (writer: WritableStreamDefaultWriter<Uint8Array>) => Promise<void>
  /** 文件名(包含扩展名) */
  filename: string
  /** 下载开始回调 */
  onStart?: () => void
  /** 下载完成回调 */
  onComplete?: () => void
  /** 下载出错回调 */
  onError?: (error: Error) => void
  /** 下载进度回调 */
  onProgress?: (progress: number) => void
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 按钮变体 */
  variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow' | 'ghost'
  /** 按钮颜色 */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
  /** 按钮文本 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
}

/**
 * 流式下载器
 * @param props 下载器属性
 * @returns 下载器组件
 */
export const StreamDownloader: React.FC<StreamDownloaderProps> = ({
  onWrite,
  filename,
  onStart,
  onComplete,
  onError,
  onProgress,
  size = 'sm',
  variant = 'flat',
  color = 'primary',
  children = '下载',
  className
}) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)

  const handleDownload = async () => {
    try {
      onStart?.()
      setDownloadProgress(0)

      /** 创建写入流 */
      const fileStream = streamSaver.createWriteStream(filename)
      const writer = fileStream.getWriter()

      /** 执行写入操作 */
      await onWrite(writer)

      await writer.close()
      onComplete?.()
      /** 设置为 100% 但不关闭弹窗 */
      setDownloadProgress(100)
    } catch (error) {
      console.error('下载失败:', error)
      onError?.(error as Error)
      setDownloadProgress(-1)
    }
  }

  return (
    <>
      <Button
        size={size}
        variant={variant}
        color={color}
        onPress={handleDownload}
        disabled={downloadProgress !== null}
        className={className}
      >
        <IoCloudDownloadOutline className='text-base' />
        {children}
      </Button>

      {downloadProgress !== null && (
        <div className='fixed inset-0 bg-black/10 flex items-center justify-center z-50'>
          <Card className='w-[400px] p-6 space-y-4 bg-white/90 dark:bg-gray-900/90'>
            <div className='flex items-center gap-3'>
              {downloadProgress < 100
                ? <div className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin' />
                : <div className='w-6 h-6 text-success'>✓</div>}
              <h3 className='text-lg font-medium'>
                {downloadProgress === 100 ? '下载完成' : downloadProgress === -1 ? '下载失败' : '正在下载文件'}
              </h3>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>{filename}</span>
                <span className='text-sm font-medium text-primary'>{downloadProgress}%</span>
              </div>

              <Progress
                size='md'
                radius='sm'
                value={downloadProgress < 0 ? 0 : downloadProgress}
                color={downloadProgress === 100 ? 'success' : downloadProgress === -1 ? 'danger' : 'primary'}
                classNames={{
                  base: 'max-w-md',
                  track: 'drop-shadow-md border border-default',
                  indicator: 'bg-gradient-to-r from-pink-500 to-yellow-500',
                  label: 'tracking-wider font-medium text-default-600',
                  value: 'text-foreground/60',
                }}
              />

              {downloadProgress === 100 && (
                <div className='flex justify-end mt-4'>
                  <Button
                    size='sm'
                    variant='light'
                    className='bg-gradient-to-tr from-pink-500/80 to-yellow-500/80 hover:from-pink-500 hover:to-yellow-500 text-white shadow-sm transition-all'
                    onPress={() => setDownloadProgress(null)}
                  >
                    关闭
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
