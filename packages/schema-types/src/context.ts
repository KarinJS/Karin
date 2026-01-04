/**
 * @fileoverview 表单上下文定义
 * @description 定义表单运行时的上下文接口，用于状态管理和数据操作
 * @module @karinjs/schema-types/context
 */

/**
 * 表单值类型
 * @description 表单数据的键值对映射
 */
export type FormValues = Record<string, unknown>

/**
 * 表单错误类型
 * @description 字段错误信息的键值对映射
 */
export type FormErrors = Record<string, string>

/**
 * 表单触碰状态类型
 * @description 记录哪些字段已被用户交互过
 */
export type FormTouched = Record<string, boolean>

/**
 * 表单上下文值
 * @description 提供表单状态和操作方法的上下文接口
 *
 * 此接口用于前端实现表单状态管理，后端定义 Schema 时不需要关心此接口。
 *
 * @example
 * ```tsx
 * // React 实现示例
 * const FormContext = createContext<FormContextValue | null>(null)
 *
 * function useFormContext() {
 *   const context = useContext(FormContext)
 *   if (!context) {
 *     throw new Error('useFormContext must be used within FormProvider')
 *   }
 *   return context
 * }
 *
 * // 在字段组件中使用
 * function TextField({ field }: { field: TextFieldSchema }) {
 *   const { getValue, setValue, getError, setTouched } = useFormContext()
 *
 *   return (
 *     <Input
 *       value={getValue(field.key) as string}
 *       onChange={(e) => setValue(field.key, e.target.value)}
 *       onBlur={() => setTouched(field.key)}
 *       errorMessage={getError(field.key)}
 *     />
 *   )
 * }
 * ```
 */
export interface FormContextValue {
  /**
   * 所有字段的当前值
   */
  values: FormValues

  /**
   * 所有字段的错误信息
   */
  errors: FormErrors

  /**
   * 所有字段的触碰状态
   */
  touched: FormTouched

  /**
   * 设置字段值
   * @param key - 字段路径，支持点号分隔的嵌套路径如 'user.name'
   * @param value - 要设置的值
   */
  setValue: (key: string, value: unknown) => void

  /**
   * 设置字段错误信息
   * @param key - 字段路径
   * @param error - 错误信息，空字符串表示清除错误
   */
  setError: (key: string, error: string) => void

  /**
   * 标记字段为已触碰
   * @param key - 字段路径
   */
  setTouched: (key: string) => void

  /**
   * 获取字段当前值
   * @param key - 字段路径
   * @returns 字段值，不存在时返回 undefined
   */
  getValue: (key: string) => unknown

  /**
   * 获取字段错误信息
   * @param key - 字段路径
   * @returns 错误信息，无错误时返回 undefined
   */
  getError: (key: string) => string | undefined
}

/**
 * 表单提交处理器
 * @description 表单提交时的回调函数类型
 */
export type FormSubmitHandler = (values: FormValues) => void | Promise<void>

/**
 * 字段变更处理器
 * @description 字段值变化时的回调函数类型
 */
export type FieldChangeHandler = (key: string, value: unknown, prevValue: unknown) => void

/**
 * 表单验证结果
 */
export interface ValidationResult {
  /**
   * 验证是否通过
   */
  valid: boolean

  /**
   * 验证错误信息
   */
  errors: FormErrors
}

/**
 * 表单验证器
 * @description 验证整个表单的函数类型
 */
export type FormValidator = (values: FormValues) => ValidationResult | Promise<ValidationResult>
