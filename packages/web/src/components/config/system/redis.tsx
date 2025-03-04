import { Input } from '@heroui/input'
import { Form } from '@heroui/form'
import { useForm, FormProvider } from 'react-hook-form'
import { NumberInput } from '@heroui/number-input'
import { saveConfig } from './save'

import type { PM2 } from 'node-karin'

/**
 * 获取redis组件
 * @param data redis数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 适配器组件
 */
const getRedisComponent = (
  data: Record<string, any>,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm({
    defaultValues: data
  })

  const render = [
    {
      type: 'string',
      key: 'url',
      label: '连接地址',
      name: 'url',
      isRequired: true,
      description: '连接地址 格式: redis://127.0.0.1:6379'
    },
    {
      type: 'string',
      key: 'username',
      label: '用户名',
      name: 'username',
      isRequired: false,
      description: '用户名'
    },
    {
      type: 'string',
      key: 'password',
      label: '密码',
      name: 'password',
      isRequired: false,
      description: '密码'
    },
    {
      type: 'number',
      key: 'database',
      label: '数据库',
      name: 'database',
      isRequired: true,
      description: '数据库 最大15'
    },
  ]

  const onSubmit = (formData: Record<string, any>) => {
    saveConfig('redis', formData)
  }

  return (
    <FormProvider {...methods}>
      <Form
        className='w-full max-w-full flex flex-col'
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className='w-full max-w-full px-6 py-4 space-y-4'>
          <div className='grid md:grid-cols-2 grid-cols-1 md:gap-x-12'>
            {render.map((item) => {
              const key = item.key as keyof PM2
              if (item.type === 'number') {
                return (
                  // @ts-ignore
                  <NumberInput
                    key={item.key}
                    className='p-2 rounded-lg w-full'
                    color='primary'
                    label={item.label}
                    isRequired={item.isRequired}
                    description={item.description}
                    {...methods.register(key)}
                    validate={(value) => {
                      if (item.isRequired && value === undefined) {
                        return '必填项'
                      }

                      if (value > 15) {
                        return '最大只允许15哦'
                      }

                      if (value < 0) {
                        return '最小只允许0哦'
                      }

                      return true
                    }}
                  />
                )
              }

              return (
                <Input
                  key={key}
                  className='p-2 rounded-lg w-full'
                  color='primary'
                  label={item.label}
                  isRequired={item.isRequired}
                  description={item.description}
                  {...methods.register(key)}
                />
              )
            })}
          </div>
        </div>
      </Form>
    </FormProvider>
  )
}

export default getRedisComponent
