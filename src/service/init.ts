import { init, port, host } from '@/utils/config'
import { processHandler, checkProcess } from '@/core/internal/process'

/** 初始化config */
init()

/** 初始化进程 */
processHandler()
await checkProcess(port())

const main = async () => {
  /** 加载插件 */
  const [
    { LoaderPlugin },
    { listen },
  ] = await Promise.all([
    import('@/plugin/loader'),
    import('@/server'),
    import('@/adapter'),
  ])

  await Promise.all([
    new LoaderPlugin().init(),
    listen(port(), host()),
  ])
}

main()
