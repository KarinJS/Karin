import { Accordion, AccordionItem, Tabs, Tab, Divider, Card, CardBody } from '@heroui/react'
import { useI18nString } from '../i18n'
import { Icon } from '../Icon'
import { useFieldRenderer } from '../FieldRendererContext'
import type { AccordionFieldSchema, TabsFieldSchema, DividerFieldSchema, AlertFieldSchema, GroupFieldSchema } from '../types'
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

// ============================================
// 折叠面板
// ============================================

export function AccordionField ({ schema }: { schema: AccordionFieldSchema }) {
  const t = useI18nString()
  const RenderField = useFieldRenderer()

  const iconColorClass: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }

  return (
    <Accordion
      selectionMode={schema.options.selectionMode || 'multiple'}
      defaultExpandedKeys={schema.options.defaultExpanded}
      variant={schema.options.variant || 'splitted'}
    >
      {schema.options.items.map((item) => (
        <AccordionItem
          key={item.key}
          aria-label={t(item.title)}
          title={
            <div className="flex items-center gap-2">
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={20}
                  className={item.iconColor ? iconColorClass[item.iconColor] : 'text-default-600'}
                />
              )}
              <span className="font-medium">{t(item.title)}</span>
            </div>
          }
          subtitle={item.subtitle ? t(item.subtitle) : undefined}
        >
          <div className="grid gap-4 pt-2">
            {item.fields.map((field) => (
              <RenderField key={field.key} schema={field} />
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// ============================================
// 标签页
// ============================================

export function TabsField ({ schema }: { schema: TabsFieldSchema }) {
  const t = useI18nString()
  const RenderField = useFieldRenderer()

  return (
    <Tabs
      aria-label={t(schema.label)}
      variant={schema.options.variant || 'solid'}
      classNames={{
        panel: 'pt-4',
      }}
    >
      {schema.options.items.map((item) => (
        <Tab
          key={item.key}
          title={
            <div className="flex items-center gap-2">
              {item.icon && <Icon name={item.icon} size={18} />}
              <span>{t(item.title)}</span>
            </div>
          }
        >
          <div className="grid gap-4">
            {item.fields.map((field) => (
              <RenderField key={field.key} schema={field} />
            ))}
          </div>
        </Tab>
      ))}
    </Tabs>
  )
}

// ============================================
// 分隔线
// ============================================

export function DividerField ({ schema }: { schema: DividerFieldSchema }) {
  const t = useI18nString()

  return (
    <div className="py-2">
      <Divider orientation={schema.options?.orientation || 'horizontal'} />
      {schema.label && (
        <div className="text-sm text-default-500 mt-2">{t(schema.label)}</div>
      )}
    </div>
  )
}

// ============================================
// 提示框
// ============================================

export function AlertField ({ schema }: { schema: AlertFieldSchema }) {
  const t = useI18nString()

  const variantStyles: Record<string, { bg: string; border: string; icon: typeof Info }> = {
    info: { bg: 'bg-primary-50', border: 'border-primary-200', icon: Info },
    success: { bg: 'bg-success-50', border: 'border-success-200', icon: CheckCircle },
    warning: { bg: 'bg-warning-50', border: 'border-warning-200', icon: AlertTriangle },
    danger: { bg: 'bg-danger-50', border: 'border-danger-200', icon: AlertCircle },
  }

  const variant = schema.options.variant || 'info'
  const style = variantStyles[variant]
  const IconComponent = style.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${style.bg} ${style.border}`}>
      <IconComponent size={20} className={`mt-0.5 text-${variant}`} />
      <div>
        {schema.options.title && (
          <div className="font-medium mb-1">{t(schema.options.title)}</div>
        )}
        <div className="text-sm text-default-600">{t(schema.options.content)}</div>
      </div>
    </div>
  )
}

// ============================================
// 分组容器
// ============================================

export function GroupField ({ schema }: { schema: GroupFieldSchema }) {
  const t = useI18nString()
  const RenderField = useFieldRenderer()
  const columns = schema.options?.columns || 1

  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (!schema.fields) return null

  return (
    <Card shadow="sm" className="border border-divider">
      <CardBody className="p-4">
        {schema.label && (
          <div className="font-medium mb-4">{t(schema.label)}</div>
        )}
        <div className={`grid gap-4 ${gridCols[columns]}`}>
          {schema.fields.map((field) => (
            <RenderField key={field.key} schema={field} />
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
