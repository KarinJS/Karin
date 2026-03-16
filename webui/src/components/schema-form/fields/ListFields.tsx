import { useState } from 'react'
import { Button, Input, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { Plus, Trash, GripVertical, Edit } from 'lucide-react'
import { useField, FormProvider } from '../FormContext'
import { useI18nString } from '../i18n'
import { useFieldRenderer } from '../FieldRendererContext'
import type { ListFieldSchema, ObjectListFieldSchema } from '../types'

// ============================================
// 简单值列表
// ============================================

export function ListField ({ schema }: { schema: ListFieldSchema }) {
  const { value, onChange } = useField(schema.key)
  const t = useI18nString()

  const items = (value as string[] | number[]) || []

  const addItem = () => {
    const newItem = schema.options.itemType === 'number' ? 0 : ''
    onChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const updateItem = (index: number, newValue: string | number) => {
    const newItems = [...items]
    newItems[index] = schema.options.itemType === 'number' ? Number(newValue) : newValue
    onChange(newItems)
  }

  const canAdd = !schema.options.maxItems || items.length < schema.options.maxItems

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">{t(schema.label)}</span>
          {schema.description && (
            <p className="text-sm text-default-500 mt-0.5">{t(schema.description)}</p>
          )}
        </div>
        {canAdd && (
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Plus size={16} />}
            onPress={addItem}
          >
            {t(schema.options.addButtonText) || '添加'}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-default-400 border-2 border-dashed rounded-xl">
            暂无数据，点击上方按钮添加
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {schema.options.sortable && (
                <div className="cursor-grab text-default-400 hover:text-default-600">
                  <GripVertical size={18} />
                </div>
              )}
              <Input
                size="sm"
                type={schema.options.itemType === 'number' ? 'number' : 'text'}
                value={String(item)}
                onValueChange={(v) => updateItem(index, v)}
                placeholder={t(schema.options.itemPlaceholder)}
                className="flex-1"
              />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => removeItem(index)}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================
// 对象数组列表 (卡片模式)
// ============================================

export function ObjectListField ({ schema }: { schema: ObjectListFieldSchema }) {
  const { value, onChange } = useField(schema.key)
  const t = useI18nString()
  const RenderField = useFieldRenderer()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null)

  const items = (value as Record<string, unknown>[]) || []

  // 创建默认值
  const createDefaultItem = (): Record<string, unknown> => {
    const item: Record<string, unknown> = {}
    for (const field of schema.options.itemSchema) {
      if (field.defaultValue !== undefined) {
        item[field.key] = field.defaultValue
      }
    }
    return item
  }

  const addItem = () => {
    const newItem = createDefaultItem()
    setEditingItem(newItem)
    setEditingIndex(items.length)
  }

  const removeItem = (index: number) => {
    if (schema.options.confirmDelete) {
      if (!confirm('确定要删除此项吗？')) return
    }
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const editItem = (index: number) => {
    setEditingItem({ ...items[index] })
    setEditingIndex(index)
  }

  const saveItem = () => {
    if (editingItem === null || editingIndex === null) return
    const newItems = [...items]
    if (editingIndex >= items.length) {
      newItems.push(editingItem)
    } else {
      newItems[editingIndex] = editingItem
    }
    onChange(newItems)
    setEditingItem(null)
    setEditingIndex(null)
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditingIndex(null)
  }

  const canAdd = !schema.options.maxItems || items.length < schema.options.maxItems

  // 获取预览值
  const getPreviewValue = (item: Record<string, unknown>, fieldKey: string): string => {
    const val = item[fieldKey]
    if (val === undefined || val === null) return '-'
    if (typeof val === 'boolean') return val ? '✅' : '❌'
    if (Array.isArray(val)) return `${val.length} 项`
    return String(val)
  }

  // 获取字段标签
  const getFieldLabel = (fieldKey: string): string => {
    const field = schema.options.itemSchema.find(f => f.key === fieldKey)
    return field?.label ? t(field.label) : fieldKey
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium text-lg">{t(schema.label)}</span>
          {schema.description && (
            <p className="text-sm text-default-500 mt-0.5">{t(schema.description)}</p>
          )}
        </div>
        {canAdd && (
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Plus size={16} />}
            onPress={addItem}
          >
            {t(schema.options.addButtonText) || '添加'}
          </Button>
        )}
      </div>

      {/* 列表 */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-default-400 border-2 border-dashed rounded-xl bg-default-50">
            {t(schema.options.emptyText) || '暂无数据，点击上方按钮添加'}
          </div>
        ) : (
          items.map((item, index) => {
            const title = schema.options.titleField
              ? String(item[schema.options.titleField] || `项目 ${index + 1}`)
              : `项目 ${index + 1}`

            return (
              <Card key={index} shadow="sm" className="border border-divider">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {schema.options.sortable && (
                          <div className="cursor-grab text-default-400 hover:text-default-600">
                            <GripVertical size={18} />
                          </div>
                        )}
                        <span className="font-medium">{title}</span>
                      </div>

                      {/* 预览字段 */}
                      {schema.options.previewFields && (
                        <div className="flex flex-wrap gap-3 text-sm">
                          {schema.options.previewFields.map((fieldKey) => (
                            <div key={fieldKey} className="flex items-center gap-1.5 px-2 py-1 bg-default-100 rounded-lg">
                              <span className="text-default-500">{getFieldLabel(fieldKey)}:</span>
                              <span className="font-medium">{getPreviewValue(item, fieldKey)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => editItem(index)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removeItem(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )
          })
        )}
      </div>

      {/* 编辑弹窗 */}
      <Modal
        isOpen={editingItem !== null}
        onClose={cancelEdit}
        size={schema.options.editModal?.size || 'lg'}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingIndex !== null && editingIndex < items.length
              ? (t(schema.options.editModal?.title) || '编辑')
              : '添加'
            }
          </ModalHeader>
          <ModalBody>
            {editingItem && (
              <FormProvider
                initialValues={editingItem}
                onChange={(values) => setEditingItem(values)}
              >
                <div className={`grid gap-4 ${schema.options.editModal?.columns === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1'
                  }`}>
                  {schema.options.itemSchema.map((field) => (
                    <div
                      key={field.key}
                      className={field.layout?.span === 2 ? 'md:col-span-2' : ''}
                    >
                      <RenderField schema={field} />
                    </div>
                  ))}
                </div>
              </FormProvider>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={cancelEdit}>
              取消
            </Button>
            <Button color="primary" onPress={saveItem}>
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
