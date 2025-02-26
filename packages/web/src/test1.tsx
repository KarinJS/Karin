import toast from 'react-hot-toast'
import { useForm, FormProvider } from 'react-hook-form'
import { DefaultValues, initDefaultValues } from './components/config/values'
import { Form } from '@heroui/form'
import { RenderComponent } from './components/config/render'
import type { ComponentConfig } from 'node-karin'
import { Button } from '@heroui/button'

export default function Parent () {
  const options: ComponentConfig[] = [
    // {
    //   key: 'parent-field',
    //   componentType: 'input',
    //   componentClassName: 'w-full',
    //   defaultValue: 'test'
    // },
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
    // {
    //   key: 'accordion',
    //   componentType: 'accordion',
    //   label: '手风琴',
    //   description: '这是一个手风琴组件',
    //   children: [
    //     {
    //       key: 'accordion-item',
    //       componentType: 'accordion-item',
    //       description: '这是一个手风琴项',
    //       children: [
    //         {
    //           key: 'accordion-item-input',
    //           componentType: 'input',
    //           componentClassName: 'w-full',
    //           defaultValue: '',
    //         },
    //       ],
    //     },
    //   ],
    // },
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
            key: 'input',
            componentType: 'input',
            componentClassName: 'w-full',
            defaultValue: '',
          },
          {
            key: 'checkbox-group',
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
          {
            key: 'input-group',
            componentType: 'input-group',
            label: '输入框组',
            description: '这是一个输入框组',
            template: {
              key: 'pro-input',
              componentType: 'input',
              componentClassName: 'w-full',
            },
            data: [],
          },
        ],
      },
      data: [
        {
          input: '1',
          'checkbox-group': ['1'],
          'input-group': ['1', '2', '3'],
        },
        {
          input: '3',
          'checkbox-group': ['2'],
          'input-group': ['3', '4', '5'],
        },
      ],
    },
  ]

  const methods = useForm({
    defaultValues: initDefaultValues(options)
  })

  /** 提交表单 */
  const onSubmit = (data: DefaultValues) => {
    console.log('完整表单数据:', JSON.stringify(data, null, 2))
    console.log('data:', data)
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
