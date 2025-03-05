import { Input } from '@heroui/input'
import { Form } from '@heroui/form'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { Button } from '@heroui/button'
import { X } from 'lucide-react'
import { getSystemEnvComponent } from './system-env'
import { saveConfig } from './save'

interface SystemEnvsField {
  HTTP_PORT: {
    value: number
    comment: string
  }
  HTTP_HOST: {
    value: string
    comment: string
  }
  HTTP_AUTH_KEY: {
    value: string
    comment: string
  }
  WS_SERVER_AUTH_KEY: {
    value: string
    comment: string
  }
  REDIS_ENABLE: {
    value: boolean
    comment: string
  }
  PM2_RESTART: {
    value: boolean
    comment: string
  }
  TSX_WATCH: {
    value: boolean
    comment: string
  }
  LOG_LEVEL: {
    value: 'all' | 'trace' | 'debug' | 'mark' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
    comment: string
  }
  LOG_DAYS_TO_KEEP: {
    value: number
    comment: string
  }
  LOG_MAX_LOG_SIZE: {
    value: number
    comment: string
  }
  LOG_FNC_COLOR: {
    value: string
    comment: string
  }
  LOG_MAX_CONNECTIONS: {
    value: number
    comment: string
  }
  FFMPEG_PATH: {
    value: string
    comment: string
  }
  FFPROBE_PATH: {
    value: string
    comment: string
  }
  FFPLAY_PATH: {
    value: string
    comment: string
  }
  RUNTIME: {
    value: 'node' | 'tsx' | 'pm2'
    comment: string
  }
  NODE_ENV: {
    value: 'development' | 'production' | 'test'
    comment: string
  }
}

export type EnvField = {
  key: string
  value: string
  comment: string
}

export type EnvFormData = {
  systemEnvs: SystemEnvsField  // 系统环境变量
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
const getEnvComponent = (
  data: Record<string, { value: string, comment: string }>,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  /** 区分系统环境变量和自定义环境变量 */
  const customEnvs: EnvField[] = []
  const systemEnvs: SystemEnvsField = {
    HTTP_PORT: {
      value: Number(data.HTTP_PORT?.value) || 7777,
      comment: data.HTTP_PORT?.comment || ''
    },
    HTTP_HOST: {
      value: data.HTTP_HOST?.value || '0.0.0.0',
      comment: data.HTTP_HOST?.comment || ''
    },
    HTTP_AUTH_KEY: {
      value: data.HTTP_AUTH_KEY?.value || '',
      comment: data.HTTP_AUTH_KEY?.comment || ''
    },
    WS_SERVER_AUTH_KEY: {
      value: data.WS_SERVER_AUTH_KEY?.value || '',
      comment: data.WS_SERVER_AUTH_KEY?.comment || ''
    },
    REDIS_ENABLE: {
      value: data.REDIS_ENABLE?.value === 'true',
      comment: data.REDIS_ENABLE?.comment || ''
    },
    PM2_RESTART: {
      value: data.PM2_RESTART?.value === 'true',
      comment: data.PM2_RESTART?.comment || ''
    },
    TSX_WATCH: {
      value: data.TSX_WATCH?.value === 'true',
      comment: data.TSX_WATCH?.comment || ''
    },
    LOG_LEVEL: {
      value: data.LOG_LEVEL?.value as SystemEnvsField['LOG_LEVEL']['value'] || 'info',
      comment: data.LOG_LEVEL?.comment || ''
    },
    LOG_DAYS_TO_KEEP: {
      value: Number(data.LOG_DAYS_TO_KEEP?.value) || 7,
      comment: data.LOG_DAYS_TO_KEEP?.comment || ''
    },
    LOG_MAX_LOG_SIZE: {
      value: Number(data.LOG_MAX_LOG_SIZE?.value) || 0,
      comment: data.LOG_MAX_LOG_SIZE?.comment || ''
    },
    LOG_FNC_COLOR: {
      value: data.LOG_FNC_COLOR?.value || '#E1D919',
      comment: data.LOG_FNC_COLOR?.comment || ''
    },
    LOG_MAX_CONNECTIONS: {
      value: Number(data.LOG_MAX_CONNECTIONS?.value) || 5,
      comment: data.LOG_MAX_CONNECTIONS?.comment || ''
    },
    FFMPEG_PATH: {
      value: data.FFMPEG_PATH?.value || '',
      comment: data.FFMPEG_PATH?.comment || ''
    },
    FFPROBE_PATH: {
      value: data.FFPROBE_PATH?.value || '',
      comment: data.FFPROBE_PATH?.comment || ''
    },
    FFPLAY_PATH: {
      value: data.FFPLAY_PATH?.value || '',
      comment: data.FFPLAY_PATH?.comment || ''
    },
    RUNTIME: {
      value: data.RUNTIME?.value as SystemEnvsField['RUNTIME']['value'] || 'tsx',
      comment: data.RUNTIME?.comment || ''
    },
    NODE_ENV: {
      value: data.NODE_ENV?.value as SystemEnvsField['NODE_ENV']['value'] || 'development',
      comment: data.NODE_ENV?.comment || ''
    }
  }

  /** 排除掉系统预设的环境变量 */
  Object.entries(data).forEach(([key, value]) => {
    if (SYSTEM_ENV_KEYS.includes(key)) return
    customEnvs.push({
      key,
      value: value.value,
      comment: value.comment
    })
  })

  const methods = useForm<EnvFormData>({
    defaultValues: { systemEnvs, customEnvs }
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'customEnvs'  // 只对自定义环境变量使用 fieldArray
  })

  // 获取系统环境变量组件
  const SystemEnvComponent = getSystemEnvComponent(methods)

  const onSubmit = (formData: EnvFormData) => {
    const result: Record<string, { value: string, comment: string }> = {}

    Object.entries(formData.systemEnvs).forEach(([key, value]) => {
      result[key] = { value: value.value, comment: value.comment }
    })
    formData.customEnvs.forEach(({ key, value, comment }) => {
      result[key] = { value, comment }
    })

    saveConfig('env', result)
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
                className='p-2 rounded-lg border border-default-200 relative'
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

export default getEnvComponent
