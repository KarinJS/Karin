import { useState, useEffect } from 'react'
import { Button, Tag, Modal, Input, message, Card, Switch, Collapse, ColorPicker, Radio, Checkbox } from 'antd'
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { request } from '@/lib/request'

/**
 * 配置项类型定义 - 使用core包中定义的类型
 */
type ConfigItem = {
  type: 'input' | 'number' | 'switch' | 'select' | 'section' | 'divider' | 'title' | 'array' | 'colorPicker' | 'radio' | 'checkbox'
  label?: string
  description?: string
  required?: boolean
  default?: any
  text?: string
  items?: ConfigItem[]
  children?: ConfigItem[]
  field?: string
  options?: Array<{
    label: string
    value: string
    checked?: boolean
    disabled?: boolean
  }>
  vertical?: boolean
}

/**
 * 数组配置编辑器组件
 */
const ArrayConfigEditor = ({
  config,
  value = [],
  onChange
}: {
  config: ConfigItem
  value: any[]
  onChange: (newValue: any[]) => void
}) => {
  const handleAdd = () => {
    // 创建一个新的对象，包含所有items中定义的字段的默认值
    const defaultItem = config.items?.reduce((acc, item) => {
      if (item.field) {
        acc[item.field] = item.default
      }
      return acc
    }, {} as Record<string, any>)
    onChange([...value, defaultItem])
  }

  const handleDelete = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const handleItemChange = (index: number, field: string, itemValue: any) => {
    const newValue = [...value]
    newValue[index] = {
      ...newValue[index],
      [field]: itemValue
    }
    onChange(newValue)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-medium">{config.label}</h3>
          {config.description && (
            <p className="text-sm text-gray-500">{config.description}</p>
          )}
        </div>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加
        </Button>
      </div>

      <div className="space-y-4">
        {value.map((item, index) => (
          <Card
            key={index}
            size="small"
            extra={
              <DeleteOutlined
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(index)}
              />
            }
            title={`${config.label} ${index + 1}`}
          >
            {config.items?.map((itemConfig, itemIndex) => (
              <ConfigItemRender
                key={itemIndex}
                config={itemConfig}
                value={item[itemConfig.field || '']}
                onChange={(newValue) => {
                  handleItemChange(index, itemConfig.field || '', newValue)
                }}
              />
            ))}
          </Card>
        ))}
        {value.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-4">
            暂无配置，点击上方按钮添加
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 获取嵌套对象的值
 */
const getNestedValue = (obj: any, path: string) => {
  if (!path) return obj
  const parts = path.split('.')
  let value = obj
  for (const part of parts) {
    if (value === undefined || value === null) return undefined
    value = value[part]
  }
  return value
}

/**
 * 配置项渲染组件
 */
const ConfigItemRender = ({
  config,
  value,
  onChange
}: {
  config: ConfigItem
  value: any
  onChange: (newValue: any) => void
}) => {
  const getValue = () => {
    if (!config.field) return undefined
    return config.field.includes('.')
      ? getNestedValue(value, config.field)
      : value?.[config.field]
  }

  const currentValue = getValue()
  const processedValue = currentValue ?? config.default ?? []

  switch (config.type) {
    case 'title':
      return <h2 className="text-lg font-bold mb-4">{config.text}</h2>
    case 'divider':
      return <div className="my-4 border-t border-gray-200" />
    case 'switch':
      return (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Switch checked={processedValue} onChange={onChange} />
            <span>{config.label}</span>
          </div>
          {config.description && (
            <p className="text-sm text-gray-500 mt-1">{config.description}</p>
          )}
        </div>
      )
    case 'array':
      return (
        <ArrayConfigEditor
          config={config}
          value={Array.isArray(processedValue) ? processedValue : []}
          onChange={onChange}
        />
      )
    case 'input':
      return (
        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              value={processedValue}
              onChange={e => onChange(e.target.value)}
              placeholder={`请输入${config.label}`}
            />
            {config.description && (
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            )}
          </div>
        </div>
      )
    case 'number':
      return (
        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="number"
              value={processedValue}
              onChange={e => onChange(Number(e.target.value))}
              placeholder={`请输入${config.label}`}
            />
            {config.description && (
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            )}
          </div>
        </div>
      )
    case 'section':
      return (
        <Collapse
          className="mb-4"
          items={[
            {
              key: config.label,
              label: (
                <div>
                  <span>{config.label}</span>
                  {config.description && (
                    <span className="text-sm text-gray-500 ml-2">
                      {config.description}
                    </span>
                  )}
                </div>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  {config.children?.map((child, index) => (
                    <ConfigItemRender
                      key={index}
                      config={child}
                      value={value}
                      onChange={(newValue) => {
                        if (child.field?.includes('.')) {
                          const [parent, field] = child.field.split('.')
                          onChange({
                            ...value,
                            [parent]: {
                              ...value?.[parent],
                              [field]: newValue
                            }
                          })
                        } else {
                          onChange({
                            ...value,
                            [child.field || '']: newValue
                          })
                        }
                      }}
                    />
                  ))}
                </div>
              )
            }
          ]}
        />
      )
    case 'colorPicker':
      return (
        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <ColorPicker
              value={processedValue}
              onChange={(color) => onChange(color.toHexString())}
            />
            {config.description && (
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            )}
          </div>
        </div>
      )
    case 'radio':
      return (
        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Radio.Group
              value={processedValue}
              onChange={(e) => onChange(e.target.value)}
              className={config.vertical ? 'flex flex-col space-y-2' : ''}
            >
              {config.options?.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
            {config.description && (
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            )}
          </div>
        </div>
      )
    case 'checkbox':
      return (
        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Checkbox.Group
              value={processedValue}
              onChange={onChange}
              className={config.vertical ? 'flex flex-col space-y-2' : ''}
            >
              {config.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
            {config.description && (
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            )}
          </div>
        </div>
      )
    default:
      return null
  }
}

/**
 * 配置页面组件
 */
const ConfigPage = () => {
  const [configStructure, setConfigStructure] = useState<ConfigItem[]>([])
  const [configValues, setConfigValues] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState('config')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await request.serverPost<ConfigItem[], { type: string }>('/api/v1/get_file', {
          type: activeTab
        })
        console.log('获取配置:', res)
        setConfigStructure(res)

        const defaultValues: Record<string, any> = {}

        /**
         * 设置嵌套对象的值
         */
        const setNestedValue = (obj: any, path: string, value: any) => {
          const parts = path.split('.')
          let current = obj
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i]
            current[part] = current[part] || {}
            current = current[part]
          }
          current[parts[parts.length - 1]] = value
        }

        /**
         * 递归处理配置项的默认值
         */
        const processConfigItem = (item: ConfigItem) => {
          if (item.type === 'title') {
            return
          }

          console.log('处理配置项:', item)
          if (item.field) {
            let defaultValue: any

            switch (item.type) {
              case 'array':
                // 使用后端返回的默认值，如果没有则使用空数组
                defaultValue = item.default || []
                break
              case 'switch':
                defaultValue = item.default ?? false
                break
              case 'number':
                defaultValue = item.default ?? 0
                break
              case 'input':
                defaultValue = item.default ?? ''
                break
            }

            if (defaultValue !== undefined) {
              if (item.field.includes('.')) {
                setNestedValue(defaultValues, item.field, defaultValue)
              } else {
                defaultValues[item.field] = defaultValue
              }
            }
          }

          // 递归处理子配置项
          if (item.children) {
            item.children.forEach(processConfigItem)
          }
        }

        // 处理所有配置项
        res.forEach(processConfigItem)

        console.log('初始化的默认值:', defaultValues)
        setConfigValues(defaultValues)
      } catch (error) {
        console.error('获取配置失败:', error)
        message.error('获取配置失败')
      }
    }

    fetchConfig()
  }, [activeTab])

  const handleSave = async () => {
    try {
      setLoading(true)
      console.log('保存配置:', configValues)
      // await request.serverPost('/api/v1/set_file', {
      //   type: activeTab,
      //   data: configValues
      // })
      message.success('保存成功')
    } catch (error) {
      console.error('保存失败:', error)
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  console.log('当前配置值:', configValues)
  console.log('配置结构:', configStructure)

  return (
    <div className="p-4">
      <div className="mb-6 border-b">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <div
              className={`pb-2 px-4 cursor-pointer ${activeTab === 'config'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('config')}
            >
              基础配置
            </div>
            <div
              className={`pb-2 px-4 cursor-pointer ${activeTab === 'adapter'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('adapter')}
            >
              适配器配置
            </div>
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={() => {
              console.log('按钮被点击')
              handleSave()
            }}
          >
            保存
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {configStructure.length === 0 ? (
          <div>加载中...</div>
        ) : (
          configStructure.map((config, index) => (
            <ConfigItemRender
              key={index}
              config={config}
              value={configValues[config.field || '']}
              onChange={(newValue) => {
                setConfigValues(prev => ({
                  ...prev,
                  [config.field || '']: newValue
                }))
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ConfigPage
