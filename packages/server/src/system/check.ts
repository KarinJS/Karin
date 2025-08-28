import fs from 'node:fs'
import { createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 检查是否安装了指定的npm包
 */
export const checkPlugin: RequestHandler = async (req, res) => {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const list = { ...pkg.dependencies, ...pkg.devDependencies }
    if (list[req.body.name]) {
      return createSuccessResponse(res, { installed: true }, '已安装')
    }
    return createSuccessResponse(res, { installed: false }, '未安装')
  } catch {
    return createSuccessResponse(res, { installed: false }, '未安装')
  }
}
