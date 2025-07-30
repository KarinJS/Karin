/* eslint-disable @stylistic/indent */
import type { AxiosRequestConfig } from 'axios'

/**
 * 测试网络请求结果详细信息接口
 */
export interface TestNetworkRequestDetail {
  /**
   * 请求URL
   */
  url: string

  /**
   * 请求是否成功
   */
  success: boolean

  /**
   * 错误信息（如果请求失败）
   */
  error: unknown

  /**
   * 请求耗时（毫秒）
   */
  duration: number
}

/**
 * 扩展的Axios请求配置
 * @template D - 请求数据类型
 * @template T - 是否返回详细信息
 * @template R - 是否为竞速模式
 */
export interface ExtendedAxiosRequestConfig<D = any, T extends boolean = false, R extends boolean = false> extends AxiosRequestConfig<D> {
  /**
   * 成功状态码列表，默认为 [200]
   */
  successCodes?: number[]

  /**
   * 是否返回详细信息，默认为 false
   */
  detailed?: T

  /**
   * race模式 必须条件为请求成功 不符合的状态码将会被忽略
   */
  isRace?: R
}

/**
 * 竞速模式返回结果类型 - 返回单个值或null
 * @template T - 是否返回详细信息
 */
export type RaceResult<T extends boolean = false> =
  T extends true
  ? TestNetworkRequestDetail | null
  : string | null

/**
 * 标准模式返回结果类型 - 返回数组
 * @template T - 是否返回详细信息
 */
export type StandardResult<T extends boolean = false> =
  T extends true
  ? TestNetworkRequestDetail[]
  : string[]

/**
 * pingRequest函数的返回类型
 * @template T - 是否返回详细信息
 * @template R - 是否为竞速模式
 */
export type PingRequestResult<T extends boolean = false, R extends boolean = false> =
  R extends true
  ? RaceResult<T>
  : StandardResult<T>

export interface GithubConfig {
  proxy: string
  /**
   * 是否支持克隆
   */
  isClone: boolean
  /**
   * 是否支持raw
   */
  isRaw: boolean
  /**
   * 获取raw地址
   * @param url - github地址
   * @returns 返回raw地址
   */
  raw: (url: string) => string
  /**
   * 克隆地址
   * @param url - github地址
   * @returns 返回克隆地址
   */
  clone: (url: string) => string
}
