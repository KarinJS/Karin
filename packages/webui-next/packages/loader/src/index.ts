import { dir } from './dir'
import { logger, app } from 'node-karin'
import express from 'node-karin/express'
import path from 'node:path'
import history from 'connect-history-api-fallback'
import * as httpProxy from 'http-proxy-middleware'

const staticRouter = express.Router()

staticRouter.use(express.static(path.join(dir.pluginDir, 'dist', 'web_chunk'), {
  redirect: false,
  // 添加静态资源的缓存控制
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache')
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000')
    }
  }
}))

// 处理 SPA 路由（history fallback）
staticRouter.use(
  history({
    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    disableDotRule: true
  }) as httpProxy.RequestHandler
)

staticRouter.use(express.static(path.join(dir.pluginDir, 'dist', 'web_chunk'), {
  redirect: false
}))

app.use('/114514/1919810', staticRouter)
// 允许根目录直接访问静态资源，防止前端 Vite 默认绝对路径 /assets/... 触发 302 重定向
app.use('/assets', express.static(path.join(dir.pluginDir, 'dist', 'web_chunk', 'assets')))
app.use('/favicon.svg', express.static(path.join(dir.pluginDir, 'dist', 'web_chunk', 'favicon.svg')))

logger.info(`http://127.0.0.1:${process.env.HTTP_PORT}/114514/1919810`)

/** 请不要在这编写插件 不会有任何效果~ */
logger.info(`${logger.violet(`[插件:${dir.version}]`)} ${logger.green(dir.name)} 初始化完成~`)
