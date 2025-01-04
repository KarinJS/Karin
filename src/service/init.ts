import { init, port } from '@/utils/config'

const main = async () => {
  /** 初始化config */
  init()

  /** 初始化进程 */
  const { processHandler, checkProcess } = await import('@/core/internal/process')
  processHandler()
  await checkProcess(port())

  /** 加载插件 */
  const { LoaderPlugin } = await import('@/plugin/loader')
  await new LoaderPlugin().init()
}

await main()
