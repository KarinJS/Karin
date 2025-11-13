import fs from 'node:fs'
import axios from 'axios'
import path from 'node:path'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'

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

/** promisify stream.pipeline */
const streamPipeline = promisify(pipeline)

/**
 * 下载文件
 * @param fileUrl 下载地址
 * @param savePath 保存路径
 * @param options 请求参数 基本是axios参数，额外拓展了returnBoolean
 */
export const downloadFile = async<T extends boolean = false> (
  fileUrl: string,
  savePath: string,
  options: DownloadFilesOptions<T> = {}
): Promise<DownloadFileResult<T>> => {
  try {
    await fs.promises.mkdir(path.dirname(savePath), { recursive: true })
    const response = await axios.get(fileUrl, { ...options, responseType: 'stream' })
    await streamPipeline(response.data, fs.createWriteStream(savePath))

    if (options.returnBoolean) {
      return true as DownloadFileResult<T>
    }

    return { success: true, data: response.data } as DownloadFileResult<T>
  } catch (error) {
    if (options.returnBoolean) {
      return false as DownloadFileResult<T>
    }
    return { success: false, data: error } as DownloadFileResult<T>
  }
}

/**
 * 下载保存文件
 * @param fileUrl 下载地址
 * @param savePath 保存路径
 * @param param axios参数
 */
export const downFile = async (fileUrl: string, savePath: string, param: AxiosRequestConfig = {}): Promise<DownloadFileResult<boolean>> => {
  return downloadFile(fileUrl, savePath, { ...param, returnBoolean: true })
}

export const download = downloadFile
