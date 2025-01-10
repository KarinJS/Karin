import { router } from './router'
import { auth } from '../auth'
import { restartDirect } from '@/utils/system/restart'
import type { RequestHandler } from 'express'

const restartRouter: RequestHandler = async (req, res) => {
  if (!auth.getAuth(req)) {
    res.status(401).json({ message: '无效的token' })
    return
  }

  res.status(200).end()
  restartDirect()
}

router.get('/restart', restartRouter)
