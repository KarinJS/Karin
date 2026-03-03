/**
 * API 响应标准格式
 *
 * 所有接口必须遵循此格式返回数据，前后端共用。
 */

import type { HTTPStatusCode } from './status'

/**
 * 通用 API 响应
 *
 * @template T - 响应数据类型，默认 unknown
 *
 * @example
 * ```ts
 * // 成功响应
 * const res: ApiResponse<{ token: string }> = {
 *   ok: true,
 *   code: 200,
 *   data: { token: 'xxx' },
 *   message: 'success',
 * }
 *
 * // 失败响应
 * const err: ApiResponse = {
 *   ok: false,
 *   code: 401,
 *   data: null,
 *   message: '未授权',
 * }
 * ```
 */
export interface ApiResponse<T = unknown> {
  /** 请求是否成功 */
  ok: boolean
  /** HTTP 状态码 */
  code: HTTPStatusCode
  /** 响应数据，失败时为 null */
  data: T | null
  /** 响应消息（供前端提示或日志使用） */
  message: string
}

/**
 * 分页请求参数
 *
 * 适用于列表类接口的分页查询。
 */
export interface PaginationParams {
  /** 当前页码，从 1 开始 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 分页响应数据
 *
 * @template T - 列表项类型
 */
export interface PaginatedData<T> {
  /** 数据列表 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 带分页的 API 响应
 *
 * @template T - 列表项类型
 */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>
