import { useState, useCallback } from 'react'
import { Button } from '@heroui/react'
import { Save } from 'lucide-react'
import { FormProvider } from './FormContext'
import { FieldRenderer } from './FieldRenderer'
import { FieldRendererProvider } from './FieldRendererContext'
import { useI18nString } from './i18n'
import type { FormSchema } from './types'

interface SchemaFormProps {
  schema: FormSchema
  initialData?: Record<string, unknown>
  onSubmit?: (data: Record<string, unknown>) => Promise<void>
  onChange?: (data: Record<string, unknown>) => void
}

export function SchemaForm ({ schema, initialData = {}, onSubmit, onChange }: SchemaFormProps) {
  const t = useI18nString()
  const [data, setData] = useState<Record<string, unknown>>(initialData)
  const [saving, setSaving] = useState(false)

  const handleChange = useCallback((values: Record<string, unknown>) => {
    setData(values)
    onChange?.(values)
  }, [onChange])

  const handleSubmit = async () => {
    if (!onSubmit) return
    setSaving(true)
    try {
      await onSubmit(data)
    } finally {
      setSaving(false)
    }
  }

  const columns = schema.options?.columns || 1
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const showTopSubmit = schema.options?.submit?.position === 'top' || schema.options?.submit?.position === 'both'
  const showBottomSubmit = !schema.options?.submit?.position || schema.options?.submit?.position === 'bottom' || schema.options?.submit?.position === 'both'

  const SubmitButton = (
    <Button
      type="submit"
      color="primary"
      isLoading={saving}
      startContent={!saving && <Save size={18} />}
    >
      {t(schema.options?.submit?.text) || '保存'}
    </Button>
  )

  return (
    <FieldRendererProvider RenderField={FieldRenderer}>
      <FormProvider initialValues={data} onChange={handleChange}>
        <form 
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="space-y-6"
        >
          {/* 标题和顶部提交按钮 */}
          <div className="flex items-center justify-between">
            <div>
              {schema.title && (
                <h2 className="text-xl font-semibold">{t(schema.title)}</h2>
              )}
              {schema.description && (
                <p className="text-default-500 mt-1">{t(schema.description)}</p>
              )}
            </div>
            {showTopSubmit && onSubmit && SubmitButton}
          </div>

          {/* 字段渲染 */}
          <div className={`grid gap-4 ${gridCols[columns]}`}>
            {schema.fields.map((field) => {
              const span = field.layout?.span || 1
              const spanClass = span > 1 ? `md:col-span-${span}` : ''
              const newLineClass = field.layout?.newLine ? 'col-start-1' : ''

              return (
                <div key={field.key} className={`${spanClass} ${newLineClass}`}>
                  <FieldRenderer schema={field} />
                </div>
              )
            })}
          </div>

          {/* 底部提交按钮 */}
          {showBottomSubmit && onSubmit && (
            <div className="flex justify-end pt-4 border-t border-divider">
              {SubmitButton}
            </div>
          )}
        </form>
      </FormProvider>
    </FieldRendererProvider>
  )
}
