import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Switch } from '@heroui/switch'
import { RadioGroup, Radio } from '@heroui/radio'
import { Checkbox, CheckboxGroup } from '@heroui/checkbox'
import { Select, SelectItem } from '@heroui/select'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Accordion, AccordionItem } from '@heroui/accordion'
import type { ArrayField as ArrayFieldType, FormField, ObjectArrayField } from '@/types/config'
import { Divider } from '@heroui/divider'
import { MdAdd, MdDelete } from 'react-icons/md'
import { Key } from '@react-types/shared'

export interface DynamicFormProps {
  register: ReturnType<typeof useForm>['register']
  control: ReturnType<typeof useForm>['control']
  errors: ReturnType<typeof useForm>['formState']['errors']
  formConfig: FormField[]
  expandedSections: Set<Key>
  setExpandedSections: (sections: Set<Key>) => void
}

function EmptyTip ({ fields }: { fields: unknown[] }) {
  return (
    fields.length === 0 && (
      <div className="text-sm text-content4-foreground text-center col-span-2">
        暂无数据，点击上方按钮添加
      </div>
    )
  )
}

function ArrayField ({
  control,
  field,
  fullPath,
  register,
}: {
  control: DynamicFormProps['control']
  field: ArrayFieldType
  fullPath: string
  register: DynamicFormProps['register']
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fullPath,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2>{field.label}</h2>
        <Button
          type="button"
          color="primary"
          size="sm"
          radius="full"
          startContent={<MdAdd />}
          onPress={() => append(field.defaultValue ?? '')}
        >
          添加
        </Button>
      </CardHeader>
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmptyTip fields={fields} />
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Input
              type={field.elementType}
              {...register(`${fullPath}.${index}`)}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              radius="full"
              color="danger"
              startContent={<MdDelete />}
              onPress={() => remove(index)}
            >
              删除
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function ObjectArrayField ({
  control,
  field,
  fullPath,
  renderField,
}: {
  control: DynamicFormProps['control']
  field: ObjectArrayField
  fullPath: string
  renderField: (field: FormField, path: string) => React.ReactNode
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fullPath,
  })
  const safeFields = field.fields || []

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2>{field.label}</h2>
        <Button
          type="button"
          color="primary"
          size="sm"
          radius="full"
          startContent={<MdAdd />}
          onPress={() => append({})}
        >
          添加
        </Button>
      </CardHeader>
      <CardBody>
        <EmptyTip fields={fields} />
        {fields.map((item, index) => (
          <div key={item.id} className="mb-4 p-4 border rounded space-y-4">
            {safeFields.map((subField, subIndex) => (
              <React.Fragment key={subField.key ?? subIndex}>
                {renderField(subField, `${fullPath}.${index}`)}
              </React.Fragment>
            ))}
            <Button
              type="button"
              size="sm"
              color="danger"
              onPress={() => remove(index)}
              className="mt-2"
            >
              删除
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

// 动态表单组件
const DynamicForm: React.FC<DynamicFormProps> = ({
  register,
  control,
  errors,
  formConfig,
  expandedSections,
  setExpandedSections
}) => {
  // 渲染表单字段
  const renderField = (field: FormField, path: string = '') => {
    const fullPath = path ? `${path}.${field.key}` : field.key
    const key = fullPath

    // 创建一个通用的描述渲染函数
    const renderDescription = (description?: string) => {
      if (!description) return null
      return (
        <div className="text-sm text-content4-foreground mt-1">
          {description}
        </div>
      )
    }

    switch (field.type) {
      case 'divider':
        return <Divider key={key} />

      case 'title':
        return <h3 key={key}>{field.text}</h3>

      case 'section':
        return (
          <Accordion
            key={key}
            selectedKeys={expandedSections}
            onSelectionChange={(keys) => {
              if (typeof keys === 'string') {
                const newSet = new Set(expandedSections)
                if (newSet.has(field.key)) {
                  newSet.delete(field.key)
                } else {
                  newSet.add(field.key)
                }
                setExpandedSections(newSet)
              } else {
                setExpandedSections(new Set(keys))
              }
            }}
          >
            <AccordionItem
              key={field.key}
              title={field.label}
              textValue={field.label}
            >
              <div className="space-y-4">
                {field.children.map((subField, subIndex) => (
                  <React.Fragment key={subField.key ?? subIndex}>
                    {renderField(subField)}
                  </React.Fragment>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        )

      case 'text':
        return (
          <div key={key}>
            <Input
              label={field.label}
              defaultValue={field.defaultValue}
              {...register(fullPath, { required: field.required })}
              className="w-full"
              errorMessage={errors[field.key]?.message?.toString()}
              description={field.description}
            />
            {renderDescription(field.description)}
          </div>
        )

      case 'number':
        return (
          <div key={key}>
            <Input
              label={field.label}
              type="number"
              defaultValue={field.defaultValue?.toString()}
              {...register(fullPath, { required: field.required })}
              className="w-full"
              description={field.description}
            />
            {renderDescription(field.description)}
          </div>
        )

      case 'switch':
        return (
          <div key={key}>
            <Switch key={key} {...register(fullPath)} defaultChecked={field.defaultValue}>
              {field.label}
            </Switch>
            {renderDescription(field.description)}
          </div>
        )

      case 'checkbox':
        return (
          <div key={key}>
            <CheckboxGroup
              label={field.label}
              defaultValue={field.defaultValue?.map(String)}
            >
              {field.options.map(option => (
                <Checkbox key={option.value} value={option.value.toString()} {...register(fullPath)}>
                  {option.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
            {renderDescription(field.description)}
          </div>
        )

      case 'radio':
        return (
          <div key={key}>
            <RadioGroup
              label={field.label}
              defaultValue={field.options[0]?.value?.toString()}
            >
              {field.options.map(option => (
                <Radio key={option.value} value={option.value.toString()} {...register(fullPath)}>
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
            {renderDescription(field.description)}
          </div>
        )

      case 'select':
        return (
          <div key={key}>
            <Select
              label={field.label}
              defaultSelectedKeys={[]}
              items={field.options}
              multiple={field.multiple}
              {...register(fullPath)}
            >
              {option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              )}
            </Select>
            {renderDescription(field.description)}
          </div>
        )

      case 'array':
        return (
          <ArrayField
            key={fullPath}
            control={control}
            field={field}
            fullPath={fullPath}
            register={register}
          />
        )

      case 'objectArray':
        return (
          <ObjectArrayField
            key={fullPath}
            control={control}
            field={field}
            fullPath={fullPath}
            renderField={renderField}
          />
        )

      case 'object':
        return (
          <Card key={key} className="p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h2>{field.label}</h2>
                {field.description && (
                  <div className="text-sm text-content4-foreground">
                    {field.description}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {field.fields.map((subField, subIndex) => (
                <React.Fragment key={subField.key ?? subIndex}>
                  {renderField(subField, fullPath)}
                </React.Fragment>
              ))}
            </CardBody>
          </Card>
        )

      default:
        return null
    }
  }

  return <>{formConfig.map(field => renderField(field))}</>
}

export default DynamicForm
