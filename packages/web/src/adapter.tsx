import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Tooltip } from '@heroui/tooltip'
import { } from '@heroui/accordion'
import { } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { } from '@heroui/checkbox'
import { Divider } from '@heroui/divider'
import { Form } from '@heroui/form'
import { Switch } from '@heroui/switch'
import { useState } from 'react'
import { Terminal, Bot } from 'lucide-react'
import { NumberInput } from '@heroui/number-input'
import { useForm, FormProvider } from 'react-hook-form'

const data = {
  console: {
    isLocal: true,
    token: '',
    host: ''
  },
  onebot: {
    ws_server: {
      enable: true,
      timeout: 120
    },
    ws_client: [
      {
        enable: false,
        url: 'ws://127.0.0.1:7778',
        token: ''
      }
    ],
    http_server: [
      {
        enable: false,
        self_id: 'default',
        url: 'http://127.0.0.1:6099',
        token: ''
      }
    ]
  }
}

export const getAdapterComponent = () => {
  const [protocol, setProtocol] = useState(data.console.host.split('://')[0] || 'http')

  const methods = useForm({
    defaultValues: {
      console: {
        isLocal: data.console.isLocal,
        token: data.console.token,
        host: data.console.host.replace(/(http|https):\/\//, '')
      },
      onebot: {
        ws_server: {
          enable: data.onebot.ws_server.enable,
          timeout: data.onebot.ws_server.timeout
        }
      }
    }
  })

  const isLocal = methods.watch('console.isLocal')

  const onSubmit = (formData: any) => {
    const finalData = {
      ...data,
      console: {
        ...formData.console,
        host: formData.console.host ? `${protocol}://${formData.console.host}` : ''
      },
      onebot: {
        ...data.onebot,
        ws_server: formData.onebot.ws_server
      }
    }
    console.log('Form Data:', finalData)
  }

  return (
    <FormProvider {...methods}>
      <Form
        className='p-2 space-y-2'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className='text-lg font-medium border-b pb-4 flex items-center gap-2'>
          <Terminal className='w-5 h-5' />
          Console 适配器
        </div>
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
        <div className='text-lg font-medium border-b pb-4 flex items-center gap-2'>
          <Bot className='w-5 h-5' />
          OneBot 适配器
        </div>
        <div className='space-y-2'>
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
        </div>

        <div className='flex justify-end pt-4'>
          <Button color='primary' type='submit'>
            保存配置
          </Button>
        </div>
      </Form>
    </FormProvider>
  )
}
