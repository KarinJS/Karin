import { Input } from '@heroui/input'
import { Form } from '@heroui/form'
import { useForm, FormProvider } from 'react-hook-form'
import { NumberInput } from '@heroui/number-input'
import { Switch } from '@heroui/switch'
import { saveConfig } from './save'
import type { PM2 } from 'node-karin'

/**
 * 获取pm2组件
 * @param data pm2数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 适配器组件
 */
const getPm2Component = (
  data: PM2,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm({
    defaultValues: {
      lines: data.lines ?? 1000,
      apps: data.apps?.[0]
    }
  })

  const render = [
    {
      type: 'number',
      key: 'lines',
      label: '日志最多显示多少行',
      name: 'lines',
      description: '日志最多显示多少行'
    },
    {
      type: 'string',
      key: 'apps.name',
      label: '唯一标识符',
      name: 'apps.name',
      description: '应用名称 唯一标识符 用于指令管理实例'
    },
    {
      type: 'string',
      key: 'apps.script',
      label: '入口文件',
      name: 'apps.script',
      description: '入口文件'
    },
    {
      type: 'number',
      key: 'apps.max_restarts',
      label: '最大重启次数',
      name: 'apps.max_restarts',
      description: '最大重启次数'
    },
    {
      type: 'string',
      key: 'apps.max_memory_restart',
      label: '最大内存重启',
      name: 'apps.max_memory_restart',
      description: '最大内存重启'
    },
    {
      type: 'number',
      key: 'apps.restart_delay',
      label: '重启延迟',
      name: 'apps.restart_delay',
      description: '重启延迟'
    },
    {
      type: 'string',
      key: 'apps.error_file',
      label: '错误日志路径',
      name: 'apps.error_file',
      description: '错误日志路径'
    },
    {
      type: 'string',
      key: 'apps.out_file',
      label: '输出日志路径',
      name: 'apps.out_file',
      description: '输出日志路径'
    }
  ]

  const onSubmit = (formData: {
    lines: number
    apps: PM2['apps'][number]
  }) => {
    const result = {
      lines: formData.lines ?? 1000,
      apps: data.apps
    }
    result.apps[0] = formData.apps

    saveConfig('pm2', result)
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
            <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-gray-200 mb-3'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-medium'>进程守护</span>
                <span className='text-xs text-gray-500'>崩溃后是否自动重启</span>
              </div>
              <Switch
                {...methods.register('apps.autorestart')}
                color='success'
              />
            </div>
            <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-gray-200 mb-3'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-medium'>合并日志</span>
                <span className='text-xs text-gray-500'>是否合并日志</span>
              </div>
              <Switch
                {...methods.register('apps.merge_logs')}
                color='success'
              />
            </div>
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
                    isRequired
                    description={item.description}
                    {...methods.register(key)}
                  />
                )
              }

              return (
                <Input
                  key={key}
                  className='p-2 rounded-lg w-full'
                  color='primary'
                  label={item.label}
                  description={item.description}
                  isRequired
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

export default getPm2Component
