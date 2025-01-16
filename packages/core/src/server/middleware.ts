import { Request, Response, NextFunction } from 'express'
import { auth } from './auth'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    if (req.path === '/api/v1/ping' || req.path.startsWith('/api/v1/console')) {
      next()
      return
    }
    if (!auth.getAuth(req)) {
      res.status(401).json({ message: '无效的token' })
      return
    }
  }

  next()
}
