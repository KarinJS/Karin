import { app } from '../app'
import { auth } from '../auth'

app.get('/ping', (req, res) => {
  res.send({
    ping: 'pong',
    name: 'karin',
  })
})

app.get('/status', (req, res) => {
  if (!auth.getAuth(req)) {
    res.status(401).json({ message: '无效的token' })
    return
  }

  const data = {
    name: 'karin',
    pid: process.pid,
    pm2_id: process.env.pm_id || '',
    uptime: process.uptime(),
    version: process.env.karin_version,
    karin_dev: process.env.karin_dev,
    karin_lang: process.env.karin_lang,
    karin_runtime: process.env.karin_runtime,
  }

  res.status(200).json(data)
})
