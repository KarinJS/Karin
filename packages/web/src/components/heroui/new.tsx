import React, { JSX } from 'react'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Checkbox, CheckboxGroup } from '@heroui/checkbox'
import { Accordion, AccordionItem } from '@heroui/accordion'

import type { InputProps } from 'node-karin'

type InputType = 'text' | 'search' | 'url' | 'tel' | 'email' | 'password' | 'number' | (string & {})

interface FormData {
  name: string
  password: string
  email: string
  [key: string]: string
}

interface CheckboxConfig {
  label: string
  name: string
  placeholder: string
  value: string
}

const input: InputProps[] = [
  {
    componentType: 'input',
    label: '姓名',
    key: 'name',
    placeholder: '请输入您的姓名',
    type: 'text',
    isRequired: true
  },
  {
    componentType: 'input',
    label: '密码',
    key: 'password',
    placeholder: '请输入您的密码',
    type: 'password',
    isRequired: true
  },
  {
    componentType: 'input',
    label: '邮箱',
    key: 'email',
    placeholder: '请输入您的邮箱',
    type: 'email',
    isRequired: true
  }
]

const checkbox: CheckboxConfig[] = [
  {
    label: '选项1',
    name: 'option1',
    value: 'option1',
    placeholder: '请选择您的选项',
  },
  {
    label: '选项2',
    name: 'option2',
    value: 'option2',
    placeholder: '请选择您的选项',
  },
  {
    label: '选项3',
    name: 'option3',
    value: 'option3',
    placeholder: '请选择您的选项',
  },
  {
    label: '选项4',
    name: 'option4',
    value: 'option4',
    placeholder: '请选择您的选项',
  }
]

let result: Record<string, any> = {}
const list: Record<string, (value: string) => void> = {}

const createResultFnc = (
  key: string,
  value: (value: string) => void
) => {
  list[key] = value
}

/**
 * 创建输入组件
 * @param label - 标签
 * @param name - 名称
 * @param placeholder - 占位符
 * @returns 输入组件
 */
const createInput = (options: InputProps): JSX.Element => {
  const { componentType: _, key, ...option } = options
  return (
    <Input
      {...option}
      key={key}
      name={key}
    />
  )
}

/**
 * 创建多选框子项组件
 * @param name - 名称
 * @param placeholder - 占位符
 * @returns 多选框子项组件
 */
const createCheckbox = ({
  value,
  name,
  placeholder,
  label
}: CheckboxConfig
): JSX.Element => {
  return (
    <Checkbox
      value={value}
      name={name}
      placeholder={placeholder}
    >
      {label}
    </Checkbox>
  )
}

/**
 * 表单应用组件
 * @returns 渲染的表单组件
 */
export default function App (): React.ReactElement {
  const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  /**
   * 处理表单提交
   * @param e - 表单提交事件
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    result = {}
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData)
    console.log('formValues:', formValues)

    // 自定义验证检查
    const newErrors: Record<string, string> = {}

    // 用户名验证
    if (formValues.name === 'admin') {
      newErrors.name = '请选择其他用户名！'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    Object.entries(formValues).forEach(([key, value]) => {
      const fnc = list[key]
      if (!fnc) {
        newErrors[key] = `无法获取 ${key} 的对应的校验函数`
        setErrors(newErrors)
        return
      }

      fnc(value as string)
    })

    setErrors({})
    setSubmitted(result)
  }

  return (
    <Form
      className='w-full justify-center items-center space-y-4'
      validationErrors={errors}
      onReset={() => setSubmitted(null)}
      onSubmit={onSubmit}
    >
      <div className='flex flex-col gap-4 max-w-md'>
        {input.map(item => {
          createResultFnc(item.key, (value: string) => {
            result[item.key] = value
          })
          return createInput(item)
        })}

        {errors.terms && <span className='text-danger text-small'>{errors.terms}</span>}

        <div className='flex gap-4'>
          <Button className='w-full' color='primary' type='submit'>
            提交
          </Button>
          <Button type='reset' variant='bordered'>
            重置
          </Button>
        </div>
      </div>

      {submitted && (
        <div className='text-small text-default-500 mt-4'>
          提交的数据: <pre>{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </Form>
  )
}
