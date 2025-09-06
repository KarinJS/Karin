import { saveConfig } from './save'
import { Divider } from '@heroui/divider'
import { Form } from '@heroui/form'
import { Switch } from '@heroui/switch'
import { Terminal } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { createInputGroup } from './inputGroup'

import type { Config } from 'node-karin'

/**
 * 获取基本配置组件
 * @param data 基本配置数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 基本配置组件
 */
const getConfigComponent = (
  data: Config,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm({
    defaultValues: data,
  })

  const list = [
    {
      key: 'master',
      label: 'Bot主人列表',
      description: 'Bot主人列表 优先级最高 可以设置多个用户',
      data: data.master || [],
    },
    {
      key: 'admin',
      label: 'Bot管理员列表',
      description: 'Bot管理员列表 优先级次之 可以设置多个用户',
      data: data.admin || [],
    },
  ]

  const userList = [
    {
      key: 'user.enable_list',
      label: '用户白名单',
      description: '用户白名单 优先级最高 可以设置多个用户',
      data: data.user.enable_list || [],
    },
    {
      key: 'user.disable_list',
      label: '用户黑名单',
      description: '用户黑名单 优先级次之 可以设置多个用户',
      data: data.user.disable_list || [],
    },
  ]

  const friendList = [
    {
      key: 'friend.enable_list',
      label: '好友白名单',
      description: '好友白名单 如果用户处于黑名单内无效',
      data: data.friend.enable_list || [],
    },
    {
      key: 'friend.disable_list',
      label: '好友黑名单',
      description: '好友黑名单 如果用户处于白名单内无效',
      data: data.friend.disable_list || [],
    },
    {
      key: 'friend.log_enable_list',
      label: '好友日志白名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.friend.log_enable_list || [],
    },
    {
      key: 'friend.log_disable_list',
      label: '好友日志黑名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.friend.log_disable_list || [],
    },
  ]

  const groupList = [
    {
      key: 'group.enable_list',
      label: '群白名单',
      description: '群白名单 如果用户处于黑名单内无效',
      data: data.group.enable_list || [],
    },
    {
      key: 'group.disable_list',
      label: '群黑名单',
      description: '群黑名单 如果用户处于白名单内无效',
      data: data.group.disable_list || [],
    },
    {
      key: 'group.log_enable_list',
      label: '群日志白名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.group.log_enable_list || [],
    },
    {
      key: 'group.log_disable_list',
      label: '群日志黑名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.group.log_disable_list || [],
    },
  ]

  const directsList = [
    {
      key: 'directs.enable_list',
      label: '私信白名单',
      description: '私信白名单 如果用户处于黑名单内无效',
      data: data.directs.enable_list || [],
    },
    {
      key: 'directs.disable_list',
      label: '私信黑名单',
      description: '私信黑名单 如果用户处于白名单内无效',
      data: data.directs.disable_list || [],
    },
    {
      key: 'directs.log_enable_list',
      label: '私信日志白名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.directs.log_enable_list || [],
    },
    {
      key: 'directs.log_disable_list',
      label: '私信日志黑名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.directs.log_disable_list || [],
    },
  ]

  const guildsList = [
    {
      key: 'guilds.enable_list',
      label: '频道白名单',
      description: '频道白名单 如果用户处于黑名单内无效',
      data: data.guilds.enable_list || [],
    },
    {
      key: 'guilds.disable_list',
      label: '频道黑名单',
      description: '频道黑名单 如果用户处于白名单内无效',
      data: data.guilds.disable_list || [],
    },
    {
      key: 'guilds.log_enable_list',
      label: '频道日志白名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.guilds.log_enable_list || [],
    },
    {
      key: 'guilds.log_disable_list',
      label: '频道日志黑名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.guilds.log_disable_list || [],
    },
  ]

  const channelsList = [
    {
      key: 'channels.enable_list',
      label: '子频道白名单',
      description: '子频道白名单 如果用户处于黑名单内无效',
      data: data.channels.enable_list || [],
    },
    {
      key: 'channels.disable_list',
      label: '子频道黑名单',
      description: '子频道黑名单 如果用户处于白名单内无效',
      data: data.channels.disable_list || [],
    },
    {
      key: 'channels.log_enable_list',
      label: '子频道日志白名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.channels.log_enable_list || [],
    },
    {
      key: 'channels.log_disable_list',
      label: '子频道日志黑名单',
      description: '设置后 如果对应的用户触发事件 将不会记录打印日志',
      data: data.channels.log_disable_list || [],
    },
  ]

  const renderList = [
    {
      key: 'user',
      event: '用户黑白名单',
      title: '用户管理',
      description: '用户黑白名单相关配置选项 点击展开',
      isSwitch: false,
      data: userList,
    },
    {
      key: 'friend',
      event: '好友消息事件',
      title: '好友管理',
      description: '好友相关配置选项 点击展开',
      isSwitch: true,
      data: friendList,
    },
    {
      key: 'group',
      event: '群消息事件',
      title: '群管理',
      description: '群相关配置选项 点击展开',
      isSwitch: true,
      data: groupList,
    },
    {
      key: 'directs',
      event: '私信消息事件',
      title: '私信管理',
      description: '私信相关配置选项 点击展开',
      isSwitch: true,
      data: directsList,
    },
    {
      key: 'guilds',
      event: '频道消息事件',
      title: '频道管理',
      description: '频道相关配置选项 点击展开',
      isSwitch: true,
      data: guildsList,
    },
    {
      key: 'channels',
      event: '子频道消息事件',
      title: '子频道管理',
      description: '子频道相关配置选项 点击展开',
      isSwitch: true,
      data: channelsList,
    },
  ]

  const onSubmit = (formData: Config) => {
    saveConfig('config', formData)
  }

  return (
    <FormProvider {...methods}>
      <Form
        className='w-full max-w-full flex flex-col'
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className='w-full max-w-full px-6 py-4 space-y-4'>
          <div className='text-xl font-semibold flex items-center gap-2 mb-2'>
            <Terminal className='w-6 h-6 text-primary-500' />
            权限配置
          </div>
          <Divider className='w-full' />
          <div className='space-y-2'>
            {list.map((item) => (
              createInputGroup(
                item.key,
                item.data,
                item.label,
                item.description,
                methods.control
              )))}

            <Divider className='w-full' />

            <div className='text-xl font-semibold flex items-center gap-2 mb-2'>
              <Terminal className='w-6 h-6 text-primary-500' />
              用户及群组管理
            </div>

            <Accordion className='border rounded-lg'>
              {renderList.map(item => {
                return (
                  <AccordionItem
                    key={`accordion-${item.key}`}
                    title={item.title}
                    subtitle={item.description}
                    className='mx-2'
                  >

                    {item.isSwitch && (
                      <div className='inline-flex items-center gap-3 p-3 rounded-lg border border-default-200 mb-3'>
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-sm font-medium'>{item.event}</span>
                          <span className='text-xs text-gray-500'>是否启用{item.event}</span>
                        </div>
                        <Switch
                          {...methods.register(`${item.key}.enable` as any)}
                          color='success'
                        />
                      </div>
                    )}

                    {item.data.map(item => {
                      return createInputGroup(
                        item.key,
                        item.data,
                        item.label,
                        item.description,
                        methods.control
                      )
                    })}
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </div>
      </Form>
    </FormProvider>
  )
}

export default getConfigComponent
