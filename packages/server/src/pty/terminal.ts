import {
  createServerErrorResponse,
  createSuccessResponse,
} from '../utils'
import {
  closeTerminal,
  createTerminal,
  getTerminalList,
} from './terminalManager'

import type { RequestHandler } from 'express'
import type { CreatePty } from './terminalManager'

/**
 * 创建终端
 * @param req 请求
 * @param res 响应
 */
export const createTerminalHandler: RequestHandler = async (req, res) => {
  try {
    const { cols, rows, shell, name } = req.body as CreatePty
    const { id } = await createTerminal(name, shell, cols, rows)
    return createSuccessResponse(res, { id })
  } catch (error) {
    logger.error(`[terminal] 创建终端失败: ${req.body.shell}`)
    logger.error(error)
    return createServerErrorResponse(res, `创建终端失败: ${(error as Error).message}`)
  }
}

/**
 * 获取终端列表
 * @param _ 请求
 * @param res 响应
 */
export const getTerminalListHandler: RequestHandler = (_, res) => {
  try {
    const list = getTerminalList()
    return createSuccessResponse(res, list)
  } catch (error) {
    logger.error('[terminal] 获取终端列表失败')
    logger.error(error)
    return createServerErrorResponse(res, `获取终端列表失败: ${(error as Error).message}`)
  }
}

/**
 * 关闭终端
 * @param req 请求
 * @param res 响应
 */
export const closeTerminalHandler: RequestHandler = (req, res) => {
  try {
    const id = req.body.id
    if (!id) {
      return createServerErrorResponse(res, 'ID不能为空')
    }

    closeTerminal(id)
    return createSuccessResponse(res, {})
  } catch (error) {
    logger.error(`[terminal] 关闭终端失败: ${req.body.id}`)
    logger.error(error)
    return createServerErrorResponse(res, `关闭终端失败: ${(error as Error).message}`)
  }
}
