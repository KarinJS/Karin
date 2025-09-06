import React from 'react'
import { Spinner } from '@heroui/spinner'
import { Card, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'

type FullScreenLoaderProps = {
  label?: string
  progress?: number
  status?: string
  showTips?: boolean
}

/**
 * 全屏加载组件，用于显示系统更新或长时间操作的加载状态
 *
 * @param props - 组件属性
 * @param props.label - 加载提示文本，默认为 '系统更新中，请稍后......'
 * @param props.progress - 可选的进度百分比 (0-100)
 * @param props.status - 可选的状态信息，显示在芯片中
 * @param props.showTips - 是否显示友好提示信息，默认为 true
 * @returns React 函数组件
 *
 * @example
 * // 基础使用
 * <FullScreenLoader />
 *
 * @example
 * // 带进度和状态的使用
 * <FullScreenLoader
 *   label="正在下载更新包..."
 *   progress={65}
 *   status="下载中"
 * />
 *
 * @example
 * // 简化版本，不显示提示信息
 * <FullScreenLoader
 *   label="系统重启中..."
 *   showTips={false}
 * />
 *
 * @example
 * // 仅显示进度
 * <FullScreenLoader
 *   progress={80}
 *   status="安装中"
 * />
 */
export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  label = '系统更新中，请稍后......',
  progress,
  status,
  showTips = true,
}) => (
  <div className='fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl bg-black/20'>
    <Card className='max-w-md mx-4 shadow-2xl border-0'>
      <CardBody className='flex flex-col items-center gap-6 p-8'>
        {/* 主要加载动画和标签 */}
        <div className='flex flex-col items-center gap-4'>
          <Spinner
            className='text-primary'
            size='lg'
            label={label}
          />

          {/* 进度条 */}
          {progress !== undefined && (
            <div className='w-full max-w-xs'>
              <div className='flex justify-between text-sm text-default-600 mb-2'>
                <span>更新进度</span>
                <span>{progress}%</span>
              </div>
              <div className='w-full bg-default-200 rounded-full h-2'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300 ease-out'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 状态信息 */}
          {status && (
            <Chip
              variant='flat'
              color='primary'
              size='sm'
              className='animate-pulse'
            >
              {status}
            </Chip>
          )}
        </div>

        {/* 友好提示 */}
        {showTips && (
          <div className='text-center space-y-3'>
            <div className='text-sm text-default-600'>
              <p className='mb-2'>🔄 正在为您更新系统</p>
              <p className='text-xs text-default-500'>
                更新过程中请勿关闭浏览器或刷新页面
              </p>
            </div>

            <div className='flex flex-wrap justify-center gap-2 text-xs text-default-400'>
              <span className='flex items-center gap-1'>
                ⚡ 优化性能
              </span>
              <span className='flex items-center gap-1'>
                🛡️ 安全升级
              </span>
              <span className='flex items-center gap-1'>
                ✨ 新功能
              </span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  </div>
)

export default FullScreenLoader
