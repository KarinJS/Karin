import React from 'react'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'

interface FormData {
  name: string
  password: string
  email: string
  [key: string]: string
}

interface FieldConfig {
  /** 标签 */
  label: string
  /** 名称 */
  name: string
  /** 占位符 */
  placeholder: string
  /** 类型 */
  type: string
  /** 是否必填 */
  isRequired: boolean
}

const data: FieldConfig[] = [

  {
    label: '姓名',
    name: 'name',
    placeholder: '请输入您的姓名',
    type: 'text',
    isRequired: true
  },
  {
    label: '密码',
    name: 'password',
    placeholder: '请输入您的密码',
    type: 'password',
    isRequired: true
  },
  {
    label: '邮箱',
    name: 'email',
    placeholder: '请输入您的邮箱',
    type: 'email',
    isRequired: true
  }
]

/**
 * 表单应用组件
 * @returns 渲染的表单组件
 */
export default function App (): React.ReactElement {
  const [submitted, setSubmitted] = React.useState<FormData | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  /**
   * 创建输入组件
   * @param label - 标签
   * @param name - 名称
   * @param placeholder - 占位符
   * @returns 输入组件
   */
  const createInput: React.FC<FieldConfig> = ({
    label,
    name,
    placeholder,
    type,
    isRequired = false
  }) => {
    return (
      <Input
        key={name}
        label={label}
        name={name}
        placeholder={placeholder}
        isRequired={isRequired}
        labelPlacement='outside'
        errorMessage={({ validationDetails }) => {
          if (isRequired && validationDetails.valueMissing) {
            return `请输入${label}`
          }
          if (name === 'email' && validationDetails.typeMismatch) {
            return '请输入有效的邮箱地址'
          }
          return errors[name]
        }}
        type={type}
      />
    )
  }

  /**
   * 处理表单提交
   * @param e - 表单提交事件
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData) as FormData

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

    // 清除错误并提交
    setErrors({})
    setSubmitted(formValues)
  }

  return (
    <Form
      className='w-full justify-center items-center space-y-4'
      validationErrors={errors}
      onReset={() => setSubmitted(null)}
      onSubmit={onSubmit}
    >
      <div className='flex flex-col gap-4 max-w-md'>
        {data.map(item => createInput(item.label, item.name, item.placeholder, item.type, item.isRequired))}
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
