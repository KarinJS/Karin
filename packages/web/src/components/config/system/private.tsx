import { useState } from 'react'
import { Form } from '@heroui/form'
import toast from 'react-hot-toast'
import { Button } from '@heroui/button'
import { createInputGroup } from './inputGroup'
import { NumberInput } from '@heroui/number-input'
import { RadioGroup, Radio } from '@heroui/radio'
import { AddPrivateConfigDialog } from './addPrivateConfig'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form'
import { saveConfig } from './save'
import { cn } from '@/lib/utils'

import type { Privates } from 'node-karin'
import type { RadioProps } from '@heroui/radio'

/**
 * 获取基本配置组件
 * @param data 基本配置数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 基本配置组件
 */
const getPrivateComponent = (
  data: Privates,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm({
    defaultValues: {
      values: Object.entries(data).map(([key, value]) => ({
        ...value,
        mode: value.mode + '',
        key
      }))
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'values'
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddConfig = (config: string) => {
    // 检查是否已存在相同配置
    const exists = fields.some(field => field.key === config)
    if (exists) {
      toast.error('该配置已存在')
      return
    }

    // 添加新配置
    append({
      key: config,
      cd: 0,
      mode: '0',
      alias: [],
      enable: [],
      disable: [],
    })

    toast.success(`已添加配置: ${config}`)
    setIsDialogOpen(false)
  }

  const onSubmit = (formData: any) => {
    const data = formData.values.map((item: any) => ({
      ...item,
      cd: Number(item.cd) ?? 0,
      userCD: Number(item.userCD) ?? 0,
      mode: Number(item.mode) ?? 0
    }))

    saveConfig('privates', data)
  }

  // 添加自定义 Radio 组件
  const CustomRadio = (props: RadioProps) => {
    const { children, description, ...otherProps } = props

    return (
      <Radio
        {...otherProps}
        color='success'
        classNames={{
          base: cn(
            'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
            'flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
            'data-[selected=true]:border-success',
            'border border-gray-200'
          ),
        }}
      >
        <div className='flex flex-col gap-1'>
          <span>{children}</span>
          <span className='text-sm text-gray-500'>{description}</span>
        </div>
      </Radio>
    )
  }

  return (
    <FormProvider {...methods}>
      <Form
        // className='w-full max-w-full flex flex-col'
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className='w-full max-w-full px-6 py-4 space-y-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm text-gray-500'>
              {fields.length > 0 ? `共 ${fields.length} 个配置` : '暂无配置'}
            </div>
            <Button
              size='sm'
              variant='solid'
              onPress={() => setIsDialogOpen(true)}
              className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            >
              添加新配置
            </Button>
          </div>
          <Accordion className='space-y-2 border rounded-lg p-4'>
            {fields.map((val, index) => {
              return (
                <AccordionItem
                  key={val.id}
                  className='mb-2'
                  textValue={`${val.key}-${index}`}
                  title={
                    <div className='flex justify-between items-center w-full pr-4'>
                      <span>{val.key}</span>
                      <div
                        role='button'
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(index)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            remove(index)
                          }
                        }}
                        className='px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer'
                      >
                        删除
                      </div>
                    </div>
                  }
                >
                  <div className='pt-2'>
                    {/* 冷却时间卡片 */}
                    <div className='border rounded-lg p-4 space-y-2'>
                      {/* 标题 */}
                      <span className='text-md'>冷却时间</span>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* @ts-ignore */}
                        <NumberInput
                          {...methods.register(`values.${index}.cd`)}
                          color='primary'
                          label='全局冷却时间'
                          placeholder='全部好友事件的冷却时间，单位秒，0则无限制'
                          description='全部好友事件的冷却时间，单位秒，0则无限制'
                          min={0}
                          max={10000}
                          isRequired
                        />
                      </div>
                    </div>

                    {/* 添加间距 */}
                    <div className='h-2' />

                    {/* 响应模式卡片 */}
                    <div className='border rounded-lg p-4'>
                      <Controller
                        name={`values.${index}.mode`}
                        control={methods.control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            color='success'
                            label='机器人响应模式'
                            description='设置在当前配置下机器人的响应模式'
                            classNames={{
                              wrapper: 'grid grid-cols-1 md:grid-cols-2 gap-4'
                            }}
                          >
                            <CustomRadio
                              value='0'
                              description='机器人会响应所有消息'
                            >
                              默认
                            </CustomRadio>
                            <CustomRadio
                              value='3'
                              description='只响应使用别名的消息'
                            >
                              仅回应别名
                            </CustomRadio>
                            <CustomRadio
                              value='6'
                              description='仅回应主人的消息'
                            >
                              仅回应主人
                            </CustomRadio>
                            <CustomRadio
                              value='2'
                              description='只响应管理员的消息'
                            >
                              仅回应管理员
                            </CustomRadio>
                            <CustomRadio
                              value='5'
                              description='主人管理员无限制，反之需别名'
                            >
                              管理无限制
                            </CustomRadio>
                          </RadioGroup>
                        )}
                      />
                    </div>

                    {/* 输入组之间的间距调整为2 */}
                    <div className='space-y-2'>
                      {createInputGroup(
                        `values.${index}.alias`,
                        val.alias,
                        '机器人别名',
                        '设置后别名+指令触发机器人',
                        methods.control
                      )}
                      {createInputGroup(
                        `values.${index}.enable`,
                        val.enable,
                        '白名单插件、功能',
                        '只有在白名单中的插件、功能才会响应 例如: `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
                        methods.control
                      )}
                      {createInputGroup(
                        `values.${index}.disable`,
                        val.disable,
                        '黑名单插件、功能',
                        '黑名单中的插件、功能不会响应 例如: `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
                        methods.control
                      )}
                    </div>
                  </div>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </Form>

      {/* 确保对话框在最外层渲染，避免被其他元素遮挡 */}
      <AddPrivateConfigDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleAddConfig}
      />
    </FormProvider>
  )
}

export default getPrivateComponent
