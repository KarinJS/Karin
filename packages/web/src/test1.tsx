import toast from 'react-hot-toast'
import { useForm, FormProvider } from 'react-hook-form'
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
            key: 'checkbox-group-pro',
            componentType: 'checkbox-group',
            componentClassName: 'w-full',
            defaultValue: [],
            checkbox: [
              {
                key: 'checkbox-1',
                componentType: 'checkbox',
                label: '选项1',
                value: '1',
              },
              {
                key: 'checkbox-2',
                componentType: 'checkbox',
                label: '选项2',
                value: '2',
              },
            ],
          },
        ],
      },
      data: [
        {
          'accordion-pro-item-input': '1',
          'checkbox-group-pro': ['1'],
        },
        {
          'accordion-pro-item-input': '3',
          'checkbox-group-pro': ['2'],
        },
      ],
    },
  ]

  const methods = useForm({
    defaultValues: initDefaultValues(options)
  })

  /** 提交表单 */
  const onSubmit = (data) => {
    console.log('完整表单数据:', JSON.stringify(data, null, 2))
    toast.success('表单提交成功！')
  }

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4'>
        <div className='space-y-4'>
          <RenderComponent
            options={options}
            control={methods.control}
            register={methods.register}
          />
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
    </FormProvider>
  )
}
