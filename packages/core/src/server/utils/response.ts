import { Response } from 'express'

/** HTTP状态码 */
export enum HTTPStatusCode {
  /** 成功 */
  OK = 200,
  /** 请求错误 */
  BadRequest = 400,
  /** 未授权 */
  Unauthorized = 401,
  /** 禁止访问 */
  Forbidden = 403,
  /** 未找到 */
  NotFound = 404,
  /** 方法不允许 */
  MethodNotAllowed = 405,
  /** 请求体过大 */
  PayloadTooLarge = 413,
  /** 服务器错误 */
  InternalServerError = 500,
}

/**
 * 创建响应
 * @param res 响应
 * @param code 状态码
 * @param data 数据
 * @param message 消息
 * @returns 响应
 * @template T 数据类型
 * @example createResponse(res, HTTPStatusCode.OK, { message: '成功' })
 * @example createResponse(res, HTTPStatusCode.BadRequest, { message: '参数错误' })
 * @example createResponse(res, HTTPStatusCode.InternalServerError, { message: '服务器错误' })
 */
export const createResponse = <T> (res: Response, code: HTTPStatusCode, data?: T, message = '') => {
  logger.debug(
    '[express] 响应:\n' +
    `code: ${code}\n` +
    `data: ${JSON.stringify(data)}\n` +
    `message: ${message}\n`
  )
  res.status(code).json({
    code,
    data,
    message,
  })
}

/**
 * 创建成功响应
 * @param res 响应
 * @param data 数据
 * @param message 消息
 * @returns 响应
 * @template T 数据类型
 * @example createSuccessResponse(res, null, '成功')
 * @example createSuccessResponse(res, data)
 */
export const createSuccessResponse = <T> (res: Response, data?: T, message = '成功') => {
  return createResponse(res, HTTPStatusCode.OK, data, message)
}

/**
 * 创建未鉴权响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createUnauthorizedResponse(res)
 * @example createUnauthorizedResponse(res, '未授权')
 * @example createUnauthorizedResponse(res, '登录已过期')
 * @example createUnauthorizedResponse(res, '登录信息已失效')
 */
export const createUnauthorizedResponse = (res: Response, message = '未登录') => {
  return createResponse(res, HTTPStatusCode.Unauthorized, null, message)
}

/**
 * 创建未找到响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createNotFoundResponse(res)
 * @example createNotFoundResponse(res, '未找到')
 * @example createNotFoundResponse(res, '数据不存在')
 * @example createNotFoundResponse(res, '资源不存在')
 */
export const createNotFoundResponse = (res: Response, message = '未找到') => {
  return createResponse(res, HTTPStatusCode.NotFound, null, message)
}

/**
 * 创建服务器错误响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createServerErrorResponse(res)
 * @example createServerErrorResponse(res, '服务器错误')
 * @example createServerErrorResponse(res, '系统错误')
 * @example createServerErrorResponse(res, '未知错误')
 */
export const createServerErrorResponse = (res: Response, message = '服务器错误') => {
  return createResponse(res, HTTPStatusCode.InternalServerError, null, message)
}

/**
 * 创建参数错误响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createBadRequestResponse(res)
 * @example createBadRequestResponse(res, '参数错误')
 * @example createBadRequestResponse(res, '请求参数错误')
 * @example createBadRequestResponse(res, '参数不正确')
 */
export const createBadRequestResponse = (res: Response, message = '参数错误') => {
  return createResponse(res, HTTPStatusCode.BadRequest, null, message)
}

/**
 * 创建请求过大响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createPayloadTooLargeResponse(res)
 * @example createPayloadTooLargeResponse(res, '请求体过大')
 */
export const createPayloadTooLargeResponse = (res: Response, message = '请求体过大') => {
  return createResponse(res, HTTPStatusCode.PayloadTooLarge, null, message)
}

/**
 * 创建方法不允许响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createMethodNotAllowedResponse(res)
 */
export const createMethodNotAllowedResponse = (res: Response, message = '方法不允许') => {
  return createResponse(res, HTTPStatusCode.MethodNotAllowed, null, message)
}

/**
 * 创建禁止访问响应
 * @param res 响应
 * @param message 消息
 * @returns 响应
 * @example createForbiddenResponse(res)
 * @example createForbiddenResponse(res, '禁止访问')
 * @example createForbiddenResponse(res, '无权限访问')
 * @example createForbiddenResponse(res, '权限不足')
 */
export const createForbiddenResponse = (res: Response, message = '禁止访问') => {
  return createResponse(res, HTTPStatusCode.Forbidden, null, message)
}
