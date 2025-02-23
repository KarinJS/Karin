import React from 'react'
import { Form } from '@heroui/form'
import { Card } from '@heroui/card'
import { Button } from '@heroui/button'
import { Avatar } from '@heroui/avatar'
import { toast } from 'react-hot-toast'
import { createCheckboxGroup } from '@/components/heroui/checkboxs'
import { ConfigDetailModal, BUTTON_COMMON_STYLES } from './printConfig'
import { createInput, createInputGroup } from '@/components/heroui/inputs'
import { createDivider } from '@/components/heroui/dividers'
import { createSwitch } from '@/components/heroui/switchs'
import { createRadioGroup } from '@/components/heroui/radioGroups'
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion'

import type { JSX } from 'react'
import type { AccordionProProps, AccordionProps, CheckboxGroupProps, ComponentConfig } from 'node-karin'

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
    componentType: 'divider',
    key: 'divider',
  },
  {
    componentType: 'switch',
    key: 'agree',
    defaultSelected: true,
    label: '用户协议',
    description: '是否同意用户协议',

  },
  {
    componentType: 'divider',
    key: 'divider-11',
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
    componentType: 'divider',
    key: 'divider-1',
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
    componentType: 'divider',
    key: 'divider-2',
  },
  {
    componentType: 'input-group',
    label: '爱好',
    key: 'hobby-group',
    data: ['篮球', '足球', '羽毛球', '排球', '网球'],
    description: '请输入您的爱好',
    template: {
      componentType: 'input',
      label: '爱好',
      key: '',
      placeholder: '请输入您的爱好',
      type: 'text'
    }
  },
  {
    componentType: 'divider',
    key: 'divider-3',
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
            defaultValue: '篮球'
          }
        ]
      }
    ]
  },
  {
    componentType: 'accordion-pro',
    label: '手风琴pro',
    key: 'accordion-pro',
    data: [
      {
        'accordion-pro-name': '张三',
        'accordion-pro-age': 18,
      },
      {
        'accordion-pro-name': '李四',
        'accordion-pro-age': 20,
      }
    ],
    children: {
      key: 'accordion-pro-item',
      children: [
        {
          componentType: 'input',
          label: '名称',
          key: 'accordion-pro-name',
        },
        {
          componentType: 'input',
          label: '年龄',
          key: 'accordion-pro-age',
        }
      ]
    }
  }
]

/**
 * 动态渲染插件配置页面
 * @returns 仪表盘页面
 */
export const DashboardPage = (configProps: ComponentConfig[]) => {
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
      toast.error(Object.entries(newErrors).map(([key, msg]) => `${key}: ${msg}`).join('\n'))
      return null
    }

    /**
     * 处理手风琴
     * tips: 讨厌手风琴...
     */
    Object.entries(result).forEach(([key, value]) => {
      if (key.includes('accordion:') || key.includes('accordion-pro:')) {
        delete result[key]
        const [_, index, sourceKey] = key.split(':')
        if (!result[sourceKey]) {
          result[sourceKey] = []
        }
        /** 不要用切割出来的，可能会有笨比传个:::这样的 */
        const subKey = key.replace(`${_}:${index}:${sourceKey}:`, '')
        if (!result[sourceKey][index]) {
          result[sourceKey][index] = {}
        }

        result[sourceKey][index][subKey] = value
      }
    })

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
   * @param options - 配置组件
   * @param createResultFnc - 创建结果函数
   * @param subKey - 子键
   * @param disableAccordionRecursion - 禁止递归渲染
   * @returns 配置组件
   */
  const renderConfig = (
    options: ComponentConfig[],
    createResultFnc: CreateResultFnc,
    subKey?: string,
    disableAccordionRecursion: boolean = false
  ) => {
    const list: JSX.Element[] = []

    /**
     * 构建手风琴
     * @param val - 手风琴配置
     * @returns 手风琴组件
     */
    const createAccordion = (val: AccordionProps) => {
      if (disableAccordionRecursion) {
        console.error('[accordion] 不允许递归渲染')
        return null
      }

      const {
        componentType: _,
        key,
        className,
        componentClassName,
        label,
        children = [],
        ...options
      } = val
      return list.push(
        <div className={className || 'flex flex-col gap-4 w-full mx-2'} key={key}>
          <div className='flex justify-between items-center'>
            <span className='text-default-500 text-md mt-2'>{label || '手风琴'}</span>
          </div>
          <HeroAccordion
            key={key}
            className={componentClassName || 'border border-default-200 rounded-lg p-1'}
            {...options}
            keepContentMounted
          >
            {children.map(({
              componentType: _,
              key,
              className,
              componentClassName,
              title,
              subtitle,
              children: childrenConfig,
              ...itemOptions
            }, index) => {
              if (_ !== 'accordion-item') return null

              return (
                <HeroAccordionItem
                  {...itemOptions}
                  key={key}
                  title={title || '手风琴默认标题'}
                  subtitle={subtitle || '手风琴默认副标题'}
                  className={componentClassName}
                  textValue={`textValue-${key}-${index}`}
                >
                  {renderConfig(
                    childrenConfig as ComponentConfig[],
                    createResultFnc,
                    `accordion:${index}:${key}:`,
                    true
                  )}
                </HeroAccordionItem>
              )
            }).filter(Boolean)}
          </HeroAccordion>
        </div>
      )
    }

    /**
     * 构建手风琴pro
     * @param val - 手风琴pro配置
     * @returns 手风琴pro组件
     */
    const createAccordionPro = (val: AccordionProProps) => {
      if (disableAccordionRecursion) {
        console.error('[accordion] 不允许递归渲染')
        return null
      }

      const {
        componentType: _,
        key,
        className,
        componentClassName,
        label,
        children,
        data,
        ...options
      } = val

      // 根据data来填充模板 形成对应的子组件children
      const {
        children: childrenConfig,
        title,
        subtitle,
        className: childrenClassName,
        componentClassName: childrenComponentClassName,
        ...childrenOptions
      } = children

      return list.push(
        <div className={className || 'flex flex-col gap-4 w-full mx-2'} key={`div-${key}`}>
          <div className='flex justify-between items-center'>
            <span className='text-default-500 text-md mt-2'>{label}</span>
          </div>
          <HeroAccordion
            key={`accordion-pro-${key}`}
            {...options}
            className={componentClassName || 'border border-default-200 rounded-lg p-1'}
            keepContentMounted
          >
            {data.map((item, index) => {
              const props: ComponentConfig[] = []
              childrenConfig.forEach(v => {
                if (!item[v.key]) return
                if (
                  v.componentType === 'input' ||
                  v.componentType === 'checkbox-group' ||
                  v.componentType === 'radio-group'
                ) {
                  props.push({
                    ...v,
                    defaultValue: item[v.key]
                  })
                  return
                }

                if (v.componentType === 'switch') {
                  props.push({
                    ...v,
                    defaultSelected: item[v.key]
                  })
                }

                if (v.componentType === 'input-group') {
                  props.push({
                    ...v,
                    data: item[v.key]
                  })
                  return
                }

                console.error(`[accordion-pro] 不支持的组件类型: ${v.componentType}`)
              })

              return (
                <HeroAccordionItem
                  {...childrenOptions}
                  className={childrenClassName || 'mx-2'}
                  key={`accordion-pro-item-${item.key}-${index}`}
                  textValue={`textValue-${item.key}-${index}`}
                  title={item.title || title || '手风琴默认标题'}
                  subtitle={item.subtitle || subtitle || '手风琴默认副标题'}
                >
                  {renderConfig(
                    props,
                    createResultFnc,
                    `accordion-pro:${index}:${key}:`,
                    true
                  )}
                </HeroAccordionItem>
              )
            }).filter(Boolean)}
          </HeroAccordion>
        </div>
      )
    }

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
        return createAccordion(val)
      }

      /** 手风琴pro */
      if (val.componentType === 'accordion-pro') {
        return createAccordionPro(val)
      }

      console.error(`[${val.componentType}] 不支持的组件类型`)
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
            <ConfigDetailModal
              showJsonModal={showJsonModal}
              setShowJsonModal={setShowJsonModal}
              handleFormResult={handleFormResult}
            />
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
