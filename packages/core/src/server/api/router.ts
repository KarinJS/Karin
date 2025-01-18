import express from 'express'
import { Router } from 'express'

/**
 * karin-api 路由
 */
export const router: Router = Router()

router.use(express.json())
