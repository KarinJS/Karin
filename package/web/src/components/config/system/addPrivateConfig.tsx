import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { RadioGroup, Radio } from '@heroui/radio'
import { Input } from '@heroui/input'
import { useEffect, memo, useState, type Key, FC } from 'react'
import { Card } from '@heroui/card'
import { Tabs, Tab } from '@heroui/tabs'
import { useForm, Controller } from 'react-hook-form'

interface AddPrivateConfigDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (config: string) => void
}

interface FormData {
  configType: 'friend' | 'direct'
  configMode: string
  selfId: string
  userId: string
}

/**
 * 配置模式
 */
const CONFIG_MODES = {
  friend: [
    { value: 'single', label: '添加单个好友配置' },
    { value: 'withBot', label: '添加指定Bot下的好友配置' }
  ],
  direct: [
    { value: 'single', label: '添加单个频道用户配置' },
    { value: 'withBot', label: '添加指定Bot下的频道用户配置' }
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
 * 私聊配置对话框
 */
export const AddPrivateConfigDialog = memo(({ isOpen, onClose, onConfirm }: AddPrivateConfigDialogProps) => {
  const { control, watch, reset, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      configType: 'friend',
      configMode: 'single',
      selfId: '',
      userId: ''
    },
    mode: 'onSubmit'
  })

  const [currentTab, setCurrentTab] = useState<'friend' | 'direct'>('friend')
  const configMode = watch('configMode')
  const configType = watch('configType')

  // 重置和初始化表单
  useEffect(() => {
    if (isOpen) {
      reset()
      setCurrentTab('friend')
      setValue('configType', 'friend')
      setValue('configMode', 'single')
    }
  }, [isOpen, reset, setValue])

  // 当tab改变时更新相关状态
  useEffect(() => {
    setValue('configType', currentTab)
    setValue('configMode', 'single')
    setValue('selfId', '')
    setValue('userId', '')
  }, [currentTab, setValue])

  // 确定哪些字段是必填的
  const getRequiredFields = () => {
    return {
      selfId: configMode === 'withBot',
      userId: true
    }
  }

  const requiredFields = getRequiredFields()

  // 处理表单提交
  const onSubmit = (formValues: FormData) => {
    try {
      let config = ''

      if (formValues.configMode === 'single') {
        config = formValues.userId
      } else if (formValues.configMode === 'withBot') {
        config = `Bot:${formValues.selfId}:${formValues.userId}`
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

    if (configMode === 'withBot') {
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

    fields.push(
      <FormField
        key='userId'
        name='userId'
        label={configType === 'friend' ? '好友ID' : '用户ID'}
        control={control}
        isRequired={requiredFields.userId}
        errors={errors}
      />
    )

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
      key={`private-config-dialog-${isOpen}`}
    >
      <ModalContent className='max-w-md md:max-w-lg mx-auto'>
        <ModalHeader className='border-b'>
          <div className='text-lg font-medium'>添加私聊配置</div>
        </ModalHeader>

        <ModalBody className='p-2 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Tabs
            selectedKey={currentTab}
            onSelectionChange={(key: Key) => setCurrentTab(key as 'friend' | 'direct')}
            className='w-full flex-1 flex flex-col'
          >
            <Tab key='friend' title='好友配置'>
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
                        {CONFIG_MODES.friend.map(mode => (
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

            <Tab key='direct' title='频道用户配置'>
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
                        {CONFIG_MODES.direct.map(mode => (
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

AddPrivateConfigDialog.displayName = 'AddPrivateConfigDialog'
