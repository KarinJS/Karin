import React, { type JSX } from 'react'
import { Form } from '@heroui/form'
import { Card } from '@heroui/card'
import { Button } from '@heroui/button'
import { Avatar } from '@heroui/avatar'
import { Input as HeroInput } from '@heroui/input'
import { ConfigDetailModal, BUTTON_COMMON_STYLES } from './printConfig'
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion'
import { createInput, createInputGroup } from '@/components/heroui/inputs'
import { createDivider } from '@/components/heroui/dividers'
import { createSwitch } from '@/components/heroui/switchs'
import { createRadioGroup } from '@/components/heroui/radioGroups'

import type { CheckboxGroupProps, ComponentConfig } from 'node-karin'
import { createCheckboxGroup } from '@/components/heroui/checkboxs'

type CreateResultFnc = (key: string, value: (v: string, k: string) => void) => void

const input: ComponentConfig[] = [
  {
    componentType: 'input',
    label: '姓名',
    key: 'name',
    placeholder: '请输入您的姓名',
    type: 'text',
    isRequired: true,
    autoComplete: 'name',
    defaultValue: '张三'
  },
  {
    componentType: 'input',
    label: '密码',
    key: 'password',
    placeholder: '请输入您的密码',
    type: 'password',
    isRequired: true,
    autoComplete: 'current-password',
    defaultValue: '123456'
  },
  {
    componentType: 'input',
    label: '邮箱',
    key: 'email',
    placeholder: '请输入您的邮箱',
    type: 'email',
    defaultValue: 'admin@karin.fun',
    isRequired: true,
  },
  {
    componentType: 'radio-group',
    label: '性别',
    key: 'gender',
    defaultValue: 'male',
    radio: [
      {
        label: '男',
        value: 'male',
        componentType: 'radio',
        key: 'male'
      },
      {
        label: '女',
        value: 'female',
        componentType: 'radio',
        key: 'female'
      }
    ]
  },
  {
    componentType: 'checkbox-group',
    label: '爱好',
    key: 'hobby',
    checkbox: [
      {
        componentType: 'checkbox',
        label: '篮球',
        value: 'basketball',
        key: 'basketball'
      },
      {
        componentType: 'checkbox',
        label: '足球',
        value: 'football',
        key: 'football'
      },
      {
        componentType: 'checkbox',
        label: '羽毛球',
        value: 'badminton',
        key: 'badminton'
      }
    ]
  },
  {
    componentType: 'input-group',
    label: '爱好',
    key: 'hobby-group',
    data: ['篮球', '足球', '羽毛球'],
    template: {
      componentType: 'input',
      label: '爱好',
      key: '',
      placeholder: '请输入您的爱好',
      type: 'text'
    }
  },
  {
    componentType: 'accordion',
    label: '爱好',
    key: 'hobby-accordion',
    children: [
      {
        componentType: 'accordion-item',
        key: 'hobby-accordion-item',
        children: [
          {
            componentType: 'input',
            label: '爱好',
            key: 'accordion-input',
            isRequired: true,
          }
        ]
      }
    ]
  }
]

/**
 * 动态渲染插件配置页面
 * @returns 仪表盘页面
 */
export const DashboardPage = () => {
  let result: Record<string, any> = {}
  let newErrors: Record<string, string> = {}
  const list: Record<string, (v: string, k: string) => void> = {}
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showJsonModal, setShowJsonModal] = React.useState(false)

  const createResultFnc = (key: string, value: (v: string, k: string) => void) => {
    list[key] = value
  }

  /**
   * 构建表单返回值
   * @param result - 表单返回值
   * @param newErrors - 表单错误
   * @param formValues - 表单值
   * @returns 表单返回值
   */
  const handleFormResult = (formValues: Record<string, FormDataEntryValue>) => {
    result = {}
    newErrors = {}

    Object.entries(formValues).forEach(([key, value]) => {
      const fnc = list[key]
      if (!fnc) {
        newErrors[key] = `无法获取 ${key} 的对应的校验函数`
        setErrors(newErrors)
        return
      }

      fnc(value as string, key)
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return null
    }

    return result
  }

  /**
   * 处理表单提交
   * @param e - 表单提交事件
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData)

    if (handleFormResult(formValues) === null) return

    setErrors({})
    console.log('result:', result)
    return result
  }

  /**
   * 渲染配置组件
   */
  const renderConfig = (
    options: ComponentConfig[],
    createResultFnc: CreateResultFnc,
    subKey?: string
  ) => {
    const list: JSX.Element[] = []

    options.forEach(val => {
      /** 分割线 */
      if (val.componentType === 'divider') {
        return list.push(createDivider(val))
      }

      /** 输入框 */
      if (val.componentType === 'input') {
        const k = subKey ? `${subKey}${val.key}` : val.key
        createResultFnc(k, (value: string) => {
          result[k] = value
        })
        return list.push(createInput({ ...val, key: k }))
      }

      /** 开关 */
      if (val.componentType === 'switch') {
        createResultFnc(val.key, (value: string) => {
          result[val.key] = value
        })
        return list.push(createSwitch(val))
      }

      /** 单选框组 */
      if (val.componentType === 'radio-group') {
        const k = subKey ? `${subKey}${val.key}` : val.key
        createResultFnc(k, (value: string) => {
          result[k] = value
        })
        return list.push(createRadioGroup({ ...val, key: k }))
      }

      /** 复选框组 */
      if (val.componentType === 'checkbox-group') {
        const option: CheckboxGroupProps = val
        val.checkbox.forEach((v, index) => {
          const k = subKey ? `${subKey}${val.key}` : v.key
          createResultFnc(k, (value: string, sourceKey: string) => {
            if (!result[val.key]) {
              result[val.key] = {}
              val.checkbox.forEach(v => {
                result[val.key][k] = v.defaultSelected ?? false
              })
            }
            result[val.key][sourceKey] = !!value
          })
          option.checkbox[index] = { ...v, key: k }
        })
        return list.push(createCheckboxGroup(option))
      }

      /** 输入框组 */
      if (val.componentType === 'input-group') {
        const k = subKey ? `${subKey}${val.key}` : val.key
        createResultFnc(k, (value: string) => {
          if (!result[k]) result[k] = []
          result[k] = JSON.parse(value)
        })
        return list.push(createInputGroup({ ...val, key: k }))
      }

      /** 手风琴 */
      if (val.componentType === 'accordion') {
        const { componentType: _, key, className, componentClassName, label, children = [], ...options } = val

        return list.push(
          <div className={className || 'flex flex-col gap-4 w-full'} key={key}>
            <div className='flex justify-between items-center'>
              <span className='text-default-500 text-md'>{label}</span>
            </div>
            <HeroAccordion
              key={key}
              className='border border-default-200 rounded-lg p-1'
              {...options}
              keepContentMounted
            >
              {children.map((item, index) => {
                if (item.componentType !== 'accordion-item') {
                  return null
                }

                return (
                  <HeroAccordionItem {...item} key={item.key}>
                    {renderConfig(item.children as ComponentConfig[], createResultFnc, `accordion:${index}:`)}
                  </HeroAccordionItem>
                )
              })}
            </HeroAccordion>
          </div>
        )
      }
    })

    return list
  }

  return (
    <div className='flex flex-col w-full h-screen'>
      <Card
        shadow='sm'
        className='border-b p-4 mb-0.5 rounded-lg border-gray-300'
      >
        <div className='flex justify-between items-start'>
          <div className='flex justify-center items-center whitespace-nowrap'>
            <Avatar src='https://avatar.vercel.sh/ikenxuan' size='md' radius='full' />
            <div className='flex flex-col ml-4'>
              <div className='text-base flex items-center'>
                插件名称
              </div>
              <div className='text-sm text-gray-600'>基本信息展示</div>
            </div>
          </div>
          <div className='flex gap-2'>
            {/* <ConfigDetailModal
              showJsonModal={showJsonModal}
              setShowJsonModal={setShowJsonModal}
              handleFormResult={handleFormResult}
            /> */}
            <Button
              type='submit'
              color='primary'
              variant='flat'
              size='md'
              className={`${BUTTON_COMMON_STYLES} bg-blue-50 hover:bg-blue-100 text-blue-600`}
              onPress={() => {
                const form = document.getElementById('dashboard-form')
                if (form instanceof HTMLFormElement) return form.requestSubmit()
                console.error('表单元素不存在')
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Card>
      <Card
        shadow='sm'
        className='flex-1 rounded-lg shadow-md mb-2 border border-gray-200 overflow-auto'
      >
        <Form
          id='dashboard-form'
          className='flex gap-4'
          validationErrors={errors}
          onSubmit={onSubmit}
        >
          <div className='mb-4 px-6 py-4 w-full min-w-[500px]'>
            {renderConfig(input, createResultFnc)}
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default DashboardPage
