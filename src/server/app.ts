import express from 'express'
import type { Express } from 'express'
import { createServer } from 'node:http'

/** express 服务 */
export const app: Express = express()
/** http 服务 */
export const server = createServer(app)
