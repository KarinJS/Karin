import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * 下载文件请求参数
 */
export interface DownloadFilesOptions<T extends boolean = false> extends AxiosRequestConfig {
  /** 是否返回布尔值 */
  returnBoolean?: T
}

/**
 * 下载文件成功返回值
 */
export interface DownloadFileSuccessResult {
  success: true
  data: AxiosResponse<any>
}

/**
 * 下载文件失败返回值
 */
export interface DownloadFileErrorResult {
  success: false
  data: unknown
}

/**
 * 下载文件返回值
 */
export type DownloadFileResult<T extends boolean = false> = T extends true
  ? boolean
  : DownloadFileSuccessResult | DownloadFileErrorResult
