import { Input } from '@heroui/input'
import { Form } from '@heroui/form'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { Button } from '@heroui/button'
import { X } from 'lucide-react'
import { getSystemEnvComponent } from './system-env'

type EnvField = {
  key: string
  value: string
  comment: string
}

type EnvFormData = {
  systemEnvs: EnvField[]  // 系统环境变量
  customEnvs: EnvField[]  // 自定义环境变量
}

// 系统预设的环境变量键名
export const SYSTEM_ENV_KEYS = [
  'HTTP_ENABLE',
  'HTTP_PORT',
  'HTTP_HOST',
  'HTTP_AUTH_KEY',
  'WS_SERVER_AUTH_KEY',
  'REDIS_ENABLE',
  'PM2_RESTART',
  'TSX_WATCH',
  'LOG_LEVEL',
  'LOG_DAYS_TO_KEEP',
  'LOG_MAX_LOG_SIZE',
  'LOG_FNC_COLOR',
  'LOG_MAX_CONNECTIONS',
  'FFMPEG_PATH',
  'FFPROBE_PATH',
  'FFPLAY_PATH',
  'RUNTIME',
  'NODE_ENV'
]

/**
 * 获取环境变量配置组件
 * @param data 环境变量数据
 * @param formRef 表单引用
 */
export const getEnvComponent = (
  data: Record<string, { value: string, comment: string }>,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm<EnvFormData>({
    defaultValues: {
      systemEnvs: Object.entries(data)
        .filter(([key]) => SYSTEM_ENV_KEYS.includes(key))
        .map(([key, value]) => ({
          key,
          ...value
        })),
      customEnvs: Object.entries(data)
        .filter(([key]) => !SYSTEM_ENV_KEYS.includes(key))
        .map(([key, value]) => ({
          key,
          ...value
        }))
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'customEnvs'  // 只对自定义环境变量使用 fieldArray
  })

  // 获取系统环境变量组件
  const SystemEnvComponent = getSystemEnvComponent(
    {
      HTTP_PORT: Number(data.HTTP_PORT?.value) || 7777,
      HTTP_HOST: data.HTTP_HOST?.value || '0.0.0.0',
      HTTP_AUTH_KEY: data.HTTP_AUTH_KEY?.value || '',
      WS_SERVER_AUTH_KEY: data.WS_SERVER_AUTH_KEY?.value || '',
      REDIS_ENABLE: data.REDIS_ENABLE?.value === 'true',
      PM2_RESTART: data.PM2_RESTART?.value === 'true',
      TSX_WATCH: data.TSX_WATCH?.value === 'true',
      LOG_LEVEL: (data.LOG_LEVEL?.value || 'info') as any,
      LOG_DAYS_TO_KEEP: Number(data.LOG_DAYS_TO_KEEP?.value) || 7,
      LOG_MAX_LOG_SIZE: Number(data.LOG_MAX_LOG_SIZE?.value) || 0,
      LOG_FNC_COLOR: data.LOG_FNC_COLOR?.value || '#E1D919',
      LOG_MAX_CONNECTIONS: Number(data.LOG_MAX_CONNECTIONS?.value) || 5,
      FFMPEG_PATH: data.FFMPEG_PATH?.value || '',
      FFPROBE_PATH: data.FFPROBE_PATH?.value || '',
      FFPLAY_PATH: data.FFPLAY_PATH?.value || '',
      RUNTIME: (data.RUNTIME?.value || 'tsx') as any,
      NODE_ENV: (data.NODE_ENV?.value || 'development') as any
    },
    formRef
  )

  const onSubmit = (formData: EnvFormData) => {
    const result = [...formData.systemEnvs, ...formData.customEnvs]
      .reduce((acc, { key, value, comment }) => {
        acc[key] = { value, comment }
        return acc
      }, {} as Record<string, { value: string, comment: string }>)
    console.log('表单提交:', result)
  }

  return (
    <FormProvider {...methods}>
      <Form
        className='w-full max-w-full flex flex-col'
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className='w-full max-w-full px-4 py-2 space-y-4'>
          {/* 系统环境变量配置 */}
          {SystemEnvComponent}

          {/* 自定义环境变量配置 */}
          <div className='space-y-2'>
            <div className='flex justify-end'>
              <Button
                color='primary'
                size='sm'
                onPress={() => append({ key: '', value: '', comment: '' })}
                type='button'
              >
                添加新的自定义环境变量
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className='p-2 rounded-lg border border-gray-200 relative'
              >
                <div className='grid md:grid-cols-3 grid-cols-1 gap-2'>
                  <Input
                    className='p-1 rounded-lg w-full'
                    color='warning'
                    label='键'
                    size='sm'
                    isRequired
                    {...methods.register(`customEnvs.${index}.key`)}
                  />
                  <Input
                    className='p-1 rounded-lg w-full'
                    color='primary'
                    label='值'
                    size='sm'
                    {...methods.register(`customEnvs.${index}.value`)}
                  />
                  <div className='flex gap-2 items-center'>
                    <Input
                      className='p-1 rounded-lg w-full'
                      color='secondary'
                      label='注释'
                      size='sm'
                      {...methods.register(`customEnvs.${index}.comment`)}
                    />
                    <Button
                      color='danger'
                      size='sm'
                      variant='light'
                      className='min-w-6 h-6 p-0'
                      onPress={() => remove(index)}
                      type='button'
                    >
                      <X className='w-3 h-3' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Form>
    </FormProvider>
  )
}
