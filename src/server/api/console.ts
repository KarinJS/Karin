import fs from 'node:fs'
import { app } from '../app'
import path from 'node:path'
import { server } from '@/utils/config'
import { isLocalRequest } from '@/utils/system/ip'
import { consolePath } from '@root'

app.get('/console/*', async (req, res) => {
  const cfg = server()

  let name = req.path.split('/').pop()
  if (!name) {
    res.status(400).json({ error: '无效的请求', message: '文件名不能为空' })
    return
  }

  name = decodeURIComponent(name)
  /** 防止路径穿越 */
  if (name.includes('..')) {
    res.status(403).json({ error: '禁止访问', message: '非法请求' })
    return
  }

  const isLocal = await isLocalRequest(req)
  if (cfg.console.isLocal) {
    if (!isLocal) {
      res.status(403).json({ error: '禁止访问', message: '无效的请求' })
      return
    }
  } else {
    if (!cfg.console.token) {
      res.status(500).json({ error: '配置错误', message: '缺少 token 配置' })
      return
    }

    const token = req.query.token
    if (!token || token !== cfg.console.token) {
      res.status(403).json({ error: '禁止访问', message: '无效的 token' })
      return
    }
  }

  const file = path.join(consolePath, name)
  if (!fs.existsSync(file)) {
    res.status(404).json({ error: '文件不存在', message: '文件不存在' })
    return
  }

  const data = fs.readFileSync(file)
  if (!data) {
    res.status(500).json({ error: '内部错误', message: '读取失败' })
    return
  }

  const ext = path.extname(name).toLowerCase()
  switch (ext) {
    case '.png':
      res.setHeader('Content-Type', 'image/png')
      break
    case '.mp3':
      res.setHeader('Content-Type', 'audio/mpeg')
      break
    case '.mp4':
      res.setHeader('Content-Type', 'video/mp4')
      break
    default:
      res.setHeader('Content-Type', 'application/octet-stream')
  }
  res.send(data)
})
