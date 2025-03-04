import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { RadioGroup, Radio } from '@heroui/radio'
import { Input } from '@heroui/input'
import { useEffect, memo, useState, type Key, FC } from 'react'
import { Card } from '@heroui/card'
import { Tabs, Tab } from '@heroui/tabs'
import { useForm, Controller } from 'react-hook-form'

interface AddConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (config: string) => void
}

interface FormData {
  configType: 'group' | 'channel' | 'bot'
  configMode: string
  selfId: string
  groupId: string
  guildId: string
  channelId: string
}

/**
 * 配置模式
 */
const CONFIG_MODES = {
  group: [
    { value: 'single', label: '添加单个群配置' },
    { value: 'withBot', label: '添加指定Bot下的群配置' }
  ],
  channel: [
    { value: 'guildOnly', label: '配置单个频道' },
    { value: 'channelOnly', label: '配置单个子频道' },
    { value: 'botGuild', label: '配置指定Bot和单个频道' },
    { value: 'botGuildChannel', label: '配置指定Bot和单个频道、子频道' }
  ]
}

/**
 * 表单字段组件
 */
const FormField: FC<{
  name: string
  label: string
  control: any
  isRequired: boolean
  placeholder?: string
  errors: any
}> = ({ name, label, control, isRequired, placeholder, errors }) => (
  <Controller
    name={name}
    control={control}
    rules={{ required: isRequired ? `请输入${label}` : false }}
    render={({ field }) => (
      <Input
        label={label}
        value={field.value}
        isRequired={isRequired}
        color='primary'
        onValueChange={(value) => field.onChange(value)}
        placeholder={placeholder || `请输入${label}`}
        isInvalid={!!errors[name]}
        errorMessage={errors[name]?.message?.toString()}
      />
    )}
  />
)

/**
 * 配置对话框
 */
export const AddConfigDialog = memo(({ isOpen, onClose, onConfirm }: AddConfigDialogProps) => {
  const { control, watch, reset, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      configType: 'group',
      configMode: 'single',
      selfId: '',
      groupId: '',
      guildId: '',
      channelId: ''
    },
    mode: 'onSubmit'
  })

  const [currentTab, setCurrentTab] = useState<'group' | 'channel' | 'bot'>('group')
  const configMode = watch('configMode')
  const configType = watch('configType')

  // 重置和初始化表单
  useEffect(() => {
    if (isOpen) {
      reset()
      setCurrentTab('group')
      setValue('configType', 'group')
      setValue('configMode', 'single')
    }
  }, [isOpen, reset, setValue])

  // 当tab改变时更新相关状态
  useEffect(() => {
    setValue('configType', currentTab);

    // 重置字段
    ['selfId', 'groupId', 'guildId', 'channelId'].forEach((field: any) => setValue(field, ''))

    // 设置默认的configMode
    setValue('configMode', currentTab === 'group' ? 'single' : currentTab === 'channel' ? 'guildOnly' : '')
  }, [currentTab, setValue])

  // 确定哪些字段是必填的
  const getRequiredFields = () => {
    const required = {
      selfId: false,
      groupId: false,
      guildId: false,
      channelId: false
    }

    if (configType === 'bot') {
      required.selfId = true
    } else if (configType === 'group') {
      required.groupId = true
      required.selfId = configMode === 'withBot'
    } else if (configType === 'channel') {
      required.selfId = ['botGuild', 'botGuildChannel'].includes(configMode)
      required.guildId = ['guildOnly', 'botGuild', 'botGuildChannel'].includes(configMode)
      required.channelId = ['channelOnly', 'botGuildChannel'].includes(configMode)
    }

    return required
  }

  const requiredFields = getRequiredFields()

  // 处理表单提交
  const onSubmit = (formValues: FormData) => {
    try {
      let config = ''

      // 简化配置生成逻辑
      if (formValues.configType === 'bot') {
        config = `Bot:${formValues.selfId}`
      } else if (formValues.configType === 'group') {
        config = formValues.configMode === 'single'
          ? formValues.groupId
          : `Bot:${formValues.selfId}:${formValues.groupId}`
      } else if (formValues.configType === 'channel') {
        const parts = []

        if (['botGuild', 'botGuildChannel'].includes(formValues.configMode)) {
          parts.push('Bot', formValues.selfId)
        }

        if (['guildOnly', 'botGuild', 'botGuildChannel'].includes(formValues.configMode)) {
          parts.push(formValues.guildId)
        } else if (formValues.configMode === 'channelOnly') {
          parts.push(formValues.channelId)
          config = formValues.channelId
          parts.length = 0
        }

        if (formValues.configMode === 'botGuildChannel') {
          parts.push(formValues.channelId)
        }

        if (parts.length > 0) {
          config = parts.join(':')
        }
      }

      console.log('提交配置:', config)
      onClose()
      setTimeout(() => onConfirm(config), 0)
    } catch (error) {
      console.error('处理提交出错:', error)
      onClose()
    }
  }

  // 渲染表单字段
  const renderFormFields = () => {
    const fields = []

    if ((configType === 'bot') ||
      (configType === 'group' && configMode === 'withBot') ||
      (configType === 'channel' && ['botGuild', 'botGuildChannel'].includes(configMode))) {
      fields.push(
        <FormField
          key='selfId'
          name='selfId'
          label='Bot ID'
          control={control}
          isRequired={requiredFields.selfId}
          errors={errors}
        />
      )
    }

    if (configType === 'group') {
      fields.push(
        <FormField
          key='groupId'
          name='groupId'
          label='群号'
          control={control}
          isRequired={requiredFields.groupId}
          errors={errors}
        />
      )
    }

    if (configType === 'channel' && ['guildOnly', 'botGuild', 'botGuildChannel'].includes(configMode)) {
      fields.push(
        <FormField
          key='guildId'
          name='guildId'
          label='频道ID'
          control={control}
          isRequired={requiredFields.guildId}
          errors={errors}
        />
      )
    }

    if (configType === 'channel' && ['channelOnly', 'botGuildChannel'].includes(configMode)) {
      fields.push(
        <FormField
          key='channelId'
          name='channelId'
          label='子频道ID'
          control={control}
          isRequired={requiredFields.channelId}
          errors={errors}
        />
      )
    }

    return fields
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable
      backdrop='blur'
      className='z-50'
      size='lg'
      key={`config-dialog-${isOpen}`}
    >
      <ModalContent className='max-w-md md:max-w-lg mx-auto'>
        <ModalHeader className='border-b'>
          <div className='text-lg font-medium'>添加配置</div>
        </ModalHeader>

        <ModalBody className='p-2 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Tabs
            selectedKey={currentTab}
            onSelectionChange={(key: Key) => setCurrentTab(key as 'group' | 'channel' | 'bot')}
            className='w-full flex-1 flex flex-col'
          >
            <Tab key='group' title='群聊配置'>
              <div className='mt-0 space-y-2'>
                <Card className='p-4 shadow-sm border rounded-lg'>
                  <h3 className='text-md font-medium mb-3'>配置方式</h3>
                  <Controller
                    name='configMode'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={value => field.onChange(value)}
                        className='grid grid-cols-1 sm:grid-cols-2 gap-2'
                      >
                        {CONFIG_MODES.group.map(mode => (
                          <Radio key={mode.value} value={mode.value} className='flex-1'>
                            {mode.label}
                          </Radio>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Card>

                <Card className='p-4 shadow-sm border rounded-lg'>
                  <h3 className='text-md font-medium mb-3'>配置信息</h3>
                  <div className='grid gap-4'>
                    {renderFormFields()}
                  </div>
                </Card>
              </div>
            </Tab>

            <Tab key='channel' title='频道配置'>
              <div className='mt-0 space-y-2'>
                <Card className='p-4 shadow-sm border rounded-lg'>
                  <h3 className='text-md font-medium mb-3'>配置方式</h3>
                  <Controller
                    name='configMode'
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={value => field.onChange(value)}
                        orientation='horizontal'
                        className='flex flex-wrap gap-2'
                      >
                        {CONFIG_MODES.channel.map(mode => (
                          <Radio key={mode.value} value={mode.value}>
                            {mode.label}
                          </Radio>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Card>

                <Card className='p-2 shadow-sm border rounded-lg'>
                  <h3 className='text-md font-medium mb-3'>配置信息</h3>
                  <div className='grid gap-4'>
                    {renderFormFields()}
                  </div>
                </Card>
              </div>
            </Tab>

            <Tab key='bot' title='Bot配置'>
              <div className='mt-0'>
                <Card className='p-2 shadow-sm border rounded-lg'>
                  <h3 className='text-md font-medium mb-3'>配置信息</h3>
                  {renderFormFields()}
                </Card>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter className='border-t'>
          <Button variant='light' onPress={onClose}>取消</Button>
          <Button
            variant='solid'
            onPress={() => handleSubmit(onSubmit)()}
            className='bg-primary text-white hover:bg-primary-600'
          >
            确认
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})

AddConfigDialog.displayName = 'AddConfigDialog'
