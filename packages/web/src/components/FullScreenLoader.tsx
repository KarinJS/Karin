import React from 'react'
import { Spinner } from '@heroui/spinner'

type FullScreenLoaderProps = {
  label?: string
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ label = '系统更新中，请稍后......' }) => (
  <div className='fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl'>
    <div className='flex flex-col items-center gap-4 p-6'>
      <Spinner
        className='text-default-50'
        size='lg'
        label={label}
      />
    </div>
  </div>
)
