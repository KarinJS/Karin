import { Input } from '@heroui/input'
import { Divider } from '@heroui/divider'
import { Form } from '@heroui/form'
import { Switch } from '@heroui/switch'
import { Terminal, Network, Server } from 'lucide-react'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { InternalAccordion } from './accordion'
import { saveConfig } from './save'
import type { Renders } from 'node-karin'

/**
 * 获取渲染器组件
 * @param data 适配器数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 适配器组件
 */
const getRenderComponent = (
  data: Renders,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm({
    defaultValues: {
      // 不要用解构赋值 否则会丢失数据
      ws_server: {
        enable: data.ws_server.enable ?? false,
      },
      ws_client: (data.ws_client || []).map((item) => ({
        ...item,
        isSnapka: item.isSnapka ?? false,
        reconnectTime: item.reconnectTime ?? 5000,
        heartbeatTime: item.heartbeatTime ?? 30000,
      })),
      http_server: data.http_server || [],
    },
  })

  const wsClientFields = useFieldArray({
    control: methods.control,
    name: 'ws_client',
  })

  const httpServerFields = useFieldArray({
    control: methods.control,
    name: 'http_server',
  })

  const onSubmit = (formData: Renders) => {
    saveConfig('render', formData)
  }

  const addWsClient = () => {
    wsClientFields.append({
      enable: false,
      url: 'ws://127.0.0.1:7775/ws',
      token: '123456',
      isSnapka: false,
      reconnectTime: 5000,
      heartbeatTime: 30000,
    })
  }

  const addHttpServer = () => {
    httpServerFields.append({
      enable: false,
      url: 'http://127.0.0.1:7775',
      token: '123456',
      isSnapka: false,
    })
  }

  return (
    <FormProvider {...methods}>
      <Form
        className='w-full max-w-full flex flex-col'
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className='w-full max-w-full px-6 py-4 space-y-4'>
          <div className='text-lg font-medium flex items-center gap-2'>
            <Terminal className='w-5 h-5' />
            WebSocket Server服务
          </div>
          <Divider className='w-full' />
          <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-default-200 mb-3'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-medium'>启用</span>
              <span className='text-xs text-gray-500'>打开后 可允许和karin-puppeteer连接</span>
            </div>
            <Switch
              {...methods.register('ws_server.enable')}
              color='success'
            />
          </div>
          {/* WS Client 部分 */}
          <div className='text-lg font-medium flex items-center gap-2 mt-4'>
            <Network className='w-5 h-5' />
            正向 WebSocket 客户端
          </div>
          <Divider className='w-full' />
          <InternalAccordion
            list={wsClientFields.fields}
            add={addWsClient}
            remove={wsClientFields.remove}
            description='管理puppeteer的WebSocket客户端 也就是正向WebSocket'
            title='WebSocket 客户端'
            render={(index: number) => (
              <div className='flex flex-col gap-2 p-2'>
                <div className='flex flex-row gap-3 mb-3'>
                  <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-default-200 flex-shrink-0'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-sm font-medium'>启用</span>
                      <span className='text-xs text-gray-500'>启用WebSocket 客户端</span>
                    </div>
                    <Switch
                      {...methods.register(`ws_client.${index}.enable`)}
                      color='success'
                    />
                  </div>
                  <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-default-200 flex-shrink-0'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-sm font-medium'>Snapka模式</span>
                      <span className='text-xs text-gray-500'>是否使用snapka模式</span>
                    </div>
                    <Switch
                      {...methods.register(`ws_client.${index}.isSnapka`)}
                      color='success'
                    />
                  </div>
                </div>
                <Input
                  label='WebSocketServer 地址'
                  description='WebSocket的地址 也就是puppeteer的WebSocket服务端api地址 例如: ws://127.0.0.1:6099'
                  {...methods.register(`ws_client.${index}.url`)}
                  placeholder='WebSocket的地址'
                  className='p-2 rounded-lg w-full'
                  color='primary'
                />
                <Input
                  label='Token'
                  description='用于验证连接的Token 如果协议端没有设置无需填写'
                  {...methods.register(`ws_client.${index}.token`)}
                  placeholder='请输入 Token'
                  className='p-2 rounded-lg w-full'
                  color='primary'
                />
                <Input
                  label='重连时间'
                  description='连接断开后重新连接的时间间隔(毫秒)'
                  {...methods.register(`ws_client.${index}.reconnectTime`)}
                  placeholder='请输入重连时间'
                  className='p-2 rounded-lg w-full'
                  color='primary'
                  type='number'
                />
                <Input
                  label='心跳时间'
                  description='发送心跳包的时间间隔(毫秒)'
                  {...methods.register(`ws_client.${index}.heartbeatTime`)}
                  placeholder='请输入心跳时间'
                  className='p-2 rounded-lg w-full'
                  color='primary'
                  type='number'
                />
              </div>
            )}
          />

          {/* HTTP Server 部分 */}
          <div className='text-lg font-medium flex items-center gap-2 mt-4'>
            <Server className='w-5 h-5' />
            HTTP 服务端
          </div>
          <Divider className='w-full' />
          <InternalAccordion
            list={httpServerFields.fields}
            add={addHttpServer}
            remove={httpServerFields.remove}
            description='管理puppeteer的HTTP Api'
            title='HTTP Api'
            render={(index: number) => (
              <div className='flex flex-col p-2'>
                <div className='flex flex-row gap-3 mb-3'>
                  <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-default-200 flex-shrink-0'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-sm font-medium'>启用</span>
                      <span className='text-xs text-gray-500'>启用Http 服务端</span>
                    </div>
                    <Switch
                      {...methods.register(`http_server.${index}.enable`)}
                      color='success'
                    />
                  </div>
                  <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-default-200 flex-shrink-0'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-sm font-medium'>Snapka模式</span>
                      <span className='text-xs text-gray-500'>是否使用snapka模式</span>
                    </div>
                    <Switch
                      {...methods.register(`http_server.${index}.isSnapka`)}
                      color='success'
                    />
                  </div>
                </div>
                <Input
                  label='发送Api请求的URL地址'
                  {...methods.register(`http_server.${index}.url`)}
                  description='发送Api请求的URL地址 也就是puppeteer的http地址 例如: http://127.0.0.1:6099'
                  placeholder='发送Api请求的URL地址'
                  className='p-2 rounded-lg w-full'
                  color='primary'
                />
                <Input
                  label='Token'
                  description='用于发送Api请求的鉴权Token 如果puppeteer没有设置无需填写'
                  {...methods.register(`http_server.${index}.token`)}
                  placeholder='请输入 Token'
                  className='p-2 rounded-lg w-full'
                  color='primary'
                />
              </div>
            )}
          />

        </div>
      </Form>
    </FormProvider>
  )
}

export default getRenderComponent
