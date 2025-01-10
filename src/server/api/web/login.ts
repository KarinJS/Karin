import { router } from './router'
import { auth } from '../../auth'
import type { RequestHandler } from 'express'

const loginRouter: RequestHandler = async (req, res) => {
  if (!auth.getAuth(req)) {
    res.status(401).json({ message: '无效的token' })
    return
  }

  res.json({ message: '登录成功' })
}

router.get('/login', loginRouter)
