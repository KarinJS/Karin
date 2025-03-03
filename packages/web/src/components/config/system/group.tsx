import { Divider } from '@heroui/divider'
import { Form } from '@heroui/form'
import { Switch } from '@heroui/switch'
import { Terminal } from 'lucide-react'
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { createInputGroup } from './inputGroup'
import { Input } from '@heroui/input'
import { NumberInput } from '@heroui/number-input'
import { Select } from '@heroui/select'
import { Textarea } from '@heroui/textarea'
import { RadioGroup, Radio } from '@heroui/radio'
import { Button } from '@heroui/button'
import type { Groups } from 'node-karin'

/**
 * 获取基本配置组件
 * @param data 基本配置数据
 * @param formRef 表单引用，用于外部触发表单提交
 * @returns 基本配置组件
 */
export const getGroupComponent = (
  data: Groups,
  formRef: React.RefObject<HTMLFormElement | null>
) => {
  const methods = useForm({
    defaultValues: {
      values: data.map((item) => ({
        ...item,
        mode: item.mode + ''
      }))
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'values'
  })

  const onSubmit = (formData: any) => {
    const data = formData.values.map((item: any) => ({
      ...item,
      cd: Number(item.cd),
      userCD: Number(item.userCD),
      mode: Number(item.mode)
    }))
    console.log('表单提交:', data)
  }

  return (
    <FormProvider {...methods}>
      <Form
        className='w-full max-w-full flex flex-col'
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className='w-full max-w-full px-6 py-4 space-y-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm text-gray-500'>测试</div>
            <Button
              size='sm'
              variant='light'
              onPress={() => {
                append({
                  key: '新卡片',
                  cd: 0,
                  userCD: 0,
                  mode: '0',
                  alias: [],
                  enable: [],
                  disable: [],
                  member_enable: [],
                  member_disable: []
                })
              }}
              className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            >
              添加新卡片
            </Button>
          </div>
          <Accordion>
            {fields.map((val, index) => {
              return (
                <AccordionItem key={val.id} title={val.key}>
                  {/* @ts-ignore */}
                  <NumberInput
                    {...methods.register(`values.${index}.cd`)}
                    label='冷却时间'
                    placeholder='群聊、频道中所有消息冷却时间，单位秒，0则无限制'
                    min={0}
                    max={10000}
                  />
                  {/* @ts-ignore */}
                  <NumberInput
                    {...methods.register(`values.${index}.userCD`)}
                    label='用户冷却时间'
                    placeholder='群聊、频道中 每个人的消息冷却时间，单位秒，0则无限制'
                    min={0}
                    max={10000}
                  />

                  <Controller
                    name={`values.${index}.mode`}
                    control={methods.control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        label='机器人响应模式'
                      >
                        <Radio value={0 + ''}>所有</Radio>
                        <Radio value={1 + ''}>仅@机器人</Radio>
                        <Radio value={2 + ''}>仅回应管理员</Radio>
                        <Radio value={3 + ''}>仅回应别名</Radio>
                        <Radio value={4 + ''}>别名或@机器人</Radio>
                        <Radio value={5 + ''}>管理员无限制，成员别名或@机器人</Radio>
                        <Radio value={6 + ''}>仅回应主人</Radio>
                      </RadioGroup>
                    )}
                  />
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
                    '只有在白名单中的插件、功能才会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
                    methods.control
                  )}
                  {createInputGroup(
                    `values.${index}.disable`,
                    val.disable,
                    '黑名单插件、功能',
                    '黑名单中的插件、功能不会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
                    methods.control
                  )}
                  {createInputGroup(
                    `values.${index}.member_enable`,
                    val.member_enable,
                    '群、频道成员单独白名单',
                    '群、频道成员单独白名单',
                    methods.control
                  )}
                  {createInputGroup(
                    `values.${index}.member_disable`,
                    val.member_disable,
                    '群、频道成员单独黑名单',
                    '群、频道成员单独黑名单',
                    methods.control
                  )}
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </Form>
    </FormProvider>
  )
}
