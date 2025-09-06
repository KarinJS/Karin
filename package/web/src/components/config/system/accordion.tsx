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
          variant='solid'
          color='primary'
          onPress={add}
        >
          添加
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
                <Button
                  as='div'
                  size='sm'
                  color='danger'
                  variant='solid'
                  onPress={() => remove(index)}
                >
                  删除
                </Button>
              </div>
            }
            className='mb-2 mx-2'
          >
            {render(index)}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
