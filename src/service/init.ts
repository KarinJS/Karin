import { init, port, host } from '@/utils/config'
import { processHandler, checkProcess } from '@/core/internal/process'

/** 初始化config */
init()

/** 初始化进程 */
processHandler()
await checkProcess(port())

const main = async () => {
  const [
    { LoaderPlugin },
    { listen },
  ] = await Promise.all([
    import('@/plugin/loader'),
    import('@/server'),
    import('@/adapter'),
  ])

  await Promise.all([
    /** 加载插件 */
    new LoaderPlugin().init(),
    /** 启动服务 */
    listen(port(), host()),
  ])
}

main()
