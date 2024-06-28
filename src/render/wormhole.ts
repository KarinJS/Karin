import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import WebSocket from 'ws'
import { render } from '.'
import { HttpRenderer } from './http'
import { config } from 'karin/utils'

let ws: WebSocket
let reConnect: NodeJS.Timeout | undefined
const chunkSize = 1024 * 1024 * 3 // 文件分片大小

export function Wormhole () {
  let heartbeat: string | number | NodeJS.Timeout | null | undefined
  let index = 0
  reConnect = undefined
  const wsUrl = config.Server.HttpRender.WormholeClient
  ws = new WebSocket(wsUrl)
  ws.on('open', function open () {
    logger.info('连接到wormhole服务器' + wsUrl)
    // 发送心跳
    heartbeat = setInterval(() => {
      ws.send(JSON.stringify({ type: 'heartbeat', date: new Date() }))
    }, 30000) // 每30秒发送一次心跳
  })

  ws.on('message', msg => {
    let data: any = ''
    try {
      data = JSON.parse(msg.toString())
    } catch (error) {
      logger.warn(`收到非法消息${data}`)
    }
    const echo = data.echo
    switch (data.type) {
      case 'msg': {
        const { post, token, WormholeClient } = config.Server.HttpRender
        const parsedUrl = new URL(WormholeClient)
        const { hostname, port } = parsedUrl
        const ishttps = WormholeClient.includes('wss://')
        const host = `${ishttps ? 'https' : 'http'}://${hostname}${port ? `:${port}` : ''}/web/${data.date}`
        logger.mark(`web渲染器已连接，地址：${host}`)
        /** 注册渲染器 */
        const rd = new HttpRenderer(host, post, token)
        index = render.app({ id: 'puppeteer', type: 'image', render: rd.render.bind(rd) })
        break
      }
      case 'web':
        if (data.path) {
          const filePath = data.path
          const query = data.query
          if (query.html) {
            ws.send(JSON.stringify({ type: 'web', command: 'redirect', path: filePath, target: query.html.startsWith('/') ? query.html.slice(1) : query.html, echo }))
            return
          }
          const list = ['.css', '.html', '.ttf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.woff', '.woff2']
          if (!list.some(ext => path.extname(filePath).endsWith(ext))) {
            logger.warn(`拦截非资源文件${filePath}`)
            ws.send(JSON.stringify({ type: 'web', state: 'error', error: '非资源文件', echo }))
            return
          }

          /** 判断一下是否为html 如果是需要特殊处理 */
          if (path.extname(filePath) === '.html') {
            let html = filePath
            /** 获取文件路径 对路径进行处理，去掉../、./ */
            html = `./${html.replace(/\\/g, '/').replace(/(\.\/|\.\.\/)/g, '')}`

            /** 判断是否为html文件且路径存在 */
            if (!fs.existsSync(html)) {
              return ws.send(JSON.stringify({ type: 'web', state: 'error', error: '文件不存在', echo }))
            }

            let content = fs.readFileSync(html, 'utf-8')
            /** 处理所有绝对路径、相对路径 */
            content = content.replace(new RegExp(`(${process.cwd()}|${process.cwd().replace(/\\/g, '/')})`, 'g'), '')
            // 保存到本地
            // filePath = './1.html'
            // fs.writeFileSync(filePath, content, 'utf-8')
            return ws.send(
              JSON.stringify({
                type: 'web',
                path: data.path,
                command: 'resource',
                data: Buffer.from(content),
                state: 'complete',
                part: 0,
                echo,
              })
            )
          }

          logger.info(`获取网页文件数据:${filePath}`)
          // 获取文件

          const stream = fs.createReadStream(filePath, { highWaterMark: chunkSize })
          let part = 0

          stream.on('data', chunk => {
            part++
            const message = {
              type: 'web',
              path: data.path,
              command: 'resource',
              data: chunk,
              state: 'part',
              part,
              echo,
            }

            ws.send(JSON.stringify(message))
          })

          stream.on('end', () => {
            part++
            // 如果是最后一片段，则更新状态为 'complete'
            if (stream.readableEnded) {
              ws.send(
                JSON.stringify({
                  type: 'web',
                  path: data.path,
                  command: 'resource',
                  data: '',
                  state: 'complete',
                  part,
                  echo,
                })
              )
            }
          })

          stream.on('error', err => {
            ws.send(JSON.stringify({ type: 'web', state: 'error', error: err.message, echo }))
          })
        } else {
          ws.send(JSON.stringify({ type: 'web', state: 'error', error: '错误的文件路径', echo }))
        }
        break
      default:
        logger.warn(`未知消息类型${JSON.stringify(data)}`)
        break
    }
  })

  ws.on('close', function close () {
    /** 卸载渲染器 */
    index && render.unapp(index)
    index = 0
    if (heartbeat) {
      clearInterval(heartbeat)
      heartbeat = null
    }
    logger.warn('连接关闭，10秒后尝试重新连接')
    if (!reConnect) {
      reConnect = setTimeout(Wormhole, 10000)
    }
  })

  ws.on('error', function error () {
    /** 卸载渲染器 */
    index && render.unapp(index)
    index = 0
    if (heartbeat) {
      clearInterval(heartbeat)
      heartbeat = null
    }
    logger.warn('连接错误，10秒后尝试重新连接')
    if (!reConnect) {
      reConnect = setTimeout(Wormhole, 10000)
    }
  })
}
