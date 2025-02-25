import { useForm, useFieldArray } from 'react-hook-form'
import { createValidator } from './components/heroui/utils'
import type { ComponentConfig, InputGroupProps, AccordionProProps } from 'node-karin'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@heroui/button'
import { IoCloseCircle } from 'react-icons/io5'
import { Input as HeroInput } from '@heroui/input'
import { Form } from '@heroui/form'
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/accordion'

const InputGroup = ({ props, control, register }: {
  props: InputGroupProps
  control: any
  register: any
}) => {
  const { template, key: k } = props
  const key = k

  const { componentType: __, key: ___, componentClassName, ...templateOptions } = template
  const validator = template.rules ? createValidator(template.rules) : undefined

  /** 单行最多允许多少个输入框 */
  const itemsPerRow = props.itemsPerRow || 5
  /** 最大显示行数 */
  const maxRows = props.maxRows || 5
  /** 最大输入框数量 */
  const maxInputs = props.maxInputs ?? 100

  const [columns, setColumns] = useState('1fr')

  const { fields, append, remove } = useFieldArray({
    control,
    name: key,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')

    const updateColumns = (e: MediaQueryListEvent | MediaQueryList) => {
      setColumns(e.matches ? `repeat(${itemsPerRow}, 1fr)` : '1fr')
    }

    updateColumns(mediaQuery)
    mediaQuery.addEventListener('change', updateColumns)

    return () => mediaQuery.removeEventListener('change', updateColumns)
  }, [itemsPerRow])

  // 添加新输入框
  const handleAddInput = () => {
    if (maxInputs !== 0 && fields.length >= maxInputs) {
      toast.error(`最多只能添加 ${maxInputs} 个输入框哦 φ(>ω<*) `)
      return
    }
    append({ value: '' })
  }

  // 删除输入框
  const handleDeleteInput = (index: number) => {
    remove(index)
    toast.success('已删除一个输入框')
  }

  return (
    <div key={key} className={props.className || 'w-full rounded-2xl p-2 transition-colors'}>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-default-500 text-md'>{props.label}</span>
          {props.description && <p className='text-sm text-gray-500'>{props.description}</p>}
        </div>
        <div className='flex items-center gap-1.5 self-end sm:self-auto'>
          <span className='text-sm text-gray-500'>
            {fields.length}
            {maxInputs !== 0 ? `/${maxInputs}` : ''}
          </span>
          <Button
            key={`${key}-add-input`}
            variant='solid'
            color='primary'
            size='sm'
            onPress={handleAddInput}
            className='flex items-center gap-1 px-2 h-7 min-w-[60px]'
            disabled={maxInputs !== 0 && fields.length >= maxInputs}
          >
            添加
          </Button>
        </div>
      </div>

      <div
        className='grid gap-4 p-2 border border-gray-200 dark:border-gray-700 rounded-xl min-h-[100px] transition-colors'
        style={{
          maxHeight: `calc((60px * ${maxRows}) + (1rem * ${maxRows}))`,
          gridTemplateColumns: columns,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {fields.map((field, index) => (
          <div key={field.id} className='grid grid-cols-[1fr,auto] items-center gap-1'>
            <HeroInput
              {...templateOptions}
              className={`${componentClassName || 'w-full'}`}
              {...register(`${key}.${index}.value`)}
              validate={(val) => {
                if (!val) {
                  if (templateOptions.isRequired) {
                    return '( • ̀ω•́ )✧ 不能为空哦~'
                  }
                  return true
                }
                return validator?.(val)
              }}
            />
            <Button
              variant='light'
              color='danger'
              key={`delete-${key}-${index}`}
              onPress={() => handleDeleteInput(index)}
              className='hover:bg-red-50 transition-colors duration-200 p-1 min-w-0 h-7 w-7 rounded-full'
              aria-label='删除输入框'
            >
              <IoCloseCircle size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// 递归渲染组件
const RenderComponent = ({
  config,
  register,
  control,
  prefix = ''
}: {
  config: ComponentConfig
  register: any
  control: any
  prefix?: string
}) => {
  if (config.componentType === 'input') {
    const key = prefix ? `${prefix}${config.key}` : config.key
    return <HeroInput {...register(key)} {...config} />
  }

  if (config.componentType === 'input-group') {
    return (
      <InputGroup
        key={config.key}
        props={config}
        control={control}
        register={register}
      />
    )
  }

  return null
}

// 手风琴项组件
const AccordionItemContent = ({
  config,
  register,
  control,
  prefix
}: {
  config: ComponentConfig[]
  register: any
  control: any
  prefix: string
}) => (
  <div className='space-y-4'>
    {config.map((child, index) => (
      <RenderComponent
        key={`${child.key}-${index}`}
        config={child}
        register={register}
        control={control}
        prefix={prefix}
      />
    ))}
  </div>
)

// 手风琴组件
const AccordionComponent = ({
  config,
  register,
  control
}: {
  config: AccordionProProps
  register: any
  control: any
}) => {
  // 维护最大序号
  const [maxIndex, setMaxIndex] = useState(0)
  const { fields, append, remove } = useFieldArray({
    control,
    name: config.key
  })

  // 初始化序号
  useEffect(() => {
    if (fields.length > 0) {
      const maxCurrentIndex = Math.max(...fields.map(field => (field as any)._index || 0))
      setMaxIndex(maxCurrentIndex)
    }
  }, [])

  const handleAddItem = () => {
    const newItem: Record<string, any> = {
      _index: maxIndex + 1 // 添加序号字段
    };
    (config.children.children as ComponentConfig[])?.forEach(child => {
      newItem[child.key] = ''
    })
    append(newItem)
    setMaxIndex(prev => prev + 1)
  }

  return (
    <div className='flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'>
      <div className='flex justify-between items-center'>
        <span className='text-default-500 text-md mt-2'>{config.label || '手风琴'}</span>
        <Button
          type='button'
          variant='solid'
          color='primary'
          size='sm'
          onPress={handleAddItem}
        >
          添加项目
        </Button>
      </div>
      <HeroAccordion
        className='border border-default-200 rounded-lg p-1'
        keepContentMounted
      >
        {fields.map((field, index) => (
          <HeroAccordionItem
            key={field.id}
            title={
              <div className='flex justify-between items-center w-full'>
                <span>{`${config.label || '项目'} ${(field as any)._index + 1}`}</span>
                <Button
                  type='button'
                  variant='light'
                  color='danger'
                  size='sm'
                  onPress={() => {
                    remove(index)
                    toast.success('删除成功')
                  }}
                >
                  删除
                </Button>
              </div>
            }
            className='mx-2'
          >
            <AccordionItemContent
              config={config.children.children as ComponentConfig[]}
              register={register}
              control={control}
              prefix={`${config.key}.${index}.`}
            />
          </HeroAccordionItem>
        ))}
      </HeroAccordion>
    </div>
  )
}

// 父组件
export default function Parent () {
  const options: ComponentConfig[] = [
    {
      key: 'parent-field',
      componentType: 'input',
      componentClassName: 'w-full',
    },
    {
      key: 'input-group',
      componentType: 'input-group',
      label: '输入框组',
      description: '这是一个输入框组（在父表单中）',
      template: {
        key: 'input',
        componentType: 'input',
        componentClassName: 'w-full',
      },
      data: ['1', '2', '3'],
    },
    {
      key: 'accordion',
      componentType: 'accordion',
      label: '手风琴',
      description: '这是一个手风琴组件',
      children: [
        {
          key: 'accordion-item',
          componentType: 'accordion-item',
          description: '这是一个手风琴项',
          children: [
            {
              key: 'accordion-item-input',
              componentType: 'input',
              componentClassName: 'w-full',
              defaultValue: '',
            },
          ],
        },
      ],
    },
    {
      key: 'accordion-pro',
      componentType: 'accordion-pro',
      label: '手风琴',
      description: '这是一个手风琴组件',
      children: {
        key: 'accordion-pro-item',
        description: '这是一个手风琴项',
        children: [
          {
            key: 'accordion-pro-item-input',
            componentType: 'input',
            componentClassName: 'w-full',
            defaultValue: '',
          },
          {
            key: 'accordion-pro-item-input-2',
            componentType: 'input',
            componentClassName: 'w-full',
            defaultValue: '',
          },
        ],
      },
      data: [
        {
          'accordion-pro-item-input': '1',
          'accordion-pro-item-input-2': '2',
        },
        {
          'accordion-pro-item-input': '3',
          'accordion-pro-item-input-2': '4',
        },
      ],
    },
  ]

  // 修改初始化数据的处理
  const defaultValues: Record<string, any> = {}
  options.forEach((option) => {
    if (option.componentType === 'input') {
      defaultValues[option.key] = option.value ?? option.defaultValue ?? ''
      return
    }

    if (option.componentType === 'input-group') {
      const data = option.data?.map(item => ({ value: item })) ?? []
      if (data.length === 0) data.push({ value: '' })
      defaultValues[option.key] = data
      return
    }

    if (option.componentType === 'accordion-pro') {
      // 添加序号字段到初始数据
      defaultValues[option.key] = option.data?.map((item, index) => {
        const result: Record<string, any> = {
          _index: index
        }
          ; (option.children.children as ComponentConfig[])?.forEach(child => {
            result[child.key] = item[child.key] ?? ''
          })
        return result
      }) ?? []
    }
  })

  const { control, register, handleSubmit } = useForm({
    defaultValues
  })

  const onSubmit = handleSubmit((data) => {
    console.log('表单数据:', data)
    toast.success('表单提交成功！')
  })

  return (
    <Form onSubmit={onSubmit} className='flex flex-col gap-4 p-4'>
      <div className='space-y-4'>
        {options.map((option) => {
          if (option.componentType === 'accordion-pro') {
            return (
              <AccordionComponent
                key={option.key}
                config={option as AccordionProProps}
                register={register}
                control={control}
              />
            )
          }

          return (
            <RenderComponent
              key={option.key}
              config={option}
              register={register}
              control={control}
            />
          )
        })}

        <Button
          type='submit'
          variant='solid'
          color='primary'
          className='w-full mt-4'
        >
          提交表单
        </Button>
      </div>
    </Form>
  )
}
