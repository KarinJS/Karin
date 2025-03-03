import { Button } from '@heroui/button'
import { Accordion, AccordionItem } from '@heroui/accordion'

import type { FC } from 'react'

/**
 * 内部组件 手风琴
 * @param list 列表
 * @param add 添加
 * @param remove 删除
 * @param children 子组件
 */
export const InternalAccordion: FC<{
  list: Record<string, any>[],
  add: () => void,
  remove: (index: number) => void,
  render: (index: number) => React.ReactNode,
  description: string,
  title: string,
}> = ({ list, add, remove, render, description, title }) => {
  return (
    <div className='w-full max-w-full'>
      <div className='flex items-center justify-between mb-2'>
        <div className='text-sm text-gray-500'>{description}</div>
        <Button
          size='sm'
          variant='light'
          onPress={add}
          className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          添加新卡片
        </Button>
      </div>
      <Accordion className='w-full border border-default-200 rounded-lg px-2 py-1'>
        {list.map((field, index) => (
          <AccordionItem
            key={field.id}
            textValue={`${title} ${index + 1}`}
            title={
              <div className='flex justify-between items-center w-full pr-4'>
                <span>{`${title} ${index + 1}`}</span>
                <div
                  role='button'
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(index)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      remove(index)
                    }
                  }}
                  className='px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer'
                >
                  删除
                </div>
              </div>
            }
            className='mb-2'
          >
            {render(index)}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
