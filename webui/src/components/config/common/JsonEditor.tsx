import { useState, useCallback } from 'react'
import { Textarea, Chip, Button } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { Check, X, AlertTriangle, RotateCcw } from 'lucide-react'

export interface JsonEditorProps<T = unknown> {
  /** JSON 值 */
  value: T
  /** 值变化回调 - 仅在JSON有效时调用 */
  onChange: (value: T) => void
  /** 标签 */
  label?: string
  /** 描述 */
  description?: string
  /** 最小高度 */
  minRows?: number
  /** 最大高度 */
  maxRows?: number
  /** 是否只读 */
  isReadOnly?: boolean
  /** 验证函数，返回错误信息或 null */
  validate?: (value: T) => string | null
  /** 自定义类名 */
  className?: string
}

/**
 * JSON 编辑器组件
 * 支持 JSON 语法验证和自定义验证
 */
export function JsonEditor<T = unknown> ({
  value,
  onChange,
  label,
  description,
  minRows = 10,
  maxRows = 30,
  isReadOnly = false,
  validate,
  className,
}: JsonEditorProps<T>) {
  const { t } = useTranslation()

  // 将初始值转换为字符串
  const getValueAsString = useCallback((v: T) => {
    try {
      return JSON.stringify(v, null, 2)
    } catch {
      return '{}'
    }
  }, [])

  const [text, setText] = useState(() => getValueAsString(value))
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  // 处理文本变化
  const handleChange = useCallback((newText: string) => {
    setText(newText)

    if (!newText.trim()) {
      setError(t('jsonEditor.emptyError', 'JSON 不能为空'))
      setIsValid(false)
      return
    }

    try {
      const parsed = JSON.parse(newText) as T

      // 运行自定义验证
      if (validate) {
        const validationError = validate(parsed)
        if (validationError) {
          setError(validationError)
          setIsValid(false)
          return
        }
      }

      setError(null)
      setIsValid(true)
      onChange(parsed)
    } catch (e) {
      const message = e instanceof Error ? e.message : t('jsonEditor.parseError', '无效的 JSON 格式')
      setError(message)
      setIsValid(false)
    }
  }, [onChange, validate, t])

  // 格式化 JSON
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(text)
      const formatted = JSON.stringify(parsed, null, 2)
      setText(formatted)
      setError(null)
      setIsValid(true)
    } catch {
      // 格式化失败时不做处理
    }
  }, [text])

  // 重置为原始值
  const handleReset = useCallback(() => {
    const original = getValueAsString(value)
    setText(original)
    setError(null)
    setIsValid(true)
  }, [value, getValueAsString])

  return (
    <div className={className}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {label && <span className="font-medium">{label}</span>}
          <Chip
            size="sm"
            variant="flat"
            color={isValid ? 'success' : 'danger'}
            startContent={isValid ? <Check size={12} /> : <X size={12} />}
          >
            {isValid ? 'JSON' : t('jsonEditor.invalid', '无效')}
          </Chip>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={handleFormat}
              isDisabled={!isValid}
            >
              {t('jsonEditor.format', '格式化')}
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="warning"
              startContent={<RotateCcw size={14} />}
              onPress={handleReset}
            >
              {t('jsonEditor.reset', '重置')}
            </Button>
          </div>
        )}
      </div>

      {description && (
        <p className="text-sm text-default-500 mb-3">{description}</p>
      )}

      {/* 编辑器 */}
      <Textarea
        value={text}
        onValueChange={handleChange}
        minRows={minRows}
        maxRows={maxRows}
        isReadOnly={isReadOnly}
        isInvalid={!isValid}
        classNames={{
          input: 'font-mono text-sm',
          inputWrapper: 'bg-default-100',
        }}
        placeholder="{}"
      />

      {/* 错误提示 */}
      {error && (
        <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-danger-50 border border-danger-200">
          <AlertTriangle size={16} className="text-danger-600 shrink-0 mt-0.5" />
          <p className="text-sm text-danger-600 break-all">{error}</p>
        </div>
      )}
    </div>
  )
}
