import React from 'react'
import { Form } from '@heroui/form'
import { Card } from '@heroui/card'
import { Button } from '@heroui/button'
import { Avatar } from '@heroui/avatar'
import { toast } from 'react-hot-toast'
import { MdWarning } from 'react-icons/md'
import { createDivider } from '@/components/heroui/dividers'
import { createSwitch } from '@/components/heroui/switchs'
import { createRadioGroup } from '@/components/heroui/radioGroups'
import { createCheckboxGroup } from '@/components/heroui/checkboxs'
import { ConfigDetailModal, BUTTON_COMMON_STYLES } from './printConfig'
import { createInput, createInputGroup } from '@/components/heroui/inputs'
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion'

import type { JSX } from 'react'
import type {
  AccordionProProps,
  AccordionProps,
  CheckboxGroupProps,
  ComponentConfig,
  GetConfigResponse
} from 'node-karin'
import { request } from '@/lib/request'

type CreateResultFnc = (key: string, value: (v: string, k: string) => void) => void

/**
 * 动态渲染插件配置组件
 * @param props - 组件属性
 */
export const DashboardPage: React.FC<GetConfigResponse> = ({ options: configProps, info }) => {
  let result: Record<string, any> = {}
  let newErrors: Record<string, string> = {}
  /** 用于存储渲染错误信息 */
  const errorMessages: { key: string, error: Error }[] = []
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
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData)
    console.log('formValues:', formValues)

    const processedResult = handleFormResult(formValues)
    if (processedResult === null) return

    setErrors({})

    try {
      const response = await request.serverPost<Record<string, any>, Record<string, any>>(
        '/api/v1/plugin/config/save',
        {
          name: info.id,
          type: info.type,
          config: processedResult
        }
      )

      if (response.success) {
        toast.success(response.message || '保存成功')
      } else {
        toast.error(response.message || '保存失败')
        console.error('保存配置失败:', response)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      toast.error(`保存配置失败: ${errorMessage}`)
      console.error('保存配置出错:', error)
    }

    return processedResult
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
        <div className={className || 'flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'} key={key}>
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
                  className={componentClassName || 'mx-2'}
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
          <div className='h-2' />
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
        <div className={className || 'flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'} key={`div-${key}`}>
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
                if (typeof item[v.key] === 'undefined') return
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
                  return
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
      try {
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
          const k = subKey ? `${subKey}${val.key}` : val.key
          createResultFnc(k, (value: string) => {
            console.log('value:', value)
            result[k] = value === 'true'
          })
          return list.push(createSwitch({ ...val, key: k }))
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
      } catch (error) {
        console.error(`[${val.componentType}] 渲染失败`)
        console.error(error)
        errorMessages.push({ key: val.key, error: error as Error })
      }
    })

    return list
  }

  return (
    <div className='flex flex-col w-full h-screen'>
      <Card
        shadow='sm'
        className='border-b mb-1 rounded-lg border-gray-300'
      >
        <div className='p-4 flex flex-col gap-2'>
          {/* 头部信息区域 */}
          <div className='flex items-center'>
            <Avatar src={info?.author?.[0]?.avatar || `https://avatar.vercel.sh/${info?.name || 'ikenxuan'}`} size='sm' radius='full' />
            <div className='flex flex-col ml-3'>
              <div className='text-sm font-medium text-default-900'>
                {`${info.name || '插件名称'}(${info.id})`}
              </div>
              <div className='text-xs text-default-500'>{info.description || '这个人很懒，什么都没写...'}</div>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className='flex gap-2 justify-center sm:justify-end border-t border-gray-100 pt-3 mt-2'>
            <ConfigDetailModal
              showJsonModal={showJsonModal}
              setShowJsonModal={setShowJsonModal}
              handleFormResult={handleFormResult}
            />
            <Button
              type='submit'
              color='primary'
              variant='flat'
              size='sm'
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
          className='flex flex-col w-full'
          validationErrors={errors}
          onSubmit={onSubmit}
        >
          <div className='mb-4 px-4 sm:px-6 py-4 w-full'>
            {renderConfig(configProps, createResultFnc)}
          </div>
          {errorMessages.length > 0 && (
            <Card
              shadow='lg'
              className='flex flex-col gap-6 mx-12 my-2 bg-red-100 border border-red-300 rounded-lg p-4 max-w-8xl'
            >
              <div className='text-red-600 font-bold text-xl flex items-center gap-2'>
                <MdWarning className='w-6 h-6' />
                错误信息
              </div>
              {errorMessages.map((msg, index) => (
                <div key={index} className='flex flex-col mb-4'>
                  <div className='text-red-500 text-lg'>组件渲染错误: {msg.key}</div>
                  <pre className='text-sm text-gray-700 bg-gray-200 p-3 rounded-md overflow-x-auto'>{msg.error.stack}</pre>
                </div>
              ))}
            </Card>
          )}
        </Form>
      </Card>
    </div>
  )
}
