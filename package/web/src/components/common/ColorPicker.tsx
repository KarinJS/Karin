import toast from 'react-hot-toast'
import { Code } from '@heroui/code'
import { Button } from '@heroui/button'
import { Palette, Copy } from 'lucide-react'
import { SketchPicker } from 'react-color'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'

import type { FC } from 'react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

/**
 * @description 颜色选择器组件
 */
const ColorPicker: FC<ColorPickerProps> = ({
  color,
  onChange
}) => {
  return (
    <div className='flex flex-col md:flex-row items-center gap-2 p-4 rounded-lg border border-default-200'>
      {/* 颜色预览和值 */}
      <div className='flex items-center gap-3 flex-shrink-0'>
        <div
          className='w-8 h-8 rounded border shadow-sm'
          style={{
            backgroundColor: color,
            borderColor: 'rgba(0,0,0,0.1)'
          }}
        />
        <div className='flex flex-col gap-0.5'>
          <span className='text-sm text-gray-700'>预览颜色</span>
          <Code color='success' className='text-xs'>{color.toUpperCase()}</Code>
        </div>
      </div>

      {/* 纵向分隔线 - 添加高度和颜色 */}
      <div className='hidden md:block h-[80px] w-px bg-default-200 mx-2' />

      {/* 操作按钮组 */}
      <div className='flex flex-col gap-2 flex-1 md:max-w-[240px]'>
        <Popover>
          <PopoverTrigger>
            <Button
              size='sm'
              variant='bordered'
              color='primary'
              className='border !border-primary-200 hover:!border-primary-400 w-full justify-start px-4'
            >
              <div className='flex items-center w-full'>
                <Palette className='w-4 h-4 mr-1' />
                <span className='flex-1 text-center'>选择颜色</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='backdrop-blur-md bg-white/70 border border-gray-200/50'>
            <SketchPicker
              color={color}
              onChange={(color) => onChange(color.hex)}
              className='!bg-transparent !shadow-none'
            />
          </PopoverContent>
        </Popover>

        {/* 复制按钮 */}
        <Button
          size='sm'
          variant='bordered'
          color='secondary'
          className='border !border-secondary-200 hover:!border-secondary-400 w-full justify-start px-4'
          onPress={() => {
            const colorValue = color.toUpperCase()
            navigator.clipboard.writeText(colorValue).then(() => {
              toast.success(`颜色值 ${colorValue} 已复制到剪贴板`, {
                duration: 2000,
                position: 'top-center',
              })
            }).catch(() => {
              toast.error('复制失败，请手动复制颜色值', {
                duration: 2000,
                position: 'top-center',
              })
            })
          }}
        >
          <div className='flex items-center w-full'>
            <Copy className='w-4 h-4 mr-1' />
            <span className='flex-1 text-center'>复制颜色</span>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ColorPicker
