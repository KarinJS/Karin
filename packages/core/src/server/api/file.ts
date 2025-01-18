import { router } from './router'
import { getFileList } from '../utils/file'
import { setYaml, getYaml } from '@/utils/config/config'
import { createBadRequestResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'
import type { FileList } from '@/types/config'

const list: (FileList | 'env')[] = ['adapter', 'config', 'groups', 'pm2', 'privates', 'redis', 'render', 'env']

const nameMap = {
  adapter: '适配器配置',
  config: '基本配置',
  groups: '群和频道配置',
  pm2: 'pm2配置',
  privates: '好友和频道私信配置',
  redis: 'redis配置',
  render: '渲染器配置',
  env: '环境变量配置',
}

/**
 * 获取文件列表
 * @param req 请求
 * @param res 响应
 */
const fileRouter: RequestHandler = async (_req, res) => {
  const files = list.map((name) => ({
    name,
    title: nameMap[name],
  }))

  createSuccessResponse(res, files)
}

/**
 * 设置文件内容
 * @param req 请求
 * @param res 响应
 */
const setFileRouter: RequestHandler = async (req, res) => {
  const { name, data } = req.body
  if (!name || !data || !list.includes(name) || typeof data !== 'object') {
    return createBadRequestResponse(res, '参数错误')
  }

  setYaml(name, data)
  createSuccessResponse(res, null, '设置成功')
}

/**
 * 获取文件内容
 * @param req 请求
 * @param res 响应
 */
const getFileRouter: RequestHandler = async (req, res) => {
  const { name } = req.body
  if (!name || !list.includes(name)) {
    return createBadRequestResponse(res, '参数错误')
  }

  const data = getYaml(name, 'user')
  createSuccessResponse(res, data)
}

/**
 * 获取文件字段
 * @param req 请求
 * @param res 响应
 */
const getFileFieldsRouter: RequestHandler = async (req, res) => {
  const { name } = req.body
  const fields = getFileList(name)
  createSuccessResponse(res, fields)
}

router.post('/file', fileRouter)
router.post('/set_file', setFileRouter)
router.post('/get_file', getFileRouter)
router.post('/get_file_fields', getFileFieldsRouter)
