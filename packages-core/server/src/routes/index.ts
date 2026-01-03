import { Router as ExpressRouter } from 'express'
import configRouter from './v2/config'
import pluginRouter from './v2/plugin'

const router = ExpressRouter()

// API v2 路由
router.use('/v2/config', configRouter)
router.use('/v2/plugin', pluginRouter)

export default router
