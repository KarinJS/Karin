import { Input } from '@heroui/input'
import { Tooltip } from '@heroui/tooltip'
import { Divider } from '@heroui/divider'
import { Form } from '@heroui/form'
import { Switch } from '@heroui/switch'
import { useState } from 'react'
import { Terminal, Bot, Network, Server } from 'lucide-react'
import { NumberInput } from '@heroui/number-input'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { InternalAccordion } from './accordion'

import type { Adapters } from 'node-karin'

/**
 * 获取适配器组件
 * @param data 适配器数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 适配器组件
 */
export const getAdapterComponent = (
  data: Adapters,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const [protocol, setProtocol] = useState(data.console.host.split('://')[0] || 'http')

  const methods = useForm({
    defaultValues: {
      // 不要用解构赋值 否则会丢失数据
      console: {
        isLocal: data.console.isLocal ?? false,
        token: data.console.token ?? '',
        host: data.console.host.replace(/(http|https):\/\//, '') ?? ''
      },
      onebot: {
        ws_server: {
          enable: data.onebot.ws_server.enable ?? false,
          timeout: data.onebot.ws_server.timeout ?? 120
        },
        ws_client: data.onebot.ws_client ?? [],
        http_server: data.onebot.http_server ?? []
      }
    }
  })

  const wsClientFields = useFieldArray({
    control: methods.control,
    name: 'onebot.ws_client'
  })

  const httpServerFields = useFieldArray({
    control: methods.control,
    name: 'onebot.http_server'
  })

  const isLocal = methods.watch('console.isLocal')

  const onSubmit = (formData: Adapters) => {
    const finalData = {
      ...formData,
      console: {
        ...formData.console,
        host: formData.console.host ? `${protocol}://${formData.console.host}` : ''
      }
    }
    console.log('表单提交:', finalData)
  }

  const addWsClient = () => {
    wsClientFields.append({
      enable: false,
      url: '',
      token: ''
    })
  }

  const addHttpServer = () => {
    httpServerFields.append({
      enable: false,
      self_id: 'default',
      url: '',
      token: ''
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
            Console 适配器
          </div>
          <Divider className='w-full' />
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Switch
                className='p-2 rounded-lg w-[500px]'
                {...methods.register('console.isLocal')}
                defaultChecked={data.console.isLocal}
                color='success'
              >
                <div className='flex flex-col'>
                  <span className='text-sm'>只允许本地访问</span>
                  <span className='text-xs text-gray-500'>打开后 适配器生成的资源文件连接将只允许127.0.0.1访问</span>
                </div>
              </Switch>
            </div>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-y-8 md:gap-x-12'>
              <Input
                label='资源文件的访问地址'
                {...methods.register('console.host')}
                description='打印的资源文件访问地址，本地模式下可留空。'
                placeholder=''
                className='p-2 rounded-lg w-full'
                color='primary'
                startContent={
                  <div className='flex items-center'>
                    <label className='sr-only' htmlFor='protocol'>
                      Protocol
                    </label>
                    <select
                      className='outline-none border-0 bg-transparent text-primary text-small'
                      id='protocol'
                      name='protocol'
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                    >
                      <option value='http' className='text-primary'>http://</option>
                      <option value='https' className='text-primary'>https://</option>
                    </select>
                  </div>
                }
              />
              <Input
                {...methods.register('console.token')}
                label='Token'
                description='用于验证连接的安全令牌，本地模式下可留空'
                placeholder='请输入 Token'
                required={!isLocal}
                isRequired={!isLocal}
                className='p-2 rounded-lg bg-gray-50/50'
                color='primary'
              />
            </div>
          </div>
          <div className='text-lg font-medium flex items-center gap-2'>
            <Bot className='w-5 h-5' />
            OneBot 适配器
          </div>
          <Divider className='w-full' />
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Tooltip
                content={
                  <div className='space-y-2 p-2'>
                    <p>用于接收来自OneBot11协议的 WebSocket 连接</p>
                    <p className='text-xs text-gray-300'>1.打开此项开关</p>
                    <p className='text-xs text-gray-300'>2.将会启用一个挂载在HTTP端口上的WebSocket服务器</p>
                    <p className='text-xs text-gray-300'>3.通过组合HTTP端口，可以创建一个反向链接</p>
                    <p className='text-xs text-gray-300'>4. 如HTTP端口为7777，则反向链接为 <code className='text-xs text-gray-300 text-blue-500'>ws://127.0.0.1:7777</code></p>
                    <br />
                    <p>理解这里最简单的方法就是:</p>
                    <p className='text-xs text-gray-300'>
                      karin开启了一个WebSocket服务器，并监听7777端口
                      然后karin等着协议端来疯狂连接，俗称诶c...
                    </p>
                  </div>
                }
                placement='right'
                showArrow
                classNames={{
                  content: 'p-0'
                }}
              >
                <Switch
                  className='p-2 rounded-lg bg-gray-50/50'
                  {...methods.register('onebot.ws_server.enable')}
                  defaultChecked={data.onebot.ws_server.enable}
                  color='success'
                >
                  <div className='flex flex-col'>
                    <span className='text-xs'>反向 WebSocket 服务器</span>
                    <span className='text-xs text-gray-500'>鼠标悬停可以查看详情(〃'▽'〃)</span>
                  </div>
                </Switch>
              </Tooltip>
            </div>
            <div className='flex'>
              {/* @ts-ignore */}
              <NumberInput
                label='请求回调等待时间'
                className='p-2 rounded-lg w-full'
                {...methods.register('onebot.ws_server.timeout')}
                defaultValue={data.onebot.ws_server.timeout}
                placeholder='请输入请求回调等待时间'
                isRequired
                color='primary'
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
              description='管理OneBot11协议的WebSocket客户端 也就是正向WebSocket'
              title='WebSocket 客户端'
              render={(index: number) => (
                <div className='flex flex-col gap-4 p-2'>
                  <Switch
                    className='p-2 rounded-lg bg-gray-50/50 mb-3'
                    {...methods.register(`onebot.ws_client.${index}.enable`)}
                    color='success'
                  >
                    <span className='text-xs'>启用</span>
                  </Switch>
                  <Input
                    label='WebSocketServer 地址'
                    description='WebSocket的地址 也就是协议端的WebSocket服务端api地址 例如: ws://127.0.0.1:6099'
                    {...methods.register(`onebot.ws_client.${index}.url`)}
                    placeholder='WebSocket的地址'
                    className='p-2 rounded-lg w-full'
                    color='primary'
                  />
                  <Input
                    label='Token'
                    description='用于验证连接的Token 如果协议端没有设置无需填写'
                    {...methods.register(`onebot.ws_client.${index}.token`)}
                    placeholder='请输入 Token'
                    className='p-2 rounded-lg w-full'
                    color='primary'
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
              description='管理OneBot11协议的HTTP POST服务端'
              title='HTTP 服务端'
              render={(index: number) => (
                <div className='flex flex-col gap-4 p-2'>
                  <Switch
                    className='p-2 rounded-lg bg-gray-50/50 mb-3'
                    {...methods.register(`onebot.http_server.${index}.enable`)}
                    color='success'
                  >
                    <span className='text-xs'>启用</span>
                  </Switch>
                  <Input
                    label='Bot的QQ号'
                    description='Bot的QQ号'
                    {...methods.register(`onebot.http_server.${index}.self_id`)}
                    placeholder='Bot的QQ号'
                    className='p-2 rounded-lg w-full'
                    color='primary'
                  />
                  <Input
                    label='发送Api请求的URL地址'
                    {...methods.register(`onebot.http_server.${index}.url`)}
                    description='上报事件的URL地址 也就是协议端的http地址 例如napcat的: http://127.0.0.1:6099'
                    placeholder='发送Api请求的URL地址'
                    className='p-2 rounded-lg w-full'
                    color='primary'
                  />
                  <Input
                    label='Token'
                    description='用于发送Api请求的鉴权Token 如果协议端没有设置无需填写'
                    {...methods.register(`onebot.http_server.${index}.token`)}
                    placeholder='请输入 Token'
                    className='p-2 rounded-lg w-full'
                    color='primary'
                  />
                </div>
              )}
            />
          </div>
        </div>
      </Form>
    </FormProvider>
  )
}
