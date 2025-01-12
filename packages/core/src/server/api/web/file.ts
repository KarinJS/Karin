import { router } from './router'
import { auth } from '../../auth'
import { setYaml, getYaml } from '@/utils/config/config'
import type { RequestHandler } from 'express'
import type { FileList } from '@/types/config'

const list: FileList[] = [
  'adapter',
  'config',
  'groups',
  'pm2',
  'privates',
  'redis',
  'render',
]

const nameMap = {
  adapter: '适配器配置',
  config: '基本配置',
  groups: '群和频道配置',
  pm2: 'pm2配置',
  privates: '好友和频道私信配置',
  redis: 'redis配置',
  render: '渲染器配置',
}

/**
 * 获取文件列表
 * @param req 请求
 * @param res 响应
 */
const fileRouter: RequestHandler = async (req, res) => {
  if (!auth.getAuth(req)) {
    res.status(401).json({ message: '无效的token' })
    return
  }

  // 组合文件列表
  const files = list.map(name => ({
    name,
    title: nameMap[name],
  }))

  res.json(files)
}

/**
 * 设置文件内容
 * @param req 请求
 * @param res 响应
 */
const setFileRouter: RequestHandler = async (req, res) => {
  const { name, data } = req.body
  if (!name || !data || !list.includes(name) || typeof data !== 'object') {
    res.status(400).json({ message: '参数错误' })
    return
  }

  setYaml(name, data)
  res.json({ message: '设置成功' })
}

/**
 * 获取文件内容
 * @param req 请求
 * @param res 响应
 */
const getFileRouter: RequestHandler = async (req, res) => {
  const { name } = req.body
  if (!name || !list.includes(name)) {
    res.status(400).json({ message: '参数错误' })
    return
  }

  res.json(getYaml(name, 'user'))
}

router.get('/file', fileRouter)
router.post('/set_file', setFileRouter)
router.post('/get_file', getFileRouter)
