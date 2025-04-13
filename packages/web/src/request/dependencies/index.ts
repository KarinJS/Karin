import { api, request, getErrorMessage } from '@/request/base'

import type { BaseResponse } from '@/request/base'
import type {
  DependenciesManage,
  Dependency,
  CreateTaskResult,
  NpmrcFileResponse,
  NpmBaseConfigResponse,
} from 'node-karin'

/**
 * 获取依赖列表
 * @param isForceRefresh - 是否强制刷新
 * @timeout 2分钟超时
 */
export const getDependencies = async (
  isForceRefresh = false
): Promise<BaseResponse<Dependency[]>> => {
  try {
    const data = { force: isForceRefresh }
    const result = await request.serverPost<Dependency[], { force: boolean }>(
      api.getDependencies,
      data
    )

    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/**
 * 依赖管理
 */
export const manageDependencies = async (params: DependenciesManage): Promise<BaseResponse<CreateTaskResult>> => {
  try {
    const result = await request.serverPost<CreateTaskResult, DependenciesManage>(api.manageDependencies, params)

    if (result.success) {
      return { success: true, data: result }
    }

    throw new Error(result.message)
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/**
 * 获取.npmrc文件列表
 */
export const getNpmrcList = async (): Promise<BaseResponse<NpmrcFileResponse[]>> => {
  try {
    const result = await request.serverPost<NpmrcFileResponse[], void>(api.getNpmrcList)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/**
 * 获取.npmrc文件内容
 */
export const getNpmrcContent = async (path: string): Promise<BaseResponse<string>> => {
  try {
    const result = await request.serverPost<Record<string, string>, { path: string }>(api.getNpmrcContent, { path })
    /** 转成字符串 */
    let content = ''
    Object.entries(result).forEach(([key, value]) => {
      content += `${key}=${value}\n`
    })
    return { success: true, data: content }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/**
 * 获取npm registry、proxy、https-proxy配置
 */
export const getNpmBaseConfig = async (): Promise<BaseResponse<NpmBaseConfigResponse>> => {
  try {
    const result = await request.serverPost<NpmBaseConfigResponse, void>(api.getNpmBaseConfig)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/**
 * 保存npmrc文件
 * @param path - 文件路径
 * @param content - 文件内容
 * @param baseConfig - 基础配置
 */
export const saveNpmrc = async (
  path: string,
  content: string,
  baseConfig: NpmBaseConfigResponse
): Promise<BaseResponse<void>> => {
  try {
    const result = await request.serverPost<void, { path: string, content: string, baseConfig: NpmBaseConfigResponse }>(
      api.saveNpmrc,
      { path, content, baseConfig }
    )
    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}
