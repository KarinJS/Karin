import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { initDefaultValues } from './components/config/values'
import { Form } from '@heroui/form'
import { RenderComponent } from './components/config/render'
import type { ComponentConfig } from 'node-karin'
import { Button } from '@heroui/button'

export default function Parent () {
  const options: ComponentConfig[] = [
    {
      key: 'parent-field',
      componentType: 'input',
      componentClassName: 'w-full',
      defaultValue: 'test'
    },
    {
      key: 'input-group',
      componentType: 'input-group',
      label: '输入框组',
      description: '这是一个输入框组',
      template: {
        key: 'input',
        componentType: 'input',
        componentClassName: 'w-full',
      },
      data: ['1', '2', '3'],
    },
    {
      key: 'accordion',
      componentType: 'accordion',
      label: '手风琴',
      description: '这是一个手风琴组件',
      children: [
        {
          key: 'accordion-item',
          componentType: 'accordion-item',
          description: '这是一个手风琴项',
          children: [
            {
              key: 'accordion-item-input',
              componentType: 'input',
              componentClassName: 'w-full',
              defaultValue: '',
            },
          ],
        },
      ],
    },
    {
      key: 'accordion-pro',
      componentType: 'accordion-pro',
      label: '手风琴',
      description: '这是一个手风琴组件',
      children: {
        key: 'accordion-pro-item',
        description: '这是一个手风琴项',
        children: [
          {
            key: 'accordion-pro-item-input',
            componentType: 'input',
            componentClassName: 'w-full',
            defaultValue: '',
          },
          {
            key: 'accordion-pro-item-input-2',
            componentType: 'input',
            componentClassName: 'w-full',
            defaultValue: '',
          },
        ],
      },
      data: [
        {
          'accordion-pro-item-input': '1',
          'accordion-pro-item-input-2': '2',
        },
        {
          'accordion-pro-item-input': '3',
          'accordion-pro-item-input-2': '4',
        },
      ],
    },
  ]

  const defaultValues = initDefaultValues(options)
  const { control, register, handleSubmit } = useForm({
    defaultValues
  })

  /** 提交表单 */
  const onSubmit = handleSubmit((data) => {
    console.log('表单数据:', data)
    toast.success('表单提交成功！')
  })

  return (
    <Form onSubmit={onSubmit} className='flex flex-col gap-4 p-4'>
      <div className='space-y-4'>
        <RenderComponent options={options} control={control} register={register} />
      </div>
      <Button
        type='submit'
        variant='solid'
        color='primary'
        className='w-full mt-4'
      >
        提交表单
      </Button>
    </Form>
  )
}
