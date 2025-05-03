import { AxiosError } from 'axios'

/**
 * 请求成功返回类型
 */
interface SuccessResponse<T> {
  success: true
  data: T
}

/**
 * 请求失败返回类型
 */
interface FailedResponse {
  success: false
  /** 捕获的错误对象 */
  data: unknown
  /** 获取字符串格式错误信息 */
  get message (): string
}

/**
 * 通用请求响应类型
 * @description 请求成功返回类型
 * @description 请求失败返回类型
 * @description 泛型T为请求成功返回的数据类型
 */
export type BaseResponse<T = any> = SuccessResponse<T> | FailedResponse

/**
 * 传入捕获的错误对象，返回字符串格式错误信息
 */
export const getErrorMessage = (error: unknown): string => {
  const errorMessage = '未知错误'
  if (error instanceof AxiosError) {
    return error?.response?.data?.message || error.message || errorMessage
  }

  if (error instanceof Error) {
    return error.message || error.stack || errorMessage
  }

  return String(error)
}
