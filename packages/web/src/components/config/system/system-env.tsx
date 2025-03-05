import { Input } from '@heroui/input'
import { Switch } from '@heroui/switch'
import { RadioGroup, Radio } from '@heroui/radio'
import { NumberInput } from '@heroui/number-input'
import ColorPicker from '@/components/common/ColorPicker'
import { Controller } from 'react-hook-form'

import type { EnvFormData } from './env'
import type { UseFormReturn } from 'react-hook-form'

/**
 * @description 获取系统环境变量组件
 * @param methods 表单方法
 * @returns 系统环境变量组件
 */
export const getSystemEnvComponent = (
  methods: UseFormReturn<EnvFormData, any, undefined>
) => {
  return (
    <div className='w-full max-w-full px-4 py-2 space-y-4'>
      {/* HTTP 配置组 */}
      <div className='p-4 rounded-lg border border-default-200'>
        <h3 className='text-sm font-medium mb-3'>HTTP 配置</h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {/* @ts-ignore */}
          <NumberInput
            className='p-1 rounded-lg w-full'
            color='primary'
            label='HTTP 端口'
            description='HTTP 端口 默认7777'
            size='sm'
            isRequired
            min={1}
            max={65535}
            {...methods.register('systemEnvs.HTTP_PORT.value')}
          />
          <Input
            className='p-1 rounded-lg w-full'
            color='primary'
            label='HTTP 主机'
            description='HTTP 主机 默认0.0.0.0 ipv6请使用::'
            size='sm'
            isRequired
            placeholder='0.0.0.0'
            {...methods.register('systemEnvs.HTTP_HOST.value')}
          />
          <Input
            className='p-1 rounded-lg w-full'
            color='primary'
            label='HTTP 鉴权密钥'
            description='仅用于karin自身Api路由 /api/v1'
            size='sm'
            {...methods.register('systemEnvs.HTTP_AUTH_KEY.value')}
          />
          <Input
            className='p-1 rounded-lg w-full'
            color='primary'
            label='WebSocket 鉴权密钥'
            description='OneBot11 WebSocketServer鉴权密钥'
            size='sm'
            {...methods.register('systemEnvs.WS_SERVER_AUTH_KEY.value')}
          />
        </div>
      </div>

      {/* 系统开关配置组 */}
      <div className='p-4 rounded-lg border border-default-200'>
        <h3 className='text-sm font-medium mb-3'>系统开关</h3>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='inline-flex items-center justify-between p-3 rounded-lg border border-default-200'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-medium'>Redis</span>
              <span className='text-xs text-gray-500'>是否启用 Redis</span>
            </div>
            <Switch
              {...methods.register('systemEnvs.REDIS_ENABLE.value')}
              color='success'
            />
          </div>
          <div className='inline-flex items-center justify-between p-3 rounded-lg border border-default-200'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-medium'>PM2 重启</span>
              <span className='text-xs text-gray-500'>重启时是否调用 PM2</span>
            </div>
            <Switch
              {...methods.register('systemEnvs.PM2_RESTART.value')}
              color='success'
            />
          </div>
        </div>
      </div>

      {/* 日志配置组 */}
      <div className='p-4 rounded-lg border border-default-200'>
        <h3 className='text-sm font-medium mb-3'>日志配置</h3>
        <div className='space-y-4'>
          {/* 日志函数颜色选择器 */}
          <div className='flex flex-col gap-2'>
            <span className='text-sm text-gray-600'>日志函数颜色</span>
            <div className='flex'>
              <Controller
                name='systemEnvs.LOG_FNC_COLOR.value'
                control={methods.control}
                defaultValue={methods.getValues('systemEnvs.LOG_FNC_COLOR.value')}
                render={({ field: { value, onChange } }) => (
                  <ColorPicker
                    color={value || methods.getValues('systemEnvs.LOG_FNC_COLOR.value')}
                    onChange={(color) => {
                      onChange(color)
                    }}
                  />
                )}
              />
            </div>
          </div>
          <Controller
            name='systemEnvs.LOG_LEVEL.value'
            control={methods.control}
            render={({ field }) => (
              <RadioGroup
                className='p-1'
                color='primary'
                label='日志等级'
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <div className='flex flex-col gap-2'>
                  <div className='text-xs text-gray-500 mb-1'>
                    日志等级从低到高依次为：all {'<'} trace {'<'} debug {'<'} mark {'<'} info {'<'} warn {'<'} error {'<'} fatal {'<'} off
                  </div>
                  <div className='grid grid-cols-3 gap-4'>
                    <Radio value='all' color='primary'>
                      <div className='flex flex-col'>
                        <span className='text-primary-500'>所有日志 (All)</span>
                        <span className='text-xs text-gray-500'>输出所有级别的日志</span>
                      </div>
                    </Radio>
                    <Radio value='trace' color='secondary'>
                      <div className='flex flex-col'>
                        <span className='text-secondary-500'>追踪 (Trace)</span>
                        <span className='text-xs text-gray-500'>用于追踪程序执行流程</span>
                      </div>
                    </Radio>
                    <Radio value='debug' color='primary'>
                      <div className='flex flex-col'>
                        <span className='text-info-500'>调试 (Debug)</span>
                        <span className='text-xs text-gray-500'>调试信息</span>
                      </div>
                    </Radio>
                    <Radio value='mark' color='primary'>
                      <div className='flex flex-col'>
                        <span className='text-primary-500'>标记 (Mark)</span>
                        <span className='text-xs text-gray-500'>重要标记点</span>
                      </div>
                    </Radio>
                    <Radio value='info' color='success'>
                      <div className='flex flex-col'>
                        <span className='text-success-500'>信息 (Info)</span>
                        <span className='text-xs text-gray-500'>一般信息</span>
                      </div>
                    </Radio>
                    <Radio value='warn' color='warning'>
                      <div className='flex flex-col'>
                        <span className='text-warning-500'>警告 (Warn)</span>
                        <span className='text-xs text-gray-500'>警告信息</span>
                      </div>
                    </Radio>
                    <Radio value='error' color='danger'>
                      <div className='flex flex-col'>
                        <span className='text-danger-500'>错误 (Error)</span>
                        <span className='text-xs text-gray-500'>错误信息</span>
                      </div>
                    </Radio>
                    <Radio value='fatal' color='danger'>
                      <div className='flex flex-col'>
                        <span className='text-danger-500 font-bold'>致命 (Fatal)</span>
                        <span className='text-xs text-gray-500'>致命错误</span>
                      </div>
                    </Radio>
                    <Radio value='off' color='default'>
                      <div className='flex flex-col'>
                        <span className='text-gray-500'>关闭 (Off)</span>
                        <span className='text-xs text-gray-500'>关闭所有日志</span>
                      </div>
                    </Radio>
                  </div>
                </div>
              </RadioGroup>
            )}
          />

          <div className='grid md:grid-cols-3 grid-cols-1 gap-4'>
            {/* @ts-ignore */}
            <NumberInput
              className='p-1 rounded-lg w-full'
              color='primary'
              label='日志保留天数'
              description='日志保留天数 默认7天'
              size='sm'
              isRequired
              min={1}
              {...methods.register('systemEnvs.LOG_DAYS_TO_KEEP.value')}
            />
            {/* @ts-ignore */}
            <NumberInput
              className='p-1 rounded-lg w-full'
              color='primary'
              label='日志文件最大大小'
              description='如果此项大于0则启用日志分割 单位MB'
              size='sm'
              isRequired
              min={0}
              {...methods.register('systemEnvs.LOG_MAX_LOG_SIZE.value')}
            />
            {/* @ts-ignore */}
            <NumberInput
              className='p-1 rounded-lg w-full'
              color='primary'
              label='长连接最大连接数'
              description='日志api最大连接数 不建议过多'
              size='sm'
              isRequired
              min={1}
              max={10}
              {...methods.register('systemEnvs.LOG_MAX_CONNECTIONS.value')}
            />
          </div>
        </div>
      </div>

      {/* FFmpeg 配置组 */}
      <div className='p-4 rounded-lg border border-default-200'>
        <h3 className='text-sm font-medium mb-3'>FFmpeg 配置</h3>
        <div className='grid md:grid-cols-1 gap-4'>
          <Input
            className='p-1 rounded-lg w-full'
            color='primary'
            label='FFmpeg 路径'
            size='sm'
            {...methods.register('systemEnvs.FFMPEG_PATH.value')}
          />
          <Input
            className='p-1 rounded-lg w-full'
            color='primary'
            label='FFprobe 路径'
            size='sm'
            {...methods.register('systemEnvs.FFPROBE_PATH.value')}
          />
          <Input
            className='p-1 rounded-lg w-full'
            color='primary'
            label='FFplay 路径'
            size='sm'
            {...methods.register('systemEnvs.FFPLAY_PATH.value')}
          />
        </div>
      </div>

      {/* 运行时配置组 */}
      <div className='p-4 rounded-lg border border-default-200'>
        <h3 className='text-sm font-medium mb-3'>运行时配置</h3>
        <div className='flex flex-col gap-4'>
          <Controller
            name='systemEnvs.RUNTIME.value'
            control={methods.control}
            render={({ field }) => (
              <RadioGroup
                className='p-1'
                color='primary'
                label='运行时'
                value={field.value}
                defaultValue='node'
                onValueChange={(value) => field.onChange(value)}
              >
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-wrap gap-4'>
                    <Radio value='node' color='success'>
                      <div className='flex flex-col'>
                        <span>Node</span>
                        <span className='text-xs text-gray-500'>使用 Node.js 运行</span>
                      </div>
                    </Radio>
                    <Radio value='tsx' color='secondary'>
                      <div className='flex flex-col'>
                        <span>TSX</span>
                        <span className='text-xs text-gray-500'>使用 tsx 直接运行 TypeScript</span>
                      </div>
                    </Radio>
                    <Radio value='pm2' color='warning'>
                      <div className='flex flex-col'>
                        <span>PM2</span>
                        <span className='text-xs text-gray-500'>使用 PM2 进程管理</span>
                      </div>
                    </Radio>
                  </div>
                </div>
              </RadioGroup>
            )}
          />

          <Controller
            name='systemEnvs.NODE_ENV.value'
            control={methods.control}
            render={({ field }) => (
              <RadioGroup
                className='p-1'
                color='primary'
                label='环境'
                value={field.value}
                defaultValue='development'
                onValueChange={(value) => field.onChange(value)}
              >
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-wrap gap-4'>
                    <Radio value='production' color='success'>
                      <div className='flex flex-col'>
                        <span>Production</span>
                        <span className='text-xs text-gray-500'>生产环境</span>
                      </div>
                    </Radio>
                    <Radio value='development' color='secondary'>
                      <div className='flex flex-col'>
                        <span>Development</span>
                        <span className='text-xs text-gray-500'>开发环境</span>
                      </div>
                    </Radio>
                    <Radio value='test' color='warning'>
                      <div className='flex flex-col'>
                        <span>Test</span>
                        <span className='text-xs text-gray-500'>测试环境</span>
                      </div>
                    </Radio>
                  </div>
                </div>
              </RadioGroup>
            )}
          />
          {/* tsx监察者模式 */}
          <div className='inline-flex items-center justify-between p-3 rounded-lg border border-default-200'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-medium'>TSX Watch</span>
              <span className='text-xs text-gray-500'>是否启用 TSX 监听模式</span>
            </div>
            <Switch
              defaultSelected={methods.getValues('systemEnvs.TSX_WATCH.value') ?? false}
              {...methods.register('systemEnvs.TSX_WATCH.value')}
              color='success'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
